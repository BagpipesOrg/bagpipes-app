import React, { useState, useEffect, useMemo, useContext } from 'react';
import useAppStore from '../../../../../../store/useAppStore';
import { WalletContext } from '../../../../../Wallet/contexts';
import { getAssetBalanceForChain } from '../../../../../../Chains/Helpers/AssetHelper';
import BalanceTippy from './BalanceTippy';


import { CollapsibleField }  from '../../../fields';
import { ChainQueryIcon } from '../../../../../Icons/icons';
import { useTippy } from '../../../../../../contexts/tooltips/TippyContext';
import { listChains} from '../../../../../../Chains/ChainsInfo';
import { queryMetadata } from './QueryMetadata';
import { parseMetadataPallets, resolveTypeName } from '../parseMetadata'
import { parseLookupTypes } from '../ParseMetadataTypes';
import { resolveKeyType } from '../resolveKeyType';
import ChainRpcService from '../../../../../../services/ChainRpcService';
import FormHeader from '../../../FormHeader';
import FormFooter from '../../../FormFooter';

import '../types';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; 
import 'tippy.js/themes/light.css';

import '../ChainForm.scss';
import '../../Popup.scss';
import '../../../../../../index.css';


const ChainTxForm = ({ onSubmit, onSave, onClose, onEdit, nodeId }) => {
  const { scenarios, activeScenarioId, saveNodeFormData } = useAppStore(state => ({ 
    scenarios: state.scenarios,
    activeScenarioId: state.activeScenarioId,
    saveNodeFormData: state.saveNodeFormData,
   }));
   const walletContext = useContext(WalletContext);
   const [balance, setBalance] = useState(null);
   const [isFetchingBalance, setIsFetchingBalance] = useState(false);


  const formData = scenarios[activeScenarioId]?.diagramData?.nodes.find(node => node.id === nodeId)?.formData || {};
  console.log('ChainTxForm formData:', formData);

  const [metadata, setMetadata] = useState(null); 
  console.log('ChainTxForm metadata:', metadata);

  const [pallets, setPallets] = useState([]);
  const [chains, setChains] = useState([]);
  const [selectedChain, setSelectedChain] = useState(formData.selectedChain || '');
  const [selectedPallet, setSelectedPallet] = useState(formData.selectedPallet || null);
  const [selectedMethod, setSelectedMethod] = useState(formData.selectedMethod || null);
  const [blockHash, setBlockHash] = useState(formData.blockHash || '');
  const [result, setResult] = useState('');

  const { hideTippy } = useTippy();
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  const lookupTypes = useMemo(() => {
    const typesArray = metadata?.metadata?.V14?.lookup?.types;
    // console.log('Lookup Types in lookupTypes:', typesArray);
    if (typesArray && Array.isArray(typesArray)) {
        const parsedTypes = parseLookupTypes(typesArray);
        // console.log("Lookup Parsed Types:", parsedTypes);
        return parsedTypes;
    }
    console.error("Metadata is not valid or types are not available");
    return {};
  }, [metadata]);


  useEffect(() => {
    if (!formData.selectedPallet && pallets.length > 0) {
      setSelectedPallet(pallets[0]); // Sets default on initial load only if no pallet is selected
    }
  }, [pallets, formData.selectedPallet]); 

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

  useEffect(() => {
    if (metadata) {
      setPallets(parseMetadataPallets(metadata));
    } else if (selectedChain) {
      queryMetadata(selectedChain)
        .then(setMetadata)
        .catch(error => console.error('Error fetching metadata:', error));
    }
  }, [metadata, selectedChain]);

  useEffect(() => {
    if (metadata) {
      console.log('Metadata:', metadata)
      const parsedData = parseMetadataPallets(metadata);
      console.log('Lookup Parsed Data:', parsedData);  
      setPallets(parsedData);
    }
  }, [metadata]);




  const handleChainSelectChange = async (chainName) => {
    if (chainName !== selectedChain) {
        setSelectedChain(chainName);
        setSelectedPallet(null);
        setSelectedMethod(null);
        setBlockHash('');

        try {
            const metadata = await queryMetadata(chainName);
            setMetadata(metadata);
            const parsedPallets = parseMetadataPallets(metadata);
            setPallets(parsedPallets);
        } catch (error) {
            console.error('Error fetching metadata:', error);
        }
    }
    saveNodeFormData(activeScenarioId, nodeId, {...formData, selectedChain: chainName, selectedMethod: null, selectedPallet: null, blockHash: ''});
  };

    
  const handlePalletChange = (palletName) => {
    const newPallet = pallets.find(p => p.name === palletName);
    if (newPallet && newPallet !== selectedPallet) {
        setSelectedPallet(newPallet);
        setSelectedMethod(null); 
        console.log('handlePalletChange New Pallet  selectedMethod changing to null:', selectedMethod, newPallet);

    }
    saveNodeFormData(activeScenarioId, nodeId, {...formData, selectedPallet: palletName, selectedMethod: null});
  };

  const handleMethodChange = (methodName) => {
    const newMethod = selectedPallet?.calls.find(calls => calls.name === methodName);
    console.log('handleMethodChange New Method:', newMethod);
    if (newMethod && newMethod !== selectedMethod) {
        setSelectedMethod(newMethod);
    }
    setSelectedMethod(newMethod);

    saveNodeFormData(activeScenarioId, nodeId, {...formData, selectedMethod: newMethod});
  };


  const handleBlockHashChange = (newBlockHash) => {
    // setBlockHash(newBlockHash);
    saveNodeFormData(activeScenarioId, nodeId, {...formData, blockHash: newBlockHash});
  };

  const handleMethodFieldChange = (fieldName, newFieldValue) => {
    // Update the specific field inside formData.params
    const updatedParams = {
        ...formData.params, 
        [fieldName]: newFieldValue
    };
    const updatedValues = {
        ...formData,
        params: updatedParams
    };
    saveNodeFormData(activeScenarioId, nodeId, updatedValues);
};

  // handlers for the form fields

  const renderAddressSelection = () => {
    if (!walletContext || walletContext.accounts.length === 0) {
      return <div>No wallet accounts available.</div>;
    }

    const addressOptions = walletContext.accounts.map(acc => ({
      label: `${acc.name} (${acc.address})`, // Adjust formatting as needed
      value: acc.address
    }));

    return (
      <CollapsibleField
        key="addressDropdown"
        title="Select Address"
        hasToggle={true}
        fieldTypes="select"
        nodeId="address-dropdown"
        info="Select an address that will sign the transaction."
        selectOptions={addressOptions}
        value={formData.selectedAddress || ''}
        onChange={(value) => handleAddressChange(value)}
      />
    );
  };


  const renderChainSelection = () => {
      if (chains?.length === 0) {
          return <div>Loading chains...</div>;
      }

      return (
          <CollapsibleField
              key="chainDropdown"
              title="Select Chain"
              hasToggle={true}
              fieldTypes="select"
              nodeId={nodeId}
              info="Choose a blockchain chain to query"
              selectOptions={chains.map(chain => ({
                label: chain.display || chain.name,
                value: chain.name
              }))}
              value={formData.selectedChain}
              onChange={(newValue) => handleChainSelectChange(newValue)}  
              />
      );
  };

    
  const renderPalletSelection = () => {
    // console.log('renderPalletSelection pallets:', pallets);
    if (!selectedChain || pallets.length === 0) return null;
  
    return (
      <CollapsibleField
        key="palletDropdown"
        title="Select Pallet"
        hasToggle={true}
        fieldTypes="select"
        nodeId={nodeId}
        info="Select a pallet to explore"
        selectOptions={pallets.map(pallet => ({ label: pallet.name, value: pallet.name }))}
        value={formData.selectedPallet || ''}
        onChange={(value) => handlePalletChange(value)}
      />
    );
  };
    
  const renderMethodSelection = () => {
    console.log('renderMethodSelection selectedPallet:', selectedPallet);
    if (!selectedPallet) return null;
  
    // Check if `calls` array exists and has elements
    if (!selectedPallet.calls || selectedPallet.calls.length === 0) {
      console.log("No calls available for:", selectedPallet.name);
      return <div>No transaction methods available for this pallet.</div>;
    }
  
    // Directly use the calls array since each entry represents a method
    const methods = selectedPallet.calls;
  
    return (
      <CollapsibleField
        key="methodDropdown"
        title="Select Method"
        hasToggle={true}
        fieldTypes="select"
        nodeId={nodeId}
        info="Select a transaction method to execute"
        selectOptions={methods.map(method => ({ label: method.name, value: method.name }))}
        value={formData?.selectedMethod?.name || ''}
        onChange={(value) => handleMethodChange(value)}
      />
    );
  };
  

  const renderMethodFields = () => {
    if (!formData.selectedMethod) {
        return <div>No method selected.</div>;
    }
    if (Object.keys(lookupTypes).length === 0) {
        return <div>Loading data or incomplete metadata...</div>;
    }

    return formData.selectedMethod?.fields?.map((field, index) => (
        <CollapsibleField
            title={`${field.name} <${field.typeName}>`}
            info={field.docs || 'No documentation available.'}
            fieldTypes="input"
            hasToggle={true}
            nodeId={nodeId}
            value={formData.params?.[field.name] || ''}
            onChange={(value) => handleMethodFieldChange(field.name, value)}
            // onPillsChange={(updatedPills) => handlePillsChange(updatedPills, field.name)}
            placeholder={`Enter ${field.name}`}
        />

    ));
};

  
  const renderBlockHashInput = () => {
    if (!selectedMethod) return null; 
    
    return (
        <CollapsibleField
            title="Blockhash/Blocknumber to Query (optional)"
            info="Enter a block hash or block number to query specific data, leave blank for latest block."
            fieldTypes="input"
            hasToggle={true}
            nodeId={nodeId}
            value={formData?.blockHash}
            onChange={handleBlockHashChange}
            // onPillsChange={(updatedPills) => handlePillsChange(updatedPills, blockHash)}

        />
    );
  };

  

//   const CallsFieldInput = ({ field, lookupTypes, formData, handleFieldChange }) => {
//     if (!field) {
//         console.error('Invalid or incomplete call field:', field);
//         return <div>Field data is incomplete or missing.</div>;
//     }

//     return (
//         <div>
//             <CollapsibleField
//                 title={`${field.name} <${field.typeName}>`}
//                 info={field.docs || 'No documentation available.'}
//                 fieldTypes="input"
//                 hasToggle={true}
//                 nodeId={`field-input-${field.name}`}
//                 value={formData[field.name] || ''}
//                 onChange={handleMethodFieldChange}
//                 // onPillsChange={(updatedPills) => handlePillsChange(updatedPills, field.name)}
//                 placeholder={`Enter ${field.name}`}
//             />
//         </div>
//     );
// };


  const handleSignMethodClick = async () => {
    if (!selectedMethod) return;

    try {
        const output = await ChainRpcService.executeChainSignMethod({
            chainKey: formData.selectedChain,
            palletName: formData.selectedPallet,
            methodName: formData.selectedMethod.name,
            params: Object.values(formData.params || {}), // we need to pass in the params so that the tx params are not blank
            atBlock: formData.blockHash || undefined,
            signer: walletContext?.wallet?.signer,
            signerAddress: formData.selectedAddress
        });
        setResult(JSON.stringify(output, null, 2));
    } catch (error) {
        console.error('Execution failed:', error);
        setResult(`Error: ${error.message}`);
    }
  };

  const handlePillsChange = (updatedPills, fieldKey) => {
    console.log('handlePillsChange Updated Pills:', fieldKey);
      saveNodeFormData(activeScenarioId, nodeId, (previousData) => ({
      ...previousData,
      [fieldKey]: updatedPills  // assuming pills directly relate to the field without a nested structure
    }));
  };

  const handleAdvancedSettingsToggle = (isToggled) => {
    setShowAdvancedSettings(isToggled);
  };
  
  const handleSave = (newChainQuery) => {
    // event.preventDefault();

    // update this to be similar to handleNewChainQueryData
    hideTippy();
    onSave();
  };

  const handleCancel = () => {
    hideTippy();
    onClose(); // Invoke the onClose function passed from the parent component
  };

  const handleScroll = (e) => {
    e.stopPropagation();
  };

  const fetchBalance = async (signal) => {
    // console.log('getAssetBalanceForChain fetchBalance address:', address, 'chain:', chain);
    // if (!address || !chain) return;

    setIsFetchingBalance(true);
    try {
      const fetchedBalance = await getAssetBalanceForChain(formData.selectedChain, 0, formData.selectedAddress);
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

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (formData.selectedAddress && formData.selectedChain) {

    fetchBalance(signal);
    }
    return () => controller.abort();
  }, [formData.selectedAddress, formData.selectedChain]);

  const handleAddressChange = (newAddress) => {
    // Update formData with the new address
    saveNodeFormData(activeScenarioId, nodeId, {...formData, selectedAddress: newAddress});
  };


return (
  <div onScroll={handleScroll} className=''>
      <FormHeader onClose={handleCancel} title='Query Chain' logo={<ChainQueryIcon className='h-4 w-4' fillColor='black' />} />  

      <div className='http-form'>
          
          {renderAddressSelection()} 
          <div className="flex items-center primary-font">
        {isFetchingBalance ? (
          <span>Loading balance...</span>
        ) : (
          balance && <BalanceTippy balance={balance} symbol="DOT" /> // Adjust symbol accordingly
        )}
              <span onClick={fetchBalance} className="text-xs m-1 p-0 rounded refresh-button">
              <img className="h-3 w-3" src="/refresh.svg" />
            </span>
                   
      </div>

          {renderChainSelection()}
          {renderPalletSelection()}
          {renderMethodSelection()}
          {renderMethodFields()}
          {renderBlockHashInput()}


    <button className="button mt-2" onClick={handleSignMethodClick} disabled={!selectedMethod}>Sign Tx Once</button>
    <textarea className="result-textarea" value={result} readOnly />

    </div>

    <FormFooter onClose={handleCancel} onSave={handleSave} showToggle={true} onToggleChange={handleAdvancedSettingsToggle} />
  </div>
);

};

export default ChainTxForm;
