// @ts-nocheck
import React from 'react';
import { PlusIcon } from '../../Icons/icons';
import '../nodes.jsx';
import '../../../index.css';
import './Buttons.scss'

export const CreateButton = ({createScenario}) => {
    return (
        <button 
        className="start-stop-create-button ml-2" 
        onClick={createScenario} 
        >
            {PlusIcon}
            New Scenario
        </button>
    );
}

export default CreateButton;

