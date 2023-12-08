import React, { useState, useEffect } from 'react';
import { Collapse, Input, Button, Select, Radio } from 'antd';
import Toggle from '../Toggle';
import ItemField from './ItemField'; // Assuming ItemField is in the same directory
import { CustomExpandIcon } from './CustomExpandIcon'; // Assuming CustomExpandIcon is in the same directory
import { PlusIcon } from '../../../Icons/icons';
import { v4 as uuidv4 } from 'uuid';
import 'antd/dist/antd.css';
import './Fields.scss';


const { Option } = Select;


const CollapsibleField = ({ title, info, toggleTitle, hasToggle,fieldTypes, items, selectOptions=[], selectRadioOptions=[], children, value, onChange }) => {
  const [isToggled, setIsToggled] = useState(false);

  const handleToggleChange = (toggled) => {
    setIsToggled(toggled);
  };

  const deleteItem = (itemToDelete) => {
    setItems(items.filter(item => item !== itemToDelete));
  };

  const generateUniqueId = () => {
    // Generate a random number and truncate it to 5 digits
    const id = uuidv4().split('-')[0].substring(0, 4);
    const item = "item_";
    return item.concat(id);
  };
  
 

  useEffect(() => {
    console.log('Toggled state is now:', isToggled);
  }, [isToggled]);

  useEffect(() => {
  }, [items]);


  const renderContent = () => {
    // Handle the toggle condition
    if (isToggled) {
      return <Input placeholder="Enter value" />;
    }
  
    // Dynamic field type rendering based on the fieldType prop
    switch (fieldTypes) {
        case 'input':
          return (
            <Input 
              placeholder={info} 
              className='custom-input' 
              value={value}
              onChange={e => onChange(e.target.value)} // Updated
            />
          );
        case 'select':
          return (
            <Select
              onChange={value => onChange(value)}
              value={value} 
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
   
      const addItem = () => {
        const newItems = [...items, { key: '', value: '', id: generateUniqueId() }]; 
        onChange(newItems);
      };
    
    
      const deleteItem = (itemToDelete) => {
        const newItems = items.filter(item => item !== itemToDelete);
        onChange(newItems); // Update the parent component
      };
    
      const updateItem = (updatedItem) => {
        const newItems = items.map(item => item.id === updatedItem.id ? updatedItem : item);
        onChange(newItems);
      };
    

      return (
        <div className='flex flex-col'>
          {items.map((item, index) => (
            <ItemField
              key={item.id}              
              title={`${item.id}`}
              item={item}
              onDelete={() => deleteItem(item)}
              onItemChange={(updatedItem) => updateItem(updatedItem)}
              />
          ))}
          <button className='flex items-center text-gray-700 text-sm' onClick={addItem}>
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
    <div className='font-semibold text-sm text-gray-600 mt-1'>
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