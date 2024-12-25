module.exports = app => {
    const departmentController = require('../controllers/department.controller.js');
    var router = require("express").Router();

    // CRUD операции для отделов

    // Создание нового отдела
    router.post('/', departmentController.create);

    // Получение всех отделов
    router.get('/', departmentController.findAll);

    // Получение одного отдела по ID
    router.get('/:id', departmentController.findOne);

    // Обновление отдела по ID
    router.put('/:id', departmentController.update);

    // Удаление отдела по ID
    router.delete('/:id', departmentController.delete);

    // Удаление всех отделов
    router.delete('/', departmentController.deleteAll);

    app.use('/api/departments', router);
};