import React, { useState, useRef, useEffect, useMemo } from 'react';
// import CreateChainQueryForm from './CreateChainQueryForm';
import useAppStore from '../../../../../store/useAppStore';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional for styling
import 'tippy.js/themes/light.css';
import toast from 'react-hot-toast';
import { CollapsibleField }  from '../../fields';
import FormHeader from '../../FormHeader';
import FormFooter from '../../FormFooter';
import { ChainQueryIcon } from '../../../../Icons/icons';
import { useTippy } from '../../../../../contexts/tooltips/TippyContext';
import { Form } from 'react-router-dom';
import { Select, Input } from 'antd';
import httpForm from './httpForm.json';
import '../Popup.scss';
import '../../../../../index.css';
// import ChainQuerysService from '../../../../../services/ChainQuerysService';
import './types';

import { CHAIN_METADATA } from '../../../../../Chains/api/metadata';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { queryMetadata } from './QueryMetadata';
import { parseMetadata } from './utils'
import { listChains} from '../../../../../Chains/ChainsInfo';
import { parseTypeDefinition, parseLookupTypes } from './ParseMetadataTypes';
import renderInputFields from './RenderInputFields';
import ChainQueryRpcService from '../../../../../services/ChainQueryRpcService';

import './ChainQueryForm.scss';
// import { Params } from '@polkadot/react-params';
// import { TypeDef } from '@polkadot/types/create/types';

const ChainQueryForm = ({ onSubmit, onSave, onClose, onEdit, nodeId }) => {
  const { scenarios, activeScenarioId, saveNodeFormData } = useAppStore(state => ({ 
    scenarios: state.scenarios,
    activeScenarioId: state.activeScenarioId,
    saveNodeFormData: state.saveNodeFormData,
   }));

////////

const formData = scenarios[activeScenarioId]?.diagramData?.nodes.find(node => node.id === nodeId)?.formData || {};
console.log('ChainQueryForm formData:', formData);

  const [metadata, setMetadata] = useState(null); 
  console.log('ChainQueryForm metadata:', metadata);

  const [pallets, setPallets] = useState([]);
  const [chains, setChains] = useState([]);
  const [selectedChain, setSelectedChain] = useState(formData.selectedChain || '');
  const [selectedPallet, setSelectedPallet] = useState(formData.selectedPallet || null);
  const [selectedMethod, setSelectedMethod] = useState(formData.selectedMethod || null);
  const [blockHash, setBlockHash] = useState(formData.blockHash || '');
  const [selectedBlockHash, setSelectedBlockHash] = useState('');

  const [result, setResult] = useState('');



  // const selectedStorageItem = useMemo(() => {
  //   return selectedPallet?.storage?.find(item => item.name === selectedMethod?.name) || null;
  // }, [selectedPallet, selectedMethod]);


    const lookupTypes = useMemo(() => {
      // Accessing the nested types array correctly based on your console log
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

      // Load chains and initialize form only once on mount
  // useEffect(() => {
  //   const initializeData = async () => {
  //     try {
  //       const chainsObject = await listChains();
  //       setChains(Object.keys(chainsObject).map(key => ({ ...chainsObject[key], id: key })));

  //       // Initialize form values from existing formData or set defaults
  //       if (!formData.selectedChain && chains.length > 0) {
  //         setSelectedChain(chains[0].name); // Default to first chain
  //       } else {
  //         setSelectedChain(formData.selectedChain);
  //         setSelectedPallet(formData.selectedPallet);
  //         setSelectedMethod(formData.selectedMethod);
  //         setBlockHash(formData.blockHash);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching chains:', error);
  //     }
  //   };

  //   initializeData();
  // }, []);

  const resolveType = (typeId, lookupTypes) => {
    const typeInfo = lookupTypes[typeId];
    if (!typeInfo) {
        console.warn(`Type information not found for type ID: ${typeId}`);
        return { displayName: 'Unknown' }; // Provide a fallback type
    }

    let displayName = '';
    // Use only the last element of the path if it exists
    if (typeInfo.path.length > 0) {
        displayName = typeInfo.path[typeInfo.path.length - 1];
    } else if (typeInfo.definition) {
        // If path is empty, determine the display name based on the type definition
        switch (typeInfo.definition.type) {
            case 'Primitive':
                displayName = typeInfo.definition.primitiveType;
                break;
            case 'Composite':
                // For composite types, join type names if available
                displayName = typeInfo.definition.fields.map(f => f.typeName || f.type).join(', ');
                break;
            case 'Variant':
                // For variant types, list variant names
                displayName = typeInfo.definition.variants.map(v => v.name).join(', ');
                break;
            default:
                displayName = 'Complex Type'; // Default text for complex or unknown definitions
                break;
        }
    }

    return { ...typeInfo, displayName };
};


    useEffect(() => {
      if (!formData.selectedPallet && pallets.length > 0) {
        setSelectedPallet(pallets[0]); // Sets default on initial load only if no pallet is selected
      }
    }, [pallets, formData.selectedPallet]); // This might be causing reset when formData updates

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
      setPallets(parseMetadata(metadata));
    } else if (selectedChain) {
      queryMetadata(selectedChain)
        .then(setMetadata)
        .catch(error => console.error('Error fetching metadata:', error));
    }
  }, [metadata, selectedChain]);

