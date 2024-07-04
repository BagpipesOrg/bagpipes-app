import { Type, TypeEntry, TypeDefinitions, Field, Pallet, MethodOutput, RawMetadata, CallOutput, StorageOutput, TypeLookup, ResolvedType } from './TypeDefinitions';



export function parseMetadataPallets(rawMetadata: RawMetadata): MethodOutput[] {
  const metadata = rawMetadata.metadata;

  if (!metadata) {
    console.error('No metadata provided:', metadata);
    return [];
  }

  // Extract types into a lookup table
  const typesLookup = {};
  if (metadata.V14 && metadata.V14.lookup && metadata.V14.lookup.types) {
    metadata.V14.lookup.types.forEach((type: any) => {
      typesLookup[type.id] = type.type;
    });
  }

  let pallets: MethodOutput[] = [];
  if (metadata.V14) {
    console.log('Metadata version:', metadata.V14);

    pallets = metadata.V14.pallets.map(pallet => parsePallet(pallet, typesLookup));
  } else if (metadata.V13) {
    console.error('Metadata V13 handling needs to be implemented if necessary');
  } else {
    console.error('Metadata version not supported:', metadata);
  }
  return pallets;
}


function parsePallet(pallet: Pallet, typesLookup: any): MethodOutput {
  let calls: CallOutput[] = [];

  if (pallet.calls) {
    const callsTypeId = pallet.calls.type;
    const callTypeInfo = typesLookup[callsTypeId]; 

    if (callTypeInfo && callTypeInfo.def && callTypeInfo.def.Variant) {
      calls = callTypeInfo.def.Variant.variants.map((variant: any) => ({
        name: variant.name,
        type: variant.fields.map((f: any) => `${f.name}: ${resolveTypeName(f.type, typesLookup)}`).join(', '),
        docs: variant.docs.join(' '),
        fields: variant.fields.map((f: any) => ({
          name: f.name,
          type: f.type,
          typeName: f.typeName,
          docs: f.docs.join(' ')
        })),
        index: variant.index
      }));
      // console.log('Call type info:', calls[0]);

    } else {
      console.error('Call type info not found or invalid for:', callsTypeId);
    }
  }

  const storageItems: StorageOutput[] = (pallet.storage?.items || []).map(item => ({
    name: item.name,
    fields: item.type.Map ? Object.entries(item.type.Map).map(([key, value]) => ({
      name: key,
      type: value,
      typeName: '', // Add the 'typeName' property
      docs: [] // Change the 'docs' property to an empty array
    })) : [],
    type: item.type,
    docs: item.docs ? item.docs.join(' ') : 'No documentation available.',
  }));

  const methodOutput: MethodOutput = { name: pallet.name, calls, storage: storageItems };
  return methodOutput;
}

export function resolveTypeName(typeId: string, typesLookup: any): string {
  const typeInfo = typesLookup[typeId];
  if (!typeInfo) return 'Unknown Type';

  // Checking for the path to display nested types
  if (typeInfo.path && typeInfo.path.length > 0) {
    return typeInfo.path.join('.');
  }

  // Access the def object
  const { def } = typeInfo;
  if (!def) return 'Undefined Type Definition';

  // Handling various type defs
  if (def.Primitive) {
    return def.Primitive;
  } else if (def.Composite) {
    return `Composite(${def.Composite.fields.map((f: { type: string; }) => resolveTypeName(f.type, typesLookup)).join(', ')})`;
  } else if (def.Sequence) {
    // Adjust here to use `elementType` for sequences
    return `Sequence of ${resolveTypeName(def.Sequence.elementType, typesLookup)}`;
  } else if (def.Array) {
    return `Array[${def.Array.len}] of ${resolveTypeName(def.Array.type, typesLookup)}`;
  } else if (def.Variant) {
    return `Variant`;
  } else if (def.Tuple) {
    return `Tuple of (${def.Tuple.map((t: string) => resolveTypeName(t, typesLookup)).join(', ')})`;
  } else if (def.Compact) {
      return `Compact<${resolveTypeName(def.Compact.type, typesLookup)}>`;
  } else {
    return 'Complex Type';
  }
}


