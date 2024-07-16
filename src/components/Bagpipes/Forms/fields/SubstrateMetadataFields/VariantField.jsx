import React from 'react';
import { Select } from 'antd';
import FieldRenderer from '../../PopupForms/ChainForms/FieldRenderer';
import { resolveFieldTypeShallow } from '../../PopupForms/ChainForms/parseMetadata';
import CollapsibleField from '../CollapsibleField';
import RecursiveFieldRenderer from '../RecursiveFieldRenderer/RecursiveFieldRenderer';

const { Option } = Select;

const VariantField = ({ value, onChange, variants, typesLookup, nodeId }) => {
  console.log('VariantField - variants:', variants);
  console.log('VariantField - value:', value);

  // Handler for when a new option is selected in the dropdown
  const handleSelectChange = selectedValue => {
    console.log('VariantField in select change - value:', value);

    const selectedVariant = variants.find(variant => variant.index === selectedValue);
    console.log('VariantField - selectedVariant:', selectedVariant);


      console.log('VariantField - selectedValue:', selectedValue);
      if (selectedVariant) {
        onChange({  // Ensure this is a valid dynamic key
                index: selectedValue,
                name: selectedVariant.name,
                // fields: selectedVariant.fields.map(field => ({
                //     name: field.name,
                //     typeId: field.typeId,
                //     type: field.type,
                //     resolvedType: {
                //         type: field.type,
                //         typeName: field.typeName || '',
                //     }
                // }))
            }
        );
      };
    }

    // Function to fetch and render additional fields based on the selected variant
    const getAdditionalFields = () => {
        const selectedVariant = variants.find(variant => variant.index === parseInt(value.index, 10));
        return selectedVariant ? selectedVariant.fields.map((field, index) => (
            <RecursiveFieldRenderer
                key={index}
                fieldObject={field}
                values={value.fields[field.name]} // Ensure this is managed based on field name
                onChange={(newFieldValue) => {
                    const updatedFields = {...value.fields, [field.name]: newFieldValue};
                    onChange({...value, fields: updatedFields});
                }}
                nodeId={nodeId}
            />
        )) : null;
    };

    // Render additional fields if a value is selected
    const selectedVariant = variants.find(variant => variant.index === parseInt(value, 10));
    const additionalFields = selectedVariant ? getAdditionalFields(selectedVariant) : null;

  return (
      <>
          <Select
              value={selectedVariant?.name}
              onChange={onChange}
              className='w-full font-semibold custom-select'
              getPopupContainer={trigger => trigger.parentNode}
              placeholder="Select option"
          >
              {variants.map(variant => (
                  <Option key={variant.index} value={variant.index}>{variant.name}</Option>
              ))}
          </Select>
          {/* Render additional fields here */}
          <div>{additionalFields}</div>
      </>
  );
};

export default VariantField;

