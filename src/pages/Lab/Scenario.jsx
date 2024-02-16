import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppStore } from '../../components/Bagpipes/hooks';
import './Lab.scss';

function ScenarioInfo() {
  const navigate = useNavigate();
  const { scenarioId } = useParams();
  const [openExecutions, setOpenExecutions] = useState({});
  const [openNodeDetails, setOpenNodeDetails] = useState({});

  const { scenarios } = useAppStore((state) => ({
    scenarios: state.scenarios,
  }));

  const scenario = scenarios ? scenarios[scenarioId] : null;

  const toggleExecutionDropdown = (executionId) => {
    setOpenExecutions((prev) => ({
      ...prev,
      [executionId]: !prev[executionId],
    }));
  };

  const toggleNodeDetail = (executionId, nodeId) => {
    const key = `${executionId}-${nodeId}`;
    setOpenNodeDetails((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Function to render node-specific details based on nodeType
  const renderNodeDetails = (nodeData) => {
    switch (nodeData.nodeType) {
      case 'action':
        return (
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Block Hash</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {nodeData.responseData?.updates?.map((update, index) => (
                <React.Fragment key={index}>
                  {update.inBlock && (
                    <tr>
                      <td>In Block</td>
                      <td>{update.inBlock}</td>
                      <td>{update.timestamp}</td>
                    </tr>
                  )}
                  {update.finalized && (
                    <tr>
                      <td>Finalized</td>
                      <td>{update.finalized}</td>
                      <td>{update.timestamp}</td>
                    </tr>
                  )}
                  {update.error && (
                    <tr>
                      <td>Error</td>
                      <td colSpan="2">{update.error}</td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        );
      // Add cases for other node types with different data structures
      default:
        return <p>No execution details available for this node type.</p>;
    }
  };
  

  return (
    <div className="scenario-container main-font">
      <h1>Scenario {scenarioId}</h1>
      
      <h2>Executions</h2>
      {scenario && scenario.executions && Object.keys(scenario.executions).length > 0 ? (
        Object.entries(scenario.executions).map(([executionId, executionData]) => (
          <div key={executionId} className="execution-section">
            <button className="dropdown-button flex items-center" onClick={() => toggleExecutionDropdown(executionId)}>
              <span className='flex justify-center items-center m-2' style={{width: '20px'}}>
                {openExecutions[executionId] ? '-' : '+'}
              </span>
              <span>Execution {executionId}</span>
            </button>

            {openExecutions[executionId] && (
              <div>
                <table className="node-table">
                  <thead>
                    <tr>
                      <th>Node ID</th>
                      <th>Node Type</th>
                      <th>Timestamp</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(executionData).map(([nodeId, nodeData]) => (
                      <React.Fragment key={nodeId}>
                        <tr>
                          <td>{nodeId}</td>
                          <td>{nodeData.nodeType}</td>
                          <td>{nodeData.timestamp}</td>
                          <td>
                            <button className="node-detail-toggle" onClick={() => toggleNodeDetail(executionId, nodeId)}>
                              {openNodeDetails[`${executionId}-${nodeId}`] ? <span>-</span> : <span>+</span>}
                            </button>
                          </td>
                        </tr>
                        {openNodeDetails[`${executionId}-${nodeId}`] && (
                          <tr className="node-execution-details-row">
                            <td colSpan="4">
                              <div className="node-execution-details">
                                {renderNodeDetails(nodeData)}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No executions for this scenario yet.</p>
      )}
    </div>
  );
}

export default ScenarioInfo;
