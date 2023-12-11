import React, { useState, useRef, useEffect } from 'react';
import useAppStore from '../../../../../store/useAppStore';

import CollapsibleField from '../../fields/CollapsibleField';
import FormHeader from '../../FormHeader';
import { useTippy } from '../../../../../contexts/tooltips/TippyContext';
import { getSavedFormState, setSavedFormState } from '../../../utils/storageUtils';
import { useDrag, useDrop } from 'react-dnd';
import CustomInput from '../../fields/CustomInput';
import TextEditor from '../../fields/TextEditor';
import toast from 'react-hot-toast';
import '../Popup.scss';
import '../../../../../index.css';
// import { PanelIcon } from '../../../../Icons/icons';

const Pill = ({ text, onDelete, id }) => {
  return (
      <div 
          draggable 
          onDragStart={(e) => handleDragStart(e, id)} 
          className="pill"
          style={{ backgroundColor: 'rgb(199, 58, 99)', color: 'white' }}
      >
          {text}
          <button onClick={() => onDelete(id)}>x</button>
      </div>
  );
};





const PanelForm = ({ nodeId }) => {
    const { scenarios, activeScenarioId, saveNodeFormData, savePanel, panels, setSelectedPanelInNode } = useAppStore(state => ({ 
        scenarios: state.scenarios,
        activeScenarioId: state.activeScenarioId,
        // saveNodeFormData: state.saveNodeFormData,
    
    }));

    const currentScenario = scenarios[activeScenarioId];
    const node = currentScenario.diagramData.nodes.find(node => node.id === nodeId);
    const savedState = getSavedFormState(nodeId) ?? { inputNodes: node?.data?.inputNodes || [] };
    const [inputNodes, setInputNodes] = useState(node?.data?.inputNodes || []);
    const [droppedItems, setDroppedItems] = useState([]);
    const [combinedValue, setCombinedValue] = useState(""); // This will store text and pills combined as HTML
    const [pills, setPills] = useState([]);
    const [content, setContent] = useState([]);

  
    // // In your input field or drop target
    const [{ isOver }, drop] = useDrop(() => ({
      accept: 'NODE',
      drop: (item, monitor) => {
        if (monitor.isOver({ shallow: true })) {
          setDroppedItems(currentItems => [...currentItems, item]);
        }
      },
      collect: monitor => ({
        isOver: !!monitor.isOver(),
      }),
    }));

    const DraggablePill = ({ id, text }) => {
      const [, dragRef] = useDrag({
          type: 'PILL',
          item: { id },
          collect: monitor => ({
              isDragging: monitor.isDragging(),
          }),
      });
  
      return (
          <div ref={dragRef} className="draggable-pill">
              {text}
          </div>
      );
  };

  const DropArea = ({ onItemDropped }) => {
    const [{ isOver }, drop] = useDrop({
        accept: 'PILL', // Make sure this matches the type in useDrag
        drop: (item, monitor) => {
            if (monitor.canDrop()) {
                onItemDropped(item);
            }
        },
        collect: monitor => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
        }),
    });
      return (
        <div 
          ref={drop} 
          style={{ 
            height: '100px', 
            width: '100%', 
            backgroundColor: isOver ? 'lightblue' : 'lightgrey',
            border: '1px dashed black',
            margin: '10px 0'
          }}>
          {droppedItems.length === 0
            ? "Drop items here"
            : droppedItems.map((item, index) => (
                <div key={index}>
                  Dropped: {item.type} (ID: {item.id})
                </div>
              ))
          }
        </div>
      );
    };

    const handleItemDropped = (item) => {
      const newPill = {
        id: item.id,  // Ensure unique ID for each pill
        text: item.label,  // Text to display on the pill
        color: 'green' // Color or other styling for the pill
      };
    
      setPills(currentPills => [...currentPills, newPill]);
      updateCombinedValue(); // Update the combinedValue
    };
    

         // Handler for changes in CustomInput
const handleCombinedValueChange = (newContent) => {
  setCombinedValue(newContent);
  // Here you can also parse newContent to update other states or perform other actions
};

const updateCombinedValue = () => {
  const pillHtml = pills.map(pill => `<span class='pill' style='background-color: ${pill.color};'>${pill.text}</span>`).join("");
  const newCombinedValue = pillHtml + inputText;
  setCombinedValue(newCombinedValue);
};
    


const PillContainer = () => {
  const pills = [/* array of pill data */];

  return (
      <div className="pill-container">
          {pills.map(pill => (
              <DraggablePill key={pill.id} id={pill.id} text={pill.text} />
          ))}
      </div>
  );
};

  return (
    <div>
      <FormHeader title='Panel' />  

      <PillContainer />
      <DraggablePill id="pill1" text="Pill 1" />
      {/* Drop area */}
      <DropArea onItemDropped={handleItemDropped} />
      <TextEditor />

      
    </div>
  );
};

export default PanelForm;
