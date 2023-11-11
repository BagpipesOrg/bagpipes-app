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

const Toolbar = () => {
  const { theme } = useContext(ThemeContext);
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const renderNode = (nodeKey) => (
    <Tippy content={nodeNames[nodeKey]}>
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
