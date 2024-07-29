import { Type, TypeEntry, TypeDefinitions, Field, Pallet, MethodOutput, RawMetadata, CallOutput, StorageOutput, TypeLookup, ResolvedType, PathSegment} from './TypeDefinitions';
import { TypeDef } from './ParseMetadataTypes';

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
console.log('Resolving type and here is the path and the depth', path, depth);
  if (cache[typeId]) {
    // console.log(`Using cached result for typeId: ${typeId}`);
    return cache[typeId];
}

if (depth > 45) {
    console.warn(`Excessive recursion at depth ${depth} for typeId ${typeId}`);
    return { type: 'complex', path, typeName: 'Complex Type', id: `complexDepth-${depth}`};
}

const typeInfo = typesLookup[typeId];
if (!typeInfo || !typeInfo.def) {
    console.error(`Type information is undefined or missing definition for typeId: ${typeId} and depth: ${depth} at path: ${path.join(' -> ')} `);
    return { type: 'input', path, id: `inputError-${depth}`};
}


const typeName = resolveTypeName(typeId, typesLookup);
const currentType = Object.keys(typeInfo.def)[0] as keyof TypeDef;

const typeLower = currentType.toLowerCase();
const typeID = `${typeLower}-${depth}`;

const newPathSegment = { type: currentType, id: typeID, typeName: typeName };
const newPath = [...path, newPathSegment];


  let result: ResolvedType = {
    type: currentType,
    path: newPath,
    typeName: typeName,
    id: typeID
    
};

