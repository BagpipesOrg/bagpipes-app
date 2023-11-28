import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppStore } from '../hooks';
import { v4 as uuidv4 } from 'uuid';
import { decompressString } from './compress';

const CreateFromTemplate = () => {
  const location = useLocation();

  const navigate = useNavigate();
  const { addScenario, setActiveScenarioId } = useAppStore((state) => ({
    addScenario: state.addScenario,
    setActiveScenarioId: state.setActiveScenarioId,
}));
 
useEffect(() => {
  // Extract the query parameter with the diagramData
  const params = new URLSearchParams(location.search);
 // const diagramDataString  = params.get('diagramData'); // validate me
 // const diagramDataStrings = params.get('diagramData');
  const rawSearchString = location.search.replace(/^\?/, '');  // read it raw instead, params.get auto formats the string
 // console.log('rawSearchString:', rawSearchString);
  const diagramDataString = rawSearchString.replace(/^diagramData=/, '');

 // const diagramDataString = diagramDataStrings.join('');

 // console.log(`diagramDataString:`, diagramDataString);
  if (diagramDataString) {
  //  console.log('CreateFromTemplate diagramDataString:', diagramDataString);

    const deco = decompressString(diagramDataString);
    const decodedData =  JSON.parse(deco);
    const newScenarioId = uuidv4();

    addScenario(newScenarioId, { diagramData: {nodes: decodedData, edges: []} });

    setActiveScenarioId(newScenarioId);
    console.log(`set active scenario id`);
    navigate('/builder'); // Navigate to the builder with the new scenario
  }
}, [location.search, addScenario, setActiveScenarioId, navigate]);

  // UI to show loading or success message

  return (
    <div>
      Creating your scenario from the template...
    </div>
  );
};

export default CreateFromTemplate;
