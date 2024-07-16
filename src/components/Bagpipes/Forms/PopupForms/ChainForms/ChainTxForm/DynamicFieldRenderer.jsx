import React from 'react';  
import RecursiveFieldRenderer from '../../../fields/RecursiveFieldRenderer/RecursiveFieldRenderer';
import { CollapsibleField }  from '../../../fields';

const DynamicFieldRenderer = ({ fieldObject, index, localResolvedFields, customContent, nodeId, formData, handleMethodFieldChange }) => {
    const resolvedField = localResolvedFields?.[index];
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
                fieldName={fieldObject.name}
                fieldObject={resolvedField}
                formValues={formData.params?.[fieldObject.name] || {}}
                onChange={(newFieldValue) => handleMethodFieldChange(fieldObject.name, newFieldValue, resolvedField.type)}
                nodeId={nodeId}
        
            />
        </CollapsibleField>
    );
};

export default DynamicFieldRenderer;