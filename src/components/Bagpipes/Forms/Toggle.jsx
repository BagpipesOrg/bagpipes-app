import React, { useState } from 'react';


const Toggle = ({ title }) => {
  const [isToggled, setIsToggled] = useState(false);

  return (
    <div className='flex text-xxs items-center text-gray-500'>
      <input type="checkbox" checked={isToggled} onChange={() => setIsToggled(!isToggled)} />
      <label className='ml-2'>{title}</label>

    </div>
  );
};

export default Toggle;
