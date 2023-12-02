import React, { useState } from 'react';
import '../Forms.scss';
import '../PopupForms/Popup.scss';

const CollapsibleField = ({ title, children, info }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="collapsible-field">
      {/* <button onClick={() => setIsOpen(!isOpen)}>...</button> */}
      {/* {isOpen && ( */}
        <>
        <h3>{title}</h3>
        {children}
          
          
          <div className="description">{info}</div>
        </>
      {/* )} */}
    </div>
  );
};

export default CollapsibleField;
