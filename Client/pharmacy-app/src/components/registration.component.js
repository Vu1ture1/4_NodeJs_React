import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';  // Декодируем JWT токен
import { useUser } from '../hooks/user.hooks';  // Убедитесь, что вы импортируете useUser, а не UserContext
import "bootstrap/dist/css/bootstrap.min.css";
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';

const Register = () => {
    const { login } = useUser();  // Получаем метод login из контекста
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [redirect, setRedirect] = useState(false); 

    // Функция для отправки данных и обработки ответа
    const handleRegister = async (e) => {
        e.preventDefault();

        // Проверка, что все поля заполнены
        if (!username || !email || !password) {
        setError('Пожалуйста, заполните все обязательные поля.');
        return;
        }

        try {
        // Отправляем запрос на сервер для регистрации
        const response = await fetch('http://localhost:8080/api/register', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password, phone_number: phoneNumber, adress: address }),
        });

        const data = await response.json();

        // Проверяем успешность регистрации
        if (response.ok) {
            // Токен, который вернул сервер
            const token = data.token;

            // Декодируем JWT токен
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

            setError('');
            setSuccess('Регистрация прошла успешно!');

            login(userData);

            setRedirect(true);
        } else {
            // В случае ошибки
            setError(data.message || 'Ошибка регистрации');
            setSuccess('');
        }
        } catch (error) {
        console.error('Ошибка при отправке запроса:', error);
        setError('Ошибка при подключении к серверу.');
        setSuccess('');
        }
    };

    if (redirect) {
        return <Redirect to="/" />; 
    }

    return (
        <div className="container mt-5">
        <div className="row justify-content-center">
            <div className="col-md-5">
            <div className="card shadow-sm">
                <div className="card-body">
                <h2 className="text-center mb-4">Регистрация</h2>
                <form onSubmit={handleRegister}>
                    <div className="mb-3">
                    <div className="d-flex justify-content-center mb-3">
                        <input
                        type="text"
                        className="form-control"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ width: '400px' }}
                        placeholder="Введите ваше имя пользователя"
                        required
                        />
                    </div>
                    </div>
                    <div className="mb-3">
                    <div className="d-flex justify-content-center mb-3">
                        <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '400px' }}
                        placeholder="Введите ваш email"
                        required
                        />
                    </div>
                    </div>
                    <div className="mb-3">
                    <div className="d-flex justify-content-center mb-3">
                        <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '400px' }}
                        placeholder="Введите ваш пароль"
                        required
                        />
                    </div>
                    </div>
                    <div className="mb-3">
                    <div className="d-flex justify-content-center mb-3">
                        <input
                        type="text"
                        className="form-control"
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        style={{ width: '400px' }}
                        placeholder="Введите ваш номер телефона (необязательно)"
                        />
                    </div>
                    </div>
                    <div className="mb-3">
                    <div className="d-flex justify-content-center mb-3">
                        <input
                        type="text"
                        className="form-control"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        style={{ width: '400px' }}
                        placeholder="Введите ваш адрес (необязательно)"
                        />
                    </div>
                    </div>

                    {error && <p className="text-danger">{error}</p>}
                    {success && <p className="text-success">{success}</p>}

                    <div className="d-flex justify-content-center mb-3">
                    <button type="submit" className="btn btn-primary" style={{ width: '230px' }}>
                        Зарегистрироваться
                    </button>
                    </div>
                </form>

                </div>
            </div>
            </div>
        </div>
    </div>
);
};

export default Register;