export function resolveFieldType(typeId: string, typesLookup: TypeLookup, depth = 0, path = []) {
  console.log(`Resolving type for typeId: ${typeId} at recursion depth: ${depth}, path: ${path.join(' -> ')}`);

  if (depth > 20) {
    console.warn(`Excessive recursion at depth ${depth} for typeId ${typeId}`);
    return { type: 'complex', path };
  }

  const typeInfo = typesLookup[typeId];
  console.log(`Type info for typeId ${typeId}:`, typeInfo);
  if (!typeInfo || !typeInfo.def) {
    console.error(`Type information is undefined or missing definition for typeId: ${typeId}`);
    return { type: 'input', path };
  }

  const currentType = Object.keys(typeInfo.def)[0];
  console.log(`Current type: ${currentType}`);
  path.push(currentType);
  console.log(`Current type path: ${path.join(' -> ')}`);

  switch (currentType) {
    case 'Primitive':
      return { type: 'input', path: path.concat(typeInfo.def.Primitive) }; // Append Primitive type for clarity

    case 'Composite':
      console.log(`Type ${typeId} is a Composite, processing fields...`);
      return {
        type: 'composite',
        path,
        fields: typeInfo.def.Composite.fields.map(field => ({
          name: field.name,
          type: resolveFieldType(field.type, typesLookup, depth + 1, path.concat(field.name)),
          typeId: field.type
        }))
      };

    case 'Compact':
      if (typeInfo.def.Compact && typeInfo.def.Compact.type) {
        console.log(`Type ${typeId} is a Compact type, resolving its base type: ${typeInfo.def.Compact.type}`);
        // Directly resolve the base type of Compact without adding 'Compact' redundantly to the path
        return resolveFieldType(typeInfo.def.Compact.type, typesLookup, depth + 1, path);
      } else {
        console.error(`Compact type at ID ${typeId} does not specify a base type`);
        return { type: 'complex', path };
      }

      case 'Sequence':
        console.log(`Type ${typeId} is a Sequence, element type: ${typeInfo.def.Sequence.elementType}`);
        const elementType = resolveFieldTypeShallow(typeInfo.def.Sequence.elementType, typesLookup, path.concat('Sequence'));
        return {
          path,
          elementType: elementType,
        };

    case 'Array':
      console.log(`Type ${typeId} is an Array, element type: ${typeInfo.def.Array.type}, length: ${typeInfo.def.Array.len}`);
      return {
        type: 'array',
        path,
        elementType: resolveFieldType(typeInfo.def.Array.type, typesLookup, depth + 1, path.concat('Array')),
        length: typeInfo.def.Array.len
      };

    case 'Variant':
      console.log(`Type ${typeId} is a Variant, processing variants...`);
      return {
        type: 'variant',
        path,
        variants: typeInfo.def.Variant.variants.map(variant => ({
          name: variant.name || 'unnamed variant',
          index: variant.index,
          fields: variant.fields.map(field => ({
            name: field.name || 'unnamed field',
            type: resolveFieldTypeShallow(field.type, typesLookup, path.concat('Variant')),
            typeId: field.type
          }))
        }))
      };

    case 'Tuple':
      console.log(`Type ${typeId} is a Tuple`);
      return {
        type: 'tuple',
        path,
        elements: typeInfo.def.Tuple.elements.map(element => resolveFieldType(element, typesLookup, depth + 1, path))
      };

    default:
      console.log(`Type ${typeId} is classified as Complex`);
      return { type: 'complex', path };
  }
}




export function resolveFieldTypeShallow(typeId: string, typesLookup: TypeLookup, path = []) {
  const typeInfo = typesLookup[typeId];

  console.log(`Type info for typeId ${typeId}:`, typeInfo);
  if (!typeInfo || !typeInfo.def) {
    console.error(`Type information is undefined or missing definition for typeId: ${typeId}`);
    return { type: 'input', path };
  }

 
  

  const currentType = Object.keys(typeInfo.def)[0];

  console.log(`Current type: ${currentType}`);
  path.push(currentType);
  console.log(`Current type path: ${path.join(' -> ')}`);

  if (['Variant', 'Sequence', 'Array'].includes(currentType)) {
    // Prepare complex types with 'needsLoading' set to true for lazy loading
    console.log(`Resolving render complex type: ${currentType}`);
    return {
      path,
      type: currentType.toLowerCase(), 
      needsLoading: true, 
      ...(currentType === 'Variant' && {
        fields: typeInfo.def.Variant.variants.map(variant => ({
          name: variant.name,
          index: variant.index,
          fields: variant.fields.map(field => ({ 
            name: field.name, 
            type: field.type,
            typeId: field.type
          })), 
          needsLoading: true 
        }))
      }),
      ...(currentType === 'Sequence' && {
        path,
        elementType: typeInfo.def.Sequence.elementType, 
        needsLoading: true,
        elements: typeInfo.def.Sequence.type,
        typeId: typeInfo.def.Sequence.type 

      }),
      ...(currentType === 'Array' && {
        path,
        elementType: typeInfo.def.Array.type, 
        length: typeInfo.def.Array.len,
        needsLoading: true 
      })
    };
  } else {
    // For simpler types, resolve as usual
    return resolveFieldType(typeId, typesLookup);
  }
}
