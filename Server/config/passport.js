const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Конфигурация Google OAuth
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,  // URL callback, который указан в Google API Console
  },
  async (token, tokenSecret, profile, done) => {
    try {
      // profile содержит информацию о пользователе
      const user = {
        displayName: profile.displayName,
        email: profile.emails[0].value,
        id: profile.id
      };

      // Поверяем, есть ли такой пользователь в базе данных
      let existingUser = await User.findOne({ email: user.email });
      if (!existingUser) {
        existingUser = new User({
          username: user.displayName,
          email: user.email,
          role: 'user',
          password: null,
          cart: (await new Cart({ cart_items: [] }).save())._id
        });
        await existingUser.save();
      }

      // Возвращаем пользователя в функцию done()
      done(null, existingUser);
    } catch (err) {
      done(err);
    }
  }
));

// Сериализация и десериализация пользователей
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
