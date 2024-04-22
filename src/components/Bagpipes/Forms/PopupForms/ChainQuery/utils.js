export function parseMetadata(rawMetadata) {
    const metadata = rawMetadata.metadata;
    if (!metadata) {
      console.error('No metadata provided:', metadata);
      return [];
    }
  
    let pallets = [];
    if (metadata.V14) {
        console.log('Metadata version:', metadata.V14);
      pallets = metadata.V14.pallets.map(pallet => parsePallet(pallet));
    } else if (metadata.V13) { // Example for another version
      pallets = metadata.V13.pallets.map(pallet => parsePallet(pallet));
    } else {
      console.error('Metadata version not supported:', metadata);
    }
    return pallets;
  }
  
  function parsePallet(pallet) {
    return {
      name: pallet.name,
      methods: pallet.storage ? pallet.storage.items.map(item => {
        return {
          name: item.name,
          fields: item.type.Map ? Object.entries(item.type.Map).map(([key, value]) => {
            return { key, value };
          }) : []
        };
      }) : []
    };
  }
  