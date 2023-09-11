import { list_assethub_assets, list_hydradx_assets } from './../../../Chains/draft_tx';


export const chainOptions = [
    {
      value: 'polkadot',
      label: 'Polkadot',
      logo: './polkadot-logo.svg',
    },
    {
      value: 'rococo',
      label: 'Rococo',
      logo: './polkadot-logo.svg'
    },
    {
      value: 'hydradx',
      label: 'Hydra',
      logo: './hydra-logo.svg'
    },
    {
      value: 'Polkadot AssetHub',
      label: 'Asset Hub',
      logo: './assethub-logo.svg'
    },
  ];


  export const assetOptions = [
    {
      chain: 'polkadot',
      assets: [
        {
          name: 'polkadotDot',
          ticker: 'DOT',
          description: 'Polkadot'
        }
      ]
    },
    {
      chain: 'rococo',
      assets: [
        {
          name: 'rococoRoc',
          ticker: 'ROC',
          description: 'Rococo'
        }
      ]
    },
    {
      chain: 'hydradx',
      assets: 
      await list_hydradx_assets()
    },
    {
      chain: 'Polkadot AssetHub',
      assets: 
        await list_assethub_assets()
      
    }
  ];

