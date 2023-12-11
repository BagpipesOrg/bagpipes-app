import React, { createContext, useState, useContext } from 'react';

const TippyContext = createContext();

export const useTippy = () => useContext(TippyContext);

export const TippyProvider = ({ children }) => {
  const [tippyProps, setTippyProps] = useState({
    visible: false,
    position: { x: 100, y: 300 },
    nodeId: null
  });

  const showTippy = (contentType, nodeId, position, content) => {
    console.log('showTippy called with nodeId:', nodeId);


  
    setTippyProps({ visible: true, position, nodeId, content }); // Include the content
  };


  const hideTippy = () => {
    setTippyProps({ visible: false, position: { x: 0, y: 0 }, nodeId: null, reference: null });
  };

  return (
    <TippyContext.Provider value={{ tippyProps, showTippy, hideTippy }}>
      {children}
    </TippyContext.Provider>
  );
};


const PanelTippyContext = createContext();

export const usePanelTippy = () => useContext(PanelTippyContext);

export const PanelTippyProvider = ({ children }) => {
  const [panelTippyProps, setPanelTippyProps] = useState({
    visible: false,
    position: { x: 0, y: 0 },
    content: null
  });

  const showPanelTippy = (nodeId, position, content) => {
    setPanelTippyProps({ visible: true, position, content });
  };

  const hidePanelTippy = () => {
    setPanelTippyProps({ visible: false, position: { x: 0, y: 0 }, content: null });
  };

  return (
    <PanelTippyContext.Provider value={{ panelTippyProps, showPanelTippy, hidePanelTippy }}>
      {children}
    </PanelTippyContext.Provider>
  );
};

