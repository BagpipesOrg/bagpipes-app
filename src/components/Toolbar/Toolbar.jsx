import React, { useContext } from 'react';
import Tippy from '@tippyjs/react';
import ThemeContext from '../../contexts/ThemeContext';
import 'tippy.js/dist/tippy.css'; // Optional for styling
import './Toolbar.scss'; // Path to your custom CSS

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
  chain: 'Drag and drop a chain node on to the canvas to select the chain you want to use.',
  action: 'Drag and drop an action to make an action (transfer, xTransfer, Swap, etc.).',

  }

const Toolbar = () => {
  const { theme } = useContext(ThemeContext);
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const renderNode = (nodeKey) => (
    <Tippy theme="light" content={nodeDescriptions[nodeKey]}>
      <div className={`toolbar-icon ${theme}`} onDragStart={(event) => onDragStart(event, nodeKey)} draggable>
        {nodeNames[nodeKey]}
      </div>
    </Tippy>
  );

  return (
    <div className={`toolbar-node ${theme}`}>
      {Object.keys(nodeNames).map(nodeKey => renderNode(nodeKey))}
    </div>
  );
};

export default Toolbar;
