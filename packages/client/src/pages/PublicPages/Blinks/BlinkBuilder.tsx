import React, { useState, useEffect, useContext } from 'react';

import BlinkViewer from './BlinkViewer';
import useBlinkStore from '../../../store/useBlinkStore';
import { v4 as uuidv4 } from 'uuid';
import { WalletContext, WalletWidget } from 'wallet';
import CollapsibleField from '../../../components/Bagpipes/Forms/fields/CollapsibleField';
import { listChains, getAssetBalanceForChain } from 'chains-lib';
import BalanceTippy from '../../../components/Bagpipes/Forms/PopupForms/ChainForms/ChainTxForm/BalanceTippy';
import { actionCallsData, chainActions } from './actions';
import { Button, Modal, Spin } from 'antd';
import { BlinkIcon, CopyIcon } from '../../../components/Icons/icons';  
import { signAndSendRemark } from './generateBlink';
import type { Action, NewActionForm } from './types';
import type { Balance, Chain } from './types';
import toast from 'react-hot-toast';
// import { useTippy } from '../../../contexts/tooltips/TippyContext';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; 
import 'tippy.js/themes/light.css';

import './Blinks.scss';
import 'wallet-styles';



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



   // State initialization with default values moved into a function
   const initializeAction = (id: string) => ({
    id: id,
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

let formData = getBlinkMetadata(activeBlinksId);


  useEffect(() => {
    console.log('BlinkBuilder activeBlinksId', activeBlinksId);
    if (activeBlinksId) {

      formData = getBlinkMetadata(activeBlinksId);
      console.log('BlinkBuilder already id loading formData',);

    
      if (formData) {
        console.log('BlinkBuilder formData', formData);
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

      }
      
 
    } else {
      const newId = uuidv4();
      setActiveBlinksId(newId);
      const newBlinkData = initializeAction(newId) as Action<"action">;
      saveBlinkMetadata(newId, newBlinkData);
      setAction(newBlinkData);
    }
  }, [activeBlinksId, createNewBlink, getBlinkMetadata, setActiveBlinksId]);


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

  const [actionForms, setActionForms] = useState<NewActionForm[]>([]);
  const [actionType, setActionType] = useState<string>("select");
  const [actionConfig, setActionConfig] = useState([]);
  const [amountTypes, setAmountTypes] = useState<string[]>([]); 
  
  const [balance, setBalance] = useState<Balance | null>(null);
  const [isFetchingBalance, setIsFetchingBalance] = useState(false);
  const [chainSymbol, setChainSymbol] = useState('');

  const [chains, setChains] = useState<Chain[]>([]);
  const [selectedChain, setSelectedChain] = useState(formData?.selectedChain || '');
  const [selectedCreatorAccount, setSelectedCreatorAccount] = useState('');
  const[selectedCreatorAccountName, setSelectedCreatorAccountName] = useState('');
  const [iconUrl, setIconUrl] = useState(formData?.icon || ''); 
  const [formFields, setFormFields] = useState([]);

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [urlStatus, setUrlStatus] = useState('wating for signature');
  const [urlLoading, setUrlLoading] = useState(false);
  const [loadings, setLoadings] = useState<boolean[]>([]);
  const [themeColor, setThemeColor] = useState('#ffffff');


  const enterLoading = (index: number) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });

    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 6000);
  };



  const handleChange = (field: keyof Action<"action">) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string
  ) => {
    const value = typeof e === 'string' ? e : e.target.value;
    const updatedValue = { ...action, [field]: value };

    setAction(updatedValue);
    const updatedFormData = { ...formData, [field]: value };
    saveBlinkMetadata(activeBlinksId, updatedFormData);
    console.log('handleChange', field, value, updatedFormData);
  };


  const handleThemeColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setThemeColor(e.target.value);
  };


  const handleTransferButtonChange = (index: number, valueOrEvent: any, field: keyof NewActionForm) => {
    let value: string;
    if (typeof valueOrEvent === 'string') {
        value = valueOrEvent;
    } else if (valueOrEvent && valueOrEvent.target) {
        value = valueOrEvent.target.value;
    } else {
        console.error('Invalid input from form elements');
        return;
    }

    const newForms = [...actionForms];
    newForms[index][field] = value;
    setActionForms(newForms);

    // Construct the updated actions based on form data
    const updatedActions = newForms.map(form => ({
        label: form.label,
        href: form.amountType === "fixedAmount" ? `/api/${actionType}/recipient?amount=${form.amount}` : `/api/${actionType}/recipient`,
        type: form.amountType,
        parameters: form.amountType === "inputAmount" ? [{ name: form.inputName, label: form.label, type: 'inputAmount' }] : []
    }));
    setAction(prev => ({ ...prev, links: { actions: updatedActions } }));
    saveBlinkMetadata(activeBlinksId, 
      {...formData, links: { actions: updatedActions }});
  };



  const addNewTransferButton = () => {
    if (actionType !== "" && actionType !== "no action") {
        const inputAmountCount = actionForms.filter(form => form.amountType === "inputAmount").length;
        const fixedAmountCount = actionForms.filter(form => form.amountType === "fixedAmount").length;

        if (inputAmountCount >= 1 && fixedAmountCount >= 3) {
            alert("Maximum number of input and fixed amounts reached.");
            return;
        }

        setActionForms(prev => [...prev, { label: "", amount: "", inputName: "", amountType: "", recipient: "" }]);
    } else {
        alert("Please select a valid action type first.");
    }
  };


  const removeTransferButton = (index: number) => {
    const filteredForms = actionForms.filter((_, idx) => idx !== index);
    setActionForms(filteredForms);

    // Update the main action state to reflect this change
    const updatedActions = filteredForms.map(form => ({
        label: form.label,
        href: form.amountType === "fixedAmount" ? `/api/${actionType}/recipient?amount=${form.amount}` : `/api/${actionType}/recipient`,
        parameters: form.amountType === "inputAmount" ? [{ name: form.inputName, label: form.label }] : []
    }));
    setAction(prev => ({ ...prev, links: { actions: updatedActions } }));
  };

