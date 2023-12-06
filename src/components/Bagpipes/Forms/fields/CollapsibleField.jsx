import React, { useState, useEffect } from 'react';
import { Collapse, Input, Button, Select, Radio } from 'antd';
import Toggle from '../Toggle';
import ItemField from './ItemField'; // Assuming ItemField is in the same directory
import { CustomExpandIcon } from './CustomExpandIcon'; // Assuming CustomExpandIcon is in the same directory
import { PlusIcon } from '../../../Icons/icons';
import 'antd/dist/antd.css';
import './Fields.scss';


const { Option } = Select;


const CollapsibleField = ({ title, info, toggleTitle, hasToggle,fieldTypes, selectOptions=[], selectRadioOptions=[],description, children, value, onChange }) => {
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
    // Handle the toggle condition
    if (isToggled) {
      return <Input placeholder="Enter value" />;
    }
  
    // Dynamic field type rendering based on the fieldType prop
    switch (fieldTypes) {
      case 'input':
        return <Input placeholder={info} className='custom-input'  />;
        case 'select':
          return (
            <Select
              onChange={value => onChange(value)} // Updated
              className='w-full'
              placeholder="Select option"
            >
              {selectOptions.map((option, index) => (
                <Option key={index} value={option.value}>{option.label}</Option>
              ))}
            </Select>
          );
      case 'radio':
        // Check if selectRadioOptions is provided, else default to Yes/No
        // if (selectRadioOptions && selectRadioOptions.length > 0) {
          return (
            <Radio.Group
            onChange={e => onChange(e.target.value)} // Add onChange handler
            value={value}
            buttonStyle="solid"
           
          >
            {selectRadioOptions && selectRadioOptions.length > 0 ? (
              selectRadioOptions.map((option, index) => (
                <Radio key={index} value={option.value}>{option.label}</Radio>
              ))
            ) : (
              <>
                <Radio value="yes">Yes</Radio>
                <Radio value="no">No</Radio>
              </>
            )}
          </Radio.Group>
          
          );
        
      case 'items':
        return (
          <div className='flex flex-col'>
            {items.map((item, index) => (
              <ItemField key={index} title={`Item ${index + 1}`} item={item} onDelete={() => deleteItem(item)} onItemChange={onChange} />
            ))}
            <button className='flex items-center text-gray-700 text-sm 'onClick={addItem}>
              <PlusIcon className='add-item-icon' />
              Add item
            </button>
          </div>
        );
      default:
        return <div className="description">{info}</div>; // Render description or null if no fieldType matches
    }
  };
  


  const header = (
    <div className='font-semibold text-sm text-gray-600'>
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
      {children}
      <div className='flex justify-between'>
       
  
        {renderContent()}
        
        </div>
        <div className='text-xxs text-gray-500 mt-3'>{info}</div>
      </Collapse.Panel>
    </Collapse>
    </div>
  );
};

export default CollapsibleField;