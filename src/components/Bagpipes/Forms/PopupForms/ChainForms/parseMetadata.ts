

interface Pallet {
  name: string;
  calls?: {
    type: string; 
  };
  storage?: {
    items: StorageItem[];
  };
}

interface Call {
  name: string;
  type: string;
  params?: Param[];
  docs?: string[];
}

interface Param {
  name: string;
  type: string;
  typeName?: string;
  docs?: string[];
}

interface StorageItem {
  name: string;
  type: {
    Map?: Record<string, any>;
  };
  docs?: string[];
}

interface MethodOutput {
  name: string;
  calls: CallOutput[];
  storage: StorageOutput[];
}

interface CallOutput {
  name: string;
  type: string;
  docs: string;
}

interface StorageOutput {
  name: string;
  fields: { key: string; value: any }[];
  type: any;
  docs: string;
}

interface Lookup {
  types: TypeDef[];
}

interface TypeDef {
  id: string;
  type: {
    path?: string[];
    params?: TypeParam[];
    def: TypeDefDetail;
    docs?: string[];
  };
}

interface TypeDefDetail {
  Primitive?: string;
  Composite?: {
    fields: TypeField[];
  };
  Sequence?: {
    type: string; // Reference to another type ID
    length?: number; // Optional length for fixed-size sequences
  };
  Array?: {
    type: string; // Reference to another type ID
    len: number;
  };
  Tuple?: {
    types: string[]; // Array of type IDs
  };
  Variant?: {
    variants: Variant[];
  };
  // more type definitions as needed
}

interface TypeField {
  name?: string; // Name might be optional in some contexts
  type: string; // Reference to type ID
  typeName?: string; // Optional more readable type name
  docs?: string[];
}

interface TypeParam {
  name: string; // Name of the parameter, often generic, like "T"
  type?: string; // Reference to another type ID
}

interface Variant {
  name: string;
  fields: TypeField[];
  index?: number;
  docs?: string[];
}


interface VersionedMetadata {
  pallets: Pallet[];
  lookup?: Lookup;
}

interface Metadata {
  V14?: VersionedMetadata;
  V13?: VersionedMetadata; // Include lookup if V13 supports it
  [key: string]: any;
}

interface RawMetadata {
  metadata: Metadata;
}

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
    // Pass typesLookup to parsePallet
    pallets = metadata.V14.pallets.map(pallet => parsePallet(pallet, typesLookup));
  } else if (metadata.V13) {
    // If you need similar logic for V13, ensure it also passes types information
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
    const callTypeInfo = typesLookup[callsTypeId]; // Assuming you have a mechanism to lookup types by ID

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

  const storageItems = (pallet.storage?.items || []).map(item => ({
    name: item.name,
    fields: item.type.Map ? Object.entries(item.type.Map).map(([key, value]) => ({
      key,
      value
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

  // Check the typeInfo.path first
  if (typeInfo.path && typeInfo.path.length > 0) {
    return typeInfo.path.join('.');
  }

  // Handle the different possible type definitions
  const { def } = typeInfo;
  if (!def) return 'Undefined Type Definition';

  if (def.Primitive) {
    return def.Primitive;
  } else if (def.Composite) {
    return `Composite(${def.Composite.fields.map(f => resolveTypeName(f.type, typesLookup)).join(', ')})`;
  } else if (def.Sequence) {
    return `Sequence of ${resolveTypeName(def.Sequence.type, typesLookup)}`;
  } else if (def.Array) {
    return `Array[${def.Array.len}] of ${resolveTypeName(def.Array.type, typesLookup)}`;
  } else if (def.Variant) {
    return `Variant`;
  } else {
    // If none of the types matched, default to Complex Type
    return 'Complex Type';
  }
}


