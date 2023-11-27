import React, { useEffect } from 'react';
import NodeForm from '../NodeForm';
import { ChainNodeFormProps } from '../types';
import '../Forms.scss';

const ChainNodeForm: React.FC<ChainNodeFormProps> = ({ visible, nodeId, nodes, edges, onNodesChange, setModalNodeId, inputNodes, formState }) => {




    
    useEffect(() => {
        console.log('ChainNodeForm Node ID:', nodeId);
        console.log('ChainNodeForm Form State:', formState);
    }, [nodeId, formState]);

    useEffect(() => {
        console.log('ChainNodeForm Visible:', visible); // Log the visible prop
    }, [visible]);





    return (
        <div className="node-form main-font">
            <NodeForm
                visible={visible}
                nodeId={nodeId}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                setModalNodeId={setModalNodeId}
                inputNodes={inputNodes}
            />
            {/* Specific fields for ChainNodeForm */}
    
        </div>
    );
};

export default ChainNodeForm;

