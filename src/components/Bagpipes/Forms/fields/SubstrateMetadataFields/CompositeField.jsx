import React from 'react';
import CustomInput from '../CustomInput'; // Ensure CustomInput handles all interaction props.
import { Select } from 'antd';

const { Option } = Select;

const CompositeField = ({ fields, values, onChange, nodeId, pills, setPills, onPillsChange, onClick }) => {
  const handleChange = (fieldName, newValue) => {
    const updatedValues = { ...values, [fieldName]: newValue };
    onChange(updatedValues);
  };

  const renderField = (field) => {
    switch (field.type.type) { // Assuming 'type' can be an object with detailed type info
      case 'input':
        console.log('field type input')
        return (
          <CustomInput 
            key={field.name}
            value={values[field.name] || ''}
            onChange={(newValue) => handleChange(field.name, newValue)}
            fieldKey={field.name}
            onPillsChange={onPillsChange}
            onClick={onClick}
            placeholder={`Enter ${field.name}`}
            className='custom-input'
            pills={pills}
            setPills={setPills}
            nodeId={nodeId}
          />
        );

      case 'select':
        return (
          <Select
            key={field.name}
            defaultValue={values[field.name] || ''}
            onChange={(newValue) => handleChange(field.name, newValue)}
            style={{ width: '100%' }}
          >
            {field.type.options.map(option => (
              <Option key={option.value} value={option.value}>{option.label}</Option>
            ))}
          </Select>
        );

      case 'composite':
        return (
          <CompositeField
            key={field.name}
            fields={field.type.fields}
            values={values[field.name] || {}}
            onChange={(newValues) => handleChange(field.name, newValues)}
            nodeId={nodeId}
            pills={pills}
            setPills={setPills}
            onPillsChange={onPillsChange}
            handleInputClick={handleInputClick}
          />
        );
      
        case 'sequence':
          return (
            <SequenceField
              key={field.name}
              items={values[field.name] || []}
              onChange={(newItems) => handleChange(field.name, newItems)}
              nodeId={nodeId}
              pills={pills}
              setPills={setPills}
              onPillsChange={onPillsChange}
            />
          );

      default:
        return <div key={field.name}>Unsupported field type: {field.type.type}</div>;
    }
  };

  return (
    <div className="composite-container">
      {fields.map(field => (
        <div key={field.name} className="composite-field">
          <label>{field.name}</label>
          {renderField(field)}
        </div>
      ))}
    </div>
  );
};

export default CompositeField;
