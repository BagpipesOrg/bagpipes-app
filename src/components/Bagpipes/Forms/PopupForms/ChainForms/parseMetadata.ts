

interface Pallet {
  name: string;
  calls?: {
    items: Call[];
  };
  storage?: {
    items: StorageItem[];
  };
}

interface Call {
  name: string;
  type: string;
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

interface Metadata {
  V14?: {
    pallets: Pallet[];
  };
  V13?: {
    pallets: Pallet[];
  };
  [key: string]: any;
}

interface RawMetadata {
  metadata: Metadata;
}

export function parseMetadataPallets(rawMetadata: RawMetadata): MethodOutput[] {
  const metadata = rawMetadata.metadata;
  // console.log("parseMetadata Metadata:", metadata);

  if (!metadata) {
    console.error('No metadata provided:', metadata);
    return [];
  }

  let pallets: MethodOutput[] = [];
  if (metadata.V14) {
    console.log('Metadata version:', metadata.V14);
    pallets = metadata.V14.pallets.map(pallet => parsePallet(pallet));
  } else if (metadata.V13) {
    pallets = metadata.V13.pallets.map(pallet => parsePallet(pallet));
  } else {
    console.error('Metadata version not supported:', metadata);
  }
  return pallets;
}

function parsePallet(pallet: Pallet): MethodOutput {
  const calls = (pallet.calls?.items || []).map(call => ({
    name: call.name,
    type: call.type,
    docs: call.docs ? call.docs.join(' ') : 'No documentation available.'
  }));

  const storageItems = (pallet.storage?.items || []).map(item => ({
    name: item.name,
    fields: item.type.Map ? Object.entries(item.type.Map).map(([key, value]) => ({
      key,
      value
    })) : [],
    type: item.type,
    docs: item.docs ? item.docs.join(' ') : 'No documentation available.'
  }));

  const methodOutput: MethodOutput = { name: pallet.name, calls, storage: storageItems };
  return methodOutput;
}


// export function parseMetadataPallets(rawMetadata) {
//   const metadata = rawMetadata.metadata;
//   if (!metadata) {
//     console.error('No metadata provided:', metadata);
//     return [];
//   }

//   let pallets = [];
//   if (metadata.V14) {
//       console.log('Metadata version:', metadata.V14);
//     pallets = metadata.V14.pallets.map(pallet => parsePallet(pallet));
//   } else if (metadata.V13) { // Example for another version
//     pallets = metadata.V13.pallets.map(pallet => parsePallet(pallet));
//   } else {
//     console.error('Metadata version not supported:', metadata);
//   }
//   return pallets;
// }

// function parsePallet(pallet) {
//   const calls = (pallet?.calls?.items || []).map(call => ({
//       name: call.name,
//       type: call.type,  // Assumes call.type gives an indication of input types needed
//       docs: call.docs ? call.docs.join(' ') : 'No documentation available.'
//   }));

//   const storageItems = (pallet?.storage?.items || []).map(item => ({
//       name: item.name,
//       fields: item.type.Map ? Object.entries(item.type.Map).map(([key, value]) => ({
//           key, value
//       })) : [],
//       type: item.type,
//       docs: item.docs ? item.docs.join(' ') : 'No documentation available.'
//   }));


//   const methodOutput = {name: pallet.name, calls, storage: storageItems};
//   // console.log("parsePallet methodOutput:", methodOutput);
//   return methodOutput
// }



