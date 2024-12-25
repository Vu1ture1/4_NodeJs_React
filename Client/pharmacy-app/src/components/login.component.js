import React, { Component } from 'react';
import { BrowserRouter as Router, Link } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleLoginButton from './login-google.component';
import "bootstrap/dist/css/bootstrap.min.css";
import './login.component.css';
import { Redirect } from 'react-router-dom';
import { UserContext } from '../hooks/user.hooks';  // Импортируем UserContext

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: '',
      emailValid: false,
      passwordValid: false,
      redirect: false,
    };
  }

  handleEmailChange = (e) => {
    const val = e.target.value;
    const valid = this.validateEmail(val);
    this.setState({ email: val, emailValid: valid });
  };

  handlePasswordChange = (e) => {
    const val = e.target.value;
    const valid = this.validatePassword(val);
    this.setState({ password: val, passwordValid: valid });
  };

  validatePassword(password) {
    return password.length >= 8; // Пароль должен быть не короче 8 символов
  }

  validateEmail(email) {
    const regex = /\w+\@\w+\.\w+/;
    return regex.test(email);
  }

  handleLogin = async (e, login) => {
    e.preventDefault();
    const { email, password, emailValid, passwordValid } = this.state;

    if (emailValid && passwordValid) {
      if (!email || !password) {
        this.setState({ error: 'Пожалуйста, заполните все поля.' });
        return;
      }

      try {
        const response = await fetch('http://localhost:8080/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          const token = data.token;
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

          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('token', token);

          // Вызываем login из контекста, чтобы обновить состояние пользователя
          login(userData);

          this.setState({ redirect: true });
        } else {
          this.setState({ error: data.message || 'Ошибка входа' });
        }
      } catch (error) {
        console.error('Ошибка при отправке запроса:', error);
        this.setState({ error: 'Ошибка при подключении к серверу.' });
      }
    } else {
      alert('Неправильный ввод почты или пароля.');
    }
  };

  render() {
    const { email, password, error, emailValid, passwordValid } = this.state;

    const passwordColor = this.state.passwordValid ? "green" : "red";
    const emailColor = this.state.emailValid ? "green" : "red";

    if (this.state.redirect) {
      return <Redirect to="/" />;
    }

    return (
      
      <UserContext.Consumer>
        {({ login }) => (
          <div className="container mt-5">
            <div className="row justify-content-center">
              <div className="col-md-5">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h2 className="text-center mb-4">Вход в аккаунт</h2>
                    <form onSubmit={(e) => this.handleLogin(e, login)}>
                      <div className="mb-3">
                        <div className="d-flex justify-content-center mb-3">
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={email}
                            onChange={this.handleEmailChange}
                            style={{ width: '400px', borderColor: emailColor }}
                            placeholder="Введите ваш email"
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
                            onChange={this.handlePasswordChange}
                            style={{ width: '400px', borderColor: passwordColor }}
                            placeholder="Введите ваш пароль"
                          />
                        </div>
                      </div>
                      {error && <p className="text-danger">{error}</p>}
                      <div className="d-flex justify-content-center mb-3">
                        <button type="submit" className="btn btn-primary" style={{ width: '230px' }}>
                          Войти
                        </button>
                      </div>
                    </form>

                    {/* Google OAuth Provider */}
                    <GoogleOAuthProvider clientId="84953027650-pktgvcem4luki5kltbeqmjlhhf7v43bh.apps.googleusercontent.com">
                      <div className="d-flex justify-content-center mb-3">
                        <GoogleLoginButton />
                      </div>
                    </GoogleOAuthProvider>

                    <div className="text-center mt-3">
                      <Link to="/registration" className="nav-link-no-ac">Нет аккаунта?</Link>  
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </UserContext.Consumer>
    );
  }
}

export default Login;
