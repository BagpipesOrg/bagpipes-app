import React from 'react';
import { PlayIcon } from '../../Icons/icons'; // Ensure icons are imported correctly
import { useAppStore } from '../../../components/Bagpipes/hooks';
import './Buttons.scss';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const ExecuteButton = ({ executeFlowScenario, stopExecution, actionNodesPresent }) => {
    const { executionState } = useAppStore((state) => ({
        executionState: state.executionState,
    }));

    // Determine button class based on executionState and whether action nodes are present
    let buttonClass = "start-stop-create-button";
    if (executionState === 'idle' && actionNodesPresent) {
        buttonClass += ' idle-effects'; // Apply idle effects only if action nodes are present
    } else if (executionState === 'executing') {
        buttonClass += ' executing-effects'; // Apply executing effects regardless of action nodes
    }

    const getTooltipContent = () => {
        if (executionState === 'executing') {
            return 'Execution in progress. Click to stop.';
        } else if (actionNodesPresent) {
            return 'Click to start execution.';
        } else {
            return 'Click to run once.';
        }
    };

    const getButtonContent = () => {
        if (executionState === 'executing') {
            return <> Stop</>;
        } else if (actionNodesPresent) {
            return <><PlayIcon /><span className='ml-1'>Execute</span> </>;
        } else {
            return <><PlayIcon /><span className='ml-1'>Run Once</span> </>;
        }
    };

    const handleButtonClick = () => {
        if (executionState === 'executing') {
            stopExecution();
        } else {
            executeFlowScenario();
        }
    };

    return (
        <Tippy theme='light' interactive={true} content={getTooltipContent()}>
            <button 
                className={buttonClass} 
                style={{ zIndex: 1000 }}
                onClick={handleButtonClick}
            >
                {getButtonContent()}
            </button>
        </Tippy>
    );
};

export default ExecuteButton;
