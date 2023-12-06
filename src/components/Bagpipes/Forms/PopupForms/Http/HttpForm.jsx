import React, { useState, useRef, useEffect } from 'react';
// import CreateHttpForm from './CreateHttpForm';
import useAppStore from '../../../../../store/useAppStore';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional for styling
import 'tippy.js/themes/light.css';
import toast from 'react-hot-toast';

import { CollapsibleField }  from '../../fields';
import FormHeader from '../../FormHeader';
import FormFooter from '../../FormFooter';
import { HttpIcon } from '../../../../Icons/icons';

import { Form } from 'react-router-dom';
import { Select, Input } from 'antd';
import httpForm from './HttpForm.json';

import '../Popup.scss';
import '../../../../../index.css';
// import HttpsService from '../../../../../services/HttpsService';
import './types';

const HttpForm = ({ onSubmit, onSave, onClose, onEdit, nodeId }) => {
  const { scenarios, activeScenarioId, saveNodeFormData } = useAppStore(state => ({ 
    scenarios: state.scenarios,
    activeScenarioId: state.activeScenarioId,
    saveNodeFormData: state.saveNodeFormData,
   }));

   const selectedHttp = scenarios[activeScenarioId]?.diagramData.nodes.find(node => node.id === nodeId)?.selectedHttp || '';

  const [isCreateFormVisible, setCreateFormVisible] = useState(false);
  const createFormRef = useRef();

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

//   const selectedHttpObject = https?.find(http => http.name === selectedHttp);
//   const httpURL = selectedHttpObject ? `https://http.site/${selectedHttpObject.uuid}` : '';

const [formData, setFormData] = useState(null);
const [formValues, setFormValues] = useState({}); // State to track form values
const formSections = httpForm.sections;

const initializeFormValues = () => {
  let initialValues = {};

  const setDefaultValues = (fields) => {
    fields.forEach(field => {
      // Handle default value for radio buttons
      if (field.type === "radio") {
        if (field.default !== undefined) {
          // If default is a boolean, convert it to 'yes' or 'no'
          if (typeof field.default === 'boolean') {
            initialValues[field.key] = field.default ? 'yes' : 'no';
          } else {
            // If default is not a boolean, use it as is
            initialValues[field.key] = field.default;
          }
        }
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

  setFormValues(initialValues);
};




useEffect(() => {
  initializeFormValues();
}, []);


const handleFieldChange = (key, value) => {
  setFormValues(prevValues => {
    let updatedValues = { ...prevValues, [key]: value };

    const field = findFieldByKey(key);

    // Check if a valid field is found
    if (field && field.type === 'radio' && field.children) {
      field.children.forEach(childSection => {
        childSection.fields.forEach(childField => {
          updatedValues[childField.key] = ''; // Reset or set to default
        });
      });
    }

    return updatedValues;
  });
};







    // Callback function to handle new http data
  const handleNewHttpData = (newHttp) => {

      console.log('newHttp nodeId', nodeId);
      // Fetch the current https for the node

      setSelectedHttpInNode(activeScenarioId, nodeId, newHttp.name);

      console.log('selectedHttp', selectedHttp )

      // Save updated data
      saveHttp(newHttp); // Save the http globally

      // Force component to re-render if necessary
      setForceUpdate(prev => !prev);
      setCreateFormVisible(false);
  };
    

  const handleCreateClick = () => {
    setCreateFormVisible(true);
  };

  const handleSave = (newHttp) => {
    // event.preventDefault();

    // update this to be similar to handleNewHttpData
    setCreateFormVisible(false);
    onSave();
  };

  const handleCancel = () => {
    onClose(); // Invoke the onClose function passed from the parent component
};

  const handleCloseCreateForm = () => {
    setCreateFormVisible(false);
  };

  const handleScroll = (e) => {
    e.stopPropagation();
  };



  const fetchAndProcessEvents = async () => {
    const data = await HttpsService.fetchLatestFromHttpSite(selectedHttpObject.uuid);
    if (data && data.data.length > 0) {
      console.log('Http event received:', data.data);
      toast.success('Http event received');

      const httpEvent = data.data[0];
      const eventData = {
        query: httpEvent.query,
        createdAt: httpEvent.created_at,
        method: httpEvent.method,
      };

      // save the http object (including event data) in the zustand store
      const updatedHttp = { ...selectedHttpObject, eventData };
      saveHttp(updatedHttp);   
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

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
    setIsListening(!isListening);
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
    // Perform actions based on the updated selectedHttp
    const selectedHttpName = scenarios[activeScenarioId]?.diagramData.nodes.find(node => node.id === nodeId)?.selectedHttp;
    if (selectedHttpName) {
      // Actions like updating the UI, fetching related data, etc.
    }
  }, [scenarios, activeScenarioId, nodeId]);

  useEffect(() => {
    console.log('formValues', formValues); // Check current state of form values
  }, [formValues]);


  const handleSelectChange = (key, value) => {
    setFormValues(prevValues => {
      let updatedValues = { ...prevValues, [key]: value };
  
      // Find the selected option and its children
      const selectedOption = findOptionByKeyAndValue(key, value);
  
      // Initialize or reset the state for children fields
      const initializeChildFields = (children) => {
        children.forEach(childSection => {
          childSection.fields.forEach(childField => {
            updatedValues[childField.key] = ''; // Initialize with empty string or appropriate value
            // If the child field has further nested children, initialize them as well
            if (childField.options) {
              childField.options.forEach(option => {
                if (option.children) {
                  initializeChildFields(option.children);
                }
              });
            }
          });
        });
      };
  
      if (selectedOption?.children) {
        initializeChildFields(selectedOption.children);
      }
  
      return updatedValues;
    });
  };
  

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
    console.log('formValues in render', formValues);
    if (field.type === 'radio' && formValues[field.key] === 'yes' && field.children) {
      console.log('formValues Rendering children for field:', field.key);
      childrenElements = field.children.flatMap(childSection => 
        childSection.fields.map(childField => renderFieldWithChildren(childField))
      );
    }

    if (field.options) {
        const selectedOption = field.options.find(option => option.value === formValues[field.key]);
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
      const parentFieldValue = formValues[field.parentKey];
  
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
    console.log("httpForm Rendering field: ", field.key, "; Visible: ", isFieldVisible(field));
    // Safety check to ensure field is valid and visible
    if (!field || typeof field !== 'object' || !isFieldVisible(field)) return null;
    // if (!field || typeof field !== 'object') return null; 

    // Pass the necessary props based on field type
    const commonProps = {
      key: field.key,
      title: field.label,
      hasToggle: field.hasToggle,
      type: field.type,
    };

    console.log(`httpForm Rendering field ${field.key}`);
    let fieldElement;
    let childrenElements = null;

    switch (field.type) {
        case 'input':
            fieldElement = (
                <CollapsibleField
                fieldTypes='input'
                {...commonProps}
                placeholder={field.label}
                info={field.description}
                value={formValues[field.key] || ''}
                onChange={(value) => handleFieldChange(field.key, value)}
                />
            );
            break;
        case 'select':
            const selectedOption = findOptionByKeyAndValue(field.key, formValues[field.key]);
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
                defaultValue={formValues[field.key] || field.default}
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
                value={formValues[field.key]}
                onChange={(value) => handleFieldChange(field.key, value)}
                />
            );
            break;
        case 'items':
            fieldElement = (
                <CollapsibleField
                {...commonProps}
                fieldTypes='items'
                info={field.description}
                items={formValues[field.key] || []}
                onChange={(value) => handleFieldChange(field.key, value)}
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

    {isCreateFormVisible && (
      <div className='relative'>
        <Tippy
        content={<CreateHttpForm onSave={handleNewHttpData} onClose={handleCloseCreateForm} />
      }
        interactive={true}
          theme='light'
          placement='auto'
          visible={isCreateFormVisible}
          // hideOnClick={false}
          reference={createFormRef}
        
        >
          <div ref={createFormRef}></div>
        </Tippy>
        </div>
      )}
      
      <FormHeader title='Http' logo={<HttpIcon className='h-4 w-4' fillColor='black' />} />  
    

      <div className='http-form'>
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

export default HttpForm;
