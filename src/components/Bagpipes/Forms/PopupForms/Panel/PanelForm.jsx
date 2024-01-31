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
import '../../Forms.scss';
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
 
    
    // Function to remove a pill
    const removePill = (pillId) => {
      setPills(currentPills => currentPills.filter(pill => pill.id !== pillId));
      // Additional logic if needed, like updating the combined value or other states
    };

    useEffect(() => {
     
      const allNodes = currentScenario.diagramData.nodes;
      const orderedList = getOrderedList(currentScenario.diagramData.edges);
      console.log('orderedList', orderedList);
      const upstreamNodes = findUpstreamNodes(orderedList, nodeId);

      if (orderedList) {
        const newPills = extractEventDataFromNodes(upstreamNodes, allNodes, orderedList);
        setPills(newPills);
      } else {
        console.error('orderedList is undefined');
      }
  
    }, [currentScenario.diagramData.edges, nodeId, currentScenario.diagramData.nodes]);
  
    const extractEventDataFromNodes = (nodes, allNodes, orderedList) => {
      
      
      const createPillsFromObject = (obj, nodeIndex, prefix = '', depth = 0) => {
        return Object.entries(obj).flatMap(([key, value]) => {
          const pillId = `${prefix}${key}`;
          const isNested = typeof value === 'object' && value !== null;
          
          let pill = {
            id: pillId,
            label: key,
            value: isNested ? null : value,
            depth: depth,
            children: isNested ? createPillsFromObject(value, `${pillId}.`, depth + 1) : [],
            nodeIndex: nodeIndex + 1, 

          };
          console.log('pill', pill);
    
          return pill;
        });
      };
    
      return nodes.flatMap(nodeId => {
        const node = allNodes.find(n => n.id === nodeId);
        const nodeIndex = orderedList.indexOf(nodeId);
        console.log('nodeIndex for', nodeId, ':', nodeIndex);


    
        if (!node) {
          console.error(`Node with ID ${nodeId} not found.`);
          return [];
        }
    
        const queryData = node.formData?.eventData?.query;
        console.log('extractEventDataFromNodes queryData for node', node.id, queryData);
    
        if (!queryData || typeof queryData !== 'object') {
          return [];
        }
    
        return createPillsFromObject(queryData, nodeIndex);
      });
    };
    
    const DraggablePill = ({ pill, depth, onRemovePill, onToggleExpand }) => {
      console.log('Rendering pill:', pill.id, 'with nodeIndex:', pill.nodeIndex);

      const [isExpanded, setIsExpanded] = useState(false);
      const [{ isDragging }, drag, preview] = useDrag(() => ({
        type: 'PILL',
        item: { id: pill.id, label: pill.label },
        collect: (monitor) => ({
          isDragging: !!monitor.isDragging(),
        }),
      }));
    
      const toggleExpand = () => {
        setIsExpanded(!isExpanded);
        if (onToggleExpand) {
          onToggleExpand(pill.id, !isExpanded);
        }
      };

    
      return (
        <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1, marginLeft: `${depth * 20}px` }}>
          {pill.children.length > 0 && (
            <button onClick={toggleExpand}>{isExpanded ? '-' : '+'}</button>
          )}
          <span className="bg-green-500 w-full text-white mt-1 p-1 border-green-500 rounded cursor-pointer">
          {pill.nodeIndex}. {pill.label}
            {/* : {pill.value} */}
          </span>
          {isExpanded && pill.children.map(child => (
            <DraggablePill key={child.id} pill={child} depth={depth + 1} onRemovePill={onRemovePill} />
          ))}
        </div>
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

      // useEffect(() => {
      //   if (preview) {
      //     const dragPreview = document.createElement('div');
      //     dragPreview.innerHTML = `➕<span class="bg-green-500 w-full text-white mt-1 p-1 border-green-500 rounded">${type}</span>`; 
      //     dragPreview.style.position = "absolute";
      //     dragPreview.style.top = "-1000px";
      //     document.body.appendChild(dragPreview);
      //     preview(dragPreview);
      //   }
      // }, [preview]);
    
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

      {/* <DraggableNode nodeId="node1" type="1. referendum_hash" label="referendum_hash" />
      <DraggableNode nodeId="node2" type="1. proposal_hash" label=" test_2" /> */}
      
      {pills.map(pill => (
        <DraggablePill key={pill.id} pill={pill} depth={0} onRemovePill={removePill} />
      ))}
      
    </div>
  );
};

export default PanelForm;




