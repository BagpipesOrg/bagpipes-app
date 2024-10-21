export function removeScssImports() {
  return {
    name: 'remove-scss-imports',
    transform(code, id) {
      if (id.endsWith('.ts') || id.endsWith('.tsx')) {
        console.log('Removing SCSS imports from', id);
        // Remove import statements that import .scss or .css files
        const transformedCode = code.replace(/import\s+.*?['"][^'"]+\.scss['"];?/g, '');
        console.log('Transformed code:', transformedCode);
        return {
          code: transformedCode,
          map: null,
        };
      }
      return null;
    },
  };
}