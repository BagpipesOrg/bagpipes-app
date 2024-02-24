import React from "react";
import { CreateUiButton, CreateButton, ExecuteButton, StartButton } from "../buttons";

import './TopBar.scss';  
import { useAppStore } from '../hooks';

const TopBar = ({ createScenario, handleExecuteFlowScenario, handleStartScenario, actionNodesPresent }) => {
    // Determine if we need to show the ExecuteButton directly
    const showExecutionDirectly = !actionNodesPresent;

    return (
        <div className='top-bar'>
            <CreateUiButton />
            <CreateButton createScenario={createScenario} />
            {showExecutionDirectly ? (
                <ExecuteButton 
                    executeFlowScenario={handleExecuteFlowScenario} 
                    stopExecution={handleStartScenario} // Assuming handleStartScenario can be used to stop execution
                    actionNodesPresent={actionNodesPresent}
                />
            ) : (
                <StartButton startScenario={handleStartScenario} />
            )}
        </div>
    );
};


export default TopBar;