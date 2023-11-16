// @ts-nocheck
import React from 'react';
import { DraftIcon } from '../../Icons/icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import './Buttons.scss';
import { buttonDescriptions}  from './buttonDescriptions';

const StartButton = ({ draftTransactions }) => {
    return (
        <Tippy theme='light' content={buttonDescriptions.draft}>
        <button 
        className="start-stop-create-button" 
        onClick={draftTransactions} 
            style={{ zIndex: 1000 }}
        >
            <DraftIcon />
            {/* Draft */}
        </button>
        </Tippy>
    );
}

export default StartButton;