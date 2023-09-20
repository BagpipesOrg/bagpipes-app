import React, { useState, useEffect } from 'react';
import { Handle, Position, useNodeId } from 'reactflow';
import { getHydraDxSellPrice } from '../../Chains/PriceHelper';
import SwapSVG from '/swap.svg';
import TeleportSVG from '/teleport.svg';
import useAppStore from '../../../store/useAppStore';
import { getOrderedList } from '../utils/scenarioUtils';

import '../../../index.css';
import '../node.styles.scss';
import '../../../main.scss';

export default function ActionNode({ children, data, isConnectable }) {
  const nodeId = useNodeId();
  const { scenarios, activeScenarioId, loading, saveNodeFormData  } = useAppStore(state => ({ 
    scenarios: state.scenarios,
    activeScenarioId: state.activeScenarioId,
    loading: state.loading,
    saveNodeFormData: state.saveNodeFormData,

  }));
  const selectedNodeId = scenarios[activeScenarioId]?.selectedNodeId;
  const [assetInNodeId, setAssetInNodeId] = useState(null);
  const [assetOutNodeId, setAssetOutNodeId] = useState(null);
  const [sellPriceInfo, setSellPriceInfo] = useState(null);
  const [sellPriceInfoMap, setSellPriceInfoMap] = useState({});


  const initialAction = scenarios[activeScenarioId]?.diagramData?.nodes?.find(node => node.id === nodeId)?.formData?.action || null;

  const [formState, setFormState] = useState({
      action: initialAction
  });
  
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const getActionImage = () => {
    if (formState.action === 'swap') return SwapSVG;
    if (formState.action === 'teleport') return TeleportSVG;
    return null;
  };
  

  const handleDropdownClick = (value) => {
    setDropdownVisible(false);
    setFormState(prev => ({
      ...prev,
      action: value
    }));
  };

  // This effect will only run once when the component mounts
  useEffect(() => {
    const currentNodeFormData = scenarios[activeScenarioId]?.diagramData?.nodes?.find(node => node.id === nodeId)?.formData;
    if (currentNodeFormData) {
      setFormState(currentNodeFormData);
    }
  }, []);

  useEffect(() => {
    getHydraDxSellPrice()

  }, []);

  useEffect(() => {
    const currentNodeFormData = scenarios[activeScenarioId]?.diagramData?.nodes?.find(node => node.id === nodeId)?.formData;
    if (currentNodeFormData && JSON.stringify(currentNodeFormData) !== JSON.stringify(formState)) {
      setFormState(currentNodeFormData);
    }
  }, [nodeId, activeScenarioId]);
  
  
  useEffect(() => {
    console.log("Attempting to save form state:", formState);
    if (!activeScenarioId || !nodeId) {
      console.warn("Missing activeScenarioId or nodeId. Not proceeding with save.");
      return;
    }
    const formData = { ...formState };
    saveNodeFormData(activeScenarioId, nodeId, formData);
  }, [formState, nodeId, activeScenarioId]);



  // To do with price info in Swap...

  const getAssetNodes = (selectedNodeId) => {
    const orderedList = getOrderedList(scenarios[activeScenarioId]?.diagramData?.edges);
    const currentIndex = orderedList.indexOf(selectedNodeId);
    
    if (currentIndex === -1) return { assetInNodeId: null, assetOutNodeId: null };
    
    const assetInNodeId = orderedList[currentIndex - 1];
    const assetOutNodeId = orderedList[currentIndex + 1];
    
    return { assetInNodeId, assetOutNodeId };
  }



  useEffect(() => {
    if (!selectedNodeId || !selectedNodeId.startsWith('action_')) return;
    console.log('[ActionNode] active node:', selectedNodeId);

      const { assetInNodeId, assetOutNodeId } = getAssetNodes(selectedNodeId);
      
      setAssetInNodeId(assetInNodeId);
      setAssetOutNodeId(assetOutNodeId);
  }, [selectedNodeId]);


  useEffect(() => {
    if (!assetInNodeId || !assetOutNodeId) return;
    
    const nodes = scenarios[activeScenarioId]?.diagramData?.nodes;
    
    const assetInNodeData = nodes.find(node => node.id === assetInNodeId);
    const assetOutNodeData = nodes.find(node => node.id === assetOutNodeId);
    
    const assetInFormData = assetInNodeData?.formData;
    const assetOutFormData = assetOutNodeData?.formData;

    // Fetch the sell price
    getHydraDxSellPrice(assetInFormData?.asset?.assetId, assetOutFormData?.asset?.assetId, assetInFormData?.amount)
    .then(priceInfo => {
        setSellPriceInfoMap(prevMap => ({
            ...prevMap,
            [selectedNodeId]: priceInfo
        }));
    });

}, [assetInNodeId, assetOutNodeId]);

//   useEffect(() => {

//     if (nodeId !== selectedNodeId) {
//       // This means this ActionNode is not the one that's currently selected
//       return; // Exit the effect early
//   }

//     console.log('[ActionNode] active node:', nodeId);
//     const currentDiagramEdges = scenarios[activeScenarioId]?.diagramData?.edges;
//     const orderedList = getOrderedList(currentDiagramEdges);
//     // console.log('[ActionNode] Ordered List of Nodes:', orderedList);
  
//     const currentIndex = orderedList.indexOf(nodeId);
//     if (currentIndex !== -1) {  
//       const assetInNodeId = orderedList[currentIndex - 1];
//       const assetOutNodeId = orderedList[currentIndex + 1];
  
//       // Assuming `scenarios[activeScenarioId].diagramData.nodes` is an array of node objects
//       const nodes = scenarios[activeScenarioId]?.diagramData?.nodes;
  
//       const assetInNodeData = nodes.find(node => node.id === assetInNodeId);
//       const assetOutNodeData = nodes.find(node => node.id === assetOutNodeId);
  
//       const assetInId = assetInNodeData?.formData?.asset;  // Adjust according to your data structure
//       const assetOutId = assetOutNodeData?.formData?.asset;
//       const amountIn = assetInNodeData?.formData?.amount;
  
//       // console.log('[ActionNode] Asset In ID:', assetInId, assetInNodeId );
//       // console.log('[ActionNode] Asset Out ID:', assetOutId, assetOutNodeId);
//       // console.log('[ActionNode] Amount In:', amountIn);
  
//       // You can then use these values to perform your logic or calculations
//       // ...
  
//     }
  
// }, [ selectedNodeId]); //
  
  
  return (
    <div className="custom-node rounded-lg shadow-lg text-xs flex flex-col items-center justify-start p-2 bg-gray-100 primary-font">
          <h1 className="text-xxs text-gray-400 primary-font mb-1">{nodeId}</h1>

      <Handle id="a" type="target" position={Position.Left} isConnectable={isConnectable} />
      <Handle id="b" type="source" position={Position.Right} isConnectable={isConnectable} />

      <div className="text-gray-400 mb-2 text-xxs">{data.name}</div>

      {/* Custom dropdown */}
      <div className="relative w-28">
        <div className="flex justify-between items-center border py-1 px-2 rounded cursor-pointer text-xs ml-3 mr-3 font-semibold  bg-white" onClick={() => setDropdownVisible(!dropdownVisible)}>
        {formState.action ? (
          <>
            <img src={getActionImage()} alt={formState.action} className="w-12 h-12 p-1 mx-auto" />
          </>
        ) : (
          <div className="text-gray-500 mx-auto text-xs font-semibold">Select Action</div>
        )}

          <div className="pl-2">⌄</div> {/* This is the dropdown arrow symbol */}
        </div>
        
        {dropdownVisible && (
          <div className="absolute z-10 min-w-full border mt-1 rounded bg-white whitespace-nowrap ">
            <div className="flex flex-col">
              <div onClick={() => handleDropdownClick('swap')} className="flex items-center p-2 hover:bg-gray-200">
                <img src={SwapSVG} alt="Swap" className="w-4 h-4 mr-2" />
                <div className='text-xs bold font-semibold'>Swap</div>
              </div>
              <div onClick={() => handleDropdownClick('teleport')} className="flex items-center p-2 hover:bg-gray-200">
                <img src={TeleportSVG} alt="Teleport" className="w-5 h-4 mr-2" />
                <div className='text-xs font-semibold'>Teleport</div>
              </div>
            </div>
          </div>
        )}
      </div>


      <div className="mt-2 text-center text-xs font-semibold primary-font">
        {formState.action && formState.action.charAt(0).toUpperCase() + formState.action.slice(1)}
      </div>

      {sellPriceInfoMap[nodeId] && (
    <div className="sell-price-info mt-4 bg-white p-2 rounded border border-gray-300 text-gray-700">
        {/* Extract the values from sellPriceInfoMap[nodeId] and display them */}
        <div>Amount In: {sellPriceInfoMap[nodeId].amountIn}</div>
        <div>Amount Out: {sellPriceInfoMap[nodeId].amountOut}</div>
                <div><strong>Type:</strong> {sellPriceInfo.type}</div>
                <div><strong>Amount In:</strong> {sellPriceInfo.amountIn}</div>
                <div><strong>Amount Out:</strong> {sellPriceInfo.amountOut}</div>
                <div><strong>Spot Price:</strong> {sellPriceInfo.spotPrice}</div>
                <div><strong>Trade Fee:</strong> {sellPriceInfo.tradeFee}</div>
                <div><strong>Price Impact (%):</strong> {sellPriceInfo.priceImpactPct}</div>
                <div><strong>Trade Fee (%):</strong> {sellPriceInfo.tradeFeePct}</div>
                {/* ... add more fields as needed ... */}
            </div>
        )}




      <div className="space-y-2 mt-2">
        {data.children}
      </div>
    </div>
  );
}
