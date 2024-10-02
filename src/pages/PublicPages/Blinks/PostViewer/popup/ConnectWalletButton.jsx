import React from 'react';
import { Button } from 'antd';
import { BlinkIcon } from '../../../../../components/Icons/icons'; 

const ConnectWalletButton = () => {
  const handleConnectWallet = () => {
    // Define popup dimensions
    const width = 400;
    const height = 600;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    // Open the popup window
    const popup = window.open(
      `${window.location.origin}/popup.html`,
      'Connect Wallet',
      `width=${width},height=${height},top=${top},left=${left}`
    );

    if (!popup) {
      console.log('Failed to open popup window');
      return;
    }

    // Listen for messages from the popup
    const messageHandler = (event) => {
      // Validate the origin of the message
      const allowedOrigins = ['https://blink.bagpipes.io']; // Update with your DApp's origin
      if (!allowedOrigins.includes(event.origin)) {
        console.log(`Ignored message from origin: ${event.origin}`);
        return;
      }

      const { type, payload } = event.data;

      if (type === 'WALLET_CONNECTED') {
        console.log('Wallet connected with payload:', payload);
        // Update your WalletContext or state with the received wallet data
        // Example:
        // walletContext.setWallet(payload.wallet, payload.walletType);
      } else if (type === 'WALLET_CONNECTION_FAILED') {
        console.log('Wallet connection failed with error:', payload);
        // Handle the error accordingly
      }
    };

    window.addEventListener('message', messageHandler);

    // Optional: Handle popup closure
    const popupInterval = setInterval(() => {
      if (popup.closed) {
        clearInterval(popupInterval);
        window.removeEventListener('message', messageHandler);
        console.log('Popup was closed by the user');
      }
    }, 500);
  };

  return (
    <Button 
      icon={<BlinkIcon className='h-5 w-5' fillColor='white' />} 
      onClick={handleConnectWallet}
      type='primary'
      style={{ backgroundColor: 'black', color: 'white', border: 'none' }}
    >
      Connect Wallet
    </Button>
  );
};

export default ConnectWalletButton;
