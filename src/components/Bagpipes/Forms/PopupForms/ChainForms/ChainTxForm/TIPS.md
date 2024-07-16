# Tips

## 'undefined' issue
an object being wrapped in an 'undefined', is when the fieldName is undefined, so the object is created with name undefined. 

## Field Object and Resolved Fields

the fieldObject we pass into RecursiveFieldRenderer is the resolvedFields. resolvedFields is the fully nested object. This is too big to save in the formData (zustand). So we pass it and use the required parts of it to save to the zustand state. 

## Naming fields 

