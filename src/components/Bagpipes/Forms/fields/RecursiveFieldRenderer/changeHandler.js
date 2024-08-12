import _ from 'lodash';

export const handleChange = (path, newValue, replace = false, type, formData) => {
    console.log(`handleChange - ${type} 2d. handleChange path, newValue, replace, type:`,{ path, newValue, replace, type });

   let updatedParams = { ...formData.params }; // Clone the existing params
   let currentValue = _.get(updatedParams, path, {});

    console.log(`handleChange - ${type} 2e. handleChange updatedParams before handleChange:`, updatedParams);
   if (replace) {
    console.log(`handleChange - ${type} 2f. replace true handleChange updatedParams before handleChange:`, {  updatedParams, path });
    // we need to make sure that we replace every single value in the object with the new value. but we need to use the path to know where to replace the value.
    _.set(updatedParams, path, newValue);
  
   } else {
       console.log(`handleChange - ${type}2f. handleChange updatedParams before handleChange:`, {  updatedParams, path });
       console.log(`handleChange - ${type}   2g. handleChange currentValue:`, currentValue);
        if (typeof currentValue !== 'object' && typeof newValue === 'object') {
         //   console.log(RecursiveFieldRenderer - ${type}  2h. handleChange currentValue:, currentValue);
        currentValue = {};
        }

        else if (type === 'composite') {
            console.log(`handleChange - ${type} 2i. handleChange we're in composite area... currentValue, newValue:`, { currentValue, newValue, path  });
            _.set(updatedParams, path, { ...currentValue, ...newValue });

        } else if (type === 'variant') {
            // For variants, you might want to replace the entire value or handle it differently
            _.set(updatedParams, path, newValue);
        } else if (type === 'input') {
            console.log(`handleChange - ${type} 2j. handleChange we're in input area... currentValue, newValue:`, { currentValue, newValue, path  });
            // For inputs, you might want to handle the value differently
            _.set(updatedParams, path, newValue);
            console.log(`handleChange - ${type} 2k. handleChange input updatedParams after handleChange:`, updatedParams, newValue, path);
        }
        // _.set(updatedParams, path, { ...currentValue, ...newValue });
   }
   return updatedParams;

};
