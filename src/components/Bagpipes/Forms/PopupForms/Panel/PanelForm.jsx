import React, { useState, useRef, useEffect } from 'react';
import useAppStore from '../../../../../store/useAppStore';

import CollapsibleField from '../../fields/CollapsibleField';
import FormHeader from '../../FormHeader';
import { useTippy } from '../../../../../contexts/tooltips/TippyContext';
import { getSavedFormState, setSavedFormState } from '../../../utils/storageUtils';
import { useDrag, useDrop } from 'react-dnd';
import CustomInput from '../../fields/CustomInput';
import toast from 'react-hot-toast';
import '../Popup.scss';
import '../../../../../index.css';
// import { PanelIcon } from '../../../../Icons/icons';



const PanelForm = ({ nodeId }) => {
  const dropPositionRef = useRef(null);    
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

    const Pill = ({ id, text, onDelete }) => {
      return (
        <span className="pill" style={{ backgroundColor: 'green' }}>
          {text}
          <button onClick={() => onDelete(id)}>x</button>
        </span>
      );
    };
    
    const DraggableNode = ({ nodeId, type, label }) => {
      const [{ isDragging }, drag, preview] = useDrag(() => ({
        type: 'NODE',
        label: 'test',
        item: { id: nodeId, type, label },
        collect: (monitor) => ({
          isDragging: !!monitor.isDragging(),
        }),
      }));

      useEffect(() => {
        if (preview) {
          const dragPreview = document.createElement('div');
          dragPreview.innerHTML = "➕"; // Plus symbol
          dragPreview.style.position = "absolute";
          dragPreview.style.top = "-1000px";
          document.body.appendChild(dragPreview);
          preview(dragPreview);
        }
      }, [preview]);
    
      return (
        <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
          {/* Content of your draggable element */}
          Draggable {type}
        </div>
      );
    };

    const DropArea = ({ onItemDropped }) => {
      const [dropPosition, setDropPosition] = useState(null);
      const [, drop] = useDrop({
        accept: 'NODE', // Make sure this matches the type in useDrag
        hover: (item, monitor) => {
          const clientOffset = monitor.getClientOffset();
          if (clientOffset && dropPositionRef.current) {
            const dropTargetRect = dropPositionRef.current.getBoundingClientRect();
      
            // Calculate cursor position relative to the drop area
            const xPosition = clientOffset.x - dropTargetRect.left;
            const yPosition = clientOffset.y - dropTargetRect.top;
      
            // Update dropPosition state to reflect this
            setDropPosition({ x: xPosition, y: yPosition });
          }
        },
        drop: (item, monitor) => {
          if (monitor.canDrop()) {
            console.log("Dropping item:", item); // Debug statement

            onItemDropped(item, dropPosition);
          }
        },
        leave: () => {
          // Reset dropPosition when drag leaves
          setDropPosition(null);
        },
        collect: monitor => ({
          isOver: !!monitor.isOver(),
          canDrop: !!monitor.canDrop(),
        }),


      });
      
      const combinedRef = node => {
        drop(node);
        dropPositionRef.current = node;
      };


      return (
        <div 
          ref={combinedRef} 
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
        {dropPosition && <div style={{ position: 'absolute', left: dropPosition.x, top: dropPosition.y }}>|</div>}

        </div>
      );
    };

    const handleItemDropped = (item) => {
      const newPillHtml = `<span class='pill' style='background-color: green;'>${item.label}</span>`;

    };
    

         // Handler for changes in CustomInput
const handleCombinedValueChange = (newContent) => {
  setCombinedValue(newContent);
  // Here you can also parse newContent to update other states or perform other actions
};

const updateCombinedValue = () => {
  const pillHtml = pills.map(pill => `<span class='pill' style='background-color: ${pill.color};'>${pill.text}</span>`).join("");
  const newCombinedValue = pillHtml;
  setCombinedValue(newCombinedValue);
};
    
const handleDeletePill = (pillId) => {
  setPills(pills.filter(pill => pill.id !== pillId));
};



  return (
    <div>
      <FormHeader title='Panel' />  

      <DraggableNode nodeId="node1" type="TypeA" label="test_1" />
      <DraggableNode nodeId="node2" type="TypeB" label=" test_2" />

      {/* Drop area */}
      <DropArea onItemDropped={handleItemDropped} />

      <CustomInput
        value={combinedValue}
        onChange={handleCombinedValueChange}
        className='custom-input'
        pills={pills}
        setPills={setPills}
        onItemDropped={handleItemDropped}
        // Add other necessary props like placeholder, etc.
      />
      
    </div>
  );
};

export default PanelForm;
