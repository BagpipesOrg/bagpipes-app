import React, { useEffect, useState } from "react";
import { MenuIcon } from "../../Icons/icons";
import {
  CreateUiButton,
  ClearButton,
  CreateButton,
  ExecuteButton,
  StartButton,
  StopButton,
  GenerateLinkButton,
} from "../buttons";
import "./TopBar.scss";
import { useAppStore } from "../hooks";

const TopBar = ({
  createScenario,
  handleExecuteFlowScenario,
  handleStartScenario,
  handleStopScenario,
  draftingNodesPresent,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const {
    isExecuting,
    scenarios,
    activeScenarioId,
    clearSignedExtrinsic,
    markExtrinsicAsUsed,
  } = useAppStore((state) => ({
    isExecuting: state.isExecuting,
    scenarios: state.scenarios,
    activeScenarioId: state.activeScenarioId,
    clearSignedExtrinsic: state.clearSignedExtrinsic,
    markExtrinsicAsUsed: state.markExtrinsicAsUsed,
  }));
  const extrinsicsSigned = checkAllExtrinsicsSigned(scenarios, activeScenarioId);

  const showExecuteButton = draftingNodesPresent && extrinsicsSigned;

  const selectedNodeId = scenarios[activeScenarioId]?.selectedNodeId;

  const handleClearExtrinsic = () => {
    console.log(
      "[handleClearExtrinsic] Clearing extrinsic for scenario and nodeId:",
      activeScenarioId,
      selectedNodeId
    );
    clearSignedExtrinsic(activeScenarioId, selectedNodeId);
    markExtrinsicAsUsed(activeScenarioId, selectedNodeId);
  };

  return (
    <div className="top-bar">
      <div className="menu-buttons">
        <GenerateLinkButton scenarioId={activeScenarioId} />
        <CreateUiButton />
        <CreateButton createScenario={createScenario} />
      </div>

      <button className="burger-menu-icon" onClick={toggleMenu}>
        <MenuIcon className='h-7 w-7'fillColor="#000" />

      </button>

      {menuOpen && (
        <div className="menu">
          <GenerateLinkButton scenarioId={activeScenarioId} />
          <CreateUiButton />
          <CreateButton createScenario={createScenario} />
        </div>
      )}

      <div className="">
        {showExecuteButton ? (
          <>
            <ExecuteButton
              executeFlowScenario={handleExecuteFlowScenario}
              stopExecution={handleStopScenario}
              draftingNodesPresent={draftingNodesPresent}
            />
            <ClearButton clearExtrinsic={handleClearExtrinsic} />
          </>
        ) : isExecuting && !showExecuteButton ? (
          <StopButton stopScenario={handleStopScenario} />
        ) : (
          !showExecuteButton && <StartButton startScenario={handleStartScenario} />
        )}
      </div>
    </div>
  );
};

export default TopBar;

const checkAllExtrinsicsSigned = (scenarios, scenId) => {
  const scenario = scenarios[scenId];
  if (!scenario) {
    console.error(`[checkAllExtrinsicsSigned] Scenario with ID ${scenId} not found.`);
    return false;
  }

  for (const node of scenario.diagramData.nodes) {
    if (node.type === "action") {
      const isExtrinsicSignedAndUnused =
        node?.extrinsics?.signedExtrinsic !== undefined &&
        node?.extrinsics?.signedExtrinsic !== null &&
        !node?.extrinsics?.isUsed;

      if (!isExtrinsicSignedAndUnused) {
        return false;
      }
    }
  }

  return true;
};
