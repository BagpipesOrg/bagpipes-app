import { Type, TypeEntry, TypeDefinitions, Field, Pallet, MethodOutput, RawMetadata, CallOutput, StorageOutput, TypeLookup, ResolvedType, PathSegment} from './TypeDefinitions';
import { TypeDef } from './ParseMetadataTypes';
import generateCustomId from './generateCustomId';

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
    console.log(`Resolving type name composite: ${def.Composite.fields}`);
    return `Composite(${def.Composite.fields.map((f: { type: string; }) => resolveTypeName(f.type, typesLookup)).join(', ')})`;
  } else if (def.Sequence) {
    // Adjust here to use `elementType` for sequences
    return `Sequence of ${resolveTypeName(def.Sequence.elementType, typesLookup)}`;
  } else if (def.Array) {
    return `Array[${def.Array.len}] of ${resolveTypeName(def.Array.type, typesLookup)}`;
  } else if (def.Variant) {
    return `Variant`;
    } else if (def.Tuple) {
      console.log(`Resolving type name Tuple: ${def.Tuple}`);
      return `Tuple(${def.Tuple.map((typeId: string) => resolveTypeName(typeId, typesLookup)).join(', ')})`;
    } else if (def.Compact) {
      return `Compact<${resolveTypeName(def.Compact.type, typesLookup)}>`;
  } else {
    return 'Complex Type';
  }
}

