import React, { useState, useRef, useEffect } from 'react';
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
import { queryMetadata } from './ChainQueryTest';
import { parseMetadata } from './utils'
import { listChains} from '../../../../../Chains/ChainsInfo';


const ChainQueryForm = ({ onSubmit, onSave, onClose, onEdit, nodeId }) => {
  const { scenarios, activeScenarioId, saveNodeFormData } = useAppStore(state => ({ 
    scenarios: state.scenarios,
    activeScenarioId: state.activeScenarioId,
    saveNodeFormData: state.saveNodeFormData,
   }));

   // CHAIN QUERY TEST
    const [metadata, setMetadata] = useState(null); // Add state for metadata
    const [pallets, setPallets] = useState([]);
    const [selectedPallet, setSelectedPallet] = useState(null);
    const [selectedMethod, setSelectedMethod] = useState(null);

    const [chains, setChains] = useState([]);
    const [selectedChain, setSelectedChain] = useState('');

    useEffect(() => {
        const fetchChains = async () => {
            const chainsObject = await listChains();
            if (chainsObject && Object.keys(chainsObject).length > 0) {
                const chainsArray = Object.keys(chainsObject).map(key => ({
                    ...chainsObject[key],
                    id: key
                }));
                setChains(chainsArray);
            } else {
                console.error('Chains list is not available:', chainsObject);
                setChains([]);
            }
        };

        fetchChains();
    }, []);

    const handleChainSelectChange = async (value) => {
      setSelectedChain(value);
      setSelectedPallet(null);
      setSelectedMethod(null);
      try {
        const metadata = await fetchChainMetadata(value);
        setMetadata(metadata);
        const parsedPallets = parseMetadata(metadata);
        setPallets(parsedPallets);
      } catch (error) {
        console.error('Error fetching metadata:', error);
      }
    };
    
    const handlePalletChange = (value) => {
      const pallet = pallets.find(p => p.name === value);
      setSelectedPallet(pallet);
      setSelectedMethod(null); // Reset methods when changing pallets
    };
    
    const handleMethodChange = (value) => {
      const method = selectedPallet.methods.find(m => m.name === value);
      setSelectedMethod(method);
    };
    

    const renderChainSelection = () => {
        if (chains.length === 0) {
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
                selectOptions={chainOptions}
                value={selectedChain}
                onChange={(value) => handleChainSelectChange(value)}
            />
        );
    };

    
    
    const renderPalletSelection = () => {
      if (!selectedChain || pallets.length === 0) return null;
    
      return (
        <CollapsibleField
          key="palletDropdown"
          title="Select Pallet"
          hasToggle={false}
          type="select"
          nodeId={nodeId}
          info="Select a pallet to explore"
          selectOptions={pallets.map(pallet => ({ label: pallet.name, value: pallet.name }))}
          value={selectedPallet?.name || ''}
          onChange={(value) => handlePalletChange(value)}
        />
      );
    };
    
    const renderMethodSelection = () => {
      if (!selectedPallet || selectedPallet.methods.length === 0) return null;
    
      return (
        <CollapsibleField
          key="methodDropdown"
          title="Select Method"
          hasToggle={false}
          type="select"
          nodeId={nodeId}
          info="Select a method to view details"
          selectOptions={selectedPallet.methods.map(method => ({ label: method.name, value: method.name }))}
          value={selectedMethod?.name || ''}
          onChange={(value) => handleMethodChange(value)}
        />
      );
    };
    
    
    
 
    

      // ChainQuery Test

  const handleQueryMetadata = async () => {
    try {
      const fetchedMetadata = await queryMetadata(); // Assume this fetches the metadata
      console.log('Fetched Metadata:', fetchedMetadata);  // Check what is actually fetched
      if (fetchedMetadata) {
        setMetadata(fetchedMetadata); // Save fetched metadata to state
        // alert('Metadata fetched successfully. Check the console for details.');
      } else {
        alert('No metadata fetched');
      }
    } catch (error) {
      console.error('Failed to fetch metadata:', error);
      // alert('Failed to fetch metadata. See console for details.');
    }
  };
  

  useEffect(() => {
    if (metadata) {
      console.log('Metadata:', metadata)
      const parsedData = parseMetadata(metadata);
      console.log('Parsed Data:', parsedData);  
      setPallets(parsedData);
    }
  }, [metadata]);
  


  //////////////////////////

  const renderFieldsBasedOnChain = () => {
  if (!selectedChain) return null;
  
  const chainInfo = chains.find(chain => chain.chain === selectedChain);
  if (!chainInfo) return null;

  // Example: Suppose each chain has specific "queryOptions"
  return chainInfo.queryOptions.map(option => {
    return renderField({
      key: option.key,
      label: option.label,
      hasToggle: option.hasToggle,
      type: option.type,
      description: option.description,
      options: option.options, // If type is 'select'
    });
  });
};

 

/////

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

const formData = scenarios[activeScenarioId]?.diagramData?.nodes.find(node => node.id === nodeId)?.formData || {};
const formSections = httpForm.sections;

const initializeFormValues = () => {
  const existingFormData = scenarios[activeScenarioId]?.diagramData?.nodes.find(node => node.id === nodeId)?.formData;

  // Check if existing form data is available for this node
  if (existingFormData) {
    return; // Exit the function early
  }

  // If no existing data, initialize with default values
  let initialValues = {};
  const setDefaultValues = (fields) => {
    fields.forEach(field => {
      // Handle default value for radio buttons
      if (field.type === "radio" && field.default !== undefined) {
        initialValues[field.key] = field.default ? 'yes' : 'no';
      }
      // Handle other field types...
      // Initialize children with defaults
      if (field.children) {
        field.children.forEach(childSection => {
          setDefaultValues(childSection.fields);
        });
      }
    });
  };

  formSections.forEach(section => {
    setDefaultValues(section.fields);
  });

  saveNodeFormData(activeScenarioId, nodeId, initialValues);
};

  useEffect(() => {
    initializeFormValues();
  }, []);



  const handleFieldChange = (key, value) => {
    const updatedValues = { ...formData, [key]: value };
    const field = findFieldByKey(key);
    // Check if a valid field is found
    if (field && field.type === 'radio' && field.children) {
      field.children.forEach(childSection => {
        childSection.fields.forEach(childField => {
          updatedValues[childField.key] = ''; // Reset or set to default
        });
      });
    }
    saveNodeFormData(activeScenarioId, nodeId, updatedValues);
  };


  const handleSelectChange = (key, value) => {
    console.log(`Key: ${key}, Value: ${value}`); // Log to debug values

    if (key === 'chain') {
      setSelectedChain(value);

    } else {

    const updatedValues = { ...formData, [key]: value };
    const selectedOption = findOptionByKeyAndValue(key, value);

    const initializeChildFields = (children, defaultValues = {}) => {
      children.forEach(childSection => {
        childSection.fields.forEach(childField => {
          updatedValues[childField.key] = defaultValues[childField.key] || '';
          if (childField.options) {
            childField.options.forEach(option => {
              if (option.children) {
                initializeChildFields(option.children, defaultValues[childField.key]);
              }
            });
          }
        });
      });
    };
    };

    try {
      if (selectedOptions?.children) {
        initializeChildFields(selectedOptions.children);
      }
      saveNodeFormData(activeScenarioId, nodeId, updatedValues);
    } catch (error) {
      console.error('Failed to update form data:', error);
      // Consider additional error handling or user feedback here
    }
};



// const handleSelectChange = (key, value) => {
//   const updatedValues = { ...formData, [key]: value };
//   // Find the selected option and its children
//   const selectedOption = findOptionByKeyAndValue(key, value);
//   // Initialize or reset the state for children fields
//   const initializeChildFields = (children) => {
//     children.forEach(childSection => {
//       childSection.fields.forEach(childField => {
//         updatedValues[childField.key] = ''; // Initialize with empty string or appropriate value
//         // If the child field has further nested children, initialize them as well
//         if (childField.options) {
//           childField.options.forEach(option => {
//             if (option.children) {
//               initializeChildFields(option.children);
//             }
//           });
//         }
//       });
//     });
//   };
//   if (selectedOption?.children) {
//     initializeChildFields(selectedOption.children);
//   }
//   saveNodeFormData(activeScenarioId, nodeId, updatedValues);
// };



  const handleItemsChange = (key, newItems) => {
    console.log('handleItemsChange', key, newItems);
    const updatedValues = { ...formData, [key]: newItems };
    saveNodeFormData(activeScenarioId, nodeId, updatedValues);
  };

  const handlePillsChange = (updatedPills, fieldKey) => {
    console.log(`Received updated pills for field: ${fieldKey}`, updatedPills);
    // Update formData accordingly
    saveNodeFormData(activeScenarioId, nodeId, previousData => ({
      ...previousData,
      [fieldKey]: { ...previousData[fieldKey], pills: updatedPills }
    }));
  };
  

  
  


    // Callback function to handle new http data
  const handleNewChainQueryData = (newChainQuery) => {

      console.log('newChainQuery nodeId', nodeId);
      // Fetch the current https for the node

      setSelectedChainQueryInNode(activeScenarioId, nodeId, newChainQuery.name);

      console.log('selectedChainQuery', selectedChainQuery )

      // Save updated data
      saveChainQuery(newChainQuery); // Save the http globally

      // Force component to re-render if necessary
      setForceUpdate(prev => !prev);
      setCreateFormVisible(false);
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



  const fetchAndProcessEvents = async () => {
    const data = await ChainQuerysService.fetchLatestFromChainQuerySite(selectedChainQueryObject.uuid);
    if (data && data.data.length > 0) {
      console.log('ChainQuery event received:', data.data);
      toast.success('ChainQuery event received');

      const httpEvent = data.data[0];
      const eventData = {
        query: httpEvent.query,
        body: httpEvent.request || parsedContent, // Use request or parsed content
        headers: httpEvent.headers, 
        createdAt: httpEvent.created_at,
        method: httpEvent.method,
      };

      // save the http object (including event data) in the zustand store
      const updatedChainQuery = { ...selectedChainQueryObject, eventData };
      saveChainQuery(updatedChainQuery);   
      setEventReceived(true);
      stopListening();
    }
  };

  const startListening = () => {
    if (!pollingIntervalRef.current && !eventReceived) {
      fetchAndProcessEvents(); // Fetch immediately
      pollingIntervalRef.current = setInterval(fetchAndProcessEvents, 5000); // Poll every 5 seconds
    }
  };

  const stopListening = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
      setIsListening(false); // Update the listening state
    }
  };


  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(httpURL)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        // This function is called if there was an error copying
        toast.error('Failed to copy!');
      });
  };

  useEffect(() => {
    if (copied) {
      toast.success('Copied to clipboard!');
    }
  }, [copied]);

  useEffect(() => {
    // Perform actions based on the updated selectedChainQuery
    const selectedChainQueryName = scenarios[activeScenarioId]?.diagramData.nodes.find(node => node.id === nodeId)?.selectedChainQuery;
    if (selectedChainQueryName) {
      // Actions like updating the UI, fetching related data, etc.
    }
  }, [scenarios, activeScenarioId, nodeId]);

  // useEffect(() => {
  //   console.log('formData', formData); // Check current state of form values
  // }, [formData]);




  const findOptionByKeyAndValue = (key, value) => {
    const field = findFieldByKey(key);
    return field?.options.find(option => option.value === value);
  };


  
  const findFieldByKey = (key) => {
    for (const section of formSections) {
      const field = section.fields.find(field => field.key === key);
      if (field) {
        return field;
      }
    }
    return null;
  };


  const renderFieldWithChildren = (field) => {
    // if (!isFieldVisible(field)) return null;

    if (!field || typeof field !== 'object') return null;

    if (!isFieldVisible(field)) return null;
  
    let fieldElement = renderField(field);
    let childrenElements = null;
    if (field.type === 'radio' && formData[field.key] === 'yes' && field.children) {
      childrenElements = field.children.flatMap(childSection => 
        childSection.fields.map(childField => renderFieldWithChildren(childField))
      );
    }

    if (field.options) {
        const selectedOption = field.options.find(option => option.value === formData[field.key]);
        if (selectedOption && selectedOption.children) {
            childrenElements = selectedOption.children.flatMap(childSection => 
                childSection.fields.map(childField => renderFieldWithChildren(childField))
            );
        }
    }

    return (
        <>
            {fieldElement}
            <div className="field-children">
                {childrenElements}
            </div>
        </>
    );
};


  
  const isSectionVisible = (section) => {
    return section.fields.some(field => isFieldVisible(field));
  };
  


  const isFieldVisible = (field) => {
    if (!field) return false;
  
    if (field.advanced && !showAdvancedSettings) return false;
  
    // Check visibility for child fields
    if (field.parentKey) {
      const parentFieldValue = formData[field.parentKey];
  
      // For radio buttons, match 'yes'/'no' with true/false
      if (typeof field.parentValue === 'boolean') {
        if (field.parentValue === true) {
          return parentFieldValue === 'yes' || parentFieldValue === true;
        } else if (field.parentValue === false) {
          return parentFieldValue === 'no' || parentFieldValue === false;
        }
      } else {
        // For select fields or other cases, perform a direct string comparison
        return parentFieldValue === field.parentValue;
      }
    }

    return true;
  };
  
  

  const renderField = (field) => {
    console.log("httpForm Rendering field: ", field, "; Visible: ", isFieldVisible(field));
    // Safety check to ensure field is valid and visible
    if (!field || typeof field !== 'object' || !isFieldVisible(field)) return null;
    // if (!field || typeof field !== 'object') return null; 

    // Pass the necessary props based on field type
    const commonProps = {
      key: field.key,
      title: field.label,
      hasToggle: field.hasToggle,
      type: field.type,
      nodeId: nodeId
    };

    // console.log(`httpForm Rendering field ${field.key}`);
    let fieldElement;
    let childrenElements = null;
    console.log('field options', field.options, field.default);

    switch (field.type) {
        case 'input':
            fieldElement = (
                <CollapsibleField
                  fieldTypes='input'
                  {...commonProps}
                  fieldKey={field.key}
                  placeholder={field.label}
                  info={field.description}
                  value={formData[field.key] || ''}
                  onChange={(value) => handleFieldChange(field.key, value)}
                  onPillsChange={(updatedPills) => handlePillsChange(updatedPills, field.key)}
                />
                
            );
            break;
        case 'select':
            const selectedOption = findOptionByKeyAndValue(field.key, formData[field.key]);
            if (selectedOption && selectedOption.children) {
                childrenElements = selectedOption.children.flatMap(childSection => 
                    childSection.fields.map(childField => renderFieldWithChildren(childField))
                );
            }
            fieldElement = (
                <CollapsibleField
                  {...commonProps}
                  fieldTypes='select'
                  info={field.description}
                  selectOptions={field.options}
                  value={formData[field.key] || field.default}
                  onChange={(value) => handleSelectChange(field.key, value)}
                />
            );
            break;
        case 'radio':
            fieldElement = (
                <CollapsibleField
                  {...commonProps}
                  fieldTypes='radio'
                  info={field.description}
                  selectRadioOptions={field.options}
                  value={formData[field.key]}
                  onChange={(value) => handleFieldChange(field.key, value)}
                />
            );
            break;
        case 'items':
            fieldElement = (
                <CollapsibleField
                  fieldTypes='items'                  
                  {...commonProps}
                  fieldKey={field.key}
                  placeholder={field.label}
                  info={field.description}
                  items={formData[field.key] || []}
                  onChange={(newItems) => handleItemsChange(field.key, newItems)}
                  onPillsChange={(updatedPills) => handlePillsChange(updatedPills, field.key)}

                />
            );
            break;
        default:
            return null;
    }

    // Outside the switch case
if (field.children) {
  childrenElements = field.children.flatMap(childSection => 
    childSection.fields.map(childField => renderFieldWithChildren(childField))
  );
}

    return (
        <>
            {fieldElement}
            <div className="field-children">
                {childrenElements}
            </div>
        </>
    );
};




return (
  <div onScroll={handleScroll} className=''>
    <FormHeader onClose={handleCancel} title='Query Chain' logo={<ChainQueryIcon className='h-4 w-4' fillColor='black' />} />  

    <div className='http-form'>
      {renderChainSelection()}
      {selectedChain && renderPalletSelection()}
      {selectedPallet && renderMethodSelection()}
      {selectedMethod && (
        <ul>
          {selectedMethod.fields.map(field => (
            <li key={field.key}>{field.key}: {field.value}</li>
          ))}
        </ul>
      )}

      <button onClick={handleQueryMetadata} className='p-2 bg-blue-500 text-white rounded'>Fetch Metadata</button>

      {/* Render other sections and fields based on the form structure */}
      {formSections.map((section) => {
        if (isSectionVisible(section)) {
          return (
            <div>
              {section.fields.map(fieldKey => renderField(fieldKey))}
            </div>
          );
        }
        return null;
      })}
    </div>

    <FormFooter onClose={handleCancel} onSave={handleSave} showToggle={true} onToggleChange={handleAdvancedSettingsToggle} />
  </div>
);

};

export default ChainQueryForm;
