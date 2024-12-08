import { listAssetHubAssets,listBifrostAssets, listMoobeamAssets, listAssetHubAssets_Kusama, listMoonriverAssets, listTuringAssets, listMangataxAssets, listHydrationAssets, listInterlayAssets } from 'chains-lib';


const assetHubAssets = {
    asset: {
        name: 'assetHubDot',
        symbol: 'DOT',
        description: 'AssetHub (Polkadot)',
    },
    assetId: 1000,
};

const bifrostAssets = {
    asset: {
        name: 'bifrostBnc',
        symbol: 'BNC',
        description: 'Bifrost',
    },
    assetId: 0,
};

const dotAssets = {
  asset: {
    name: 'polkadotDot',
    symbol: 'DOT',
    description: 'Polkadot',
  },
  assetId: 0,
};

const ksmAssets = {
    asset: {
      name: 'kusamaKSM',
      symbol: 'KSM',
      description: 'Kusama',
    },
    assetId: 0,
  };



const interlayAssets = {
    asset: {
        name: 'interlayIntr',
        symbol: 'INTR',
        description: 'Interlay (Polkadot)',
    },
    assetId: 0,
};



const rococoAssets = {
  asset: {
    name: 'rococoRoc',
    symbol: 'ROC',
    description: 'Rococo',
  },
  assetId: 0,
};

export const assetOptions = [
    {
        chain: 'bifrost',
        assets: [bifrostAssets], 
    },
    {
        chain: 'polkadot',
        assets: [dotAssets], 
    },
    {
        chain: 'kusama',
        assets: [ksmAssets], 
    },
    {
        chain: 'rococo',
        assets: [rococoAssets], 
    },
    {
        chain: 'hydration',
        assets: [], 
    },
    {
        chain: 'assetHub',
        assets: [], 
    },
    {
        chain: 'interlay',
        assets: [interlayAssets], 
    }
];

export const getAssetOptions = async (selectedChain, signal) => {
  console.log("Inside getAssetOptions for chain:", selectedChain);
  
  let assets;
  switch(selectedChain) {
      
      case 'assetHub':
            assets = await listAssetHubAssets();
           // Append assetHubAssets to the fetched assets list
            assets.push(assetHubAssets);
          break;

    case 'bifrost':
        assets = await listBifrostAssets();
        console.log("Bifrost Assets:", assets);
         assets.push(bifrostAssets);
        break;
    case 'hydration':
            assets = await listHydrationAssets();
        break;
      case 'mangatax':
        assets = await listMangataxAssets();
        //assets.push(myassets);
        break;
    case 'moonriver':
        assets = listMoonriverAssets();
        break;

      case 'interlay':
            assets = await listInterlayAssets();
            assets.push(interlayAssets);
          break;

    case 'assetHub_kusama':
        assets = listAssetHubAssets_Kusama();
        break;
    
    case 'moonbeam':
        assets = listMoobeamAssets('moonbeam');
        break;

        case 'turing':
          assets = listTuringAssets();

          break;

      case 'polkadot':
          assets = [dotAssets];
          break;
    
        case 'kusama':
        assets = [ksmAssets];
        break;
      case 'rococo':
          assets = [rococoAssets];
          break;
      default:
          assets = [];
  }

  return {
      chain: selectedChain,
      assets: assets
  };
};

