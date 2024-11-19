import { createContext } from 'react';

interface ThemeContextType {
  theme: string;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export default ThemeContext;