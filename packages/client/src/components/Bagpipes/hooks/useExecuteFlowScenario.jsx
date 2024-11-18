// @ts-nocheck
import { useState, useContext, useEffect, useRef } from 'react';
import { useStoreApi } from 'reactflow';
import { getSavedFormState } from '../utils/storageUtils'; 
import ScenarioService from '../../../services/ScenarioService';
import NodeExecutionService from '../../../services/NodeExecutionService';
import { processScenarioData, validateDiagramData, processAndSanitizeFormData, getUpstreamNodeIds } from '../utils/scenarioUtils';
import { constructCallData, formatCallData } from '../utils/callDataUtils';

import { fetchNodeExecutionData, processWebhookEvent, waitForNewWebhookEvent } from './utils/scenarioExecutionUtils';
import SocketContext from '../../../contexts/SocketContext';
import WebhooksService from '../../../services/WebhooksService';
import ChainRpcService from '../../../services/ChainRpcService';

import useAppStore from '../../../store/useAppStore';
import { v4 as uuidv4 } from 'uuid';
import toast  from 'react-hot-toast';
import { ChainToastContent, ActionToastContent, CustomToastContext } from '../../toasts/CustomToastContext'

import { getOrderedList } from './utils/scenarioExecutionUtils';
import { handleNodeViewport } from '../handlers/handleNodeViewport';
import { broadcastToChain, getPaymentInfo } from 'chains-lib';
import { useTippy } from '../../../contexts/tooltips/TippyContext';
// import { sign } from 'crypto';

// import TransactionSignForm from '../Forms/PopupForms/ChainForms/ChainTxForm/TransactionSignForm';