//   useEffect(() => {
//     saveNodeFormData(activeScenarioId, nodeId, {
//         selectedChain,
//         selectedPallet: selectedPallet?.name,
//         selectedMethod: selectedMethod?.name,
//         blockHash
//     });
// }, [selectedChain, selectedPallet, selectedMethod, blockHash]);




  const handleFormChange = (updatedValues) => {
    saveNodeFormData(activeScenarioId, nodeId, updatedValues);
  };


    // useEffect(() => {
    //   if (formData) {
    //     setSelectedChain(formData.selectedChain || '');
    //     setSelectedPallet(formData.selectedPallet || null);
    //     setSelectedMethod(formData.selectedMethod || null);
    //     setBlockHash(formData.blockHash || '');
    //   }
    // }, [formData]);


    useEffect(() => {
      if (metadata) {
        console.log('Metadata:', metadata)
        const parsedData = parseMetadata(metadata);
        console.log('Lookup Parsed Data:', parsedData);  
        setPallets(parsedData);
      }
    }, [metadata]);



    //   useEffect(() => {
//     const fetchMetadata = async () => {
//         try {
//             // Simulate fetching metadata or call your actual API
//             const response = await fetchMetadataFromAPI(); // Replace with your actual metadata fetch call
//             if (response.ok) {
//                 const data = await response.json();
//                 console.log('Fetched Metadata:', data);
//                 setMetadata(data);  // Update your state accordingly
//             } else {
//                 console.error("Failed to fetch metadata");
//             }
//         } catch (error) {
//             console.error("Error fetching metadata:", error);
//         }
//     };

//     fetchMetadata();
// }, []); // Ensure this only runs once or when specific dependencies change


