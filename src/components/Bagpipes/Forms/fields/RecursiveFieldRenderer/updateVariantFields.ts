import _ from 'lodash';
import { generatePath, initializeDefaultValues } from './utils';
import { handleChange } from './changeHandler';

export const updateVariantFields = (selectedVariant, fieldPath, formData) => {

    
    console.log('RecursiveFieldRenderer - variant 1b. check:', { fieldPath });

    const defaultName = selectedVariant.name;
    let updatedParams = {}; // Initialize the structure to hold updated variant data

    console.log('RecursiveFieldRenderer - variant 2b. selectedVariant, defaultName:', { defaultName, fieldPath });

    // 1. First we need to change the value of the variant field because we need to replace the existing variant with the selected one
    console.log('RecursiveFieldRenderer - variant 2b. selectedVariant:', selectedVariant);

    updatedParams = handleChange(fieldPath, defaultName, true, 'variant', formData);
  console.log('RecursiveFieldRenderer - variant 2b. updatedParams:', updatedParams);

    // The below is for the fields of the variant that has been selected.

    // Generate a path specific for this variant
    const variantPath = generatePath(fieldPath, defaultName, 'variant');

    // Initialize the subfields of the selected variant
    selectedVariant.fields.forEach(field => {
        const subFieldPath = generatePath(variantPath, field.name, 'variant');
        const initialValues = initializeDefaultValues(field.resolvedType, subFieldPath, 'fromVariant');

        console.log('RecursiveFieldRenderer - variant 2bi. field:', { field, subFieldPath, initialValues });

        // Update the formData with initial values for each subfield
        updatedParams = handleChange(subFieldPath, initialValues, true, 'variant', formData);
        // updatedParams[field.name] = initialValues; // Store updated values in the return object
    });

    console.log('RecursiveFieldRenderer - variant 2c. updatedVariantFields:', updatedParams);

    return updatedParams;

};

export default updateVariantFields;
