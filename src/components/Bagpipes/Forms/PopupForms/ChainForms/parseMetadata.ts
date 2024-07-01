import { Type, TypeEntry, TypeDefinitions, Pallet, MethodOutput, RawMetadata, CallOutput, StorageOutput, TypeLookup, ResolvedType } from './TypeDefinitions';



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
    return `Composite(${def.Composite.fields.map(f => resolveTypeName(f.type, typesLookup)).join(', ')})`;
  } else if (def.Sequence) {
    // Adjust here to use `elementType` for sequences
    return `Sequence of ${resolveTypeName(def.Sequence.elementType, typesLookup)}`;
  } else if (def.Array) {
    return `Array[${def.Array.len}] of ${resolveTypeName(def.Array.type, typesLookup)}`;
  } else if (def.Variant) {
    return `Variant`;
  } else if (def.Tuple) {
    return `Tuple of (${def.Tuple.map((t: string) => resolveTypeName(t, typesLookup)).join(', ')})`;
  } else {
    return 'Complex Type';
  }
}




export function resolveFieldType(typeId: string, typesLookup: TypeLookup, depth = 0, path = []): ResolvedType {
  console.log(`Resolving type for typeId: ${typeId} at recursion depth: ${depth}`);
  if (depth > 10) {
      console.warn('Too deep recursion in resolveFieldType at depth:', depth);
      return { type: 'complex', path }; // Safeguard against excessive recursion
  }

  const typeInfo = typesLookup[typeId];
  if (!typeInfo || !typeInfo.def) {
      console.error(`Type information is undefined or missing definition for typeId: ${typeId}`);
      return { type: 'input', path }; // Fallback to 'input' for undefined types
  }

  const currentType = Object.keys(typeInfo.def)[0];
  path.push(currentType); // Track the path for debugging or detailed information purposes
  console.log(`Current type path: ${path.join(' -> ')}`);

  // Directly resolve the terminal type, bypassing nested structures like composites
  switch (currentType) {
      case 'Primitive':
          console.log(`Type ${typeId} is a Primitive: ${typeInfo.def.Primitive}`);
          return { type: 'input', path };

      case 'Composite':
          // For Composites, recursively resolve the type of the first field (simplistic approach)
          // You may want to handle differently depending on specific use cases
          return resolveFieldType(typeInfo.def.Composite.fields[0].type, typesLookup, depth + 1, path);

      case 'Sequence':
      case 'Array':
          // For both Sequences and Arrays, find the element type
          console.log(`Type ${typeId} is a ${currentType}, element type: ${typeInfo.def[currentType].elementType}`);
          return resolveFieldType(typeInfo.def[currentType].elementType, typesLookup, depth + 1, path);

      case 'Variant':
      case 'Tuple':
          // For Variants and Tuples, typically resolve the first element's type as a simplification
          console.log(`Type ${typeId} is a ${currentType}`);
          return resolveFieldType(typeInfo.def[currentType][0], typesLookup, depth + 1, path);

      default:
          console.log(`Type ${typeId} is classified as Complex`);
          return { type: 'complex', path };
  }
}

