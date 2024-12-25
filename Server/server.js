const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session"); // Для хранения сессий
const db = require("./app/models");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = db.user;  // Подключаем модель пользователя
const Cart = db.cart; 
const app = express();

const { OAuth2Client } = require('google-auth-library');

// Создаем новый экземпляр OAuth2Client с вашим clientID
const client = new OAuth2Client('84953027650-pktgvcem4luki5kltbeqmjlhhf7v43bh.apps.googleusercontent.com');

// CORS настройки
app.use(cors({
  origin: 'http://localhost:3000',  // Разрешаем запросы только с этого домена
  credentials: true,  // Разрешаем отправку cookies
  methods: 'GET, POST, PUT, DELETE',  // Разрешаем нужные методы
  allowedHeaders: 'Content-Type, Authorization',  // Разрешаем нужные заголовки
}));

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

// Стандартные парсеры
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Подключение к базе данных
db.mongoose
  .connect(db.url)
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// Настройка сессии (это должно быть до Passport)
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
}));

passport.serializeUser((user, done) => {
  console.log('Serializing user:', user);  // Логируем для проверки
  done(null, user.userId);  // Сохраняем только _id пользователя, а не весь объект
});

passport.deserializeUser(async (userId, done) => {
  try {
    const user = await User.findById(userId);  // Находим пользователя по _id
    done(null, user);  // Передаем пользователя в сессию
  } catch (err) {
    done(err, null);  // Обработка ошибок
  }
});

passport.use(new GoogleStrategy({
  clientID: '84953027650-pktgvcem4luki5kltbeqmjlhhf7v43bh.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'http://localhost:8080/auth/google/callback',
},
async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
            const newCart = new Cart({
              cart_items: [],  // Пустая корзина
            });
            await newCart.save();  // Сохраняем корзину в базе данных
        
            // Теперь создаем нового пользователя и присваиваем ему корзину
            user = new User({
              username: payload.name,
              email: payload.email,
              role: 'user',
              adress: '',
              phone_number: '',
              cart: newCart._id,  // Присваиваем ID корзины
            });
            await user.save();
        }

        // Создание JWT
        const token = jwt.sign({ id: user._id, email: user.email, cart: user.cart, adress: user.adress, role: user.role, phone_number: user.phone_number, username: user.username, last_update: user.updatedAt }, 'your_jwt_secret', { expiresIn: '1h' });

        // Возвращаем только _id пользователя для сериализации в сессию
        return done(null, { userId: user._id, token });
    } catch (error) {
        return done(error, null);
    }
}));

// Инициализация Passport
app.use(passport.initialize());
app.use(passport.session());

// Маршрут для начала аутентификации через Google
app.get('/auth/google', passport.authenticate('google', {
  scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
}));

app.post('/auth/google/callback', async (req, res) => {
  const { token } = req.body;

  try {
    // Проверка и декодирование токена от Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '84953027650-pktgvcem4luki5kltbeqmjlhhf7v43bh.apps.googleusercontent.com',  // ваш clientID
    });

    const payload = ticket.getPayload();
    
    // Проверяем, существует ли пользователь с этим email в базе данных
    let user = await User.findOne({ email: payload.email });

    if (!user) {
      const newCart = new Cart({
        cart_items: [],  // Пустая корзина
      });
      await newCart.save();  // Сохраняем корзину в базе данных
  
      // Теперь создаем нового пользователя и присваиваем ему корзину
        user = new User({
        username: payload.name,
        email: payload.email,
        role: 'user',
        adress: '',
        phone_number: '',
        cart: newCart._id,  // Присваиваем ID корзины
      });
      await user.save();
  }

    // Создание JWT для сессии
    const jwtToken = jwt.sign(
      { id: user._id, email: user.email, cart: user.cart, adress: user.adress, role: user.role, phone_number: user.phone_number, username: user.username  },
      'your_jwt_secret',
      { expiresIn: '1h' }
    );

    // Отправляем JWT как cookie
    res.cookie('token', jwtToken, { secure: false, sameSite: 'Strict' });

    // Возвращаем успешный ответ
    res.status(200).json({ message: 'Authentication successful', token: jwtToken });
  } catch (error) {
    console.error('Error during Google login:', error);
    res.status(500).json({ message: 'Authentication failed' });
  }
});

// Регистрация
app.post('/api/register', async (req, res) => {
  const { username, email, password, phone_number, adress } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Пожалуйста, укажите все необходимые поля.' });
  }

  try {
    // Проверяем, существует ли пользователь с таким именем
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким именем уже существует.' });
    }

    // Проверяем, существует ли пользователь с таким email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует.' });
    }

    // Хешируем пароль
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newCart = new Cart({
      cart_items: [],  // Пустая корзина
    });
    await newCart.save();  // Сохраняем корзину в базе данных

    // Создаем нового пользователя
    const user = new User({
      username: username,
      email: email,
      password: hashedPassword,
      phone_number: phone_number,
      adress: adress,
      role: 'user',
      cart: newCart._id, 
    });

    // Сохраняем пользователя в базе данных
    await user.save();

    // Создание JWT токена
    const token = jwt.sign(
      { id: user._id, email: user.email, cart: user.cart, adress: user.adress, role: user.role, phone_number: user.phone_number, username: user.username, last_update: user.updatedAt },
      'your_jwt_secret',
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      secure: false,        
      sameSite: 'Strict',   
      maxAge: 3600000       
    });

    // Возвращаем ответ с токеном
    res.status(201).json({ message: 'Регистрация прошла успешно', token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Маршрут для логина
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Введите оба поля.' });
  }

  try {
    // Проверяем, существует ли пользователь с таким email
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: 'Неправильная почта или пароль.' });
    }

    // Сравниваем введенный пароль с хешированным паролем в базе данных
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Неправильная почта или пароль.' });
    }

    // Создание JWT токена
    const token = jwt.sign(
      { id: user._id, email: user.email, cart: user.cart, adress: user.adress, role: user.role, phone_number: user.phone_number, username: user.username, last_update: user.updatedAt },
      'your_jwt_secret',
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      secure: false,        
      sameSite: 'Strict',   
      maxAge: 3600000       
    });

    // Возвращаем ответ с токеном
    res.status(201).json({ message: 'Авторизация прошла успешно', token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Запуск сервера
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

require('./app/routes/department.routes')(app);
require('./app/routes/med.routes')(app);
require('./app/routes/user.routes')(app);

app.get('/', (req, res) => {
  res.send('API Server on Node.js and Express.');  // Ответ на GET запрос к корневому пути
});

