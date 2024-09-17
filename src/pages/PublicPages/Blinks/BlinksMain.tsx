// here we import BlinkViewer and BlinkBuilder from the local diretory

import React from 'react';
import './Blinks.scss';
import BlinkViewer from './BlinkViewer';
import WalletWidget from '../../../components/WalletWidget/WalletWidget';

const BlinksMain: React.FC = () => {

  const BlinkBuilder: React.FC = () => {
    const walletContext = useContext(WalletContext);
  
    const { blinks, activeBlinksId, saveBlinkMetadata, createNewBlink, getBlinkMetadata, setActiveBlinksId, addOnChainURL, getOnChainURLs } = useBlinkStore(state => ({ 
      blinks: state.blinks,
      activeBlinksId: state.activeBlinksId,
      saveBlinkMetadata: state.saveBlinkMetadata,
      createNewBlink: state.createNewBlink,
      getBlinkMetadata: state.getBlinkMetadata,
      setActiveBlinksId: state.setActiveBlinksId,
      addOnChainURL: state.addOnChainURL,
      getOnChainURLs: state.getOnChainURLs
    }));

    
  return (
    <>
    <WalletWidget />
      <div className='blinkHeader'>

      <div className='blinkTitleInfo'> 
        <h1>Blink DApp Builder</h1>
        <span>Blink {activeBlinksId}</span></div>
      </div>
      <div className='blinkMainContainer'>
      <BlinkViewer action={action} />
    </div>
    </>
  );
};

export default BlinksMain;