const fetchChains = async () => {
  const chainsObject = listChains();
  if (chainsObject && Object.keys(chainsObject).length > 0) {
    const chainsArray = Object.keys(chainsObject).map(key => ({
        ...chainsObject[key],
        id: key
    }));
    setChains(chainsArray);
    console.log("Chains loaded:", chainsArray);
  } else {
    console.error('Chains list is not available:', chainsObject);
    setChains([]);
  }
};

useEffect(() => {
  fetchChains();
}, []); 

const fetchBalance = async (signal) => {
  // console.log('getAssetBalanceForChain fetchBalance address:', address, 'chain:', chain);
  // if (!address || !chain) return;
  const chainKey = formData?.selectedChain;
  setIsFetchingBalance(true);
  const chainsArray = Object.values(listChains()); // Convert to array if originally an object
  const chain = chainsArray.find(c => c.name.toLowerCase() === chainKey.toLowerCase());
  console.log('fetchBalance chain:', chain);
  setChainSymbol(chain?.symbol || '');
  console.log('fetchBalance chain symbol:', chain?.symbol);
    if (!chain) {
    console.error("No chain information available for:", chainKey);
    return;
  }
  try {
    const fetchedBalance = await getAssetBalanceForChain(formData?.selectedChain, formData?.selectedCreatorAccount, 0, signal);
    if (!signal.aborted) {
      setBalance({
        free: fetchedBalance.free.toString(),
        reserved: fetchedBalance.reserved.toString(),
        total: fetchedBalance.total?.toString() ?? '0', // Provide a default value if undefined
      });    
    }
  } catch (error) {
    if (!signal.aborted) {
      console.error("Failed to fetch balance", error);
    }
  } finally {
    if (!signal.aborted) {
      setIsFetchingBalance(false);
    }
  }
};

  const handleAddressChange = (newAddress) => {
    console.log('handleAddressChange', newAddress, activeBlinksId, formData);
    // Update formData with the new address

    const newAddressName = walletContext.accounts.find(acc => acc.address === newAddress)?.name || '';
    setSelectedCreatorAccount(newAddress);
    setSelectedCreatorAccountName(newAddressName);

    saveBlinkMetadata(activeBlinksId, {...formData, selectedCreatorAccount: newAddress, selectedCreatorAccountName: newAddressName});
  };

  const renderAddressSelection = () => {
      if (!walletContext || walletContext.accounts.length === 0) {
        return <div className='connect-message'>Please connect Wallet.
          {/* <button onClick={}>Connect Wallet</button> */}
          
          </div>;
      }
      const addressOptions = walletContext.accounts.map(acc => ({
        label: `${acc.name} (${acc.address})`, 
        value: acc.address
      }));

      const renderCustomContent = () => {
      
      return (
          
        // USE THIS
        <div className="flex items-center primary-font">
        {isFetchingBalance ? (
          <span>Loading balance...</span>
        ) : (
          balance && <BalanceTippy balance={balance} symbol={chainSymbol} /> 
        )}
              <span onClick={fetchBalance} className="text-xs m-1 p-0 rounded refresh-button">
              <img className="h-3 w-3" src="/refresh.svg" />
            </span>
                  
      </div>
        );
      };

    return (
      <CollapsibleField
        key="addressDropdown"
        title="Blink Creator Account"
        hasToggle={false}
        fieldTypes="select"
        customContent={renderCustomContent()}
        nodeId={'blinkBuilderArea'}
        info="Select an address that will generate the blink."
        selectOptions={addressOptions}
        value={formData?.selectedCreatorAccount || ''}
        onChange={(value) => handleAddressChange(value)} 
        selectFieldStyle=''
        collapsibleContainerStyle={`collapsibleField`}
        fieldKey={undefined} edgeId={undefined} toggleTitle={undefined} children={undefined} onPillsChange={undefined} placeholder={undefined} onClick={undefined} disabled={undefined} isTextAreaValue={undefined} buttonName={undefined} typesLookup={undefined} fieldTypeObject={undefined} fields={undefined} hoverInfo={undefined}    />
    );
  };

  const handleChainSelectChange = async (chainName) => {
    if (chainName !== selectedChain) {
        setSelectedChain(chainName);
    }
    saveBlinkMetadata(activeBlinksId, {...formData, selectedChain: chainName});
  };

  const renderChainActionSelection = () => {

    return (
      <CollapsibleField
          key="chainActionDropdown"
          title={<span>
          Chain Action {actionType} <span className="text-gray-400 text-xs font-light">{actionCallsData[actionType]?.section} {'>'} {actionCallsData[actionType]?.method}</span>
        </span>} hasToggle={false}
          fieldTypes="select"
          nodeId={'blinkBuilderArea'}
          info="Select a call to action"
          selectOptions={chainActions}
          value={actionType}
          onChange={handleActionTypeChange}
          customContent={<RenderActionFields actionConfig={actionConfig} />}
          selectFieldStyle=''
          collapsibleContainerStyle={`collapsibleField`}
          fieldKey={undefined} edgeId={undefined} toggleTitle={undefined} onPillsChange={undefined} placeholder={undefined} onClick={undefined} disabled={undefined} isTextAreaValue={undefined} buttonName={undefined} typesLookup={undefined} fieldTypeObject={undefined} fields={undefined} hoverInfo={undefined} children={undefined}  >
  
  
      </CollapsibleField>
    );
  
  }

  const renderChainSelection = () => {

    const renderCustomContent = () => {
      if (chains?.length === 0) {
          return <div>Loading chains...</div>;
      }
    }

    const collapsibleFieldStyle = {
      borderRadius: '20px'
    }

      return (
          <CollapsibleField
          key="chainDropdown"
          title="Select Chain"
          hasToggle={false}
          customContent={renderCustomContent()}
          fieldTypes="select"
          nodeId={'non-node'}
          info="Choose the blockchain that you want your mini dapp to be executed on."
          selectOptions={chains.map(chain => ({
            label: chain.display || chain.name,
            value: chain.name
          }))}
          value={formData?.selectedChain}
          selectFieldStyle=''
          collapsibleContainerStyle={collapsibleFieldStyle}
          onChange={(newValue) => handleChainSelectChange(newValue)} fieldKey={undefined} edgeId={undefined} toggleTitle={undefined} children={undefined} onPillsChange={undefined} placeholder={undefined} onClick={undefined} disabled={undefined} isTextAreaValue={undefined} buttonName={undefined} typesLookup={undefined} fieldTypeObject={undefined} fields={undefined} hoverInfo={undefined}            />
      );
  };




  const handleActionTypeChange = (value: string) => {
    console.log('handleActionTypeChange', value);
    setActionType(value);
    const config = actionCallsData[value] || { args: [] };
    setActionConfig(config.args);
    const label = chainActions.find(action => action.value === value)?.label || '';

    const updatedActionLink = {
      label: `${label}`,
      href: `/api/${config.section}/${config.method}`,
      parameters: config.args.map(arg => ({
        name: arg.key,
        label: arg.label,
        type: arg.type,
        userEditable: arg.userEditable,
        // value: arg.value || ''
      }))
    };

    const updatedFormData = {
      ...formData,
      actionType: value,
      links: { actions: [updatedActionLink] } 
    };


    setAction(updatedFormData);
    saveBlinkMetadata(activeBlinksId, updatedFormData);
  };


  const RenderActionFields = ({ actionConfig }) => {
    return (
      <>
   {action?.links?.actions?.map((linkedAction, index) => (
  <div key={index} className="action-field-wrapper">
    {linkedAction.parameters.filter(param => !param.userEditable).map((param, paramIndex) => (
      <div key={paramIndex} className='action-input-wrapper'>
        <label className='action-field-label'>{param.label}</label>
        <input 
          className='action-field-input'
          placeholder={param.label}
          defaultValue={param.value || ''}  // Set default values specified by the creator
          type={param.type === 'u128' ? 'number' : 'text'}
          onChange={(e) => handleActionFieldChange(index, param.name, e.target.value)}
          min={0} 
          step={param.type === 'u128' ? '0.1' : undefined}  // Appropriate step for numeric inputs
        
        />
      </div>
    ))}
  </div>
))
  }
      </>
    );
  };
  

  const handleActionFieldChange = (index, paramName, value) => {
    // Update the links state by first mapping through the array
    setAction(prevState => {
        const updatedLinks = prevState.links.actions.map((action, idx) => {
            if (idx === index) {
                // Update the parameters of the specific action
                const updatedParameters = action.parameters.map(param => {
                    if (param.name === paramName) {
                        return { ...param, value };
                    }
                    return param;
                });
                return { ...action, parameters: updatedParameters };
            }
            return action;
        });

        // Return new state with updated links
        const newState = {
            ...prevState,
            links: {
                ...prevState.links,
                actions: updatedLinks
            }
        };

        // Optionally save the new state to some form of persistent storage
        saveBlinkMetadata(activeBlinksId, newState);

        return newState;
    });
};

  

  const generateActionLink = (actionType, actionForms) => {
    const config = actionCallsData[actionType];
    if (!config) return null;
  
    let href = `/api/${config.section}/${config.method}?`;
    let parameters: { name: string; label: string }[] = [];
  
    config.args.forEach(arg => {
      const formValue = actionForms.find(form => form.key === arg.key);
      if (arg.userEditable) {
        parameters.push({
          name: arg.key as string,
          label: (formValue?.label || arg.label) as string // Use form-specified label if available
        });
      } else {
        // Append to URL as query if not user-editable
        href += `${arg.key}=${formValue?.value || ''}&`;
      }
    });
  
    return {
      label: actionForms.map(form => form.label).join(', '),
      href: href.slice(0, -1), // Remove the last '&'
      parameters
    };
  };
  
  const addNewActionForm = () => {
    if (actionType !== "" && actionType !== "no action") {
      const newAction = generateActionLink(actionType, actionForms);
      if (newAction) {
        setAction(prev => ({
          ...prev,
          links: {
            ...prev.links,
            actions: [...prev.links.actions, newAction]
          }
        }));
      }
      saveBlinkMetadata (activeBlinksId, {...formData, links: { actions: [...formData.links.actions, newAction] }});
    }
  };
  

  const handleSaveMetadataOnChain = async () => {

    console.log('handleSaveMetadataOnChain', formData);

    
    enterLoading(1)
    setGeneratedUrl('');
    showModal();
    setUrlStatus(`connecting to ${selectedChain}`);
    setModalText(`Connected to Light Client if available, else RPC.`);
    
    setUrlLoading(true);
    const accountAddress = formData.selectedCreatorAccount; 
    const serializedData = JSON.stringify({ Blinks: formData });
  
    try {
      const result = await signAndSendRemark(formData.selectedChain, walletContext, accountAddress, serializedData, {
        signedExtrinsic: (status: string) => {
          if (status === 'Signed') {
            // setTimeout(() => {
              console.log('Transaction signed. Waiting for the transaction to be included in a block...');
              setModalText('Transaction signed! Waiting for the transaction to be included in a block...');
              setUrlStatus('transaction signed');
              setUrlLoading(false);
            // }, 0);
          } else if (status === 'Cancelled') {
            console.log('Transaction signing was cancelled.');
            setModalText('Transaction signing was cancelled.');
            setUrlStatus('transaction signing cancelled');
            enterLoading(1);
            setUrlLoading(false);
          }
        },
        onInBlock: (blockHash: any) => {
          setModalText(`Transaction included in block: ${blockHash}. URL is being generated...`);
          setUrlStatus('Tx in block...');
        },
        onFinalized: (blockHash: any) => {
          setModalText(`Transaction finalized at block:` + `${<span className='font-mono'> {blockHash}</span>}`);
          setUrlStatus('Transaction Finalized');
        },
        onError: (error: { message: React.SetStateAction<string>; }) => {
          setModalText(`Error during transaction: ${error.message}`);
          setUrlStatus(error.message);
        },
        onUrlGenerated: (generatedUrl: React.SetStateAction<string>) => {
          console.log("Generated URL:", generatedUrl);
          addOnChainURL(activeBlinksId, generatedUrl);
          console.log('setting generated url')

          setTimeout(() => {
          setGeneratedUrl(generatedUrl);
          }, 0);
        }
      });
    
      console.log('Metadata stored on chain:', result);
      enterLoading(1); 
    } catch (error) {
      console.error('Failed to store metadata on chain:', error);
      enterLoading(1); 
      setUrlLoading(false);
    }
  };
  
  const renderTitleField = () => {
    return (
     <CollapsibleField 
     key="blinkTitleField"
     title={<span>
     Title
    </span>} 
      hasToggle={false}
     fieldTypes="input"
     nodeId={'blinkBuilderArea'}
     info="Enter the title of Blink"
     
     value={formData?.title} onChange={(value) => handleChange('title')(value)} placeholder="Enter Title"
     selectFieldStyle=''
     collapsibleContainerStyle={`collapsibleField`}
     fieldKey={undefined}     
     customContent={undefined} selectOptions={undefined} edgeId={undefined} toggleTitle={undefined} onPillsChange={undefined}  onClick={undefined} disabled={undefined} isTextAreaValue={undefined} buttonName={undefined} typesLookup={undefined} fieldTypeObject={undefined} fields={undefined} hoverInfo={undefined} children={undefined} ></CollapsibleField>
    );
  }

  const renderIconField = () => {
    return (
     <CollapsibleField 
     key="blinkIconField"
     title={<span>
     Add image
    </span>} 
      hasToggle={false}
     fieldTypes="input"
     nodeId={'blinkBuilderArea'}
     info="Paste public link to image or GIF and it will appear in the Blink"
     
     value={formData?.icon} onChange={handleChange('icon')} placeholder="https://bagpipes.io/polkadot-blinks.png"      selectFieldStyle=''
     collapsibleContainerStyle={`collapsibleField`}
     fieldKey={undefined}     
     customContent={undefined} selectOptions={undefined} edgeId={undefined} toggleTitle={undefined} onPillsChange={undefined}  onClick={undefined} disabled={undefined} isTextAreaValue={undefined} buttonName={undefined} typesLookup={undefined} fieldTypeObject={undefined} fields={undefined} hoverInfo={undefined} children={undefined} ></CollapsibleField>
    );
  }


  const renderDescriptionField = () => {
    return (
     <CollapsibleField 
     key="blinkDescriptionField"
     title={<span>
    Description
    </span>} 
      hasToggle={false}
     fieldTypes="input"
     nodeId={'blinkBuilderArea'}
     info="Enter the description of your Blink"
     
     value={formData?.description} onChange={handleChange('description')} placeholder="Brief description here."     
     selectFieldStyle=''
     collapsibleContainerStyle={`collapsibleField`}
     fieldKey={undefined}     
     customContent={undefined} selectOptions={undefined} edgeId={undefined} toggleTitle={undefined} onPillsChange={undefined}  onClick={undefined} disabled={undefined} isTextAreaValue={undefined} buttonName={undefined} typesLookup={undefined} fieldTypeObject={undefined} fields={undefined} hoverInfo={undefined} children={undefined} ></CollapsibleField>
    );
  }


  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setModalText('closing modal');
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 500);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };

  return(
  <>
   
    <div className='blinkBuilderHeader'>
      
   
    <div className='blinkTitleInfo'>
        <h1>DApp Designer</h1>
        <span>Blink {activeBlinksId}</span>
      </div>
      <div className='header-right-menu'>
      <Tippy
                    content={
                      <div className="generate-button-description">
                        Generate the blink on-chain. Make sure that you have an on-chain ID for Polkadot, and also make sure you have some balance on AssetHub where the fees will be paid.
                      </div>
                    }
                    interactive={true}
                    placement="bottom"
                    theme="light"
                  >
                <Button
                  type="primary"
                  // icon={<BlinkIcon className='h-4 w-4 mr-2' fillColor='white' />}
                  loading={loadings[1]}
                  onClick={handleSaveMetadataOnChain}
                  className='generate-button'
                >
                  <span className='font-semibold'>Publish</span>
                
                </Button>
              </Tippy>
         
      <WalletWidget />
      </div>

    </div>
  
    <div className='blinkMainContainer'>
      <div className='blinkBuilder'>
        <div className='blinkForm'>
          {renderTitleField()}
          {renderIconField()}
          {renderDescriptionField()}
          {renderChainActionSelection()}
          {renderChainSelection()} 
          {renderAddressSelection()} 
        


          
          <Modal
            title={`Blink URL | ${urlStatus}`}
            open={open}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}

            footer={
              generatedUrl ? (
                <Button type="primary" onClick={handleOk}>
                  Close
                </Button>
              ) : null
            }
            centered
          >
            <div className='modal-content'>
              <p className='modal-text'>{modalText}</p>

              <div className=''>
                {urlLoading && !generatedUrl && (
                  <div className='url-loading'>
                    <Spin size="small" className='' />
                    <div className='ml-2 font-semibold'>Generating URL... {urlStatus} </div>
                  </div>
                )}
                {generatedUrl && !urlLoading && (
                
                  <div className='blink-url-container generated-url'>

                    <Button
                      icon={<CopyIcon className="h-4 w-4 font-semibold mr-1" fillColor="#FFF" />}
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(generatedUrl);
                          toast.success(`Copied ${generatedUrl} to clipboard`);
                        } catch (err) {
                          toast.error("Failed to copy");
                          console.error("Failed to copy text: ", err);
                        }
                      }}
                      style={{ marginLeft: 8 }}
                      className="copy-button"
                    >
                      {/* <a className='blink-url' href={generatedUrl} target="_blank" rel="noopener noreferrer">
                          {generatedUrl}
                        </a> */}
                    </Button>

                 <a className='' href={generatedUrl} target="_blank" rel="noopener noreferrer">
                      {generatedUrl}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </Modal>

        
        </div>

      </div>

      <BlinkViewer action={action} />

      {/* <div className='rightBar'>
        <h2>Style Options</h2>
        <div className='styleControls'>
          <label>
            Theme Color:
            <input type='color' onChange={handleThemeColorChange} />
          </label>
        </div>
      </div> */}
    </div>
  </>
  );

};

export default BlinkBuilder;


