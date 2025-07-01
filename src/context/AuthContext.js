// filepath: /home/rcts/Music/app for my village/frontend/src/context/AuthContext.js
import { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));
  
    const login = (token) => {
      localStorage.setItem('token', token);
      setToken(token);
      setIsAuthenticated(true);
    };
  
    const logout = () => {
      localStorage.removeItem('token');
      setToken(null);
      setIsAuthenticated(false);
    };
  
    return (
      <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };

  export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  };
