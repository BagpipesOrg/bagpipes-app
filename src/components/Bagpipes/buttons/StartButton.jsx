// @ts-nocheck
import React from 'react';
import { PlayIcon } from '../../Icons/icons';
import './Buttons.scss';

const StartButton = ({ draftTransactions }) => {
    return (
        <button 
        className="start-stop-create-button" 
        onClick={draftTransactions} 
            style={{ zIndex: 1000 }}
        >
            <PlayIcon />
            Draft
        </button>
    );
}

export default StartButton;