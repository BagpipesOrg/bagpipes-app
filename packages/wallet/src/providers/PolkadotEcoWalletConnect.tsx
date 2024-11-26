import UniversalProvider from '@walletconnect/universal-provider'
import { WalletConnectModal } from '@walletconnect/modal'

const provider = await UniversalProvider.init({
    projectId: '1fb9fc2337c802bf4be64117d0ef6480',
    relayUrl: 'wss://relay.walletconnect.com'
  })


  const params = {
    requiredNamespaces: {
      polkadot: {
        methods: ['polkadot_signTransaction', 'polkadot_signMessage'],
        chains: [
          'polkadot:91b171bb158e2d3848fa23a9f1c25182', // polkadot
          'polkadot:afdc188f45c71dacbaa0b62e16a91f72', // hydradx
          'polkadot:0f62b701fb12d02237a33b84818c11f6' // turing network
        ],
        events: ['chainChanged", "accountsChanged']
      }
    }
  }
  
  const { uri, approval } = await provider.client.connect(params)

  const walletConnectModal = new WalletConnectModal({
    projectId: '1fb9fc2337c802bf4be64117d0ef6480',
  })


  // if there is a URI from the client connect step open the modal
if (uri) {
    walletConnectModal.openModal({ uri })
  }
  // await session approval from the wallet app
  const walletConnectSession = await approval()
  
  