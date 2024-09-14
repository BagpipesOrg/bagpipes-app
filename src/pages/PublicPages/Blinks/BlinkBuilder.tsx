import React, { useState, useEffect, useContext } from 'react';
import { Select } from 'antd';
import './Blinks.scss';
import BlinkViewer from './BlinkViewer';
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


export type ActionType = "action" | "completed";

export interface Parameter {
  name: string;
  label: string;
  type?: string; // Ensure type is optional if it can be missing
  userEditable?: boolean;
  value?: string;
}
interface Arg {
  key: string;
  type: 'u128' | 'AccountId' | 'enum' | string; 
  label: string;
  userEditable: boolean;
  options?: string[]; 
  createPresets?: boolean; 
  info?: string;
}

export interface LinkedAction {
  label: string;
  href: string;
  type?: string;
  parameters: Parameter[];
  args?: Arg[]; 
}


interface ActionError {
  message: string;
}

export interface Action<T extends ActionType> {
  id: string;
  recipient: string; // Recipient address TODO - we can be more specific here
  type: T;
  icon: string;
  title: string;
  description: string;
  label: string;
  disabled?: boolean;
  actionType: string;
  links: {
    actions: LinkedAction[];
  };
  error?: ActionError;
}

export interface NewActionForm {
  label: string;
  amount: string;
  inputName: string;
  amountType: string; // "fixedAmount" or "inputAmount"
}

