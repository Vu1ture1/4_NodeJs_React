import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useUser } from '../hooks/user.hooks'; // Хук для доступа к информации о пользователе

// Компонент PublicRoute, который защищает публичные маршруты от авторизованных пользователей
const PublicRoute = ({ component: Component, restricted, ...rest }) => {
  const { user } = useUser(); // Получаем текущего пользователя из контекста

  return (
    <Route
      {...rest}
      render={props =>
        user && restricted ? ( // Если пользователь авторизован и маршрут ограничен, перенаправляем его на главную страницу
          <Redirect to="/" />
        ) : ( // Иначе рендерим компонент
          <Component {...props} />
        )
      }
    />
  );
};

export default PublicRoute;
