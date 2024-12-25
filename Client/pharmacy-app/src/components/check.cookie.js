import React, { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const App = () => {
  useEffect(() => {
    // Функция для извлечения куки по имени
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();  // Возвращаем значение куки
      return null;  // Если куки нет, возвращаем null
    };

    // Извлекаем токен из куки
    const token = getCookie('token');
    console.log('JWT Token:', token);

    if (token) {
      try {
        // Если токен существует, декодируем его
        const decoded = jwtDecode(token);
        console.log('Decoded JWT:', decoded);
        console.log('User email:', decoded.email);  // Извлекаем и выводим email из токена
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);  // Запускаем один раз при монтировании компонента

  return (
    <div>
      <h1>Welcome to the React App!</h1>
      {/* Другой ваш контент */}
    </div>
  );
};

export default App;
