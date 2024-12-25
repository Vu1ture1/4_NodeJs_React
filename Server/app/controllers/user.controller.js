const db = require("../models");
const User = db.user;
const Cart = db.cart;
const Order = db.order;
const CartItem = db.cart_item;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Создание нового пользователя
exports.create = async (req, res) => {
    try {
        // Хешируем пароль перед сохранением
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Создаем новую корзину
        const newCart = new Cart({ cart_items: [] });
        const savedCart = await newCart.save();

        // Создаем нового пользователя с хешированным паролем и ссылкой на корзину
        const user = new User({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
            adress: req.body.adress,
            phone_number: req.body.phone_number,
            role: req.body.role,
            cart: savedCart._id
        });

        const savedUser = await user.save();
        res.send(savedUser); // Возвращаем результат
    } catch (err) {
        res.status(500).send({ message: err.message || "Ошибка при создании пользователя." });
    }
};

// Получение всех пользователей (с возможностью поиска и сортировки)
exports.findAll = async (req, res) => {
    try {
        const { role, sortBy, sortOrder = "asc" } = req.query;

        // Условие поиска
        const condition = role ? { role: role } : {};

        // Условие сортировки
        const sort = {};
        if (sortBy) sort[sortBy] = sortOrder === "desc" ? -1 : 1;

        // Выполняем поиск с условием и сортировкой
        const users = await User.find(condition).sort(sort);
        
        res.send(users); // Отправляем результат
    } catch (err) {
        res.status(500).send({ message: err.message || "Ошибка при получении пользователей." });
    }
};

// Получение одного пользователя по ID
exports.findOne = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate({
                path: "cart",
                populate: {
                    path: "cart_items",
                    populate: {
                        path: "med",
                        populate: {
                            path: "department"
                        }
                    }
                }
            }); // Подгружаем связанные данные

        if (!user) {
            return res.status(404).send({ message: `Пользователь с id=${req.params.id} не найден.` });
        }

        res.send(user); // Отправляем найденного пользователя
    } catch (err) {
        res.status(500).send({ message: err.message || `Ошибка при получении пользователя с id=${req.params.id}.` });
    }
};

// Обновление данных пользователя
exports.update = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); // runValidators применяет валидацию
        if (!updatedUser) {
            return res.status(404).send({ message: `Пользователь с id=${req.params.id} не найден.` });
        }
        res.send(updatedUser); // Отправляем обновленного пользователя
    } catch (err) {
        res.status(500).send({ message: err.message || `Ошибка при обновлении пользователя с id=${req.params.id}.` });
    }
};

// Удаление пользователя
exports.delete = async (req, res) => {
    try {
        const user = await User.findByIdAndRemove(req.params.id);
        if (!user) {
            return res.status(404).send({ message: `Пользователь с id=${req.params.id} не найден.` });
        }
        res.send({ message: "Пользователь успешно удален!" });
    } catch (err) {
        res.status(500).send({ message: err.message || `Ошибка при удалении пользователя с id=${req.params.id}.` });
    }
};

// Удаление всех пользователей
exports.deleteAll = async (req, res) => {
    try {
        const result = await User.deleteMany({});
        res.send({ message: `${result.deletedCount} пользователей успешно удалено!` });
    } catch (err) {
        res.status(500).send({ message: err.message || "Ошибка при удалении всех пользователей." });
    }
};

// exports.removeMedFromCart = async (req, res) => {
//     try {
//         console.log('Запрос на удаление товара:', req.params.userId, req.body.cartItemId);  // Логируем данные запроса
//         const userId = req.params.userId;  // ID пользователя
//         const cartItemId = req.body.cartItemId;  // ID cart_item для удаления

//         const user = await User.findById(userId).populate('cart');
//         if (!user) {
//             return res.status(404).send({ message: `Пользователь с id=${userId} не найден.` });
//         }

//         const cart = await Cart.findById(user.cart).populate('cart_items');
//         if (!cart) {
//             return res.status(404).send({ message: `Корзина для пользователя с id=${userId} не найдена.` });
//         }

//         const cartItem = cart.cart_items.find(item => item._id.toString() === cartItemId);
//         if (!cartItem) {
//             return res.status(404).send({ message: `CartItem с id=${cartItemId} не найден в корзине.` });
//         }

//         cart.cart_items = cart.cart_items.filter(item => item._id.toString() !== cartItemId);

//         await CartItem.findByIdAndDelete(cartItemId);

//         await cart.save();

