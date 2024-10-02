// src/popup.jsx

import React, { useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import { WalletContext } from './components/Wallet/contexts';
import { Button, Spin, message } from 'antd';
import { BlinkIcon } from './components/Icons/icons'; // Adjust the import path as needed

const Popup = () => {
  const walletContext = useContext(WalletContext);

  useEffect(() => {
    const handleMessage = (event) => {
      // Validate the origin
      const allowedOrigins = ['chrome-extension://<YOUR_EXTENSION_ID>']; // Replace with your actual extension ID
      if (!allowedOrigins.includes(event.origin)) {
        console.warn(`Ignored message from origin: ${event.origin}`);
        return;
      }

      const { type, payload } = event.data;

      if (type === 'WALLET_ACCOUNTS') {
        console.log('Received wallet accounts:', payload);
        walletContext.setWallet(payload.accounts, 'beetl'); // Update context with wallet data
        window.opener.postMessage(
          {
            type: 'WALLET_CONNECTED',
            payload: { wallet: payload.accounts, walletType: 'beetl' },
          },
          window.location.origin
        );
        window.close();
      } else if (type === 'WALLET_ERROR') {
        console.error('Received wallet error:', payload);
        window.opener.postMessage(
          {
            type: 'WALLET_CONNECTION_FAILED',
            payload: payload.error,
          },
          window.location.origin
        );
        message.error(`Wallet Connection Failed: ${payload.error}`);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [walletContext]);

  const handleConnect = async () => {
    try {
      const port = chrome.runtime.connect({ name: 'popup' });
      port.postMessage({ type: 'CONNECT_WALLET' });

      port.onMessage.addListener((msg) => {
        if (msg.type === 'WALLET_ACCOUNTS') {
          window.postMessage({ type: 'WALLET_ACCOUNTS', payload: msg.accounts }, window.location.origin);
        } else if (msg.type === 'WALLET_ERROR') {
          window.postMessage({ type: 'WALLET_ERROR', payload: msg.error }, window.location.origin);
        }
      });

      port.onDisconnect.addListener(() => {
        console.log('Port disconnected');
      });
    } catch (error) {
      console.error('Failed to connect to wallet:', error);
      window.postMessage({ type: 'WALLET_ERROR', payload: error.message }, window.location.origin);
      message.error('Failed to connect to wallet');
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <BlinkIcon className="h-5 w-5" fillColor="black" />
      <h2>Connect to Beetl Wallet</h2>
      <Button
        type="primary"
        onClick={handleConnect}
        icon={<BlinkIcon className="h-5 w-5" fillColor="white" />}
        style={{ backgroundColor: 'black', color: 'white', border: 'none' }}
      >
        Connect Wallet
      </Button>
      {/* Optional: Add a loading spinner or status messages */}
    </div>
  );
};

ReactDOM.render(<Popup />, document.getElementById('root'));
