import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../components/Bagpipes/hooks';
import Scenario from './Scenario';
import './Lab.scss';
import '../../index.css';
import '../../main.scss';
import { ExecutionIcon, PlusIcon, CloseIcon } from '../../components/Icons/icons';
import { deleteScenarioAsync, loadScenarioAsync, startPersistScenarioAsync } from '../../store/AsyncHelpers';
import CreateTemplateLink from '../../components/Bagpipes/TemplateFeatures/CreateTemplateLink';
import ScenarioService from '../../services/ScenarioService';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { useCreateScenario } from '../../components/Bagpipes/hooks/useCreateScenario';
import ThemeContext from '../../contexts/ThemeContext';
import Toggle from '../../components/Bagpipes/Forms/Toggle';
import { Button } from 'antd';
import { GenerateLinkButton, ExecutionsButton, DeleteScenarioButton, PersistScenarioToggle } from '../../components/Bagpipes/buttons';

function Lab() {
    const { scenarios, addScenario, setActiveScenarioId, activeScenarioId, setNodeContentMap, loadScenario } = useAppStore((state) => ({
        scenarios: state.scenarios,
        addScenario: state.addScenario,
        setActiveScenarioId: state.setActiveScenarioId,
        activeScenarioId: state.activeScenarioId,
        saveScenario: state.saveScenario,
        setNodeContentMap: state.setNodeContentMap,
        loadScenario: state.loadScenario,
    }));
    const navigate = useNavigate();
    const createScenario = useCreateScenario();
    const [templateScenarioId, setTemplateScenarioId] = useState(null);
    const { theme } = React.useContext(ThemeContext);
    const [persistedScenarios, setPersistedScenarios] = useState({});

    // useEffect(() => {
    //   // Load persisted scenarios from the store or an API
    // }, []);

    const handleToggleChange = async (scenarioId, checked) => {
      const persistFunction = checked ? startPersistScenarioAsync : stopPersistScenarioAsync;
      const success = await persistFunction(scenarioId, checked);
      if (success) {
        setPersistedScenarios({
          ...persistedScenarios,
          [scenarioId]: checked,
        });
      } else {
        console.error(`Error ${checked ? 'starting' : 'stopping'} persisting scenario state`);
      }
    };

    
    const editScenario = async (scenarioId) => {
      const loadSuccess = await loadScenarioAsync(scenarioId);
      
      if (loadSuccess) {
        console.log("[editScenario] active scenario id in edit scenario", activeScenarioId);
        loadScenario(scenarioId);
        setActiveScenarioId(scenarioId);


        navigate('/builder');
      } else {
        console.log("Scenario could not be loaded."); // Or some other error handling
        toast.error("Scenario could not be loaded."); // Or some other error handling

      }
    };
        
    return (
      <div className={`${theme} lab-container p-8 h-full`}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Scenarios</h1>
          <button 
            className="button bg-blue-500 flex items-center"
            onClick={createScenario}
          >
            <span className='mr-2'><PlusIcon className='' fillColor='white' /></span>Create New Scenario
          </button>
        </div>
        {templateScenarioId && <CreateTemplateLink scenarioId={templateScenarioId} />}
    
        <div>
          {Object.entries(scenarios).length > 0 ? (
            Object.entries(scenarios).map(([scenarioId, scenario]) => (
              scenario ? (
                <div key={scenarioId} className="scenario-card relative cursor-pointer" onClick={(e) => { e.stopPropagation(); editScenario(scenarioId); }}>
                  <div className="scenario-title">{scenario.name}</div>
                  <div className="scenario-details">
                    <div className="">Scenario {scenarioId} </div>
                    <GenerateLinkButton scenarioId={scenarioId} />
                    <PersistScenarioToggle scenarioId={scenarioId} isToggled={!!persistedScenarios[scenarioId]} onToggleChange={handleToggleChange} />                    
                    <ExecutionsButton scenarioId={scenarioId} />
                    <DeleteScenarioButton scenarioId={scenarioId} />
                  
                  </div>
                </div>
              ) : null
            ))
          ) : (
            <p>No scenarios available. Create a new one to get started. </p>
          )}
        </div>
      </div>
    );
          }
    export default Lab;
    