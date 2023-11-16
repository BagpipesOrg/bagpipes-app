import React from 'react';
import { CreateUI, CreateUIBlack } from '../../Icons/icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { buttonDescriptions }  from './buttonDescriptions';
import './Buttons.scss';

export const CreateUiButton = ({ onCreateUi }) => {



  return (
    <Tippy theme='light'  content={
    <div className='bg-white m-4'>
      <div className='flex justify-between'>
    <h1 className="text-xl font-bold">Create UI</h1>

    <span className='h-7 w-7'><CreateUIBlack /></span>
    </div>
    <p>Create a UI for from the flow you built then share it with others.</p>
    <img className='' src='/bagpipe-UI.jpg'></img>
    </div>
    
    }>
    <button 
      className="start-stop-create-button" 
      onClick={onCreateUi} 
    >
<CreateUI />      
    </button>
    </Tippy>
  );
}

export default CreateUiButton;