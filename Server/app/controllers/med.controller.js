const db = require("../models");
const Med = db.med;

// Создание нового медикамента
exports.createMed = async (req, res) => {
    try {
        const newMed = new Med({
            name: req.body.name,
            description: req.body.description,
            instruction: req.body.instruction,
            price: req.body.price,
            med_png: req.body.med_png,
            department: req.body.department // Ссылка на department
        });

        const savedMed = await newMed.save();
        res.status(201).send(savedMed);
    } catch (err) {
        res.status(500).send({ message: err.message || "Ошибка при создании медикамента." });
    }
};

// Получение всех медикаментов с фильтрацией и сортировкой
exports.findAllMeds = async (req, res) => {
    try {
        const { departmentId, sortBy = 'price', sortOrder = 'asc' } = req.query;

        // Условие фильтрации по department (если передан departmentId)
        const condition = departmentId ? { department: departmentId } : {};

        // Условие сортировки по цене (если передан параметр сортировки)
        const sort = {};
        if (sortBy === 'price') {
            sort['price'] = sortOrder === 'desc' ? -1 : 1; // сортировка по цене
        }

        // Выполняем поиск с условием фильтрации и сортировки
        const meds = await Med.find(condition).populate("department").sort(sort);

        res.send(meds); // Отправляем результат
    } catch (err) {
        res.status(500).send({ message: err.message || "Ошибка при получении медикаментов." });
    }
};

// Получение одного медикамента по ID
exports.findOneMed = async (req, res) => {
    try {
        const med = await Med.findById(req.params.id).populate("department");
        if (!med) {
            return res.status(404).send({ message: `Медикамент с id=${req.params.id} не найден.` });
        }
        res.send(med);
    } catch (err) {
        res.status(500).send({ message: err.message || `Ошибка при получении медикамента с id=${req.params.id}.` });
    }
};

// Получение медикаментов по имени (с учетом вхождения) и по departmentId
exports.findMedsByName = async (req, res) => {
    try {
        // Получаем строку поиска и departmentId из параметров запроса
        const { name, departmentId } = req.query;

        console.log("Searching for meds with name:", name);
        console.log("Department ID:", departmentId);

        // Строим условия поиска
        let condition = {};

        if(!departmentId){
            if(name){
                condition.name = { $regex: name, $options: "i" };

                const meds = await Med.find(condition).populate("department");

                res.send(meds); // Отправляем найденные медикаменты
            }
        }

        // Проверка, что хотя бы одно условие передано
        if (!name && !departmentId) {
            return res.status(400).send({ message: "Необходимо передать строку для поиска или departmentId." });
        }

        if (name) {
            condition.name = { $regex: name, $options: "i" };  // Поиск по имени с учетом регистра
        }

        if (departmentId) {
            condition.department = departmentId;  // Фильтрация по departmentId
        }

        // Выполняем поиск с условиями
        const meds = await Med.find(condition).populate("department");

        if (meds.length === 0) {
            return res.status(404).send({ message: `Медикаменты, соответствующие фильтрам, не найдены.` });
        }

        res.send(meds); // Отправляем найденные медикаменты
    } catch (err) {
        res.status(500).send({ message: err.message || "Ошибка при поиске медикаментов по имени и departmentId." });
    }
};


// Обновление медикамента
exports.updateMed = async (req, res) => {
    try {
        const updatedMed = await Med.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedMed) {
            return res.status(404).send({ message: `Медикамент с id=${req.params.id} не найден.` });
        }
        res.send(updatedMed);
    } catch (err) {
        res.status(500).send({ message: err.message || `Ошибка при обновлении медикамента с id=${req.params.id}.` });
    }
};

// Удаление медикамента
exports.deleteMed = async (req, res) => {
    try {
        var mongoose = require('mongoose');
        var id = new mongoose.Types.ObjectId(req.params.id);
        const med = await Med.findByIdAndDelete(id);
        if (!med) {
            return res.status(404).send({ message: `Медикамент с id=${req.params.id} не найден.` });
        }
        res.send({ message: "Медикамент успешно удален!" });
    } catch (err) {
        res.status(500).send({ message: err.message || `Ошибка при удалении медикамента с id=${req.params.id}.` });
    }
};

// Удаление всех медикаментов
exports.deleteAllMeds = async (req, res) => {
    try {
        const result = await Med.deleteMany({});
        res.send({ message: `${result.deletedCount} медикаментов успешно удалено!` });
    } catch (err) {
        res.status(500).send({ message: err.message || "Ошибка при удалении всех медикаментов." });
    }
};
