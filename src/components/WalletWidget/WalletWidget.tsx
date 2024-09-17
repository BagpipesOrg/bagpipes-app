import React, { useContext } from 'react';
import { WalletContext, OpenSelectWallet } from '../Wallet/contexts';
import { WalletIcon } from '../Icons/icons';
import './WalletWidget.scss';

function WalletWidget(): React.ReactElement {
  const { open: openSelectWallet } = useContext(OpenSelectWallet);
  const walletContext = useContext(WalletContext);

  const wallet = walletContext.wallet || walletContext.evmWallet;

  const walletTitle = wallet ? wallet.title : 'Connect';
  const walletLogoSrc = wallet?.logo?.src;
  const status = walletContext.status;

console.log("WalletWidget", walletTitle, walletLogoSrc, status);

  const displayStatus = () => {
    console.log("displayStatus", status);
    switch (status) {
      case 'authorizing':
        return 'Authorizing...';
      case 'signing':
        return 'Awaiting Signature...';
      case 'sending':
        return 'Sending Transaction...';
      case 'success':
        return 'Transaction Successful';
      case 'error':
        return 'Error Occurred';
      case 'cancelled':
        return 'Transaction Cancelled';
      default:
        return '';
    }
  };


  return (
    <div className="widget-container">
      <button onClick={openSelectWallet} className="widget-btn items-center mb-4">
        <span className="icon-and-text">
          <span className="icon">
            {walletLogoSrc ? (
              <img src={walletLogoSrc} alt={walletTitle} className="wallet-logo-small" />
            ) : (
              <WalletIcon className="h-5 w-5" fillColor="black" />
            )}
          </span>
          <span className="text">
            <span className="connect">{walletTitle}</span>
            {status !== 'connected' && status !== 'disconnected' && (
              <span className="status">{displayStatus()}</span>
            )}
          </span>
        </span>
      </button>
    </div>
  );
}

export default WalletWidget;