//         return res.send({ message: "Товар успешно удален из корзины" });
//     } catch (err) {
//         console.error('Ошибка при удалении товара:', err);
//         res.status(500).send({ message: "Ошибка на сервере. Попробуйте позже." });
//     }
// };
exports.removeMedFromCart = async (req, res) => {
    try {
        console.log('Запрос на удаление товара:', req.params.userId, req.body.cartItemId);  // Логируем данные запроса
        const userId = req.params.userId;  // ID пользователя
        const cartItemId = req.body.cartItemId;  // ID cart_item для удаления

        // Находим пользователя и его корзину
        const user = await User.findById(userId).populate('cart');
        if (!user) {
            return res.status(404).send({ message: `Пользователь с id=${userId} не найден.` });
        }

        const cart = await Cart.findById(user.cart).populate('cart_items');
        if (!cart) {
            return res.status(404).send({ message: `Корзина для пользователя с id=${userId} не найдена.` });
        }

        // Находим нужный cart_item
        const cartItem = cart.cart_items.find(item => item._id.toString() === cartItemId);
        if (!cartItem) {
            return res.status(404).send({ message: `CartItem с id=${cartItemId} не найден в корзине.` });
        }

        // Если количество товара больше 1, уменьшаем его на 1
        if (cartItem.count > 1) {
            cartItem.count -= 1;
            await cartItem.save();  // Сохраняем изменения
            return res.send({ message: "Количество товара уменьшено на 1" });
        } else {
            // Если количество товара 1 или меньше, удаляем его из корзины
            cart.cart_items = cart.cart_items.filter(item => item._id.toString() !== cartItemId);
            await CartItem.findByIdAndDelete(cartItemId);  // Удаляем сам cart_item

            await cart.save();  // Сохраняем изменения в корзине
            return res.send({ message: "Товар успешно удален из корзины" });
        }
    } catch (err) {
        console.error('Ошибка при удалении товара:', err);
        res.status(500).send({ message: "Ошибка на сервере. Попробуйте позже." });
    }
};

exports.createOrderFromCart = async (req, res) => {
    try {
        const userId = req.params.id; // Получаем ID пользователя из параметров запроса
        
        // Находим пользователя и подгружаем его корзину с элементами корзины
        const user = await User.findById(userId).populate({
            path: "cart",
            populate: {
                path: "cart_items",
                populate: {
                    path: "med"  // Подгружаем медикаменты в корзине
                }
            }
        });

        if (!user) {
            return res.status(404).send({ message: `Пользователь с id=${userId} не найден.` });
        }

        // Получаем все элементы из корзины
        const cartItems = user.cart.cart_items;
        if (cartItems.length === 0) {
            return res.status(400).send({ message: "В корзине нет товаров для оформления заказа." });
        }

        // Вычисляем итоговую стоимость заказа
        let totalAmount = 0;
        cartItems.forEach(item => {
            totalAmount += item.count * item.med.price; // Умножаем количество на цену медикамента
        });

        // Создаем новый заказ
        const newOrder = new Order({
            user: userId,
            meds: cartItems.map(item => item.med._id), // Массив с ID медикаментов из корзины
            total: totalAmount
        });

        // Сохраняем заказ в базе данных
        const savedOrder = await newOrder.save();

        // Очистить корзину пользователя (по желанию)
        user.cart.cart_items = [];
        await user.cart.save();

        // Отправляем успешный ответ
        res.send({ message: "Заказ успешно создан!", order: savedOrder });
    } catch (err) {
        res.status(500).send({ message: err.message || "Ошибка при создании заказа." });
    }
};

exports.addMedToCart = async (req, res) => {
    try {
        const userId = req.params.id;
        const medId = req.body.medId;
        const count = 1; // Количество (по умолчанию 1)

        // Найти пользователя
        const user = await User.findById(userId).populate("cart");
        if (!user) {
            return res.status(404).send({ message: `Пользователь с id=${userId} не найден.` });
        }

        let cart;
        // Загружаем существующую корзину
        cart = await Cart.findById(user.cart).populate({
            path: "cart_items",
            populate: {
                path: "med",
                model: "med", // Указываем модель, с которой связывается cart_item (если модель называется "med")
                select: "_id" // Здесь можно указать, какие поля медикамента вам нужны. Например, название, цена, описание.
            }
        });        

        // Проверяем, существует ли Cart_item с данным med
        //let cartItem = cart.cart_items.find(item => item.med.toString() === medId);
        
        console.log(cart);
        let cartItem = cart.cart_items.find(item => item.med._id.toString() === medId.toString());

        if (cartItem) 
        {
            // Если существует, увеличиваем count
            cartItem.count += count;
            await cartItem.save();
        } 
        else 
        {
            // Если нет, создаем новый Cart_item
            cartItem = new CartItem({ med: medId, count });
            await cartItem.save();

            // Добавляем новый Cart_item в корзину
            cart.cart_items.push(cartItem._id);
            await cart.save();
        }

        res.send({ message: "Med успешно добавлен в корзину.", cart });
    } catch (err) {
        res.status(500).send({ message: err.message || "Ошибка при добавлении Med в корзину." });
    }
};

exports.findAllUserCartItems = async (req, res) => {
    try {
        const userId = req.params.id;

        

        // Найти пользователя
        const user = await User.findById(userId).populate("cart");
        if (!user) {
            return res.status(404).send({ message: `Пользователь с id=${userId} не найден.` });
        }

        // Проверка, есть ли корзина у пользователя
        if (!user.cart) {
            return res.status(404).send({ message: "У пользователя нет корзины." });
        }

        // Найти корзину и заполнить элементы
        const cart = await Cart.findById(user.cart).populate({
            path: "cart_items",
            populate: {
                path: "med",
                model: "med", // Указываем модель медикамента
                select: "name _id description instruction price" // Укажите, какие поля медикамента возвращать
            }
        });

        if (!cart) {
            return res.status(404).send({ message: "Корзина не найдена." });
        }

        
        return res.send(cart.cart_items);
    } catch (error) {
        //console.error("Ошибка при получении элементов корзины:", error);
        res.status(500).send({ message: "Произошла ошибка при получении корзины." });
    }
};

