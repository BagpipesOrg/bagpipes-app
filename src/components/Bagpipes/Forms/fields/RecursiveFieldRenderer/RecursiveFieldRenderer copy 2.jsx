import React, { useState, useEffect } from 'react';
import CustomInput from '../CustomInput';
import { Select } from 'antd';
import { VariantField, CompositeField, SequenceField} from '../SubstrateMetadataFields';
import { resolveFieldType } from '../../PopupForms/ChainForms/parseMetadata';

import { generatePathKey } from '../utils';

import useTooltipClick  from '../../../../../contexts/tooltips/tooltipUtils/useTooltipClick';
import { usePanelTippy } from '../../../../../contexts/tooltips/TippyContext';
import '../../PopupForms/ChainForms/ChainTxForm/DynamicFieldRenderer';
import './RecursiveFieldRenderer.scss';

const { Option } = Select;
    // TODO 1: (DONE) CURRENT ISSUES: VARIANT AND THEN COMPOSITE FIELD RENDERS. HOWEVER VARIANT DOES NOT RENDER ANOTHER VARIANT FIELD COULD BE AN ISSUE WITH FORM VALUES 
    // TODO 2: (NOT NEEDED) None and Some (in AccountKey20) is an "Option". And option can be something that is included or not. If none then it is not included, if yes then it is included. 
    // TODO 3: (DONE) Also AccountKey20 looks like it is an array of 20 inputs of u8, so we need to add a condition in array. 
    // TODO 4: (DOING) Also when we select a variant field it can change the parent variant, this is probably because of non-unique keys. 

