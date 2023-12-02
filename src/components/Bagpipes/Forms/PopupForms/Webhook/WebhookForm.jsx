import React, { useState, useRef, useEffect } from 'react';
import CreateWebhookForm from './CreateWebhookForm';
import useAppStore from '../../../../../store/useAppStore';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional for styling
import 'tippy.js/themes/light.css';
import CollapsibleField from '../../fields/CollapsableField';
import FormHeader from '../../FormHeader';
import FormFooter from '../../FormFooter';
import { Form } from 'react-router-dom';
import { Select } from 'antd';
import toast from 'react-hot-toast';
import '../Popup.scss';
import '../../../../../index.css';
import { WebhookIcon } from '../../../../Icons/icons';
import WebhooksService from '../../../../../services/WebhooksService';



const WebhookForm = ({ onSubmit, onSave, onClose, onEdit, webhooks, nodeId }) => {
  const { scenarios, activeScenarioId, saveNodeFormData, setSelectedWebhookInNode } = useAppStore(state => ({ 
    scenarios: state.scenarios,
    activeScenarioId: state.activeScenarioId,
    saveNodeFormData: state.saveNodeFormData,
    setSelectedWebhookInNode: state.setSelectedWebhookInNode,
   }));

   const selectedWebhook = scenarios[activeScenarioId]?.diagramData.nodes.find(node => node.id === nodeId)?.selectedWebhook || '';

  const [isCreateFormVisible, setCreateFormVisible] = useState(false);
  const createFormRef = useRef();

  const [isListening, setIsListening] = useState(false);
  const [eventReceived, setEventReceived] = useState(false);
  const pollingIntervalRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);

  const currentScenario = scenarios[activeScenarioId];
    // Accessing the formData from the zustand store
    const scenario = scenarios[activeScenarioId];
    const node = scenario.diagramData.nodes.find(node => node.id === nodeId);
    const formData = node?.formData;
  const webhookNodes = currentScenario?.diagramData.nodes.filter(node => node.type === 'webhook');
  console.log('webhookNodes', webhookNodes);
  const selectedWebhookData = webhookNodes.find(webhook => webhook.selectedWebhook === selectedWebhook);
  console.log('selectedWebhookData', selectedWebhookData);

  const selectedWebhookObject = formData.find(webhook => webhook.name === selectedWebhook);
  const webhookURL = selectedWebhookObject ? `https://webhook.site/${selectedWebhookObject.uuid}` : '';
  

  // }

    // // Construct the webhook URL using the UUID
    // const webhookURL = selectedWebhookObject
    // ? `https://webhook.site/${selectedWebhookObject.uuid}`
    // : '';
  
    // console.log('webhookURL', webhookURL);
  


  // Callback function to handle new webhook data
  const handleNewWebhookData = (newWebhook) => {

    console.log('newWebhook nodeId', nodeId);
    // Fetch the current formData for the node
    const currentNode = scenarios[activeScenarioId]?.diagramData.nodes.find(node => node.id === nodeId);
    const currentFormData = currentNode?.formData;
    // Ensure currentData is an array; if not, default to an empty array
    const currentData = Array.isArray(currentFormData) ? currentFormData : [];
    
    // Append new webhook to the existing data
    const updatedData = [...currentData, newWebhook];

    setSelectedWebhookInNode(activeScenarioId, nodeId, newWebhook.name);

    console.log('selectedWebhook', selectedWebhook )

    // Save updated data
    saveNodeFormData(activeScenarioId, nodeId, updatedData);
    console.log('currentFormData', currentFormData);
    // Force component to re-render if necessary
    setForceUpdate(prev => !prev);
    setCreateFormVisible(false);
};
  




  const handleCreateClick = () => {
    setCreateFormVisible(true);
  };

  const handleSave = (newWebhook) => {
    // event.preventDefault();

    // update this to be similar to handleNewWebhookData
    saveNodeFormData(activeScenarioId, nodeId, { ...newWebhook, eventData: null });
    setCreateFormVisible(false);
    onSave();
  };

  const handleCancel = () => {
    onClose(); // Invoke the onClose function passed from the parent component
};

  const handleCloseCreateForm = () => {
    setCreateFormVisible(false);
  };

  const handleEditWebhook = () => {
    if (!selectedWebhook) {
      alert('Please select a webhook to edit.');
      return;
    }
    // Find the selected webhook object
    const webhookToEdit = formData.find(webhook => webhook.name === selectedWebhook);
    if (webhookToEdit) {
      // Logic to open CreateWebhookForm with pre-filled data
      // You might need to modify CreateWebhookForm to accept initial data for editing
    }
  };

  const fetchAndProcessEvents = async () => {
    const data = await WebhooksService.fetchLatestFromWebhookSite(selectedWebhookObject.uuid);
    if (data && data.data.length > 0) {
      console.log('Webhook event received:', data.data);
      toast.success('Webhook event received');

      const webhookEvent = data.data[0];
  
      // save the entire webhook object (including event data) in the zustand store
      saveNodeFormData(activeScenarioId, nodeId, { ...selectedWebhookObject, eventData: webhookEvent });
  
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
    navigator.clipboard.writeText(webhookURL)
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
    // Perform actions based on the updated selectedWebhook
    const selectedWebhookName = scenarios[activeScenarioId]?.diagramData.nodes.find(node => node.id === nodeId)?.selectedWebhook;
    if (selectedWebhookName) {
      // Actions like updating the UI, fetching related data, etc.
    }
  }, [scenarios, activeScenarioId, nodeId]);

  return (
    <div>

    {isCreateFormVisible && (
      <div className='relative'>
        <Tippy
        content={<CreateWebhookForm onSave={handleNewWebhookData} onClose={handleCloseCreateForm} />
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


      <FormHeader title='Webhook' />  
      <form className='popup-form' onSubmit={onSubmit}>
      <div>
      <div className="webhook-container">
      <WebhookIcon className='h-4 w-4' fillColor='black' />
      <Select
        value={selectedWebhook}
        onChange={value => {
          setSelectedWebhookInNode(activeScenarioId, nodeId, value); // update zustand store
        }} 
        className='webhook-selector' placeholder="Select a webhook">
        {formData.map((webhook, index) => (
          <Select.Option key={index} value={webhook.name}>{webhook.name}</Select.Option>
        ))}
      </Select>

        <button className='popup-form-create' onClick={handleCreateClick}>Create</button>
      </div>
        <div className="description ">Here be the generated webhook</div>

        <div className="description ">
        { selectedWebhook && selectedWebhookData && 
        <div className='flex mt-2 mb-2  '> 
        <button className='webhook-url' onClick={handleCopyToClipboard}>
          {webhookURL}</button>
        <button
          className='popup-form-buttons copy-button' 
          onClick={handleCopyToClipboard}

        >copy</button>

        </div>
        }
      </div>
    </div>
    

        </form>
      

      <div className="event-listening-area">
        <button className='popup-form-buttons border border-gray-400 rounded'onClick={toggleListening}>
          {isListening ? (
            <>
              <div className="small-spinner"></div>
              {/* <LoadingSpinner /> Replace with your actual loading spinner component */}
              Stop
            </>
          ) : (
            "Start Listening"
          )}
        </button>
      </div>
    
      <FormFooter onClose={handleCancel} onSave={handleSave} showToggle={false} />
    </div>
  );
};

export default WebhookForm;
