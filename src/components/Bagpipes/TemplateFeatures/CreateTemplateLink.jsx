import { useState, useEffect } from 'react';
import { useAppStore } from '../hooks';
import { compressString } from './compress';

const CreateTemplateLink = ({ scenarioId }) => {
  const { scenarios } = useAppStore((state) => ({
    scenarios: state.scenarios,
  }));
  const [templateLink, setTemplateLink] = useState('');

  const createLink = (diagramData) => {
    const encodedData = encodeURI(diagramData);
    console.log(`creating link to: /#/create/?diagramData=`, encodedData);
    return `${window.location.origin}/#/create/?diagramData=${encodedData}`;
  };

  const generateTemplateLink = async () => {
    try {
      if (scenarioId && scenarios && scenarios[scenarioId]) {
        console.log(`Diagram data:`, scenarios[scenarioId].diagramData.nodes);
        const compressedLink = await compressString(JSON.stringify(scenarios[scenarioId].diagramData.nodes));
        console.log(`compressed:`, compressedLink);
        const link = createLink(compressedLink);
        console.log(`link:`, link);
        setTemplateLink(link);
      } else {
        console.error('Scenarios not loaded or scenarioId is invalid.');
      }
    } catch (error) {
      console.error('Error generating template link:', error);
    }
  };

  useEffect(() => {
    generateTemplateLink();
  }, [scenarioId, scenarios]);

  return templateLink ? (
    <div className=''>
      <button
        className='flex items-center dndnode bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        onClick={() => navigator.clipboard.writeText(templateLink)}
      >
        Copy Link
      </button>
    </div>
  ) : null;
};

export default CreateTemplateLink;