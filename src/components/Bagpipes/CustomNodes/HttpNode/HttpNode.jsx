import React, { useState, useRef } from 'react';
import { Handle, Position, useNodeId } from 'reactflow';
import { HttpIcon } from '../../../Icons/icons';
import './HttpNode.scss';
import '../../node.styles.scss';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional for styling
import 'tippy.js/themes/light.css';

import HttpForm from '../../Forms/PopupForms/Http/HttpForm';


export default function HttpNode({ data }) {
  const { showArrow, instruction } = data;
  const [isHttpFormVisible, setHttpFormVisible] = useState(false);
  const nodeId = useNodeId();
  const nodeRef = useRef();
  const httpNodeRef = useRef();

  const handleNodeClick = () => {
    setHttpFormVisible(true); // Show Tippy on node click
  };

  const handleSubmit = (event) => {
    // event.preventDefault();
    setHttpFormVisible(false);
    // Handle form submission
  };

  const handleCancel = () => {
    // Handle form cancellation
    setHttpFormVisible(false);

  };

  const handleCloseHttpForm = () => {
    setHttpFormVisible(false);
  };

  const handleScroll = (e) => {
    e.stopPropagation();
  };


  return (
    <div onScroll={handleScroll}>
{isHttpFormVisible && (
  <div className='relative'>
    <Tippy
      content={<HttpForm onSave={handleSubmit} onClose={handleCloseHttpForm} nodeId={nodeId} />}
      interactive={true}
      trigger="click"
      placement="auto"
      reference={httpNodeRef}
      theme="light"
      hideOnClick={false}
      visible={isHttpFormVisible}

    >
      <div ref={httpNodeRef}></div>
    </Tippy>
    </div>
    )}
 
    
    
    <div ref={nodeRef} onClick={handleNodeClick}>

    <div className="relative nodeBody border-4 border-gray-300 rounded-full w-20 h-20 flex items-center justify-center">
      
<HttpIcon className='h-7 w-7' fillColor='white' />
      {/* Logo in the middle of the circle */}

      {/* Title outside the circle below the logo */}
      <div className="node-title-circle absolute bottom-[-38%] text-center">
      <div className="font-medium http-name text-gray-500">HTTP Request</div>

      </div>

  
      
      
      <Handle position={Position.Right} type="source" className=" z-10" />
      <Handle position={Position.Left} type="target" className=" z-10" />
      </div>

    </div>

    </div>
  );
}
