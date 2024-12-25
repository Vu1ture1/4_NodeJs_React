module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        role:{
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true,
            unique: true, // уникальность
            minlength: [3, 'Имя пользователя должно иметь минимум 3 символа']
          },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/\w+\@\w+\.\w+/, 'Введен неверный формат почты'] // проверка на email
        },
        password: {
            type: String,
            required: false,
            minlength: [6, 'Пароль пользователя должен иметь минимум 6 символов'] // минимальная длина пароля
        },
        adress: {
            type: String,
            required: false
        },
        phone_number: {
            type: String,
            required: false,
            match: [/^(\+375|8)\s?\(?((\d{2})|(\d{3}))\)?[\s-]?(\d{3})[\s-]?(\d{2})[\s-]?(\d{2})$/,'Введен неправильный формат номера телефона, правильный(+375 и 8)']
        },
        cart: { 
            type: mongoose.Schema.Types.ObjectId, ref: 'cart' 
        }
      },
      { timestamps: true }
    );
  
    // Переопределяем метод toJSON
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const User = mongoose.model("user", schema);
    return User;
  };  