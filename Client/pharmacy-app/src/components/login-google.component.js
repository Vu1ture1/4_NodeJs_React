import React, { useState, useContext } from 'react'; // Импортируем useState и useContext
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { UserContext } from '../hooks/user.hooks';  // Импортируем UserContext
import { useHistory } from 'react-router-dom';  // Используем useHistory для редиректа в React Router v5

const LoginGoogle = () => {
  const { login } = useContext(UserContext);  // Получаем функцию login из контекста
  const [redirect, setRedirect] = useState(false);  // Хук состояния для редиректа
  const history = useHistory();  // Для редиректа с использованием React Router v5

  const handleLoginSuccess = (response) => {
    // Если успешно вошли, response содержит Google токен
    const { credential } = response;

    // Отправляем полученный токен на сервер
    fetch('http://localhost:8080/auth/google/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: credential })  // отправляем Google токен
    })
      .then(res => res.json())
      .then(data => {
        console.log('Login successful:', data);
        document.cookie = `token=${data.token}; path=/; SameSite=Strict`;

        const token = data.token;

        try {
            // Используем jwt-decode для декодирования JWT
            const decodedToken = jwtDecode(token);

            console.log('Decoded JWT:', decodedToken);
            
            // Сохраняем данные из токена и сам токен в localStorage
            const userData = {
                id: decodedToken.id,
                email: decodedToken.email,
                role: decodedToken.role,
                phone_number: decodedToken.phone_number,
                cart: decodedToken.cart,
                adress: decodedToken.adress,
                username: decodedToken.username,
                last_update: decodedToken.last_update
            };

            // Сохраняем информацию о пользователе и токен в localStorage
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', token); // Сохраняем сам токен

            // Обновляем состояние пользователя через контекст
            login(userData);

            // Устанавливаем редирект в true
            setRedirect(true);
        } 
        catch (error) {
            console.error('Error decoding token:', error);
        }
      })      
      .catch(err => {
        console.error('Login failed:', err);
      });
  };

  const handleLoginFailure = (error) => {
    console.error('Login failed:', error);
  };

  // После изменения состояния redirect, мы делаем редирект
  if (redirect) {
    history.push('/');  // Используем history.push для редиректа на главную страницу
  }

  return (
    <div>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={handleLoginFailure}
      />
    </div>
  );
};

export default LoginGoogle;