const BlinkBuilder: React.FC = () => {
  const walletContext = useContext(WalletContext);

  const { blinks, activeBlinksId, saveBlinkFormData, createNewBlink, getBlinkData, setActiveBlinksId  } = useBlinkStore(state => ({ 
    blinks: state.blinks,
    activeBlinksId: state.activeBlinksId,
    saveBlinkFormData: state.saveBlinkFormData,
    createNewBlink: state.createNewBlink,
    getBlinkData: state.getBlinkData,
    setActiveBlinksId: state.setActiveBlinksId
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

let formData = getBlinkData(activeBlinksId);


  useEffect(() => {
    console.log('BlinkBuilder activeBlinksId', activeBlinksId);
    if (activeBlinksId) {

      formData = getBlinkData(activeBlinksId);
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
      saveBlinkFormData(newId, newBlinkData);
      setAction(newBlinkData);
    }
  }, [activeBlinksId, createNewBlink, getBlinkData, setActiveBlinksId]);


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
  const [balance, setBalance] = useState(null);
  const [isFetchingBalance, setIsFetchingBalance] = useState(false);
  const [chainSymbol, setChainSymbol] = useState('');
  const [chains, setChains] = useState([]);
  const [selectedChain, setSelectedChain] = useState(formData?.selectedChain || '');
  const [selectedCreatorAccount, setSelectedCreatorAccount] = useState('');
  const[selectedCreatorAccountName, setSelectedCreatorAccountName] = useState('');
  const [iconUrl, setIconUrl] = useState(formData?.icon || ''); 
  const [formFields, setFormFields] = useState([]);


  const handleChange = (field: keyof Action<"action">) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const updatedValue = { ...action, [field]: e.target.value };
    setAction(updatedValue);
    const updatedFormData = { ...formData, [field]: e.target.value };
    saveBlinkFormData(activeBlinksId, updatedFormData);
    console.log('handleChange', field, e.target.value, updatedFormData);
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
    saveBlinkFormData(activeBlinksId, 
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
  setChainSymbol(chain.symbol || '');
  console.log('fetchBalance chain symbol:', chain.symbol);
    if (!chain) {
    console.error("No chain information available for:", chainKey);
    return;
  }
  try {
    const fetchedBalance = await getAssetBalanceForChain(formData?.selectedChain, 0, formData?.selectedCreatorAccount);
    setBalance(fetchedBalance);
    if (!signal.aborted) {
      setBalance(fetchedBalance);
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

    saveBlinkFormData(activeBlinksId, {...formData, selectedCreatorAccount: newAddress, selectedCreatorAccountName: newAddressName});
  };

  const renderAddressSelection = () => {
      if (!walletContext || walletContext.accounts.length === 0) {
        return <div>No wallet accounts available. Please connect Wallet to select account.
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
    saveBlinkFormData(activeBlinksId, {...formData, selectedChain: chainName});
  };

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
          info="Choose a blockchain chain to query"
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


  const handleActionTypeChange = (value: string) => {
    console.log('handleActionTypeChange', value);
    setActionType(value);
    const config = actionCallsData[value] || { args: [] };
    setActionConfig(config.args);

    const updatedActionLink = {
      label: `${value}`,
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
    saveBlinkFormData(activeBlinksId, updatedFormData);
  };


  const RenderActionFields = ({ actionConfig }) => {
    return (
      <>
   {action.links.actions.map((linkedAction, index) => (
  <div key={index} className="action-wrapper">
    {linkedAction.parameters.filter(param => !param.userEditable).map((param, paramIndex) => (
      <div key={paramIndex} className='action-input-wrapper'>
        <label>{param.label}</label>
        <input 
          className='action-input'
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
        saveBlinkFormData(activeBlinksId, newState);

        return newState;
    });
};

  

  const generateActionLink = (actionType, actionForms) => {
    const config = actionCallsData[actionType];
    if (!config) return null;
  
    let href = `/api/${config.section}/${config.method}?`;
    let parameters = [];
  
    config.args.forEach(arg => {
      const formValue = actionForms.find(form => form.key === arg.key);
      if (arg.userEditable) {
        parameters.push({
          name: arg.key,
          label: formValue?.label || arg.label // Use form-specified label if available
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
      setAction(prev => ({
        ...prev,
        links: {
          ...prev.links,
          actions: [...prev.links.actions, newAction]
        }
      }));
      saveBlinkFormData (activeBlinksId, {...formData, links: { actions: [...formData.links.actions, newAction] }});
    }
  };
  



  return (
    <>
      <WalletWidget />
      <div className='blinkHeader'>

      <div className='blinkTitleInfo'> 
        <h1>Blinks Builder</h1>
        <span>Blink {activeBlinksId}</span></div>
      </div>
      <div className='blinkMainContainer'>
     
      
      
      <div className='blinkBuilder'>
      
        {/* <button onClick={}><span>My Blinks</span></button> */}
        
        
        <form className='blinkForm' onSubmit={(e) => e.preventDefault()}>
          <label>
            Title:
            <input type="text" value={formData?.title} onChange={handleChange('title')} placeholder="Enter Title" />
          </label>
          <label>
            Icon (URL):
            <input type="text" value={formData?.icon} onChange={handleChange('icon')} placeholder="https://bagpipes.io/polkadot-blinks.png" />
          </label>
          <label>
            Description:
            <textarea value={formData?.description} onChange={handleChange('description')} placeholder="Brief description here." />
          </label>
          {renderChainSelection()} 
          {renderAddressSelection()} 

          {renderChainActionSelection()}


          <div className='actionArea'>


          {actionType !== "no action" && actionForms.map((form, index) => (
            <div className='actionRow'>
            <div className='actionBox' key={index}><span className='font-semibold'>Action {index + 1}</span>
              <Select
                className='actionSelect'
                value={form.amountType}
                onChange={value => handleTransferButtonChange(index, value, 'amountType')}
                placeholder="Select Amount Type"
                style={{ width: 200 }}
                allowClear
              >
                <Select.Option value="fixedAmount">Fixed Amount</Select.Option>
                <Select.Option value="inputAmount">Input Amount</Select.Option>
              </Select>



              {form.amountType === "fixedAmount" && (
                <div className='subField ml-2'>
                  <input type="text" value={form.label} onChange={(e) => handleTransferButtonChange(index, e, 'label')} placeholder="Label (e.g., Send 1 DOT)" />
                  <input type="number" value={form.amount} onChange={(e) => handleTransferButtonChange(index, e, 'amount')} placeholder="Amount" />
                </div>
                )}
                {form.amountType === "inputAmount" && (
                  <div className='subField ml-2'>
                    <input type="text" value={form.label} onChange={(e) => handleTransferButtonChange(index, e, 'label')} placeholder="Label (e.g., Stake)" />
                    <input type="text" value={form.inputName} onChange={(e) => handleTransferButtonChange(index, e, 'inputName')} placeholder="Name of the input (e.g., amount)" />
                  </div>
                )}
                <button className='action-button' onClick={() => removeTransferButton(index)}>
            <div className='remove-button'>-</div>
        </button>
            </div>
            
        </div>
          ))}

          {actionType !== "no action" && 
          <button className='action-button' onClick={addNewTransferButton}>
          <div className='add-button'>+</div>
          {/* <label>Add action</label> */}
      </button>
      
          
          }
          </div>
        </form>

      </div>

      <BlinkViewer action={action} />


    </div>

    </>
  );
};

export default BlinkBuilder;



//   const handleActionTypeChange = (value: string) => {
//     // Set the new action type
//     setActionType(value);
//     saveBlinkFormData(activeBlinksId, {...formData, actionType: value})

//     // If changing action type to something valid, reset forms and add one default form
//     if (value !== "no action") {
//         setActionForms([{ label: "", amount: "", inputName: "", amountType: "" }]);
//         // Update the main action object
//         setAction(prev => ({
//             ...prev,
//             actionType: value,
//             links: { actions: [] } // Clear existing actions
//         }));
//     } else {
//         // If "no action" is selected, clear all forms
//         setActionForms([]);
//         setAction(prev => ({
//             ...prev,
//             actionType: value,
//             links: { actions: [] }
//         }));
//         saveBlinkFormData(activeBlinksId, prev => ({
//           ...prev,
//           actionType: value,
//           links: { actions: [] }
//       }));
//     }
// };



  // const handleTransferButtonChange = (index: number, valueOrEvent: any, field: keyof NewActionForm) => {
  //   let value: string;
  //   if (typeof valueOrEvent === 'string') {
  //       // This is directly from Select component
  //       value = valueOrEvent;
  //   } else if (valueOrEvent && valueOrEvent.target) {
  //       // This is from standard HTML input elements
  //       value = valueOrEvent.target.value;
  //   } else {
  //       // If neither, log an error or handle the case appropriately
  //       console.error('Invalid input from form elements');
  //       return;
  //   }

  //   const newForms = [...actionForms];
  //   newForms[index][field] = value;
  //   setActionForms(newForms);

  //   // Update main action state to reflect changes
  //   const updatedActions = newForms.map(form => ({
  //       label: form.label,
  //       href: form.amountType === "fixedAmount" ? `/api/${actionType}/recipient?amount=${form.amount}` : `/api/${actionType}/recipient`,
  //       type: form.amountType,
  //       parameters: form.amountType === "inputAmount" ? [{ name: form.inputName, label: form.label, type: 'inputAmount' }] : []
  //   }));
  //   setAction(prev => ({ ...prev, links: { actions: updatedActions } }));
  // };

