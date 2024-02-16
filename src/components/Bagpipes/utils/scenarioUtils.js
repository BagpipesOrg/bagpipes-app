// @ts-nocheck

import toast  from "react-hot-toast";


export function replacePlaceholders(text, nodeContents, validNodeIds=[]) {
    let newText = text;

    for (let nodeId in nodeContents) {
        const placeholder = `{${nodeId}}`;
        if (newText.includes(placeholder)) {
            newText = newText.replace(new RegExp(placeholder, 'g'), nodeContents[nodeId]);
        }
    }

    // Enhanced Error Handling
    const remainingPlaceholders = newText.match(/{([^{}]+)}/g);
    if (remainingPlaceholders) {
        const invalidPlaceholders = remainingPlaceholders.filter(placeholder => validNodeIds.includes(placeholder.slice(1, -1)));

        if (invalidPlaceholders.length > 0) {
            throw new Error(`Unable to replace placeholders: ${invalidPlaceholders.join(', ')}`);
        }
    }

    return newText;
}



export function validateDiagramData(diagramData) {
    console.log('Inside validateDiagramData');
    console.log('Nodes:', diagramData.nodes);
    console.log('Edges:', diagramData.edges);

    // Check if there are multiple starting nodes
    const startingNodes = diagramData.nodes.filter(
        node => !diagramData.edges.find(edge => edge.target === node.id)
    );

    if (startingNodes.length > 1) {
        throw new Error("There are multiple starting nodes. Please make sure there's only one starting point in the diagram.");
    }

    // Check for multiple ending nodes
    const endingNodes = diagramData.nodes.filter(
        node => !diagramData.edges.find(edge => edge.source === node.id)
    );

    if (endingNodes.length > 1) {
        throw new Error("There are multiple ending nodes. Please make sure there's only one ending point in the diagram.");
    }

    // TODO: check for circular references (This will need a more advanced algorithm)
    
    // TODO: check for multiple paths (Another advanced algorithm)

    // Ensure action nodes are not at the start or end
    if (startingNodes[0]?.type === 'action' || endingNodes[0]?.type === 'action') {
        toast.error("Scenarios cannot start or end with an action node.");
    }

    // Ensure that chain nodes or action nodes are not connected directly 
    diagramData.edges.forEach(edge => {
        const sourceType = diagramData.nodes.find(node => node.id === edge.source)?.type;
        const targetType = diagramData.nodes.find(node => node.id === edge.target)?.type;

        if ((sourceType === 'chain' && targetType === 'chain') || 
            (sourceType === 'action' && targetType === 'action')) {
            toast.error("Chain nodes or action nodes are connected to each other directly. They should be connected as ChainNode > ActionNode > ChainNode.");
            throw new Error("Chain nodes or action nodes are connected to each other directly. They should be connected as ChainNode > ActionNode > ChainNode.");
        }
    });

    // Additional validation checks can go here

    // Return diagramData if no issues found
    return diagramData;
}

export function processScenarioData(diagramData) {
    // Validate the data
    if (!Array.isArray(diagramData.nodes) || !Array.isArray(diagramData.edges)) {
        throw new Error('Invalid diagramData format');
    }

    let sortedNodes = [];
    let edges = [...diagramData.edges];
    let nodes = [...diagramData.nodes];

    // Assuming your flow always starts from a single node
    let currentNode = nodes.find(node => !edges.find(edge => edge.target === node.id));

    while (currentNode) {
        sortedNodes.push(currentNode);
        let outgoingEdge = edges.find(edge => edge.source === currentNode.id);
        
        // If there is no outgoingEdge, then currentNode is the last node in the flow.
        if (!outgoingEdge) {
            break;
        }

        currentNode = nodes.find(node => node.id === outgoingEdge.target);
    }

    // Return both sorted nodes and edges
    return { nodes: sortedNodes, edges };
}


export function parseAndReplacePillsInFormData(formData, executions) {
    const pillRegex = /<span[^>]*data-id="([^"]+)"[^>]*data-nodeindex="(\d+)"[^>]*>([^<]+)<\/span>/g;

    // Clone formData to avoid mutating the original object
    const parsedFormData = { ...formData };

    // Iterate over each field in formData
    for (const [key, value] of Object.entries(parsedFormData)) {
        if (typeof value === 'string') {
            parsedFormData[key] = value.replace(pillRegex, (match, dataId, nodeIndexStr, defaultValue) => {
                const nodeIndex = parseInt(nodeIndexStr, 10) - 1; // Adjust if your indexing is different
                const upstreamNodeIds = Object.keys(executions); // Assuming executions is an object keyed by node IDs
                if (nodeIndex < 0 || nodeIndex >= upstreamNodeIds.length) return defaultValue; // Out of bounds check
                
                const upstreamNodeId = upstreamNodeIds[nodeIndex];
                const upstreamNodeData = executions[upstreamNodeId];
                if (!upstreamNodeData || !upstreamNodeData.responseData) return defaultValue; 
                
                // Attempt to traverse the responseData based on dataId
                let actualValue = upstreamNodeData.responseData;
                for (const part of dataId.split('.')) {
                    actualValue = actualValue?.[part];
                    if (actualValue === undefined) return defaultValue; 
                }
                
                return typeof actualValue === 'object' ? JSON.stringify(actualValue) : actualValue;
            });
        }
        // For non-string fields, might need additional handling depending on your data structure
    }

    return parsedFormData;
}

