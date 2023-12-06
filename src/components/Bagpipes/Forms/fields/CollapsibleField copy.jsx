import React, { useState, useEffect } from 'react';
import { Collapse, Input, Button, Select, Radio } from 'antd';
import Toggle from '../Toggle';
import ItemField from './ItemField'; // Assuming ItemField is in the same directory
import { CustomExpandIcon } from './CustomExpandIcon'; // Assuming CustomExpandIcon is in the same directory
import { PlusIcon } from '../../../Icons/icons';
import 'antd/dist/antd.css';
import './Fields.scss';


const { Option } = Select;


const CollapsibleField = ({ title, info, toggleTitle, hasToggle, selectOptions, selectRadioOptions }) => {
  const [isToggled, setIsToggled] = useState(false);
  const [items, setItems] = useState([]);

  const handleToggleChange = (toggled) => {
    setIsToggled(toggled);
  };

  const deleteItem = (itemToDelete) => {
    setItems(items.filter(item => item !== itemToDelete));
  };
 

  useEffect(() => {
    console.log('Toggled state is now:', isToggled);
  }, [isToggled]);

  const addItem = () => {
    setItems([...items, { key: '', value: '' }]);
  };

  const renderContent = () => {
    if (isToggled) {
      return <Input placeholder="Enter value" />;
    } else if (selectOptions) {
      return (
        <Select 
        className='w-full'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Select option">
          {selectOptions.map((option, index) => (
            <Option className='collapsable-select-option w-full' key={index} value={option.value}>{option.label}</Option>
          ))}
        </Select>
      );
    } else if (selectRadioOptions && selectRadioOptions.length > 0) {
      return (
        <Radio.Group defaultValue={selectRadioOptions[0].value} buttonStyle="solid">
          {selectRadioOptions.map((option, index) => (
            <Radio.Button key={index} value={option.value}>{option.label}</Radio.Button>
          ))}
        </Radio.Group>
      );
    } else if (selectRadioOptions && selectRadioOptions.length === 0)  {
      // Default to "Yes" and "No" radio buttons if selectRadioOptions is not provided or empty
      return (
        <Radio.Group defaultValue="no" buttonStyle="solid">
          <Radio.Button value="yes">Yes</Radio.Button>
          <Radio.Button value="no">No</Radio.Button>
        </Radio.Group>
      );
    } else {
      return (
        <div className='flex flex-col'>
          {items.map((item, index) => (
            <ItemField key={index} title={`Item ${index + 1}`} item={item} onDelete={() => deleteItem(item)}
            />
          ))}
          <div className='add-item flex items-center' onClick={addItem} type="primary">
          <PlusIcon className='bg-blue-500 mr-1' />
            Add item
            </div>
          <div className="description">{info}</div>
        </div>
      );
    }
  };


  const header = (
    <div className='flex justify-between items-center'>
      <div>{title}</div>
      
    </div>
  );

  return (

    <div className="collapsible-field-container relative">
    {hasToggle && (
      <div className="toggle-container mt-3 mr-2" style={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}>
        <Toggle title={toggleTitle} isToggled={isToggled} onToggleChange={handleToggleChange} />
      </div>
    )}

    <Collapse className="custom-collapse" accordion defaultActiveKey={['1']} expandIcon={({ isActive }) => CustomExpandIcon({ isActive })}>

      <Collapse.Panel header={header} key="1">
   
      <div className='flex justify-between'>
  
        {renderContent()}
        
        </div>
      </Collapse.Panel>
    </Collapse>
    </div>
  );
};

export default CollapsibleField;