import React, { useState } from 'react';
import { getApiInstance } from 'chains-lib'; 

const ExtrinsicCountTester = ({ chainKey }) => {
  const [extrinsicCount, setExtrinsicCount] = useState('');
  const [error, setError] = useState('');

  const fetchExtrinsicCount = async () => {
    try {
      const api = await getApiInstance(chainKey);
      const count = await api.query.system.parentHash();
      setExtrinsicCount(count.toHuman()); 
      setError('');
      console.log("Extrinsic Count:", count.toHuman());
    } catch (err) {
      console.error("Error fetching extrinsic count:", err);
      setError(err.message || 'Failed to fetch extrinsic count');
    }
  };

  return (
    <div>
      <button onClick={fetchExtrinsicCount}>Fetch Extrinsic Count</button>
      <div>
        {extrinsicCount ? `Extrinsic Count: ${extrinsicCount}` : error ? <p>Error: {error}</p> : null}
      </div>
    </div>
  );
};

export default ExtrinsicCountTester;
