

## Parsing and processing Metadata Types

1. first the metadata is parsed by:

  `const lookupTypes = useMemo(() => {`

in ChainTxForm and ChainQueryForm

2. Then they are processed by `resolveFieldType()` in `parseMetadata.ts`. A path is generated as well as the required input fields in each nested object. 

3. Then they are rendered into fields through `renderMethodFields`

4. `fieldTypeObject` is passed into CollapsibleField which routes them to the correct switch statement. 
