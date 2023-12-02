import React from "react";
import Toggle from "./Toggle";
import './Forms.scss';

const FormFooter = ({ submitButton = 'Ok', cancelTitle = 'Cancel', onSave, onClose, showToggle = true, toggleTitle = 'Advanced Settings' }) => {
  return (
    <div className="form-footer-container">
      <div className="toggle-container">
        {showToggle && <Toggle title={toggleTitle} />}
      </div>
      <div className="buttons-container">
        <button className='popup-form-cancel popup-form-buttons' type="button" onClick={onClose}>{cancelTitle}</button>
        <button className='popup-form-submit popup-form-buttons' type="submit" onClick={onSave}>{submitButton}</button>
      </div>
    </div>
  );
};

export default FormFooter;