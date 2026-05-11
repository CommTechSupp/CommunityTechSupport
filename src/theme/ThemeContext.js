import React, { createContext, useContext, useState } from 'react';
import { darkTheme, lightTheme } from './themes';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(lightTheme);

  const toggleTheme = () => {
    setTheme((prev) =>
      prev.mode === 'light' ? darkTheme : lightTheme
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