// this resolves field types using the type id from the metadata.
export function resolveFieldType(typeId: string, typesLookup: TypeLookup, depth = 0, path: PathSegment[] = [], cache: Record<string, ResolvedType> = {}): ResolvedType {
  // console.log(`Resolving type for typeId: ${typeId} at recursion depth: ${depth}, path: ${path.join(' -> ')}`);

  if (cache[typeId]) {
    // console.log(`Using cached result for typeId: ${typeId}`);
    return cache[typeId];
}

if (depth > 45) {
    console.warn(`Excessive recursion at depth ${depth} for typeId ${typeId}`);
    return { type: 'complex', path, typeName: 'Complex Type', id: generateCustomId('complexDepth')};
}

const typeInfo = typesLookup[typeId];
if (!typeInfo || !typeInfo.def) {
    console.error(`Type information is undefined or missing definition for typeId: ${typeId}`);
    return { type: 'input', path, id: generateCustomId('inputError')};
}


const typeName = resolveTypeName(typeId, typesLookup);
const currentType = Object.keys(typeInfo.def)[0] as keyof TypeDef;
const newPath = [...path, { type: currentType, id: generateCustomId(currentType), typeName: typeName }];

  let result: ResolvedType = {

    type: currentType,
    path: newPath,
    typeName: typeName,
    id: generateCustomId(currentType)
    
};

switch (currentType) {
      case 'Primitive':
          result = { type: 'input', path: newPath, typeName: typeName, id: generateCustomId('input'), };
          break;

          case 'Composite':
            // Creating a new path segment for the composite itself
            const compositeId = generateCustomId('composite');
            const compositePathSegment = { type: 'composite', id: compositeId, typeName: typeName };
            const compositePath = [...newPath, compositePathSegment];
        
            result = {
                type: 'composite',
                path: compositePath,
                typeName: typeName,
                typeId: typeInfo.def.Composite!.type,
                id: compositeId,  // Use the generated ID for the composite itself
                fields: typeInfo.def.Composite!.fields.map(field => {
                    // Generate a new path segment for each field within the composite
                    const fieldPathSegment = { type: 'compositeField', id: generateCustomId('compositeField'), typeName: resolveTypeName(field.type, typesLookup) };
                    return {
                        name: field.name || '',
                        type: 'compositeField',
                        id: fieldPathSegment.id,
                        resolvedType: resolveFieldType(field.type, typesLookup, depth + 1, [...compositePath, fieldPathSegment], cache),
                        typeName: fieldPathSegment.typeName,
                        typeId: field.type
                    };
                })
            };
            break;
        

      case 'Compact':
        const compactElementType = resolveFieldType(typeInfo.def.Compact!.type, typesLookup, depth + 1, newPath, cache)
          result = {
              ...compactElementType,
              path: newPath,
              type: 'input',
              id: generateCustomId('compact'),
          }
          break;

          case 'Sequence':
            const sequenceId = generateCustomId('sequence');
            const sequencePathSegment = { type: 'sequence', id: sequenceId, typeName: typeName };
            const sequencePath = [...newPath, sequencePathSegment];

            const sequenceFieldId = generateCustomId('sequenceField');
            const sequenceFieldPathSegment = { type: 'sequenceField', id: sequenceFieldId, typeName: typeName };
            const sequenceFieldPath = [...newPath, sequenceFieldPathSegment];

            result = {
                id: sequenceId,
                type: 'sequence',
                typeId: typeInfo.def.Sequence!.type,
                typeName: typeName,
                path: sequencePath,
                elementType: resolveFieldType(typeInfo.def.Sequence!.type, typesLookup, depth + 1, sequenceFieldPath, cache)
            };
            break;
        

      case 'Array':
        console.log(`Resolving array type inside: ${typeId}`, typeInfo.def.Array);

        const arrayId = generateCustomId('array');
        //in array there are cases where the array is of length 32 and element type is U8 which should be a single input field. We dont want to render 32 input fields of U8
      const arrayPathSegment = { type: 'arrayElement', id: arrayId, typeName: typeName };
      const arrayPath = [...newPath, arrayPathSegment];
      const elementType = resolveFieldType(typeInfo.def.Array!.type, typesLookup, depth + 1, arrayPath, cache);
      // Check if the array is of length 32 and element type is U8


      if (typeInfo.def.Array!.len === '4' && typeInfo.def.Array!.type === '2') {
        console.log(`Resolving array type special: ${typeId}`),
          result = {
              id: generateCustomId('input'),
              type: 'input',
              path: newPath,
              typeName: '[u8;4]', 
          };

        } else if (typeInfo.def.Array!.len === '8' && typeInfo.def.Array!.type === '2') {
            console.log(`Resolving array type special: ${typeId}`),
              result = {
                id: generateCustomId('input'),

                  type: 'input',
                  path: newPath,
                  typeName: '[u8;8]', 
              };

        } else if (typeInfo.def.Array!.len === '16' && typeInfo.def.Array!.type === '2') {
          console.log(`Resolving array type special: ${typeId}`),
            result = {
              id: generateCustomId('input'),

                type: 'input',
                path: newPath,
                typeName: '[u8;8]', 
            };
      
        } else if (typeInfo.def.Array!.len === '20' && typeInfo.def.Array!.type === '2') {
           console.log(`Resolving array type special: ${typeId}`),
          result = {
            id: generateCustomId('input'),

              type: 'input',
              path: newPath,
              typeName: '[u8;20]', 
          };

        } else if (typeInfo.def.Array!.len === '32' && typeInfo.def.Array!.type === '2') {
          console.log(`Resolving array type special: ${typeId}`),
            result = {
              id: generateCustomId('input'),

                type: 'input',
                path: newPath,
                typeName: '[u8;32]',
            };
        } else {
            result = {
                id: arrayId,
                type: 'array',
                path: arrayPath,
                typeId: typeInfo.def.Array!.type,
                elementType: elementType,
                length: typeInfo.def.Array!.len
            };
      }


          break;

          case 'Variant':
            // Create a path segment for the variant itself
            const variantId = generateCustomId('variant');
            const variantPathSegment = { type: 'variant', id: variantId, typeName: typeName };
            const variantPath = [...newPath, variantPathSegment];
        
            result = {
                id: variantId,  // Use the unique ID for the variant structure
                type: 'variant',
                path: variantPath,
                typeName: typeName,
                variants: typeInfo.def.Variant!.variants.map(variant => {
                    // Each entry in the variants is considered a distinct variant
                    const variantsId = generateCustomId('variants');
                    const variantEntryPathSegment = { type: 'variants', id: variantsId, typeName: typeName };
                    const variantEntryPath = [...variantPath, variantEntryPathSegment];
        
                    return {
                        id: variantsId,  // ID for this particular variant entry
                        name: variant.name,
                        index: variant.index,
                        typeId: variant.type,
                        type: 'variants',  // Use 'variants' to indicate a group within a variant
                        fields: variant.fields.map(field => {
                            // Fields within a variant are treated as variantField
                            const variantFieldId = generateCustomId('variantField');
                            const fieldPathSegment = { type: 'variantField', id: variantFieldId, typeName: typeName };
                            const fieldPath = [...variantEntryPath, fieldPathSegment];
        
                            return {
                                id: variantFieldId,
                                name: field.name,
                                type: 'variantField',
                                resolvedType: resolveFieldType(field.type, typesLookup, depth + 1, fieldPath, cache),
                                typeName: typeName,
                                typeId: field.type
                            };
                        })
                    };
                })
            };
            break;
        
        
    

            case 'Tuple':
              
              console.log(`Resolving tuple type inside: ${typeId}`, typeInfo.def.Tuple);
              const tupleId = generateCustomId('tuple');
              const tuplePathSegment = { type: 'tuple', id: tupleId, typeName: typeName };
              const tuplePath = [...newPath, tuplePathSegment];
        
              result = {
                type: 'tuple',
                path: tuplePath,
                typeName: typeName,
                id: tupleId,
                elements: typeInfo.def.Tuple.map(tupleTypeId => {
                  console.log(`Resolving tuple element type: ${tupleTypeId}`);
                  console.log(`Tuple type id ${tupleTypeId} tupleElement`);
                  const tupleTypePathSegmentElement = { type: 'tupleElement', id: generateCustomId('tupleElement'), typeName: resolveTypeName(tupleTypeId, typesLookup) };
                  return {
                    type: 'tupleElement',
                    id: tupleTypePathSegmentElement.id,
                    resolvedType: resolveFieldType(tupleTypeId, typesLookup, depth + 1, [...tuplePath, tupleTypePathSegmentElement], cache),
                    typeName: tupleTypePathSegmentElement.typeName,
                    typeId: tupleTypeId
                  };
                })
              };
              break;
          

 

      default:
          console.log(`Type ${typeId} is classified as 'Unknown'`);
          result = { type: 'unknown', path: newPath, typeName: 'Unknown',  id: generateCustomId('unknown'),
        };
          break;
  }

  cache[typeId] = result; // Cache the result before returning
  return result;
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