const RecursiveFieldRenderer = ({ fieldObject, formValues, onChange, nodeId, pills, setPills, onPillsChange, fieldName }) => {
    
    console.log(`RecursiveFieldRenderer - CYCLE CHECK fieldObject, formValues, fieldName, nodeId`, { fieldObject, formValues, fieldName, nodeId });

    // For the Panel Form... Notify that content has changed
    const { tippyPanelInstance } = usePanelTippy();
    const handleContentChange = () => {  if (tippyPanelInstance.current && tippyPanelInstance.current.popperInstance) { tippyPanelInstance.current.popperInstance.update(); } };
    const { handleInputClick } = useTooltipClick(nodeId, handleContentChange);

    const fieldType = fieldObject.type;

    const handleChange = (path, newValue, fieldType) => {
        const pathKey = generatePathKey(path);  // Convert the path array to a string key
        console.log('RecursiveFieldRenderer - handleChange about to change:', pathKey, newValue, fieldType);
    
        // Update the value at the path in the form's state
        const updatedValues = { ...formValues, [pathKey]: newValue };
        onChange(updatedValues, fieldType);
    };

    



    switch (fieldType) {
        case 'input':
            console.log('RecursiveFieldRenderer - input formValues,, fieldObject:', fieldName, formValues, fieldObject);   
            const inputPathKey = generatePathKey(fieldObject.path);     
            console.log('RecursiveFieldRenderer - input inputPathKey:', inputPathKey); 
            return (
                <div className='mt-2 mb-4'>
                    <label className='font-semibold'>{fieldName ? `input: ${fieldName || "input"} <${fieldObject.typeName}>` : `input: <${fieldObject.typeName}>`}</label>
                    <CustomInput
                        key={fieldObject.typeName}
                        value={formValues[inputPathKey] || ''} 
                        onChange={(newValue) => handleChange(fieldObject.path, newValue, 'fromInput')}
                        fieldKey={fieldObject.typeName}
                        onPillsChange={onPillsChange}
                        placeholder={`Enter ${fieldObject.typeName}`}
                        className='custom-input'
                        pills={pills}
                        setPills={setPills}
                        nodeId={nodeId}
                        onClick={handleInputClick} 
                    />
                </div>
            );


            
        
        case 'variant':
                console.log(`RecursiveFieldRenderer - handleChange about to change formValues variant:`,{ fieldObject, formValues});
                const variantPathKey = generatePathKey(fieldObject.path);
            
                const handleSelectChange = selectedValue => {
                    console.log('RecursiveFieldRenderer - variant handleSelectChange:', selectedValue);
                    const selectedVariant = fieldObject.variants.find(variant => variant.index === selectedValue);
                    if (selectedVariant) {
                        const newValue = { index: selectedVariant.index, name: selectedVariant.name };
                        const newPath = [...fieldObject.path, {id: selectedVariant.id, type: 'variant'}];
                        handleChange(newPath, newValue, 'fromVariant');  // Update path to include variant specifics
                    }
                };
                let fieldKey;
        return (
        
            <div className='variant-container'>
                <div className='variant-selector'>
                    <Select
                        value={formValues[variantPathKey]?.index}
                        onChange={handleSelectChange}
                        className='w-full font-semibold custom-select'
                        placeholder="Select option"
                        getPopupContainer={trigger => trigger.parentNode}
                    >
                        {fieldObject?.variants.map(variant => { 
                            console.log('RecursiveFieldRenderer - variant selection:', variant);
                        return(
                            <Option key={variant.index} value={variant.index}>{variant.name}</Option>
                        )})}
                    </Select>
                </div>

                {formValues[variantPathKey]?.index !== undefined && fieldObject.variants.find(variant => variant.index === formValues[variantPathKey].index)?.fields.map((field, index) => (
                console.log('RecursiveFieldRenderer - variant field new field, fieldName:', field, fieldName),
                fieldKey = generatePathKey([...fieldObject.path, { id: field.id, type: 'variantField' }]),
              <div className='variant-field' key={index}>
                <label className='font-semibold'>variant field: {`${field?.name} <${field?.resolvedType?.typeName}>`} </label>
                <RecursiveFieldRenderer
                    key={index}
                    fieldObject={field.resolvedType}
                    formValues={formValues[fieldKey] ? formValues[fieldName] : {}}
                    fieldName={field.name}
                    onChange={(newValue) => handleChange([...fieldObject.path, { id: field.id, type: 'variantField' }], newValue, 'fromVariantField')}
                    nodeId={nodeId}
                />
                variant
                </div>
            ))}

            </div>
        );

        


        case 'composite':

            const handleCompositeChange = (fieldName, subFieldValue) => {
                // Update only the part of `formValues` related to this `fieldName`
                const updatedValues = { ...formValues, [fieldName]: { ...formValues[fieldName], ...subFieldValue } };
                onChange(updatedValues);
            };
            console.log('RecursiveFieldRenderer - composite:', fieldObject);
            console.log('RecursiveFieldRenderer - composite formValues:', fieldName);
            return (
                <div className="composite-container">
                    {fieldObject.fields.map((field, index) => {
                        console.log('RecursiveFieldRenderer - mapped - composite field:', field, formValues);
                        return (
                        <>
                        <div key={index} className="composite-field">
                            <label className='font-semibold'>composite: {`${field?.name} <${field?.resolvedType?.typeName}>`} </label>
                            <RecursiveFieldRenderer
                                fieldObject={field}
                                formValues={formValues[field.name] || {}}
                                onChange={(subFieldValue) => { handleCompositeChange(field.name, subFieldValue,'fromComposite')}}
                                fieldName={field.name}
                                nodeId={nodeId}
                                pills={pills}
                                setPills={setPills}
                                onPillsChange={onPillsChange}
                            />
                        </div>
                        </>
                    )})}
                </div>
            );



        case 'compositeField':
            console.log('RecursiveFieldRenderer - compositeField fieldObject:', fieldObject);
            console.log('RecursiveFieldRenderer - compositeField formValues:', formValues);

            // Handle individual fields within a selected variant
            return (
                <>
                <div className='composite-field'> 
                <label className='font-semibold'>composite field: {fieldObject.name} </label>
                {fieldObject.resolvedType.type === 'input' && ( <span className=''> {`<${fieldObject.resolvedType.typeName}>`}</span> )}
                    
                    <div className=''> 
                        <RecursiveFieldRenderer
                            fieldObject={fieldObject.resolvedType}
                            formValues={formValues}
                            onChange={onChange}
                            nodeId={nodeId}
                            fieldName={fieldName}

                        />
                    </div>
                </div>
               
                </>
            );




        case 'sequence':

        console.log('RecursiveFieldRenderer - sequence:', fieldObject);
        

            const [items, setItems] = useState(formValues[fieldName] || []);
        
            const handleAddItem = () => {
                console.log('RecursiveFieldRenderer - sequence handleAddItem:', fieldObject);
                const newItem = {}; // Initialize according to elementType if needed
                setItems([...items, newItem]);
            };
        
            const handleRemoveItem = index => {
                setItems(items.filter((_, i) => i !== index));
            };
        
            const handleChangeItem = (index, newValue) => {
                const updatedItems = items.map((item, i) => i === index ? newValue : item);
                setItems(updatedItems);
            };
        
            return (
                <div className='sequence-container'>
                    <div className='add-remove-box'><button  className='sequence-button'  onClick={handleAddItem}><div className='add-button'>+</div> <label className=''>Add item </label></button></div>

                    {items.map((item, index) => (
                        <>
                        <label className='sequence-field-label'>{`${index}: <${fieldObject.typeName}>`} </label>

                        <div key={index} className='sequence-item'>
                            <RecursiveFieldRenderer
                                fieldObject={fieldObject.elementType}
                                formValues={item}
                                onChange={newValue => handleChangeItem(index, newValue)}
                                nodeId={nodeId}
                                fieldName={fieldName}
                            />
                        </div>
                        <div className='add-remove-box'> <button className='sequence-button' onClick={() => handleRemoveItem(index)}><div className='remove-button'>-</div><label className=''>Remove item </label></button></div>
                        </>
                    ))}
                </div>
            );
    
            // an array just displays other fields it doesnt really do changing, so maybe should just pass it through. The reason why i say this is because if i select a variant within an array, the formObject that is passed in, does not go into the nested object it just passes what is already there. Therefore the next fields are not rendered. 
            case 'array':
                console.log('RecursiveFieldRenderer - array:', fieldObject);
            
                const arrayPathKey = generatePathKey(fieldObject.path);
                const initialArrayItems = formValues[arrayPathKey] || Array.from({ length: fieldObject.length }, () => ({}));
                const [arrayItems, setArrayItems] = useState(initialArrayItems);
            
                // Effect to update arrayItems when the length changes
                useEffect(() => {
                    // Only reset arrayItems if the length actually changes to avoid unnecessary re-renders
                    if (arrayItems.length !== fieldObject.length) {
                        setArrayItems(Array.from({ length: fieldObject.length }, () => ({})));
                    }
                }, [fieldObject.length]); // Dependency on fieldObject.length
            
                // Handle change: propagate up instead of managing locally
                const handleChangeArrayItem = (index, newValue) => {
                    const updatedArrayItems = [...arrayItems];
                    updatedArrayItems[index] = newValue;
                    setArrayItems(updatedArrayItems);  // Update local state to trigger re-render
                    onChange({...formValues, [fieldName]: updatedArrayItems}); // Propagate changes up
                };
            
                return (
                    <div className='array-container'>
                        {arrayItems.map((item, index) => (
                            <div key={index} className='array-item'>
                                <label className='array-field-label'>{`${index}: <${fieldObject.elementType?.typeName}>`}</label>
                                <RecursiveFieldRenderer
                                    fieldObject={fieldObject.elementType}
                                    formValues={item}
                                    onChange={(newValue) => handleChangeArrayItem(index, newValue)}
                                    nodeId={nodeId}
                                />
                            </div>
                        ))}
                    </div>
                );

                case 'tuple':


                const tuplePathKey = generatePathKey(fieldObject.path);
                const initialTupleValues = formValues[tuplePathKey] || fieldObject.elements.map(() => ({}));
                const [tupleItems, setTupleItems] = useState(initialTupleValues);

                    const handleTupleChange = (index, newValue) => {
                        const itemPath = [...fieldObject.path, { id: `${fieldObject.id}-item-${index}`, type: 'tupleItem' }];

                        // Create a new copy of the tupleItems with updated value at the specified index
                        const updatedTupleItems = [...tupleItems];
                        updatedTupleItems[index] = newValue;
                        setTupleItems(updatedTupleItems);
                        onChange(itemPath, newValue);
                    };
                
                    console.log('RecursiveFieldRenderer - tuple:', fieldObject);
                    return (
                        <div className="tuple-container">
                            {fieldObject.elements.map((element, index) => {
                                return (
                                    <div key={index} className="tuple-item">
                                        <label className='font-semibold'>{`Element ${index}: <${element.resolvedType.typeName || element.type}>`}</label>
                                        <RecursiveFieldRenderer
                                            fieldObject={element.resolvedType}
                                            formValues={(formValues[fieldName] || [])[index]}
                                            onChange={(newValue) => handleTupleChange(index, newValue)}
                                            nodeId={nodeId}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    );
                
                case 'tupleElement':  // This case might be similar to how fields within composites are handled
                    console.log('RecursiveFieldRenderer - tupleElement:', fieldObject);
                    // Assume tuple elements behave similarly to fields, potentially wrapping additional logic or styling if needed
                    return (
                        <RecursiveFieldRenderer
                            fieldObject={fieldObject.resolvedType}
                            formValues={formValues}
                            onChange={onChange}
                            nodeId={nodeId}
                            fieldName={fieldName}
                            />
                        );
                

                        default:
                            console.log('RecursiveFieldRenderer - default:', fieldObject);
                            return <div key={fieldName}>Unsupported field type: {fieldType}</div>;
                    }
                };
                
            export default RecursiveFieldRenderer;

                // case 'tuple':

                // console.log('RecursiveFieldRenderer - tuple:', fieldObject);
            
                // // Initializing state for each tuple element if it's not already defined in formValues
                // const initialTupleValues = fieldObject.elements?.map((element, index) => formValues[fieldName] ? formValues[fieldName][index] : undefined);
                // const [tupleItems, setTupleItems] = useState(initialTupleValues);
            
                // const handleTupleItemChange = (index, newValue) => {
                //     console.log(`Changing tuple item at index ${index}:`, newValue);
                //     const updatedTupleItems = [...tupleItems];
                //     updatedTupleItems[index] = newValue;
                //     setTupleItems(updatedTupleItems);
            
                //     // Propagate the change up to the form's main state
                //     onChange({...formValues, [fieldName]: updatedTupleItems});
                // };
            
                // return (
                //     <div className='tuple-container'>
                //         {fieldObject.elements?.map((element, index) => (
                //             <div key={index} className='tuple-item'>
                //                 <label className='tuple-item-label'>{`Element ${index}: <${element.typeName || element.type}>`}</label>
                //                 <RecursiveFieldRenderer
                //                     fieldObject={element}
                //                     formValues={tupleItems[index]}
                //                     onChange={(newValue) => handleTupleItemChange(index, newValue)}
                //                     nodeId={nodeId}
                //                 />
                //             </div>
                //         ))}
                //     </div>
                // );


            
        

        
        
                    // const handleSelectChange = selectedValue => {
        //     console.log('RecursiveFieldRenderer - variant handleSelectChange:', selectedValue);
        //     const selectedVariant = fieldObject.variants.find(variant => variant.index === selectedValue);
        //     if (selectedVariant) {
        //         const newValue = { ...formValues, [fieldName]: {index: selectedVariant.index, name: selectedVariant.name} };
        //         console.log(`Selected Variant Change - New Value:`, newValue);
        //         onChange(newValue);  // This now sends an updated object that includes existing formValues with updates only applied to the current variant field
        //     }
        // };

       // const handleSelectChange = selectedValue => {
        //     console.log('RecursiveFieldRenderer - variant handleSelectChange:', selectedValue);

        //     const selectedVariant = fieldObject.variants.find(variant => variant.index === selectedValue);
        //     if (selectedVariant) {
        //         // Structure the new value to fit into the current formValues hierarchy
        //         const newValue = { ...formValues, [fieldName]: { index: selectedVariant.index, name: selectedVariant.name } };
        //         console.log(`Selected Variant Change - New Value:`, newValue);
        //         onChange(fieldName, newValue);
        //     }
        // };


                        
    //     case 'composite':
    // console.log('RecursiveFieldRenderer - composite:', fieldObject);
    // return (
    //     <div className="composite-container">
    //         {fieldObject.fields.map((field, index) => {
    //             const fieldValues = formValues[field.name] || {};
    //             return (
    //                 <div key={index} className="composite-field">
    //                     <label className='font-semibold'>composite: {field.name}</label>
    //                     <RecursiveFieldRenderer
    //                         fieldObject={field}
    //                         formValues={fieldValues}
    //                         fieldName={field.name}
    //                         onChange={(subFieldValue) => { 
    //                             const updatedValues = { ...formValues, [field.name]: subFieldValue };
    //                             onChange(updatedValues, 'fromComposite');
    //                         }}
    //                         nodeId={nodeId}
    //                     />
    //                 </div>
    //             );
    //         })}
    //     </div>
    // );





            // case 'variant':


            //     console.log('RecursiveFieldRenderer - variant:', fieldObject);
            //     console.log('RecursiveFieldRenderer - variant formValues:', formValues);

            //     // console.log('RecursiveFieldRenderer - variant fieldName:', fieldName);
                
            //     const handleSelectChange = selectedValue => {
            //         console.log('RecursiveFieldRenderer - variant handleSelectChange:', selectedValue);

            //         const selectedVariant = fieldObject.variants.find(variant => variant.index === selectedValue);
            //         console.log('RecursiveFieldRenderer - variant selectedVariant:', selectedVariant);
            //         if (selectedVariant) {
            //             const newValue = {
            //                 index: selectedVariant.index,
            //                 name: selectedVariant.name,
                  
            //             };
            //             console.log(`Selected Variant Change - New Value:`, newValue);
            //             onChange(newValue); 
            //         }
            //     };

            //     // Render fields of the selected variant
            //     const renderAdditionalFields = () => {
  

            //         console.log('RecursiveFieldRenderer - in renderAdditionalFields - formValues:', formValues);
            //         console.log('RecursiveFieldRenderer formValues field name:', fieldName);
            //         // const variantData = formValues;
            //         if (!formValues) return null;
            //         console.log('RecursiveFieldRenderer - renderAdditionalFields we are past the check mark, formValues', formValues);
                    
            //         const selectedVariant = fieldObject.variants.find(variant => variant.index === formValues.index);
            //         console.log('RecursiveFieldRenderer - renderAdditionalFields - selectedVariant :', selectedVariant);
            //         if (!selectedVariant) return null;
                    
            //         return selectedVariant.fields.map((field, index) => (
            //             console.log('RecursiveFieldRenderer - renderAdditionalFields - variants.field field:', field),
            //             console.log('RecursiveFieldRenderer - renderAdditionalFields - formValues field.name:', formValues[field.name]),

            //             console.log('RecursiveFieldRenderer - renderAdditionalFields - variants.field field.name:', field.name),
            //             console.log('RecursiveFieldRenderer - renderAdditionalFields - formValues inside the map:', formValues),

            //             <RecursiveFieldRenderer
            //                 key={index}
            //                 fieldObject={field}
            //                 formValues={formValues.name || {}}
            //                 onChange={(newValue) => handleChange(fieldName, newValue)}
            //                 nodeId={nodeId}
            //             />
            //         ));
            //     };
                
                

            //     return (
            //         <>variant
            //             <Select
            //                 value={formValues.name}
            //                 onChange={handleSelectChange}
            //                 className='w-full font-semibold custom-select'
            //                 getPopupContainer={trigger => trigger.parentNode}
            //                 placeholder="Select option"
            //             >
            //                 {fieldObject.variants.map(variant => (
            //                     <Option key={variant.index} value={variant.index}>{variant.name}</Option>
            //                 ))}
            //             </Select>
            //             {/* Render additional fields here */}
            //             <div>{renderAdditionalFields()}</div>
            //         </>
            //     );


            
        // case 'array':

        //     console.log('RecursiveFieldRenderer - array:', fieldObject);
        
        //     const [arrayItems, setArrayItems] = useState(formValues[fieldName] || []);
        
        //     const handleAddArrayItem = () => {
        //         if (fieldObject.length && arrayItems.length >= fieldObject.length) {
        //             console.log('RecursiveFieldRenderer - array limit reached:', fieldObject.length);
        //             return; // Prevent adding more items than the specified length
        //         }
        //         console.log('RecursiveFieldRenderer - array handleAddItem:', fieldObject);
        //         const newArrayItem = {}; // Initialize according to elementType if needed
        //         setArrayItems([...arrayItems, newArrayItem]);
        //     };
        
        //     const handleRemoveArrayItem = index => {
        //         setArrayItems(arrayItems.filter((_, i) => i !== index));
        //     };
        
        //     const handleChangeArrayItem = (index, newValue) => {
        //         const updatedArrayItems = arrayItems.map((item, i) => i === index ? newValue : item);
        //         setArrayItems(updatedArrayItems);
        //     };
        
        //     return (
        //         <div className='array-container'>
        //             <div className='add-remove-box'><button className='array-button' onClick={handleAddArrayItem} disabled={fieldObject.length && arrayItems.length >= fieldObject.length}><div className='add-button'>+</div> <label className=''>Add item</label></button></div>
        
        //             {arrayItems.map((item, index) => (
        //                 <>
        //                 <label className='array-field-label'>{`${index}: <${fieldObject.typeName}>`} </label>
        //                 <div key={index} className='array-item'>
        //                     <RecursiveFieldRenderer
        //                         fieldObject={fieldObject.elementType}
        //                         formValues={item}
        //                         onChange={newValue => handleChangeArrayItem(index, newValue)}
        //                         nodeId={nodeId}
        //                     />
        //                 </div>
        //                 <div className='add-remove-box'> <button className='array-button' onClick={() => handleRemoveArrayItem(index)}><div className='remove-button'>-</div><label className=''>Remove item </label></button></div>
        //                 </>
        //             ))}
        //         </div>
        //     );
        
        


