import React, { createContext, useState, useContext, useEffect } from 'react';

// Создаем контекст для пользователя
export const UserContext = createContext();  // Экспортируем UserContext

// Хук для использования контекста
export const useUser = () => {
  return useContext(UserContext);
};

// Провайдер контекста
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
