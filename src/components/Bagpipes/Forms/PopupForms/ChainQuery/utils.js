



export function parseMetadata(rawMetadata) {
    const metadata = rawMetadata.metadata;
    console.log("parseMetadata Metadata:", metadata);
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
    const calls = (pallet?.calls?.items || []).map(call => ({
        name: call.name,
        type: call.type,  // Assumes call.type gives an indication of input types needed
        docs: call.docs ? call.docs.join(' ') : 'No documentation available.'
    }));

    const storageItems = (pallet?.storage?.items || []).map(item => ({
        name: item.name,
        fields: item.type.Map ? Object.entries(item.type.Map).map(([key, value]) => ({
            key, value
        })) : [],
        type: item.type,
        docs: item.docs ? item.docs.join(' ') : 'No documentation available.'
    }));


    const methodOutput = {name: pallet.name, calls, storage: storageItems};
    console.log("parsePallet methodOutput:", methodOutput);
    return methodOutput
}


  
  // function parsePallet(pallet) {
  //   return {
  //     name: pallet.name,
  //     methods: pallet.storage ? pallet.storage.items.map(item => {
  //       return {
  //         name: item.name,
  //         fields: item.type.Map ? Object.entries(item.type.Map).map(([key, value]) => {
  //           return { key, value };
  //         }) : []
  //       };
  //     }) : []
  //   };
  // }
  


// function parsePallet(pallet) {
//   const methods = [];
//   // Parsing extrinsics (callable methods)
//   if (pallet.extrinsics) {
//     pallet.extrinsics.forEach(extrinsic => {
//       methods.push({
//         name: extrinsic.name,
//         documentation: extrinsic.documentation.join(' '),
//         args: extrinsic.args.map(arg => ({
//           name: arg.name,
//           type: arg.type.toString(),  // Assuming arg.type needs conversion or parsing
//         }))
//       });
//     });
//   }

//   // Parsing storage items (if needed for some other functionalities)
//   const storageItems = pallet.storage ? pallet.storage.items.map(item => {
//     return {
//       name: item.name,
//       type: item.type.Map ? Object.entries(item.type.Map).map(([key, value]) => ({ key, value })) : [],
//       documentation: item.docs.join(' ')
//     };
//   }) : [];

//   return {
//     name: pallet.name,
//     methods,
//     storage: storageItems
//   };
// }

// export function parseMetadata(rawMetadata) {
//   const metadata = rawMetadata.metadata;
//   console.log("parseMetadata Metadata:", metadata);
//   if (!metadata) {
//     console.error('No metadata provided:', metadata);
//     return [];
//   }

//   let pallets = [];
//   if (metadata.V14) {
//     pallets = metadata.V14.pallets.map(parsePallet);
//   } else if (metadata.V13) {
//     pallets = metadata.V13.pallets.map(parsePallet);
//   } else {
//     console.error('Metadata version not supported:', metadata);
//   }
//   return pallets;
// }


