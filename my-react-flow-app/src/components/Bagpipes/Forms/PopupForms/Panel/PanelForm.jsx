import React, { useState, useRef, useEffect } from 'react';
import useAppStore from '../../../../../store/useAppStore';

import CollapsibleField from '../../fields/CollapsibleField';
import FormHeader from '../../FormHeader';
import { getOrderedList, findUpstreamNodes, extractEventDataFromNodes } from '../../../hooks/utils/scenarioExecutionUtils';
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
    const [pills, setPills ]  = useState([]);

    const currentScenario = scenarios[activeScenarioId];
    const node = currentScenario.diagramData.nodes.find(node => node.id === nodeId);
    const savedState = getSavedFormState(nodeId) ?? { inputNodes: node?.data?.inputNodes || [] };
    const [inputNodes, setInputNodes] = useState(node?.data?.inputNodes || []);
  
    useEffect(() => {
      // Get the ordered list of nodes
      const orderedList = getOrderedList(currentScenario.diagramData.edges);
  
      // Find upstream nodes
      const upstreamNodes = findUpstreamNodes(orderedList, nodeId);
  
      // Extract event data from upstream nodes and convert them to pills
      const newPills = extractEventDataFromNodes(upstreamNodes);
  
      // Update the pills state
      setPills(newPills);
  
    }, [currentScenario.diagramData.edges, nodeId]); // Add dependencies that trigger the update
  
  
    

    
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
          dragPreview.innerHTML = `➕<span class="bg-green-500 w-full text-white mt-1 p-1 border-green-500 rounded">${type}</span>`; 
          dragPreview.style.position = "absolute";
          dragPreview.style.top = "-1000px";
          document.body.appendChild(dragPreview);
          preview(dragPreview);
        }
      }, [preview]);
    
      return (
        <div ref={drag} className='mt-3 mb-2'style={{ opacity: isDragging ? 0.5 : 1 }}>
          {/* Content of your draggable element */}
          <span className="bg-green-500 w-full text-white mt-1 p-1 border-green-500 rounded cursor-pointer">{type}</span>
        </div>
      );
    };





  return (
    <div>
      <FormHeader title='Control Panel' />  

      <DraggableNode nodeId="node1" type="1. referendum_hash" label="referendum_hash" />
      <DraggableNode nodeId="node2" type="1. proposal_hash" label=" test_2" />
  
      
    </div>
  );
};

export default PanelForm;
