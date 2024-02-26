import React, { useState, useRef } from 'react';
import { Handle, Position, useNodeId } from 'reactflow';
import { WebhookNodeIcon }  from '../../../Icons/icons';
import { useTippy } from '../../../../contexts/tooltips/TippyContext';
import './WebhookNode.scss';
import '../../node.styles.scss';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional for styling
import 'tippy.js/themes/light.css';
import WebhookForm from '../../Forms/PopupForms/Webhook/WebhookForm';

export default function WebhookNode({ }) {
  const { showTippy } = useTippy();
  const [isWebhookFormVisible, setWebhookFormVisible] = useState(false);
  const nodeId = useNodeId();
  const nodeRef = useRef();
  const webhookNodeRef = useRef();


  const handleNodeClick = () => {
  
    const rect = nodeRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    // Determine if there's enough space to the right; if not, use the left position.
    const spaceOnRight = viewportWidth - rect.right;
    const tooltipWidth = 300; // Approximate or dynamically determine your tooltip's width.
    const shouldFlipToLeft = spaceOnRight < tooltipWidth;

    const calculatedPosition = {
      x: shouldFlipToLeft ? rect.left : rect.right,
      y: rect.top
    }; 
  
    showTippy(null, nodeId, calculatedPosition, <WebhookForm onSave={handleSubmit} onClose={handleCloseWebhookForm} nodeId={nodeId} reference={nodeRef.current} />, shouldFlipToLeft ? 'left-start' : 'right-start');
  };

  const handleSubmit = (event) => {
    // event.preventDefault();
    setWebhookFormVisible(false);
    // Handle form submission
  };

  const handleCloseWebhookForm = () => {
    setWebhookFormVisible(false);
  };


  return (

    
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
    
    

  );
}


