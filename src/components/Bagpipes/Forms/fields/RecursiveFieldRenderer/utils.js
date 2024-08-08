
    import _ from 'lodash';
  
    export const initializeFormData = (selectedVariant, variantIndex, formData, fieldPath) => {
        console.log('RecursiveFieldRenderer - variant 2b. Initializing form data for variant at index:', { variantIndex, selectedVariant, formData });
    
        // Convert path to an object structure if needed or use existing structure
        const updatedParams = { ...formData.params };
        console.log('RecursiveFieldRenderer - variant 2bi. Updated params before initialization:', updatedParams);
        let initialValues = {};

        if (selectedVariant.fields && selectedVariant.fields.length > 0) {
            selectedVariant.fields.forEach(field => {

                const fieldPath = `${selectedVariant.name}.${field.name}`;
                const defaultValue = selectedVariant.name
                // const defaultValue = initializeDefaultValues(field.resolvedType, fieldPath);
                console.log('RecursiveFieldRenderer - variant 2bii. fieldPath, defaultValue:', fieldPath, defaultValue);
                // _.set(updatedParams, fieldPath, defaultValue); // Using lodash to handle nested path setting

                initialValues[field.name] = initializeDefaultValues(field, `${fieldPath}.${field.name}`); 
                
            });
            console.log('RecursiveFieldRenderer - variant 2biii. fieldPath, initialValues:', initialValues, fieldPath);

        }
    
        return updatedParams;
    };
    
    


    // const initializeFormData = (selectedVariant, variantPath) => {
    //     console.log('RecursiveFieldRenderer - initialize initializeFormData selectedVariant, variantPath:', selectedVariant, variantPath);
    //     const updatedParams = _.cloneDeep(formData.params); // Clone to prevent direct mutation

    //     // Clear out the old data at this path if necessary
    //     _.set(updatedParams, variantPath, {});

    //     if (selectedVariant.fields && selectedVariant.fields.length > 0) {
    //         selectedVariant.fields.forEach(field => {
    //             console.log('RecursiveFieldRenderer - initialize initializeFormData field:', field);
    //             const fieldPath = generatePath(variantPath, field.name, field.type);
    //             const defaultValue = initializeDefaultValues(field.resolvedType, fieldPath);
    //             _.set(updatedParams, fieldPath, defaultValue); // Set default or existing data
    //         });
    //     }

    //     saveNodeFormData(activeScenarioId, nodeId, {...formData, params: updatedParams});
    // };
    
    

  
    // Utility to recursively initialize default values based on type
    export  const initializeDefaultValues = (field, path, fromType = 'default') => {
        console.log('RecursiveFieldRenderer - initialize initializeDefaultValues, path:', field, path, fromType);
        let defaultValue;
        switch (field.type) {
            case 'variant':
                console.log('RecursiveFieldRenderer - initialize variant 2bi. initialize initializeDefaultValues variant:', path);
                // for varaint the default value is the first variant in the list
                const defaultVariant = field.variants[0];
                console.log('RecursiveFieldRenderer - initialize variant 2bi. Initializing default values for variant:', { path, defaultVariant, fromType });
    
                // if the variant has fields, initialize them, else if variant has no fields make the default variant name a string value of the defaultValue key 

                if (defaultVariant.fields.length === 0) {
                    console.log('RecursiveFieldRenderer - initialize variant 2bia. initializeDefaultValues variant defaultVariant.name:', defaultVariant.name);
                    defaultValue = defaultVariant.name;
                } else {
                    defaultValue = {
                        [defaultVariant.name]: {}
                    };

                     // Initialize each field in the default variant
                    defaultVariant.fields.forEach(subField => {
                        defaultValue[defaultVariant.name][subField.name] = initializeDefaultValues(subField.resolvedType, `${path}.${subField.name}`, 'variant');
                        console.log('RecursiveFieldRenderer - initialize variant initializeDefaultValues variant defaultValue:', defaultValue, `${path}.${subField.name}` );
                    });
                }
    
                break;

            case 'input':
                console.log('RecursiveFieldRenderer - initialize initializeDefaultValues input:', path);
                defaultValue = "0";
                break;

            case 'variantField':    
            case 'composite':
                console.log('RecursiveFieldRenderer - initialize composite 01 initializeDefaultValues composite:', { field, path, fromType });
                defaultValue = {};
                if (field.fields) {
                    console.log('RecursiveFieldRenderer - initialize composite 02 initializeDefaultValues composite field.fields:', field.fields, fromType);
                    field.fields.forEach(subField => {
                        // if subfield is a sequence then initialize it as an array
                        if (subField.resolvedType.type === 'sequence') {
                            defaultValue = [];
                            console.log('RecursiveFieldRenderer - initialize composite 03 sequence initializeDefaultValues composite defaultValue:', subField, defaultValue, `${path}.${subField.name}`, fromType);
                        } else {
                        defaultValue[subField.name] = initializeDefaultValues(subField.resolvedType, `${path}.${subField.name}`, 'composite');
                        console.log('RecursiveFieldRenderer - initialize composite 03 initializeDefaultValues composite defaultValue:', subField, defaultValue, `${path}.${subField.name}`, fromType);
                        }
                    });
                }
                break;

            case 'sequence':
                // sequence is an array of objects
                defaultValue = [];
                console.log('RecursiveFieldRenderer - initialize sequence initializeDefaultValues sequence:', path, defaultValue, field, fromType);

            break;
            default:
                // how can we enforce the switch statement to catch all cases?

                if (field.type === null || field.type === undefined || field.type === ""    ) {
                defaultValue = null; // Default fallback
                console.log('RecursiveFieldRenderer - initialize default initializeDefaultValues default:', path, defaultValue, field, fromType);
                } else {
                    console.log('RecursiveFieldRenderer - initialize default initializeDefaultValues should retry default:', field.type, path, field, 'retrying');
                    // initializeDefaultValues(field, path, 'retrying');
                }
        }
        return defaultValue;
    };


    export const generatePath = (base, segment, type, from) => {
        console.log(`RecursiveFieldRenderer -  ${type} 0. generatePath ${type} base, segment, type:`, base, segment, type, from);
    
        // If the segment is undefined or empty, decide how to handle based on the type
        if (segment === undefined || segment === null || segment === "") {
            console.log('Missing or empty segment', { base, segment, type });
            switch (type) {
                case 'input':
                    // For input, the path should not be modified; return base
                    return base;
                case 'sequence':
                case 'array':
                    // For sequences and arrays, append empty brackets to suggest possible dynamic addition later
                    return base ? `${base}[]` : "[]";
                case 'initialBase':
                    // For initialBase, if segment is empty, do not modify the base into an array
                    return base;
                default:
                    // For other types where segment is not relevant, return just the base
                    return base;
            }
        }
    
        // For cases where segment is not empty
        switch (type) {
            case 'composite':
            case 'variant':
            case 'variantField':
                // Standard handling using dot notation if base is present
                const result = base ? `${base}.${segment}` : segment;
                console.log(`RecursiveFieldRenderer -  ${type} 0a. generatePath composite result:`, result);
                return result;
            case 'input':
                // Input fields do not need modification of path; return base
                return base;
            case 'sequence':
            case 'array':
            case 'tuple':
                // Handle as an index into an array or tuple
                return `${base}[${segment}]`;
            case 'initialBase':
                // For initialBase, create an array notation only when base is provided
                const r = base ? `${base}[${segment}]` : `[${segment}]`;
                console.log(`RecursiveFieldRenderer -  ${type} 0b. generatePath initialBase r:`, r);
                return r;
            default:
                // Fallback for unexpected types
                return `${base}.${segment}`;
        }
    };



    export const handleChange = (path, newValue, replace = false, type, formData) => {
        console.log(`RecursiveFieldRenderer - ${type} 2d. handleChange path, newValue, replace, type:`,{ path, newValue, replace, type });

       let updatedParams = { ...formData.params }; // Clone the existing params
        console.log(`RecursiveFieldRenderer - ${type} 2e. handleChange updatedParams before handleChange:`, updatedParams);
       if (replace) {
        // we need to make sure that we replace every single value in the object with the new value. but we need to use the path to know where to replace the value.
        _.set(updatedParams, path, newValue);


        // saveNodeFormData(activeScenarioId, nodeId, { ...formData, params: updatedParams });
        //    _.set(updatedParams, path, newValue);
      
       } else {
           console.log(`RecursiveFieldRenderer - ${type}2f. handleChange updatedParams before handleChange:`, {  updatedParams, path });
            let currentValue = _.get(updatedParams, path, {});
           console.log(`RecursiveFieldRenderer - ${type}   2g. handleChange currentValue:`, currentValue);
            if (typeof currentValue !== 'object' && typeof newValue === 'object') {
             //   console.log(RecursiveFieldRenderer - ${type}  2h. handleChange currentValue:, currentValue);
            currentValue = {};
            }

            else if (type === 'composite') {
                console.log(`RecursiveFieldRenderer - ${type} 2i. handleChange we're in composite area... currentValue, newValue:`, { currentValue, newValue, path  });
                _.set(updatedParams, path, { ...currentValue, ...newValue });

            } else if (type === 'variant') {
                // For variants, you might want to replace the entire value or handle it differently
                _.set(updatedParams, path, newValue);
            } else if (type === 'input') {
                // For inputs, you might want to handle the value differently
                _.set(updatedParams, path, newValue);
            }
            // _.set(updatedParams, path, { ...currentValue, ...newValue });
        //  saveNodeFormData(activeScenarioId, nodeId, { ...formData, params: updatedParams });
       }
    };
    