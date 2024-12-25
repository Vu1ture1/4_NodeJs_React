import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone'; // Импортируем moment-timezone
import { useUser } from '../hooks/user.hooks'; // Импортируем хук для работы с контекстом

const DateTimeComponent = () => {
  const { user } = useUser(); // Получаем данные о пользователе из контекста
  const [userTimeZone, setUserTimeZone] = useState(''); // Для хранения тайм зоны пользователя
  const [userLocalTime, setUserLocalTime] = useState(''); // Время в тайм зоне пользователя
  const [utcTime, setUtcTime] = useState(''); // Время в UTC
  const [joke, setJoke] = useState(''); // Для хранения шутки
  const [lastUpdate, setLastUpdate] = useState(''); // Для хранения времени последнего обновления
  const [fact_number, setNumberFact] = useState('');

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }; 

  // Получаем шутку из API
  useEffect(() => {
    fetch(`http://numbersapi.com/${getRandomInt(0, 300)}/trivia`)
      .then(response => response.text()) // Используем .text(), так как ответ текстовый
      .then(data => {
        setNumberFact(data); // Сохраняем факт в состоянии
      })
      .catch(error => console.error('Ошибка при получении факта:', error));
  }, []);
  
  // Получаем шутку из API
  useEffect(() => {
    fetch('https://v2.jokeapi.dev/joke/Programming?type=single')
      .then(response => response.json())
      .then(data => {
        if (data.type === 'single') {
          setJoke(data.joke); // Сохраняем шутку в состоянии
        } else {
          setJoke(`${data.setup} - ${data.delivery}`); // Сохраняем шутку с двумя частями
        }
      })
      .catch(error => console.error('Ошибка при получении шутки:', error));
  }, []); // useEffect будет вызван один раз при монтировании компонента

  // Получаем тайм зону и время
  useEffect(() => {
    const userTZ = Intl.DateTimeFormat().resolvedOptions().timeZone; // Получаем тайм зону через браузер
    setUserTimeZone(userTZ);
    
    updateTimes(userTZ); // Обновляем время при загрузке компонента

    // Если у вас есть метки времени (например, createdAt и updatedAt в формате ISO 8601)
    const lastUpdateFromDB = `${user.last_update}`; // Пример времени из базы данных (в UTC)

    // Преобразуем время последнего обновления в локальное время
    const formattedLastUpdate = moment(lastUpdateFromDB).tz(userTZ).format('YYYY-MM-DD HH:mm:ss'); // Преобразуем в локальное время
    setLastUpdate(formattedLastUpdate);
  }, []);

  const updateTimes = (userTZ) => {
    const userTime = moment().tz(userTZ).format('YYYY-MM-DD HH:mm:ss'); // Время в тайм зоне пользователя
    const utc = moment.utc().format('YYYY-MM-DD HH:mm:ss'); // Время в UTC

    setUserLocalTime(userTime);
    setUtcTime(utc);
  };

  return (
    <div>
      <h3>Текущее время и шутка</h3>
      
      {user ? (
        <div>
          <h4>Информация о пользователе:</h4>
          <p>Имя пользователя: {user.username}</p>
          <p>Email: {user.email}</p>
          <p>Роль: {user.role}</p>
          <p>Адресс: {user.adress}</p>
          <p>Номер телефона: {user.phone_number}</p>
        </div>
      ) : (
        <p>Пользователь не авторизован</p>
      )}

      <p>Тайм зона пользователя: {userTimeZone}</p>
      <p>Текущее время в моей тайм зоне: {userLocalTime}</p>
      <p>Текущее время в UTC: {utcTime}</p>

      <p>Последний раз редактировался в БД: {lastUpdate}</p>
      
      <p>Шутка: {joke || 'Загрузка шутки...'}</p>

      <p>Факт о рандомном числе: {fact_number || 'Загрузка факта...'}</p>
    </div>
  );
};

export default DateTimeComponent;
