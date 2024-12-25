import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from './hooks/user.hooks';  

const NavBar = () => {
  const { user, logout } = useUser();

  const handleLogout = () => {
    logout();  // Вызываем функцию logout для выхода пользователя
  };

  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark">
            <Link to={"/departments"} className="navbar-brand" style={{ marginLeft: '10px' }}>
              Все отделы
            </Link>
            
            <div className="navbar-nav mr-auto">
                {user && user.role == 'admin' && (
                    <li className="nav-item">
                        <Link to={"/meds"} className="nav-link">CRUD медикаментов</Link>
                    </li>
                )}
                
                {user && user.role == 'admin' && (
                    <li className="nav-item">
                        <Link to={"/add"} className="nav-link">Добавить медикамент</Link>
                    </li>
                )}
                
                {!user && (
                    <li>
                        <Link className="nav-link" to="/login">Войти</Link>
                    </li>
                )}
                
                {user && (
                    <>
                        <li>
                            <Link className="nav-link" to="/cart">Корзина</Link>
                        </li>
                        <li>
                            <Link className="nav-link" to="/profile">Профиль</Link>
                        </li>
                        <li>
                            <button onClick={handleLogout} className="nav-link">
                                Выйти
                            </button>
                        </li>
                    </>
                )}
            </div>
    </nav>
  );
};

export default NavBar;
