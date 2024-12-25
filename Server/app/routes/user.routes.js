module.exports = app => {
    const userController = require('../controllers/user.controller.js');
    var router = require("express").Router();

    // Получение всех пользователей (с возможностью фильтрации и сортировки)
    router.get('/', userController.findAll);

    // Получение пользователя по ID
    router.get('/:id', userController.findOne);

    // Обновление пользователя
    router.put('/:id', userController.update);

    // Удаление пользователя по ID
    router.delete('/:id', userController.delete);

    // Удаление всех пользователей
    router.delete('/', userController.deleteAll);

    // Корзина пользователя

    // Добавление медикамента в корзину пользователя
    router.post('/:id/cart', userController.addMedToCart);

    // Удаление медикамента из корзины пользователя
    router.delete('/:userId/cart', userController.removeMedFromCart);

    router.get('/cart/items/:id', userController.findAllUserCartItems);

    // Создание заказа из корзины
    router.post('/:id/order', userController.createOrderFromCart);

    app.use('/api/users', router);
};