const useExecuteFlowScenario = (nodes, setNodes, instance) => {
    const socket = useContext(SocketContext);
    const store = useStoreApi();
    const { scenarios, activeScenarioId, saveExecution, executionId, setExecutionId, updateNodeContent, setLoading, loading, toggleExecuteFlowScenario, executionState, setExecutionState, saveTriggerNodeToast, updateEdgeStyleForNode, updateNodeResponseData, updateExecutionSigningJob, updateNodeWebhookEventStatus, clearSignedExtrinsic, markExtrinsicAsUsed, setIsLoadingNode, isExecuting, setIsExecuting, saveNodeEventData } = useAppStore(state => ({
      scenarios: state.scenarios,
      activeScenarioId: state.activeScenarioId,
      saveExecution: state.saveExecution,
      setExecutionId: state.setExecutionId,
      updateNodeContent: state.updateNodeContent,
      setLoading: state.setLoading,
      loading: state.loading,
      toggleExecuteFlowScenario: state.toggleExecuteFlowScenario,
      executionState: state.executionState,
      setExecutionState: state.setExecutionState,
      saveTriggerNodeToast: state.saveTriggerNodeToast,
      updateEdgeStyleForNode: state.updateEdgeStyleForNode,
      updateNodeResponseData: state.updateNodeResponseData,
      updateNodeWebhookEventStatus: state.updateNodeWebhookEventStatus,
      clearSignedExtrinsic: state.clearSignedExtrinsic,
      markExtrinsicAsUsed: state.markExtrinsicAsUsed,
      setIsLoadingNode: state.setIsLoadingNode,   
      isExecuting: state.isExecuting,
      setIsExecuting: state.setIsExecuting,
      saveNodeEventData: state.saveNodeEventData,
      updateExecutionSigningJob: state.updateExecutionSigningJob,
    }));
    const [nodeContentMap, setNodeContentMap] = useState({}); 
    const [lastReceived, setLastReceived] = useState({});
    const prevExecutionIdRef = useRef(null);  

    const executedIds = useRef(new Set()).current;


    async function executeFlowScenario() {
      const newExecutionId = uuidv4(); 
      console.log('New Execution Id:', newExecutionId);
      saveExecution(newExecutionId);

      const updatedExecutionId = useAppStore.getState().executionId;
      console.log('Updated Execution Id:', updatedExecutionId);


      toast('Starting Workflow Execution...', { id: 'workflow-start',duration: 5000 });
      setLoading(true);
      setNodeContentMap({});

      try {

        const rawDiagramData = store.getState();
        console.log('[executeFlowScenario] rawDiagramData:', rawDiagramData);

        // Simplify the diagramData
        let diagramData = {
            nodes: rawDiagramData.getNodes().map(node => ({ 
                id: node.id, 
                type: node.type, 
                data: node.data, 
                position: node.position,
                formData: node.formData,
                eventData: node.eventData,
                formState: getSavedFormState(node.id) || {}, 
                height: node.height,
                width: node.width,   
            })),
            edges: rawDiagramData.edges.map(edge => ({ ...edge })),
        };
        
        
        const orderedList = getOrderedList(diagramData.edges);
        console.log('[executeFlowScenario] Ordered List of Nodes:', orderedList);


        if (!orderedList) {
            toast.error('Error during ordering of nodes. Check the scenario.');
            return;
        }

        // Validate the diagramData
        diagramData = validateDiagramData(diagramData);
                
        console.log("[executeFlowScenario] About to run the scenario with the following data:", { diagramData: diagramData, scenario: activeScenarioId });
        toast.success('Running Scenario...', { id: 'running-scenario' });

       
        let executionCycleFinished = false;
        let parsedFormData; // Used across multiple cases
        let activeExecutionData = {}; // Used across multiple cases

        for(let index = 0; index < orderedList.length; index++) {

            console.log('Execution status,', isExecuting);
            if (!useAppStore.getState().isExecuting) {                
                console.log('Execution has been stopped by the user.');
                break; 
            }
            console.log('Executing Node:', index, orderedList[index]);

            
            let nodeId = orderedList[index];
            let currentNode = diagramData.nodes.find(node => node.id === nodeId);
          
            if (!currentNode) {
                toast.error('The execution has ended due to an unknown node.', { id: 'unknown-node' });
                return;
            }
            setIsLoadingNode(currentNode.id, true);
            updateEdgeStyleForNode(currentNode.id, 'executing');

            switch(currentNode.type) {
                
            case 'openAi':
                break;

            case 'chain':
                break;

            case 'action':
                console.log('executeFlowScenario currentNode position:', currentNode.position);

                toast('Executing action!', {
                    icon: '💥',
                    id: 'execution-action',
                    data: {
                        position: currentNode.position
                    },
                    visible: true,
                    zIndex: 100000,
                });
            
                currentNode.data.triggerToast = true;
                saveTriggerNodeToast(activeScenarioId, currentNode.id, true);
            
                // Zoom into the current node
                await handleNodeViewport(instance, currentNode, 'zoomIn', orderedList);
            
                console.log('executeFlowScenario currentNode:', executionState, currentNode.id);
            
                // Retrieve the signedExtrinsic and other necessary data
                const formData = scenarios[activeScenarioId]?.diagramData?.nodes?.find(node => node.id === nodeId)?.formData || null;
                const node = scenarios[activeScenarioId]?.diagramData?.nodes?.find(node => node.id === nodeId) || null;
                const signedExtrinsic = node?.extrinsics?.signedExtrinsic || null;
                const sourceChain = formData?.actionData?.source?.chain || null;
            
                // we use this function instead of the extrinsicHandler to handle the different action types, 
                // but we need to validate it works with action nodes before removing the commented out code
                // !TODO: also process pills for actions, which means providing parsedFormData to the function
                await broadcastTransaction(activeScenarioId, updatedExecutionId, currentNode.id, formData, signedExtrinsic);

                // console.log('third attempt to clear signed extrinsic...');
                // console.log('Broadcasted to Chain:', signedExtrinsic);
                toast(<ActionToastContent type={formData?.actionData?.actionType} message={`Broadcasted to Chain: ${sourceChain}`} signedExtrinsic={signedExtrinsic} />);
            
            
            
                break;  

            case 'webhook':
                    const webhookFetchStartTime = new Date();
                    console.log('Webhook fetch start time:', webhookFetchStartTime.toISOString());
                    try {
                        console.log('executeFlowScenario currentNode formData uuid:', currentNode.formData.uuid);
                        const webhookData = await WebhooksService.fetchLatestFromWebhookSite(currentNode.formData.uuid);
                        console.log('executeFlowScenario Webhook data received:', webhookData);
                        const { processedEventData, isNewEvent } = processWebhookEvent(webhookData, webhookFetchStartTime);
                
                        if (!isNewEvent) {
                            console.log('Waiting for new webhook event...', currentNode.id);
                            // Directly start waiting for a new event without user input
                            const newEventData = await waitForNewWebhookEvent(currentNode.formData.uuid, webhookFetchStartTime, currentNode.id);
                            
                            if (newEventData) {
                                console.log('New webhook event received and processed:', currentNode.id);
                                // Process the new event data
                                updateNodeResponseData(activeScenarioId, updatedExecutionId, currentNode.id, { eventData: newEventData });
                            }
                        } else {
                            // If the event is already new, process it immediately
                            updateNodeResponseData(activeScenarioId, updatedExecutionId, currentNode.id, { eventData: processedEventData });
                        }
                    } catch (error) {
                        console.error('Error waiting for webhook data:', error);
                        updateNodeResponseData(activeScenarioId, updatedExecutionId, currentNode.id, { error: error.message });
                    } finally {

                    }
                    break;
                
            case 'http':

                console.log('executeFlowScenario for http event...', currentNode.id, currentNode);
                // assuming we have the scenarios object and the activeScenarioId available
                const httpExecutions = useAppStore.getState().scenarios[activeScenarioId]?.executions;
                console.log('All Executions:', httpExecutions, updatedExecutionId);
               

                if (httpExecutions) {
                    const upstreamNodeIds = getUpstreamNodeIds(orderedList, currentNode.id);
                    console.log('executionId:', updatedExecutionId);
                    activeExecutionData = httpExecutions[updatedExecutionId];
                    console.log('Active Execution Data:', activeExecutionData);

                    parsedFormData = processAndSanitizeFormData(currentNode.formData, activeExecutionData, upstreamNodeIds);
                    console.log('Parsed Form Data:', parsedFormData);
                    // parsedFormData should contain the formData with pills replaced by actual data
                } else {
                    // Handle the case where there are no executions or if fetching them failed
                    console.error('No executions found for the scenario');
                    return; // Exit from the case or handle this scenario appropriately
                }

                // Extract URL, method, and other necessary fields from parsedFormData
                // const { url: parsedUrl, method, ...otherParams } = parsedFormData;
            
                try {
                    const httpResponse = await NodeExecutionService.executeHttpRequest(parsedFormData);
                    // Assuming httpResponse contains the data you need
                    console.log('http HTTP Response:', httpResponse);
                    const statusUpdate = {
                        eventData: httpResponse.data,
                        status: httpResponse.status,
                        statusText: httpResponse.statusText,
                        headers: httpResponse.headers,
                        // Any other relevant information from the response
                    };
                
                    // Update the node response data with the new status update
                    updateNodeResponseData(activeScenarioId, updatedExecutionId, currentNode.id, statusUpdate);
                    saveNodeEventData(activeScenarioId, currentNode.id, httpResponse.data);
                    // toast(<CustomToastContext nodeType="http" eventUpdates={statusUpdate.eventData} />);

                } catch (error) {
                    console.error('Error executing HTTP request:', error);
                    // Optionally, update the node response data to reflect the error
                    const errorStatusUpdate = { error: error.message };
                    updateNodeResponseData(activeScenarioId, updatedExecutionId, currentNode.id, errorStatusUpdate);
                } finally {

                }
                
                break;

            case 'chainQuery':
                console.log('Executing Chain Query node...', currentNode.id);
            
                const chainQueryExecutions = useAppStore.getState().scenarios[activeScenarioId]?.executions;
            
                if (chainQueryExecutions) {
                    const upstreamNodeIds = getUpstreamNodeIds(orderedList, currentNode.id);
                    const activeExecutionData = chainQueryExecutions[updatedExecutionId];
            
                    const parsedFormData = processAndSanitizeFormData(currentNode.formData, activeExecutionData, upstreamNodeIds);
                    console.log('chainQuery Parsed Form Data:', parsedFormData, currentNode.id);
                    try {
                        const queryParams = {
                            chainKey: parsedFormData.selectedChain,
                            palletName: parsedFormData.selectedPallet,
                            methodName: parsedFormData.selectedMethod.name,
                            params: parsedFormData.methodInput,
                            atBlock: parsedFormData.blockHash || null,
                        }
                        console.log('[queryParams] Chain Query Params:', queryParams);
                        const queryResult = await ChainRpcService.executeChainQueryMethod({
                            ...queryParams
                        });
                        console.log('Chain Query Response:', queryResult);

                        const eventData = {
                            ...queryResult,
                            ...queryParams

                        };

                        updateNodeResponseData(activeScenarioId, updatedExecutionId, currentNode.id, {
                            eventData: eventData,
                            status: 'success'
                        });
                        saveNodeEventData(activeScenarioId, currentNode.id, queryResult);
                    } catch (error) {
                        console.error('Error executing Chain Query:', error);
                        updateNodeResponseData(activeScenarioId, updatedExecutionId, currentNode.id, {
                            error: error.message,
                            status: 'error'
                        });
                    } finally {
                    }
                } else {
                    console.error('No executions found for the scenario');
                    return;
                }
                    break;
            
            case 'chainTx':
                console.log('Executing Chain Tx node...', currentNode.id);
            
                const chainTxExecutions = useAppStore.getState().scenarios[activeScenarioId]?.executions;
            
                if (chainTxExecutions) {
                    const upstreamNodeIds = getUpstreamNodeIds(orderedList, currentNode.id);
                    const activeExecutionData = chainTxExecutions[updatedExecutionId];
                    console.log('Active Execution Data:', activeExecutionData);
                    const parsedFormData = processAndSanitizeFormData(currentNode.formData, activeExecutionData, upstreamNodeIds);
                    console.log('chainTx Parsed Form Data:', parsedFormData);

                    const callData = constructCallData(parsedFormData);
                    console.log('constructCallData params call data', { callData } );
              
                    const formattedCallData = formatCallData(callData);
                    console.log('constructCallData params call data formattedParams', { callData, formattedCallData } );


                    

                    try {
                        const { extrinsic, encodedCallData } = await ChainRpcService.createChainTxRenderedMethod({
                            chainKey: parsedFormData.selectedChain,
                            palletName: parsedFormData.selectedPallet,
                            methodName: parsedFormData.selectedMethod.name,
                            params: formattedCallData,
        
                        });
                        const paymentInfo = await getPaymentInfo(extrinsic, parsedFormData.selectedAddress, parsedFormData.selectedChain);
                        

                        const transactionDetails = {
                            parsedFormData,
                            paymentInfo,
                            needsSigning: true,
                            };

                        updateExecutionSigningJob(activeScenarioId, updatedExecutionId, currentNode.id, {
                            transactionDetails,
                            extrinsic
                        });

                        console.log('Chain Tx Transaction Details:', transactionDetails);

                            // Wait for the signing to complete
                        await new Promise(resolve => {
                            const interval = setInterval(() => {
                            const updatedJob = useAppStore.getState().scenarios[activeScenarioId]?.executions[updatedExecutionId]?.[currentNode.id]?.signingJob;
                            if (updatedJob?.transactionDetails?.needsSigning === false) {
                                clearInterval(interval);
                                resolve();
                            }
                            }, 1000);
                        });
                        
                        const signedExtrinsic = useAppStore.getState().scenarios[activeScenarioId]?.executions[updatedExecutionId]?.[currentNode.id]?.signingJob?.signedExtrinsic
                        console.log('broadcasting transaction...', signedExtrinsic);
                        await broadcastTransaction(activeScenarioId, updatedExecutionId, currentNode.id, parsedFormData, signedExtrinsic);

                    } catch (error) {
                        console.error('Error executing Chain Tx:', error);
                        updateNodeResponseData(activeScenarioId, updatedExecutionId, currentNode.id, {
                            error: error.message,
                            status: 'error'
                        });
                    } finally {
                    }
                } else {
                    console.error('No executions found for the scenario');
                    return;
                }
            
                break;
            }
                await handleNodeViewport(instance, currentNode, 'hold', orderedList);
                await handleNodeViewport(instance, currentNode, 'zoomOut', orderedList);

                updateEdgeStyleForNode(currentNode.id, 'default_connected');
                setIsLoadingNode(currentNode.id, false);
                executionCycleFinished = index === orderedList.length - 1;

        }
       



        if (executionCycleFinished) {
            toast.success('Workflow Execution Completed! The execution cycle has finished.', { id: 'execution-finished' });
            setLoading(false); 
            setExecutionState('idle');

        }
        } catch (error) {
            console.error('An error occurred while executing the workflow:', error);
        } finally {
            console.log('Workflow Execution Prepared and Sent to Server...');
            // setNodes([...nodes]);
            executedIds.add(updatedExecutionId);
            toggleExecuteFlowScenario();
            setExecutionState('idle');
            setIsExecuting(false);
            console.log('Workflow Execution Prepared and set to idle and toggled...', executionState, toggleExecuteFlowScenario);
        }
    };

    const fetchMissingData = async (nodeId) => {
        try {
            const data = await ScenarioService.fetchMissingData(executionId);  // Using the executionId here
            // Handle the received data
            
            // Clear the timestamp for this nodeId so we don't keep fetching
            setLastReceived(prev => {
                const updated = { ...prev };
                delete updated[nodeId];
                return updated;
            });
            
        } catch (error) {
            console.error(`Failed to fetch missing data for node ${nodeId}`, error);
        }
    }

    async function stopExecution() {
      try {
        console.log('Stopping execution...');
          const response = await ScenarioService.stopExecution(executionId);
          console.log('Stopped execution:', response);
          setLoading(false);  // Reset to false when an error occurs

      } catch (error) {
          console.error('Error stopping the execution:', error);
          setLoading(false);  // Reset to false when an error occurs

      }
    }


    return { nodeContentMap, executeFlowScenario, stopExecution };

    async function broadcastTransaction(activeScenarioId, executionId, nodeId, formData, signedExtrinsic) {
        const sourceChain = formData?.actionData?.source?.chain || formData.selectedChain;
      
        try {
          console.log('Clearing signed extrinsic...');
          clearSignedExtrinsic(activeScenarioId, nodeId);
          await broadcastToChain(sourceChain, signedExtrinsic, {
            onInBlock: (blockHash) => {
            const evenData = {
                inBlock: blockHash
            }
              console.log(`Transaction included at blockHash: ${blockHash}`);
              toast.success(`Transaction included at blockHash: ${blockHash}`);
              updateNodeResponseData(activeScenarioId, executionId, nodeId, { evenData });
              console.log('[markExtrinsicAsUsed] first attempt to clear signed extrinsic...');
              markExtrinsicAsUsed(activeScenarioId, nodeId);
            },
            
            onFinalized: (blockHash) => {
                const eventData = {
                    finalized: blockHash
                }
              toast.success(`Transaction finalized at blockHash: ${blockHash}`);
              updateNodeResponseData(activeScenarioId, executionId, nodeId, { eventData });
            },
            onError: (error) => {
              toast.error(`Action execution failed: ${error.message}`);
              setLoading(false);
              updateNodeResponseData(activeScenarioId, executionId, nodeId, { error: error.message });
              console.log('Second attempt to clear signed extrinsic...');
            },
          });
      
        } catch (error) {
          // This catch block is for handling errors not caught by the onError callback, e.g., network issues
          toast.error(`Error broadcasting transaction: ${error.message}`);
          setLoading(false);
        }
        console.log('Third attempt to clear signed extrinsic...');
        console.log('Broadcasted to Chain:', signedExtrinsic);
        toast(<ActionToastContent type={formData?.actionData?.actionType || 'Chain Tx'} message={`Broadcasted to Chain: ${sourceChain}`} signedExtrinsic={signedExtrinsic} />);
      }



};




export default useExecuteFlowScenario;
