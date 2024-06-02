// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { CloseIcon } from '../../Icons/icons.jsx';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import '../nodes.jsx';
import '../../../index.css';
import './Buttons.scss';
import { buttonDescriptions}  from './buttonDescriptions.jsx';
import { useAppStore } from '../hooks/index.js';
import { useNavigate } from 'react-router-dom';
import { deleteScenarioAsync } from '../../../store/AsyncHelpers';


import '../buttons/Buttons.scss';
import toast from 'react-hot-toast';

export const DeleteScenarioButton = ({ scenarioId}) => {
    const navigate = useNavigate();

    const { scenarios } = useAppStore((state) => ({
        scenarios: state.scenarios,
      }));    
      const [templateLink, setTemplateLink] = useState('');
      const [copied, setCopied] = useState(false);
    


      return (
        <Tippy theme='light' placement='bottom' interactive={true} content={buttonDescriptions.deleteScenarioButton}>
                        <button 
            className="close-button-right flex items-center"
            onClick={(e) => { e.stopPropagation(); deleteScenarioAsync(scenarioId); }}
            >
            <CloseIcon />
            </button>
        </Tippy>
    );
};

export default DeleteScenarioButton;

