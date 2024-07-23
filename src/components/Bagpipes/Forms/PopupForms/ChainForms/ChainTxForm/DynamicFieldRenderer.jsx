import React from 'react';  
import RecursiveFieldRenderer from '../../../fields/RecursiveFieldRenderer/RecursiveFieldRenderer';
import { CollapsibleField }  from '../../../fields';
import { generatePathKey } from '../../../fields/utils';


const DynamicFieldRenderer = ({ fieldObject, index, localResolvedFields, customContent, nodeId, formData, handleMethodFieldChange }) => {
    const resolvedField = localResolvedFields?.[index];
    console.log("resolvedField path", resolvedField);
    if (!resolvedField) {
        console.warn("Mismatch or missing data in localResolvedFields");
        return <div>Error or incomplete data.</div>;
    }

    return (
        <CollapsibleField
            title={`${fieldObject.name} <${fieldObject.typeName || resolvedField.typeName}>`}
            info={fieldObject?.docs || ''}
            customContent={customContent}
            hasToggle={true}
            nodeId={nodeId}
            placeholder={`Enter ${fieldObject.name}`}
        >
            <RecursiveFieldRenderer
                index={index}
                localResolvedFields={localResolvedFields}
                fieldName={resolvedField.name}
                fieldObject={resolvedField}
                formValues={formData.params[generatePathKey(resolvedField.path)] || {}}
                onChange={(newFieldValue) => handleMethodFieldChange(resolvedField.path, newFieldValue, resolvedField.type)}
                nodeId={nodeId}
                formData={formData}
          

        
            />
        </CollapsibleField>
    );
};

export default DynamicFieldRenderer;