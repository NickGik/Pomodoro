import { createContext, useState, useContext } from 'react';
import { ReactNode } from 'react';

const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} }); 

const useTheme = () => useContext(ThemeContext);

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, useTheme, ThemeProvider };