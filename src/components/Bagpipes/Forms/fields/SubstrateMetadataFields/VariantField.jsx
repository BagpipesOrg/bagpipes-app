import React from 'react';
import { Select } from 'antd';
import FieldRenderer from '../../PopupForms/ChainForms/FieldRenderer';
import { resolveFieldTypeShallow } from '../../PopupForms/ChainForms/parseMetadata';
import CollapsibleField from '../CollapsibleField';

const { Option } = Select;

const VariantField = ({ value, onChange, variants, typesLookup, nodeId }) => {
    console.log('VariantField - variants:', variants);
    console.log('VariantField - value:', value);

    // Function to fetch and render additional fields based on the selected variant
    const getAdditionalFields = (selectedVariant) => {
        console.log('VariantField Fetching additional fields for:', selectedVariant);
        return selectedVariant.fields.map((field, index) => {
            const fieldType = resolveFieldTypeShallow(field.type, typesLookup);
            console.log(' VariantField Resolved field type:', fieldType);

            return (
              // <>test</>

              <CollapsibleField
                    key={index}
                    title={field.name || `Field ${index + 1}`}
                    fieldTypes={field.type}
                    value={field.value}
                    onChange={(newFieldValue) => { /* Handle field change logic */ }}
                    placeholder={`Enter ${field.name}`}
                    typesLookup={typesLookup}
                    nodeId={nodeId}
                />
               
            );
        });
    };

    // Handler for when a new option is selected in the dropdown
    const handleSelectChange = selectedValue => {
        console.log('VariantField - selectedValue:', selectedValue);
        const selectedVariant = variants.find(variant => variant.index === selectedValue);
        if (selectedVariant) {
            console.log('VariantField - selectedVariant:', selectedVariant);
            onChange(selectedValue); // Update the selected value in the parent component's state
        }
    };

    // Render additional fields if a value is selected
    const additionalFields = value ? getAdditionalFields(variants.find(variant => variant.index === value)) : null;
console.log('additionalFields:', additionalFields);
    return (
        <>
            <Select
                value={value}
                onChange={handleSelectChange}
                className='w-full font-semibold custom-select'
                getPopupContainer={trigger => trigger.parentNode}
                placeholder="Select option"
            >
                {variants.map(variant => (
                    <Option key={variant.index} value={variant.index}>{variant.name}</Option>
                ))}
            </Select>
            {/* Render additional fields here */}
            {additionalFields}
        </>
    );
};

export default VariantField;
