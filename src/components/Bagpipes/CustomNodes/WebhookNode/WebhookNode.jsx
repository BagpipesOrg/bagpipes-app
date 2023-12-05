import React, { useState, useRef } from 'react';
import { Handle, Position, useNodeId } from 'reactflow';
import { WebhookNodeIcon }  from '../../../Icons/icons';
import './WebhookNode.scss';
import '../../node.styles.scss';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional for styling
import 'tippy.js/themes/light.css';
import WebhookForm from '../../Forms/PopupForms/Webhook/WebhookForm';

export default function WebhookNode({ data }) {
  const { showArrow, instruction } = data;
  const [isWebhookFormVisible, setWebhookFormVisible] = useState(false);
  const nodeId = useNodeId();
  const nodeRef = useRef();
  const webhookNodeRef = useRef();

  const handleNodeClick = () => {
    setWebhookFormVisible(true); // Show Tippy on node click
  };

  const handleSubmit = (event) => {
    // event.preventDefault();
    setWebhookFormVisible(false);
    // Handle form submission
  };

  const handleCancel = () => {
    // Handle form cancellation
    setWebhookFormVisible(false);

  };

  const handleCloseWebhookForm = () => {
    setWebhookFormVisible(false);
  };


  return (
    <>
{isWebhookFormVisible && (
  <div className='relative'>
    <Tippy
      content={<WebhookForm onSave={handleSubmit} onClose={handleCloseWebhookForm} nodeId={nodeId} />}
      interactive={true}
      trigger="click"
      placement="auto"
      reference={webhookNodeRef}
      theme="light"
      hideOnClick={false}
      visible={isWebhookFormVisible}

    >
      <div ref={webhookNodeRef}></div>
    </Tippy>
    </div>
    )}
 
    
    
    <div ref={nodeRef} onClick={handleNodeClick}>

    <div className="relative nodeBody bg-white border-2 border-gray-300 rounded-full w-20 h-20 flex items-center justify-center">
 
   <WebhookNodeIcon className="h-8" fillColor='purple' />
      
      {/* Logo in the middle of the circle */}
      {/* <img src={`/chains/${logo}`} alt={`${title} Logo`} className="text-slate-800 h-8 w-8" /> */}

      {/* Title outside the circle below the logo */}
      <div className="node-title-circle absolute bottom-[-38%] text-center w-full">
        <span className="font-medium text-xl text-gray-500">Webhook</span>
      </div>
      
      <Handle position={Position.Right} type="source" className="z-10" />
      {/* <Handle position={Position.Left} type="target" className="hidden z-10" /> */}
    </div>
    </div>
    
    
    </>
  );
}


