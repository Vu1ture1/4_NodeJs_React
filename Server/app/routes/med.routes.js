module.exports = app => {
    const medController = require('../controllers/med.controller.js');
    var router = require("express").Router();

    // CRUD операции для медикаментов

    // Создание нового медикамента
    router.post('/', medController.createMed);

    // Получение всех медикаментов (с возможностью фильтрации по department и сортировки по цене)
    router.get('/', medController.findAllMeds);

    router.get('/search', medController.findMedsByName);

    // Получение одного медикамента по ID
    router.get('/:id', medController.findOneMed);

    // Обновление информации о медикаменте
    router.put('/:id', medController.updateMed);

    // Удаление медикамента по ID
    router.delete('/:id', medController.deleteMed);

    // Удаление всех медикаментов
    router.delete('/', medController.deleteAllMeds);

    app.use('/api/meds', router);
};