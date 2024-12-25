import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { retrieveMeds, searchMed } from "../actions/meds"; // Подключаем action для поиска
import { addMedToCart } from "../actions/users"; // Подключаем экшен для добавления в корзину
import { useParams } from "react-router-dom"; // Для получения параметра из URL
import { useUser } from "../hooks/user.hooks"; // Хук для доступа к контексту пользователя

const MedList = ({ meds, retrieveMeds, searchMed, addMedToCart }) => {
    const { departmentId } = useParams(); // Получаем id департамента из URL
    const [sortOrder, setSortOrder] = useState("asc");
    const [searchQuery, setSearchQuery] = useState(""); // Для состояния поискового запроса
    const { user } = useUser(); // Получаем пользователя из контекста

    useEffect(() => {
        if (departmentId) {
            // Запрос с параметрами сортировки и departmentId
            retrieveMeds(sortOrder, departmentId); // Передаем параметры сортировки и id департамента
        }
    }, [departmentId, sortOrder, retrieveMeds]); // Перезапускаем при изменении departmentId или sortOrder

    const toggleSortOrder = () => {
        const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
        setSortOrder(newSortOrder); // Меняем порядок сортировки
    };

    // Функция для обработки изменения текста в поисковой строке
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query); // Обновляем состояние поиска
        searchMed(query, departmentId); // Запускаем поиск
    };

    // Функция для добавления медикамента в корзину
    const handleAddToCart = (med) => {
        if (user) {
            // Если пользователь существует, вызываем экшен addMedToCart с userId
            addMedToCart(user.id, med.id); // Добавляем медикамент в корзину с количеством 1
            alert(`Товар ${med.name} добавлен в корзину.`)
        } else {
            alert("Пожалуйста, войдите в систему для добавления товара в корзину.");
        }
    };

    return (
        <div>
            <h3 className="text-center" style={{ marginBottom: "20px" }}>
                Медикаменты отдела
            </h3>

            {/* Поле для поиска */}
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Поиск по названию медикамента..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    style={{
                        padding: "10px",
                        width: "50%",
                        fontSize: "16px",
                        borderRadius: "5px",
                        border: "1px solid #ddd",
                        boxSizing: "border-box", // Для правильного отображения ширины
                        marginBottom: "20px",
                    }}
                />
            </div>

            {/* Кнопка для переключения сортировки */}
            <div className="d-flex justify-content-center">
                <button
                    onClick={toggleSortOrder}
                    style={{
                        padding: "10px 15px",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        marginBottom: "20px",
                    }}
                >
                    Сортировать по цене ({sortOrder === "asc" ? "по возрастанию" : "по убыванию"})
                </button>
            </div>

            <div className="container my-4">
                {meds.length === 0 ? (
                    <p className="text-center">Медикаменты не найдены для этого отдела.</p>
                ) : (
                    <div className="d-flex flex-column align-items-center">
                        {meds.map((med) => (
                            <div key={med.id} className="card mb-4" style={{ width: "80%" }}>
                                <div className="card-body">
                                    <h5 className="card-title" style={{ marginBottom: "15px" }}>
                                        <strong>Название:</strong> {med.name}
                                    </h5>
                                    <p className="card-text">
                                        <strong>Описание:</strong> {med.description}
                                    </p>
                                    <p className="card-text">
                                        <strong>Инструкция:</strong> {med.instruction}
                                    </p>
                                    <p className="card-text">
                                        <strong>Цена:</strong> {med.price} руб.
                                    </p>
                                    {/* Кнопка добавления в корзину */}
                                    {user && (
                                        <button
                                        onClick={() => handleAddToCart(med)}
                                        style={{
                                            padding: "10px 15px",
                                            backgroundColor: "#4CAF50",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                        }}
                                        >
                                            Добавить в корзину
                                        </button>
                                    )}
                                    
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    meds: state.meds, // Получаем список медикаментов из стейта
});

const mapDispatchToProps = {
    retrieveMeds,
    searchMed, // Добавляем action для поиска
    addMedToCart, // Экшен для добавления медикамента в корзину
};

export default connect(mapStateToProps, mapDispatchToProps)(MedList);
