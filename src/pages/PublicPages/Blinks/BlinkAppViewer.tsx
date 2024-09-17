import React, { useState, useEffect, useContext } from 'react';
import { Select } from 'antd';
import './Blinks.scss';
import BlinkMiniApp from './BlinkMiniApp';
import useBlinkStore from '../../../store/useBlinkStore';
import { v4 as uuidv4 } from 'uuid';
import { debounce } from 'lodash'; 
import { Data } from '@polkadot/types';
import { WalletContext } from '../../../components/Wallet/contexts';
import CollapsibleField from '../../../components/Bagpipes/Forms/fields/CollapsibleField';
import { listChains} from '../../../Chains/ChainsInfo';
import { getAssetBalanceForChain } from '../../../Chains/Helpers/AssetHelper';
import BalanceTippy from '../../../components/Bagpipes/Forms/PopupForms/ChainForms/ChainTxForm/BalanceTippy';
import { actionCallsData, chainActions } from './actions';
import WalletWidget from '../../../components/WalletWidget/WalletWidget';
import { Button, Modal, Spin } from 'antd';
import { BlinkIcon, CopyIcon } from '../../../components/Icons/icons';  
import { signAndSendRemark } from './generateBlink';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import type { Parameter, Arg, LinkedAction, ActionType, Action, NewActionForm, BlinkMetadata } from './BlinkBuilder';

import { fetchBlinkData } from './helpers';

const BlinkAppViewer: React.FC = () => {
  const walletContext = useContext(WalletContext);

  const { blinks, activeBlinksId, saveBlinkMetadata, createNewBlink, getBlinkMetadata, setActiveBlinksId, addOnChainURL, getOnChainURLs, saveFetchedOnChainBlink, getFetchedOnChainBlink} = useBlinkStore(state => ({ 
    blinks: state.blinks,
    activeBlinksId: state.activeBlinksId,
    saveBlinkMetadata: state.saveBlinkMetadata,
    createNewBlink: state.createNewBlink,
    getBlinkMetadata: state.getBlinkMetadata,
    setActiveBlinksId: state.setActiveBlinksId,
    addOnChainURL: state.addOnChainURL,
    getOnChainURLs: state.getOnChainURLs,
    saveFetchedOnChainBlink: state.saveFetchedOnChainBlink,
    getFetchedOnChainBlink: state.getFetchedOnChainBlink
  }));
    const { fullId } = useParams();    

    

       // State initialization with default values moved into a function
    const initializeAction = () => ({
        id: 'default',
        type: "action",
        icon: "https://bagpipes.io/polkadot-blinks.png",
        title: "",
        description: "",
        label: "",
        disabled: false,
        links: { actions: [] },
        error: undefined,
        actionType: 'select',
        recipient: ''
    });


    const [action, setAction] = useState<Action<"action">>({
        id: '',
        type: "action",
        icon: "https://bagpipes.io/polkadot-blinks.png",    
        title: "",
        description: "",
        label: "",
        disabled: false,
        links: { actions: [] },
        error: undefined,
        actionType: 'select',
        recipient: ''
    });

    let formData: any;


    const [actionForms, setActionForms] = useState<NewActionForm[]>([]);
    const [actionType, setActionType] = useState<string>("select");
    const [amountTypes, setAmountTypes] = useState<string[]>([]); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>();
    const [selectedChain, setSelectedChain] = useState(formData?.selectedChain || '');
    const [selectedCreatorAccount, setSelectedCreatorAccount] = useState('');


    useEffect(() => {
        async function loadBlinkData() {
    
            if (fullId) {
                // Split fullId into chain, blockNumber, txIndex
                const [chain, blockNumStr, txIndexStr] = fullId.split(':');
    
                
                if (chain && blockNumStr && txIndexStr) {
                  const blockNum = parseInt(blockNumStr, 10);
                  const txIdx = parseInt(txIndexStr, 10);
                   
                if (chain && blockNumStr && txIndexStr) {
    
    
                    console.log('BlinkAppViewer loading data chain:', chain, 'blockNumber:', blockNum, 'txIndex:', txIdx);
                    // Try to get the blink data from the store
                    formData = getFetchedOnChainBlink(chain, blockNum, txIdx);
                    console.log('BlinkAppViewer fetched formData', formData);
    
                    if (formData) {
                        console.log('BlinkAppViewer non-fetched formData', formData);
                        setAction(formData);
                        setActionForms(formData?.links?.actions || []);
                        setActionType(formData?.actionType);
                        // Set the amount types for each action in the array
                        if (formData?.links?.actions) {
                        const actionTypes = formData?.links.actions.map(action => action.type || ''); 
                        setAmountTypes(actionTypes);
                        }
                        setSelectedChain(formData?.selectedChain);
                        setSelectedCreatorAccount(formData?.selectedCreatorAccount);
                        
                    } else {
                    setLoading(true);
                    try {
                        // Fetch from chain
                        formData = await fetchBlinkData( blockNum, txIdx);
    
                        
    
                        if (formData) {
                        saveFetchedOnChainBlink(chain, blockNum, txIdx, formData);
                        console.log('BlinkAppViewer formData from on-chain fetch', formData);
                        setAction(formData);
                        setActionForms(formData?.links?.actions || []);
                        setActionType(formData?.actionType);
                        // Set the amount types for each action in the array
                        if (formData?.links?.actions) {
                        const actionTypes = formData?.links.actions.map(action => action.type || ''); 
                        setAmountTypes(actionTypes);
                        }
                        setSelectedChain(formData?.selectedChain);
                        setSelectedCreatorAccount(formData?.selectedCreatorAccount);
    
                            } else {
                                console.error('Unable to fetch data from chain.');
                            }
                    } catch (error) {
                        console.error('Error loading blink data:', error);
                        setError(error);
                    } finally {
                        setLoading(false);
                    }
                    }
                } else {
                    formData = initializeAction() as Action<"action">;
                    console.error('Invalid URL parameters');
                }
            } else {
                console.error('Invalid fullId format. Expected <chain>:<blockNumber>:<txIndex>');
              }
            } else {
              console.error('No fullId parameter found');
            }
        }
    
        loadBlinkData();
      }, [fullId]);
    

  return (
    <>
      <WalletWidget />
      <div className='blinkHeader'>

      <div className='blinkTitleInfo'> 
        <h1>Mini App</h1>
        <span className='font-mono'>On-Chain Blink:<span className='font-mono'>({fullId})</span></span>
        
        </div>
      </div>
      <div className='blinkMiniAppContainer'>
    
      <BlinkMiniApp action={action} />


    </div>

    </>
  );
};

export default BlinkAppViewer;




