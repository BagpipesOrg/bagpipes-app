import React from 'react';
import CustomInput from './CustomInput';
import { Select } from 'antd';
import { VariantField, CompositeField, SequenceField} from './SubstrateMetadataFields';
import { resolveFieldType } from '../PopupForms/ChainForms/parseMetadata';

const { Option } = Select;

const RecursiveFieldRenderer = ({ resolvedFields, fieldObject, values, onChange, nodeId, pills, setPills, onPillsChange, fieldName }) => {
console.log('RecursiveFieldRenderer - onChange:', onChange);

    console.log('RecursiveFieldRenderer - fieldObject:', fieldObject);

    const fieldType = fieldObject.type;
    console.log('RecursiveFieldRenderer - fieldType:', fieldType);

    // const fieldName = fieldObject.name;

    const handleChange = (fieldName, newValue) => {
        const updatedValues = { ...values, [fieldName]: newValue };
        onChange(updatedValues);
    };


        // Check if the field should continue rendering deeper
        const shouldRenderChildren = (fieldType) => {
            // Add other conditions based on specific requirements
            return !['input', 'select', 'variant', 'sequence'].includes(fieldType);
        };
    

    switch (fieldType) {
        case 'input':
            console.log('RecursiveFieldRenderer - input:', fieldName);
            console.log('RecursiveFieldRenderer - input, values:', values);
            console.log('RecursiveFieldRenderer - input, values[fieldName]:', values?.[fieldName]);
            console.log('RecursiveFieldRenderer - input, fieldObject:', fieldObject);

            
            return (
                <CustomInput
                    key={fieldObject.typeName}
                    value={values?.[fieldObject.typeName] || ''}
                    onChange={(newValue) => handleChange(fieldObject.typeName, newValue)}
                    fieldKey={fieldObject.typeName}
                    onPillsChange={onPillsChange}
                    placeholder={`Enter ${fieldObject.typeName}`}
                    className='custom-input'
                    pills={pills}
                    setPills={setPills}
                    nodeId={nodeId}
                />
            );

            case 'variant':


                // console.log('RecursiveFieldRenderer - variant:', fieldObject);
                console.log('RecursiveFieldRenderer - variant values?.fieldName:', values?.[fieldName]);
                console.log('RecursiveFieldRenderer - variant values:', values.name);

                // console.log('RecursiveFieldRenderer - variant fieldName:', fieldName);
                
                const handleSelectChange = selectedValue => {
                    console.log('RecursiveFieldRenderer - variant handleSelectChange:', selectedValue);

                    const selectedVariant = fieldObject.variants.find(variant => variant.index === selectedValue);
                    console.log('RecursiveFieldRenderer - variant selectedVariant:', selectedVariant);
                    if (selectedVariant) {
                        const newValue = {
                            index: selectedVariant.index,
                            name: selectedVariant.name
                        };
                        console.log(`Selected Variant Change - New Value:`, newValue);
                        onChange(newValue); 
                    }
                };

                const renderAdditionalFields = () => {
                    const selectedVariant = fieldObject.variants.find(variant => variant.index === values[fieldName]?.index);
                    return selectedVariant ? selectedVariant.fields.map((field, index) => (
                        <RecursiveFieldRenderer
                            key={index}
                            fieldObject={field}
                            values={values[fieldName]?.fields || {}}
                            onChange={(newFieldValue) => {
                                const updatedFields = {...(values[fieldName]?.fields || {}), [field.name]: newFieldValue};
                                handleChange(fieldName, {...values[fieldName], fields: updatedFields});
                            }}
                            nodeId={nodeId}
                        />
                    )) : null;
                };

                return (
                    <>
                        <Select
                            value={values.name}
                            onChange={handleSelectChange}
                            className='w-full font-semibold custom-select'
                            getPopupContainer={trigger => trigger.parentNode}
                            placeholder="Select option"
                        >
                            {fieldObject.variants.map(variant => (
                                <Option key={variant.index} value={variant.index}>{variant.name}</Option>
                            ))}
                        </Select>
                        {/* Render additional fields here */}
                        <div>{renderAdditionalFields()}</div>
                    </>
                );

            

    
                // return (
                //     <VariantField
                //         key={fieldName}
                //         variants={fieldObject.variants}
                //         value={values?.[fieldName]}
                //         onChange={(selectedVariantIndex) => {
                //             const variants = fieldObject.variants;
                //             handleChange(fieldName, {
                //                 index: selectedVariantIndex,
                //                 name: variants.find(variant => variant.index === selectedVariantIndex).name,
                //                 type: variants.find(variant => variant.index === selectedVariantIndex).type
                //             });
                //         }}                        
                //         nodeId={nodeId}
                //         pills={pills}
                //         setPills={setPills}
                //         onPillsChange={onPillsChange}
                //     />
                // );

        case 'select':
            return (
                <Select
                    key={fieldName}
                    defaultValue={values?.[fieldName] || ''}
                    onChange={(newValue) => handleChange(fieldName, newValue)}
                    style={{ width: '100%' }}
                >
                    { fieldObject.options.map(option => (
                        <Option key={option.value} value={option.value}>{option.label}</Option>
                    ))}
                </Select>
            );

        


            case 'composite':
                console.log('RecursiveFieldRenderer - composite:', fieldObject);
                return (
                    <div className="composite-container">
                        {fieldObject.fields.map((subField, index) => (
                            <div key={index} className="composite-field">
                                <label>{subField.name || `Field ${index + 1}`}</label>
                                <RecursiveFieldRenderer
                                    fieldObject={subField}
                                    values={values[subField.name] || {}}
                                    onChange={(subFieldValue) => handleChange(subField.name, subFieldValue)}
                                    nodeId={nodeId}
                                    pills={pills}
                                    setPills={setPills}
                                    onPillsChange={onPillsChange}
                                />
                            </div>
                        ))}
                    </div>
                );


        
        case 'compositeField':
        case 'variantField':
            console.log('RecursiveFieldRenderer - variantField:', fieldObject);
            // Handle individual fields within a selected variant
            return (
                <RecursiveFieldRenderer
                    fieldObject={fieldObject.resolvedType}
                    values={values}
                    onChange={onChange}
                    nodeId={nodeId}
                />
            );


        case 'sequence':
     
        return shouldRenderChildren('sequence') && <SequenceField
  
                    key={fieldName}
                    items={values?.[fieldName] || []}
                    onChange={(newItems) => handleChange(fieldName, newItems)}
                    nodeId={nodeId}
                    pills={pills}
                    setPills={setPills}
                    onPillsChange={onPillsChange}
                />
      

        // case 'tuple':
        //     return (
        //         <TupleField
        //             key={fieldName}
        //             elements={ fieldObject.elements}
        //             values={values[fieldName] || []}
        //             onChange={(newValue) => handleChange(fieldName, newValue)}
        //             nodeId={nodeId}
        //             pills={pills}
        //             setPills={setPills}
        //             onPillsChange={onPillsChange}
        //         />
        //     );

        // case 'array':
        //     return (
        //         <ArrayField
        //             key={fieldName}
        //             elementType={ fieldObject.elementType}
        //             values={values[fieldName] || []}
        //             onChange={(newValue) => handleChange(fieldName, newValue)}
        //             nodeId={nodeId}
        //             pills={pills}
        //             setPills={setPills}
        //             onPillsChange={onPillsChange}
        //         />
        //     );

        default:
            return <div key={fieldName}>Unsupported field type: {fieldType}</div>;
    }
};

export default RecursiveFieldRenderer;
