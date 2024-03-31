// @ts-nocheck
import React from 'react';
import { CloseIcon } from '../../Icons/icons.jsx';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import '../nodes.jsx';
import '../../../index.css';
import './Buttons.scss';
import { buttonDescriptions}  from './buttonDescriptions.jsx';

export const ClearButton = ({clearExtrinsic}) => {
    return (
        <Tippy  theme='light' placement='bottom'  interactive={true}  content={buttonDescriptions.newFlow}>
            <button 
                className="start-stop-create-button" 
                onClick={clearExtrinsic}
            >
            <CloseIcon />

            </button>
            
        </Tippy>
    );
}

export default ClearButton;