const handleChainSelectChange = async (chainName) => {
  if (chainName !== selectedChain) {
      setSelectedChain(chainName);
      setSelectedPallet(null);
      setSelectedMethod(null);
      setBlockHash('');

      try {
          const metadata = await queryMetadata(chainName);
          setMetadata(metadata);
          const parsedPallets = parseMetadata(metadata);
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
      setSelectedMethod(null); // Reset method when pallet changes
      setBlockHash(''); // Optionally reset block hash too
  }
  saveNodeFormData(activeScenarioId, nodeId, {...formData, selectedPallet: palletName});

};

const handleMethodChange = (methodName) => {
  const newMethod = selectedPallet?.storage.find(storage => storage.name === methodName);
  console.log('handleMethodChange New Method:', newMethod);
  if (newMethod && newMethod !== selectedMethod) {
      setSelectedMethod(newMethod);
  }
  setSelectedMethod(newMethod);

  saveNodeFormData(activeScenarioId, nodeId, {...formData, selectedMethod: newMethod});

};


  const handleBlockHashChange = (newBlockHash) => {
    setBlockHash(newBlockHash);
    saveNodeFormData(activeScenarioId, nodeId, {...formData, blockHash: newBlockHash});

  };

    const handleMethodFieldChange = (value) => {

      const updatedValues = { ...formData, methodInput: value };
      saveNodeFormData(activeScenarioId, nodeId, updatedValues);
  };


 
    


  const renderChainSelection = () => {
      if (chains?.length === 0) {
          return <div>Loading chains...</div>;
      }

      const chainOptions = chains.map(chain => ({
          label: chain.display || chain.name,
          value: chain.name
      }));

      return (
          <CollapsibleField
              key="chainDropdown"
              title="Select Chain"
              hasToggle={false}
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
        hasToggle={false}
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
    console.log('renderMethodSelection Selected Pallet:', selectedPallet);
    if (!selectedPallet || selectedPallet?.storage?.length === 0) return null;
  
    return (
      <CollapsibleField
        key="methodDropdown"
        title="Select Method"
        hasToggle={false}
        fieldTypes="select"
        nodeId={nodeId}
        info="Select a method to view details"

        selectOptions={selectedPallet?.storage?.map(storageItem => ({ label: storageItem.name, value: storageItem.name }))}
        value={formData?.selectedMethod?.name || ''}
        onChange={(value) => handleMethodChange(value)}
      />
    );
  };

  const renderMethodFields = () => {
    if (!formData.selectedMethod) {
        return <div>No selected storage item.</div>;
    }
    if (Object.keys(lookupTypes).length === 0) {
        return <div>Loading data or incomplete metadata...</div>;
    }
    return <StorageFieldInput storageItem={selectedMethod} lookupTypes={lookupTypes} />;
};
  

  const renderBlockHashInput = () => {
    if (!selectedMethod) return null; 
    
    return (
        <CollapsibleField
            title="Blockhash/Blocknumber to Query (optional)"
            info="Enter a block hash or block number to query specific data, leave blank for latest block."
            fieldTypes="input"
            nodeId={nodeId}
            value={formData?.blockHash}
            onChange={handleBlockHashChange}
            onPillsChange={(updatedPills) => handlePillsChange(updatedPills, blockHash)}

        />
    );
};

const StorageFieldInput = ({ storageItem, lookupTypes }) => {
  if (!storageItem) {
      console.error('Invalid or incomplete storage item:', storageItem);
      return <div>Storage item data is incomplete or missing.</div>;
  }




  let keyTypeInfo = { displayName: 'Unknown' };
  if (storageItem.type?.Map) {
      const keyField = storageItem.type.Map.key;
      keyTypeInfo = resolveType(keyField, lookupTypes);
  } else if (storageItem.type?.Plain) {
      keyTypeInfo = resolveType(storageItem.type.Plain, lookupTypes);
  }

  return (
      <div>
          {storageItem.type?.Map && (
              <div>
                  <CollapsibleField
                      // key={key}
                      title={`Enter Key <${keyTypeInfo.displayName}>`}
                      info={storageItem.docs}
                      fieldTypes="input"
                      nodeId={nodeId}
                      value={formData.methodInput || ''}
                      onChange={(value) => handleMethodFieldChange(value)}
                      placeholder={`${keyTypeInfo.path[keyTypeInfo.path.length - 1]}`}
                      onPillsChange={(updatedPills) => handlePillsChange(updatedPills, 'methodInput')}

                  />
              </div>
          )}
            {!storageItem.type?.Map && (
              <div>
                 <CollapsibleField
                      // key={key}

                      title={`Details for ${storageItem.name} <No Input Required>`}
                      info={`${storageItem.docs}`}
                      // fieldTypes="input"
                      nodeId="key-input"
                      />
              </div>
          )}
      </div>
  );
};



  // console.log("Lookup Current Selected Pallet:", selectedPallet);
  // console.log("Lookup Current Selected Method:", selectedMethod);
  // console.log("Lookup Resolved Selected Storage Item:", selectedStorageItem);

// const executeMethod = async () => {
//   if (!selectedMethod) return;

//   try {
//     const params = selectedMethod.fields.map(field => field.value); // Map fields to a simple array of values or a key-value object as required by your API
//     const result = await blockchainApiCall(selectedMethod.name, params);
//     console.log('Method Execution Result:', result);
//     alert('Method executed successfully! See console for details.');
//   } catch (error) {
//     console.error('Failed to execute method:', error);
//     alert('Failed to execute method. See console for details.');
//   }
// };

const handleRunMethodClick = async () => {
  if (!selectedMethod) return;

  try {
      const output = await ChainQueryRpcService.executeChainQueryMethod({
          chainKey: formData.selectedChain,
          palletName: formData.selectedPallet,
          methodName: formData.selectedMethod.name,
          params: formData.methodInput,
          atBlock: formData.blockHash || undefined
      });
      setResult(JSON.stringify(output, null, 2));
  } catch (error) {
      console.error('Execution failed:', error);
      setResult(`Error: ${error.message}`);
  }
};



  const selectedChainQuery = scenarios[activeScenarioId]?.diagramData.nodes.find(node => node.id === nodeId)?.selectedChainQuery || '';
  const [isCreateFormVisible, setCreateFormVisible] = useState(false);
  const createFormRef = useRef();
  const { hideTippy } = useTippy();

  const [isListening, setIsListening] = useState(false);
  const [eventReceived, setEventReceived] = useState(false);
  const pollingIntervalRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);

  const currentScenario = scenarios[activeScenarioId];
    // Accessing the https from the zustand store
    const scenario = scenarios[activeScenarioId];
  const node = scenario.diagramData.nodes.find(node => node.id === nodeId);
  const httpNodes = currentScenario?.diagramData.nodes.filter(node => node.type === 'http');
  console.log('httpNodes', httpNodes);

  const [selectedBodyType, setSelectedBodyType] = useState('empty');
  const [contentType, setContentType] = useState('text');
  const [customContentType, setCustomContentType] = useState('');
  const [requestContent, setRequestContent] = useState('');
  const [isAdvancedSettings, setIsAdvancedSettings] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({});

  const handleBodyTypeChange = (value) => {
    setSelectedBodyType(value);
  };  
  const handleContentTypeChange = (value) => setContentType(value);
  const handleCustomContentTypeChange = (e) => setCustomContentType(e.target.value);
  const handleRequestContentChange = (e) => setRequestContent(e.target.value);
  const handleAdvancedSettingsToggle = (isToggled) => {
    setShowAdvancedSettings(isToggled);
  };

//   const selectedChainQueryObject = https?.find(http => http.name === selectedChainQuery);
//   const httpURL = selectedChainQueryObject ? `https://http.site/${selectedChainQueryObject.uuid}` : '';

const formSections = httpForm.sections;

// const initializeFormValues = () => {
//   const existingFormData = scenarios[activeScenarioId]?.diagramData?.nodes.find(node => node.id === nodeId)?.formData;

//   // Check if existing form data is available for this node
//   if (existingFormData) {
//     return; // Exit the function early
//   }

//   // If no existing data, initialize with default values
//   let initialValues = {};
//   const setDefaultValues = (fields) => {
//     fields.forEach(field => {
//       // Handle default value for radio buttons
//       if (field.type === "radio" && field.default !== undefined) {
//         initialValues[field.key] = field.default ? 'yes' : 'no';
//       }
//       // Handle other field types...
//       // Initialize children with defaults
//       if (field.children) {
//         field.children.forEach(childSection => {
//           setDefaultValues(childSection.fields);
//         });
//       }
//     });
//   };

//   formSections.forEach(section => {
//     setDefaultValues(section.fields);
//   });

//   saveNodeFormData(activeScenarioId, nodeId, initialValues);
// };

//   useEffect(() => {
//     initializeFormValues();
//   }, []);






  
  const handleItemsChange = (key, newItems) => {
    console.log('handleItemsChange', key, newItems);
    const updatedValues = { ...formData, [key]: newItems };
    saveNodeFormData(activeScenarioId, nodeId, updatedValues);
  };

  const handlePillsChange = (updatedPills, fieldKey) => {
    // Update formData accordingly
    // saveNodeFormData(activeScenarioId, nodeId, previousData => ({
    //   ...previousData,
    //   [fieldKey]: { ...previousData[fieldKey], pills: updatedPills }
    // }));
     saveNodeFormData(activeScenarioId, nodeId, (previousData) => ({
    ...previousData,
    [fieldKey]: updatedPills  // Assuming pills directly relate to the field without a nested structure
  }));
  };
  
  const handleCreateClick = () => {
    setCreateFormVisible(true);
  };

  const handleSave = (newChainQuery) => {
    // event.preventDefault();

    // update this to be similar to handleNewChainQueryData
    setCreateFormVisible(false);
    hideTippy();
    onSave();
  };

  const handleCancel = () => {
    hideTippy();
    onClose(); // Invoke the onClose function passed from the parent component
};

  const handleCloseCreateForm = () => {
    setCreateFormVisible(false);
  };

  const handleScroll = (e) => {
    e.stopPropagation();
  };




return (
  <div onScroll={handleScroll} className=''>
      <FormHeader onClose={handleCancel} title='Query Chain' logo={<ChainQueryIcon className='h-4 w-4' fillColor='black' />} />  

      <div className='http-form'>
          {renderChainSelection()}
          {renderPalletSelection()}
          {renderMethodSelection()}
          {renderMethodFields()}
          {renderBlockHashInput()}


    <button className="button mt-2" onClick={handleRunMethodClick} disabled={!selectedMethod}>Run Method</button>
    <textarea className="result-textarea" value={result} readOnly />

    </div>

    <FormFooter onClose={handleCancel} onSave={handleSave} showToggle={true} onToggleChange={handleAdvancedSettingsToggle} />
  </div>
);

};

export default ChainQueryForm;
