// WalletConnectWallet.ts

import { SubscriptionFn, Wallet, WalletAccount, WalletInfo, WalletLogoProps } from './types';
import { Signer, SignerResult } from '@polkadot/api/types';
import { SignerPayloadJSON } from '@polkadot/types/types';
import { SessionTypes } from '@walletconnect/types';
import UniversalProvider from '@walletconnect/universal-provider';
import { WalletConnectModal } from '@walletconnect/modal';

interface SignTransactionResult {
    signature: string;
  }

export class WalletConnectWallet implements Wallet {
    extensionName: string;
    title: string;
    installUrl?: string;
    logo: WalletLogoProps;
    public provider: UniversalProvider | undefined;
    private modal: WalletConnectModal | undefined;
    accounts: WalletAccount[] = [];
    extension: any;
    metadata: any;



    constructor({ extensionName, installUrl, logo, title }: WalletInfo) {
        this.extensionName = extensionName;
        this.title = title;
        this.installUrl = installUrl;
        this.logo = logo;
    }

    getAccounts: () => Promise<WalletAccount[] | null>;

    get installed() {
        // WalletConnect is always available
        return true;
    }

    enable = async () => {
        if (!this.provider) {
            this.provider = await UniversalProvider.init({
                projectId: '1fb9fc2337c802bf4be64117d0ef6480', // Replace with your actual project ID
                relayUrl: 'wss://relay.walletconnect.com'
            });

            // Listen for the display_uri event
            this.provider.on('display_uri', (uri: string) => {
                if (!this.modal) {
                    this.modal = new WalletConnectModal({
                        projectId: '1fb9fc2337c802bf4be64117d0ef6480', // Replace with your actual project ID
                    });
                }
                this.modal.openModal({ uri });
            });
        }

        // Start the connection process
        await this.provider.connect({
            namespaces: {
                polkadot: {
                    methods: ['polkadot_signTransaction', 'polkadot_signMessage'],
                    chains: ['polkadot:91b171bb158e2d3848fa23a9f1c25182'],
                    events: ['chainChanged', 'accountsChanged'],
                },
            },
        });

        // Access session after connection
        const walletConnectSession = this.provider.session;

        // Process accounts from the session
        this.accounts = Object.values(walletConnectSession.namespaces)
            .map((namespace: SessionTypes.Namespace) => namespace.accounts)
            .flat()
            .map((wcAccount) => {
                const address = wcAccount.split(':')[2];
                return {
                    address,
                    name: 'WalletConnect Account',
                    source: this.extensionName,
                    wallet: this,
                    signer: this.signer,
                } as WalletAccount;
            });

        // Close the modal after successful connection
        if (this.modal) {
            this.modal.closeModal();
        }
    };


    subscribeAccounts = async (callback: SubscriptionFn) => {
        // Implement subscription if needed
        callback(this.accounts);
        return () => {}; // Return unsubscribe function if applicable
    };

    get signer(): Signer {
        return {
            signPayload: async (payload: SignerPayloadJSON): Promise<SignerResult> => {
                const result = await this.provider.client.request({
              topic: this.provider.session.topic,
              chainId: 'polkadot:91b171bb158e2d3848fa23a9f1c25182',
              request: {
                method: 'polkadot_signTransaction',
                params: {
                  address: payload.address,
                  transactionPayload: payload,
                },
              },
            }) as SignTransactionResult;
      
            return {
              id: parseInt(payload.specVersion, 10),
              signature: `0x${result.signature}`,
            };
          },
        };
      }
      
    }