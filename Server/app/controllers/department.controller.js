const db = require("../models");
const Department = db.department;

// Создание нового отдела
exports.create = async (req, res) => {
    try {
        const { type_of_medicine, description, all_sold_num } = req.body;

        // Проверка на обязательные поля
        if (!type_of_medicine) {
            return res.status(400).send({ message: "Тип отдела обязателен." });
        }

        const newDepartment = new Department({
            type_of_medicine,
            description,
            all_sold_num: all_sold_num || 0  // Если не указан, устанавливаем 0
        });

        const savedDepartment = await newDepartment.save();
        res.status(201).send(savedDepartment); // Отправляем сохраненный отдел
    } catch (err) {
        res.status(500).send({ message: err.message || "Ошибка при создании отдела." });
    }
};

// Получение всех отделов
exports.findAll = async (req, res) => {
    try {
        const departments = await Department.find(); // Находим все отделы
        res.send(departments); // Отправляем результат
    } catch (err) {
        res.status(500).send({ message: err.message || "Ошибка при получении всех отделов." });
    }
};

// Получение одного отдела по ID
exports.findOne = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id); // Находим отдел по ID
        if (!department) {
            return res.status(404).send({ message: `Отдел с id=${req.params.id} не найден.` });
        }
        res.send(department); // Отправляем найденный отдел
    } catch (err) {
        res.status(500).send({ message: err.message || `Ошибка при получении отдела с id=${req.params.id}.` });
    }
};

// Обновление отдела по ID
exports.update = async (req, res) => {
    try {
        const updatedDepartment = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); // Обновляем данные
        if (!updatedDepartment) {
            return res.status(404).send({ message: `Отдел с id=${req.params.id} не найден.` });
        }
        res.send(updatedDepartment); // Отправляем обновленный отдел
    } catch (err) {
        res.status(500).send({ message: err.message || `Ошибка при обновлении отдела с id=${req.params.id}.` });
    }
};

// Удаление отдела по ID
exports.delete = async (req, res) => {
    try {
        const department = await Department.findByIdAndRemove(req.params.id); // Удаляем отдел
        if (!department) {
            return res.status(404).send({ message: `Отдел с id=${req.params.id} не найден.` });
        }
        res.send({ message: "Отдел успешно удален!" }); // Отправляем успешный ответ
    } catch (err) {
        res.status(500).send({ message: err.message || `Ошибка при удалении отдела с id=${req.params.id}.` });
    }
};

// Удаление всех отделов
exports.deleteAll = async (req, res) => {
    try {
        const result = await Department.deleteMany({}); // Удаляем все отделы
        res.send({ message: `${result.deletedCount} отделов успешно удалено!` }); // Отправляем количество удаленных отделов
    } catch (err) {
        res.status(500).send({ message: err.message || "Ошибка при удалении всех отделов." });
    }
};
