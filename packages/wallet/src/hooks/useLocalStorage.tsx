import { useEffect, useState } from 'react';

export function useLocalStorage (
  key: string,
  initialValue = ''
): [string, (v: string) => void] {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window !== 'undefined') {
      const item = window.localStorage.getItem(key);
      try {
        return item ? JSON.parse(item) : initialValue;
      } catch (e) {
        return initialValue;
      }
    }
    return initialValue;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const item = window.localStorage.getItem(key);
      if (item) {
        try {
          setStoredValue(JSON.parse(item));
        } catch (e) {
          setStoredValue(initialValue);
        }
      }
    }
  }, [initialValue, key]);

  const setValue = (value: string) => {
    setStoredValue(value);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  };

  return [storedValue, setValue];
}
