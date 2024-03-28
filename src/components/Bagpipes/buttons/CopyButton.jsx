// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { CopyIcon } from '../../Icons/icons.jsx';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import '../nodes.jsx';
import '../../../index.css';
import './Buttons.scss';
import { buttonDescriptions}  from './buttonDescriptions.jsx';
import { useAppStore } from '../hooks';
import { compressString } from '../TemplateFeatures/compress';

// import { buttonDescriptions }  from './buttonDescriptions';
import '../buttons/Buttons.scss';
import toast from 'react-hot-toast';

export const CopyButton = ({scenarioId}) => {

    const { scenarios } = useAppStore((state) => ({
        scenarios: state.scenarios,
      }));    
      const [templateLink, setTemplateLink] = useState('');
      const [copied, setCopied] = useState(false);
    
      useEffect(() => {
        const fetchData = async () => {
          if (scenarioId && scenarios && scenarios[scenarioId]) {
            console.log(`TemplateLinkTopBarButton Diagram data:`, scenarios[scenarioId].diagramData);
    
            try {
              const compressed_link = await compressString(JSON.stringify(scenarios[scenarioId].diagramData));
              console.log(`compressed:`, compressed_link);
              const link = createLink(compressed_link);
              console.log(`link:`, link);
              setTemplateLink(link);
            } catch (error) {
              console.error('Error compressing or processing data:', error);
              // Handle error as needed
            }
          } else {
            console.error('Scenarios not loaded or scenarioId is invalid.');
          }
        };
    
        fetchData(); // Call the asynchronous function
    
      }, [scenarioId, scenarios]);
    
      
      const createLink = (diagramData) => {
        const encodedData = encodeURI(diagramData);// encodeURI(diagramData);
        console.log(`creating link to: /#/create/?diagramData=`, encodedData);
        return `${window.location.origin}/#/create/?diagramData=${encodedData}`;
      };
    
      const handleCopyToClipboard = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(templateLink)
          .then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          })
          .catch(err => {
            // This function is called if there was an error copying
            toast.error('Failed to copy!');
          });
      };
    
      useEffect(() => {
        if (copied) {
          toast.success(`Copied ${templateLink} to clipboard!}`);
        }
      }, [copied]);

    return (
        <Tippy  theme='light' placement='bottom'  interactive={true}  content={buttonDescriptions.copyLink}>
        <button 
        className="start-stop-create-button" 
        onClick={handleCopyToClipboard} 
        >
             
            <CopyIcon />
            {/* <span className='ml-2 '>New Flow</span> */}
 
        </button>
        </Tippy>
    );
}

export default CopyButton;

