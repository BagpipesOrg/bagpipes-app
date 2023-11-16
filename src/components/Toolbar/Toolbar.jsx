import React, { useContext } from 'react';
import Tippy from '@tippyjs/react';
import ThemeContext from '../../contexts/ThemeContext';
import { ActionIcon, ChainIcon } from '../Icons/icons'; 
import 'tippy.js/dist/tippy.css'; 
import './Toolbar.scss'; 



const nodeNames = {
    // inputPrompt: 'Input Prompt',
    // output: 'Output',
    // group: 'Group',
    // textUpdater: 'Text Updater',
    // formGroup: 'Form Group',
    // openAi: 'Open AI',
    // openAi_Func: 'Open AI Function',
    // api: 'API',
    // gmail: 'Gmail',
    // vectorDb: 'Vector DB',
    chain: 'Chain',
    action: 'Action',
};

const nodeDescriptions = {
  chain: 
  <div className='m-4'>
    <h1 className='text-xl font-bold'>Chain </h1>
    <p>Drag and drop a chain node on to the canvas to select the chain you want to use.</p>
<img src='./ChainNodeScreenshot.png'></img>
  </div>,
  action: 
  <div className='m-4'>
    <h1 className='text-xl font-bold'>Action </h1>
    <p>Drag and drop an action to make an action (transfer, xTransfer, Swap, etc.).</p>
<img src='./ActionNodeScreenshot.png'></img>
  </div>,
}

const Toolbar = () => {
  const { theme } = useContext(ThemeContext);
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const renderNode = (nodeKey) => {
    let IconComponent;
    if (nodeKey === 'chain') {
      IconComponent = <ChainIcon />;
    } else if (nodeKey === 'action') {
      IconComponent = <ActionIcon />;
    }

    return (
      <Tippy  placement="bottom" theme="light" content={nodeDescriptions[nodeKey]}>
        <div className={`toolbar-icon ${theme}`} onDragStart={(event) => onDragStart(event, nodeKey)} draggable>
          {IconComponent}
          <span>{nodeNames[nodeKey]}</span>
        </div>
      </Tippy>
    );
  };
  return (
    <div className={`toolbar-node ${theme}`}>
      {Object.keys(nodeNames).map(nodeKey => renderNode(nodeKey))}
    </div>
  );
};

export default Toolbar;
