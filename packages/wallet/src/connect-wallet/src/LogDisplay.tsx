import React, { useEffect, useState } from 'react';
import { logger } from './logger'; // Adjust the path accordingly

const LogDisplay: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const updateLogs = (newLogs: string[]) => {
      setLogs([...newLogs]);
    };

    logger.subscribe(updateLogs);

    return () => {
      // Cleanup if necessary
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      width: '100%',
      maxHeight: '200px',
      overflowY: 'scroll',
      backgroundColor: '#f9f9f9',
      borderTop: '1px solid #ccc',
      padding: '10px',
      fontSize: '12px',
      zIndex: 1000
    }}>
      <strong>Debug Logs:</strong>
      {logs.map((message, index) => (
        <div key={index}>{message}</div>
      ))}
    </div>
  );
};

export default LogDisplay;
