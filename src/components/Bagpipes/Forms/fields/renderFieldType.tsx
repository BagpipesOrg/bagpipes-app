import React from 'react';
import CustomInput from './CustomInput';
import { Select } from 'antd';

export const renderFieldType = (subField: any, value: any, onChange: (fieldName: string, newValue: any) => void) => {
    switch (subField.type) {
        case 'input':
            return (
                <CustomInput 
                    value={value[subField.name] || ''}
                    onChange={(e) => onChange(subField.name, e.target.value)}
                    placeholder={`Enter ${subField.name}`}
                    className='custom-input'
                />
            );
        case 'select':
            return (
                <Select
                    value={value[subField.name] || ''}
                    onChange={(newValue) => onChange(subField.name, newValue)}
                    options={subField.options}
                    placeholder={`Select ${subField.name}`}
                />
            );
        // Add more cases for other types
        default:
            return <div>Unsupported field type</div>;
    }
};

