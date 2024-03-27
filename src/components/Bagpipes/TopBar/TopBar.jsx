import React, { useEffect } from "react";
import { CreateUiButton, CreateButton, ExecuteButton, StartButton } from "../buttons";

import './TopBar.scss';  
import { useAppStore } from '../hooks';

const TopBar = ({ createScenario, handleExecuteFlowScenario, handleStartScenario, handleStopScenario, actionNodesPresent }) => {

    const { scenarios, activeScenarioId } = useAppStore(state => ({
        scenarios: state.scenarios,
        activeScenarioId: state.activeScenarioId,
    }));
    const extrinsicsSigned = checkAllExtrinsicsSigned(scenarios, activeScenarioId);

    const showExecuteButton = actionNodesPresent && extrinsicsSigned;
 
    return (
        <div className='top-bar'>
            <CreateUiButton />
            <CreateButton createScenario={createScenario} />
            {showExecuteButton ? (
                <ExecuteButton 
                    executeFlowScenario={handleExecuteFlowScenario} 
                    stopExecution={handleStopScenario}
                    actionNodesPresent={actionNodesPresent}
                />
            ) : (
                <StartButton startScenario={handleStartScenario} />
            )}
        </div>
    );
};


export default TopBar;


const checkAllExtrinsicsSigned = (scenarios, scenId) => {
    console.log(`[checkAllExtrinsicsSigned] Checking ta scenario: ${scenId}`);
    const scenario = scenarios[scenId];
    console.log(`[checkAllExtrinsicsSigned] Scenario:`, scenario);
    if (!scenario) {
        console.error(`[checkAllExtrinsicsSigned] Scenario with ID ${scenId} not found.`);
        return false;
    }
console.log(`[checkAllExtrinsicsSigned] about to check each node:`, scenId);
    for (const node of scenario.diagramData.nodes) {
        console.log(`[checkAllExtrinsicsSigned] inside a node:`, node);
        if (node.type === "action") {
            const signedExtrinsicExists = node.formData?.signedExtrinsic !== undefined && node.formData?.signedExtrinsic !== null;
            console.log(`[checkAllExtrinsicsSigned Node ID: ${node.id}, Type: ${node.type}] Signed Extrinsic Exists: ${signedExtrinsicExists}`, node.formData);

            if (!signedExtrinsicExists) {
                // Log for debugging
                console.log(`[checkAllExtrinsicsSigned Node ID: ${node.id}] needs signing but no valid signedExtrinsic found.`);
                return false; // An action node that needs signing does not have a valid signedExtrinsic
            }
        }
    }

    console.log(`[checkAllExtrinsicsSigned] All action extrinsics signed for scenario ${scenId}: true`);
    return true; // If the function reaches this point, all required extrinsics are considered signed
};



