import react from 'react';

const VariantField = ({ value, onChange, options }) => {
    const handleSelectChange = value => {
      const selectedVariant = options.find(option => option.value === value);
      onChange(selectedVariant);
    };
  
    return (
      <Select defaultValue={value} onChange={handleSelectChange} style={{ width: '100%' }}>
        {options.map(option => (
          <Option key={option.value} value={option.value}>{option.label}</Option>
        ))}
      </Select>
    );
  };

  export default VariantField;