switch (currentType) {
      case 'Primitive':
          result = { type: 'input', path: newPath, typeName: typeName, id: typeID, };
          break;

          case 'Composite':

            result = {
                type: 'composite',
                path: newPath,
                typeName: typeName,
                typeId: typeInfo.def.Composite!.type,
                id: typeID,  
                fields: typeInfo.def.Composite!.fields.map((field, index) => {
                    // Generate unique ID only for each field within the composite
                    const fieldID = `compositeField-${depth + 1}`;
                    const fieldPathSegment = { type: 'compositeField', id: fieldID, typeName: resolveTypeName(field.type, typesLookup) };
                    
                    const fieldPath = [...newPath, fieldPathSegment];

                    return {
                        name: field.name || '',
                        type: 'compositeField',
                        id: `${fieldID}-[${index}]`,
                        resolvedType: resolveFieldType(field.type, typesLookup, depth + 2, fieldPath, cache),
                        typeName: fieldPathSegment.typeName,
                        typeId: field.type,
                        path: fieldPath
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
              id: typeID,
          }
          break;

      case 'Sequence':

      if (typeInfo.def.Sequence!.type === '2') {
        console.log(`Resolving array type special: ${typeId}`),
          result = {
              id: `input-${depth}`,
              type: 'input',
              path: newPath,
              typeName: 'Bytes', 
        } 
      } else {

        const childDepthId = `sequenceField-${depth + 1}`; 
        const sequenceFieldPathSegment = { type: 'sequenceField', id: childDepthId, typeName: typeName };
        const sequenceFieldPath = [...newPath, sequenceFieldPathSegment]; 

        result = {
            id: typeID,
            type: 'sequence',
            typeId: typeInfo.def.Sequence!.type,
            typeName: typeName,
            path: newPath,
            elementType: resolveFieldType(typeInfo.def.Sequence!.type, typesLookup, depth + 2, sequenceFieldPath, cache)
        };
      }
        break;
        
      case 'Array':
        console.log(`Resolving array type inside: ${typeId}`, typeInfo.def.Array);


        // Check if the array is of length 32 and element type is U8
        if (typeInfo.def.Array!.len === '4' && typeInfo.def.Array!.type === '2') {
          console.log(`Resolving array type special: ${typeId}`),
            result = {
                id: `input-${depth}`,
                type: 'input',
                path: newPath,
                typeName: '[u8;4]', 
          };

        } else if (typeInfo.def.Array!.len === '8' && typeInfo.def.Array!.type === '2') {
            console.log(`Resolving array type special: ${typeId}`),
              result = {
                id:`input-${depth}`,

                  type: 'input',
                  path: newPath,
                  typeName: '[u8;8]', 
              };
        } else if (typeInfo.def.Array!.len === '16' && typeInfo.def.Array!.type === '2') {
          console.log(`Resolving array type special: ${typeId}`),
            result = {
              id: `input-${depth}`,

                type: 'input',
                path: newPath,
                typeName: '[u8;8]', 
            };
      
        } else if (typeInfo.def.Array!.len === '20' && typeInfo.def.Array!.type === '2') {
           console.log(`Resolving array type special: ${typeId}`),
          result = {
            id: `input-${depth}`,

              type: 'input',
              path: newPath,
              typeName: '[u8;20]', 
          };

        } else if (typeInfo.def.Array!.len === '32' && typeInfo.def.Array!.type === '2') {
          console.log(`Resolving array type special: ${typeId}`),
            result = {
              id: `input-${depth}`,

                type: 'input',
                path: newPath,
                typeName: '[u8;32]',
            };
        } else {

         

          const arrayElementId = `arrayElement-${depth + 1}`;
          const arrayElementPathSegment = { type: 'arrayElement', id: arrayElementId, typeName: typeName };

          const arrayElementPath = [...newPath, arrayElementPathSegment];
          const elementType = resolveFieldType(typeInfo.def.Array!.type, typesLookup, depth + 2, arrayElementPath, cache);

          
            result = {
                id: typeID,
                type: 'array',
                path: newPath,
                typeId: typeInfo.def.Array!.type,
                elementType: elementType,
                length: typeInfo.def.Array!.len
            };
        }


          break;

      case 'Variant':
            // Create a path segment for the variant itself
        
            result = {
                id: typeID, 
                type: 'variant',
                name: typeInfo.def.Variant!.name || '',
                path: newPath,
                typeName: typeName,
                variants: typeInfo.def.Variant!.variants.map((variant, index ) => {

                  const variantsId = `variants-${depth + 1}`;
                    const variantEntryPathSegment = { type: 'variants', id: variantsId, typeName: typeName };
                    const variantEntryPath = [...newPath, variantEntryPathSegment];
        
                    return {
                        id: `${variantsId}-[${index}]`, 
                        name: variant.name,
                        index: variant.index,
                        path: variantEntryPath,
                        typeId: variant.type,
                        type: 'variants',  // Use 'variants' to indicate a group within a variant
                        fields: variant.fields.map((field, index) => {
                            // Fields within a variant are treated as variantField
                            const variantFieldId = `variantField-${depth + 2}`;
                            const fieldPathSegment = { type: 'variantField', id: variantFieldId, typeName: typeName };
                            const fieldPath = [...variantEntryPath, fieldPathSegment];
        
                            return {
                                id: `${variantFieldId}-[${index}]` ,
                                name: field.name,
                                type: 'variantField',
                                resolvedType: resolveFieldType(field.type, typesLookup, depth + 3, fieldPath, cache),
                                typeName: typeName,
                                typeId: field.type,
                                path: fieldPath
                            };
                        })
                    };
                })
            };
            break;

      case 'Tuple':
              
        
              result = {
                type: 'tuple',
                path: newPath,
                typeName: typeName,
                id: typeID,
                elements: typeInfo.def.Tuple.map((tupleTypeId, index) => {
                  console.log(`Resolving tuple element type: ${tupleTypeId}`);
                  console.log(`Tuple type id ${tupleTypeId} tupleElement`);
                  const tupleTypePathSegmentElement = { type: 'tupleElement', id: `tupleElement-${depth + 1}`, typeName: resolveTypeName(tupleTypeId, typesLookup) };
                  return {
                    type: 'tupleElement',
                    id:`${tupleTypePathSegmentElement.id}-[${index}]`,
                    resolvedType: resolveFieldType(tupleTypeId, typesLookup, depth + 1, [...newPath, tupleTypePathSegmentElement], cache),
                    typeName: tupleTypePathSegmentElement.typeName,
                    typeId: tupleTypeId,
                    path: [...newPath, tupleTypePathSegmentElement]
                  };
                })
              };
              break;
          
      default:
          console.log(`Type ${typeId} is classified as 'Unknown'`);
          result = { type: 'unknown', path: newPath, typeName: 'Unknown',  id: `unknown-${depth}`,
        };
          break;
}

  cache[typeId] = result; 
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
