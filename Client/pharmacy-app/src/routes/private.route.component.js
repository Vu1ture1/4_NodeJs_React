import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useUser } from '../hooks/user.hooks'; // Хук для доступа к информации о пользователе

// Компонент PrivateRoute, который защищает маршруты
const PrivateRoute = ({ component: Component, ...rest }) => {
  const { user } = useUser(); // Получаем текущего пользователя из контекста

  return (
    <Route
      {...rest}
      render={props =>
        user ? ( // Если пользователь авторизован, рендерим компонент
          <Component {...props} />
        ) : ( // Если нет, перенаправляем на страницу входа
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;
