import React, { useEffect } from "react";
import { connect } from "react-redux";
import { retrieveDepartments } from "../actions/departments";
import { useHistory } from "react-router-dom"; // Для навигации между компонентами

const DepartmentList = ({ departments, retrieveDepartments }) => {
  const history = useHistory();

  useEffect(() => {
    // При монтировании компонента получаем список департаментов
    retrieveDepartments();
  }, [retrieveDepartments]);

  const handleDepartmentClick = (departmentId) => {
    // Навигация на компонент с медикаментами для выбранного департамента
    history.push(`/departments/${departmentId}`);
  };

  return (
    <div>
      <h3 className="text-center" style={{marginBottom: "20px"}}>Все отделы аптеки</h3>
      <div className="d-flex flex-column align-items-center">
        {departments.map((department) => (
            <div 
            key={department.id} 
            className="department-item border p-3 mb-3" // Добавляем рамку, padding и отступы
            style={{ width: "80%", maxWidth: "500px" }} // Ограничиваем ширину элементов
            >
            <h4>{department.type_of_medicine}</h4> {/* Название отдела */}
            <p>{department.description}</p> {/* Описание отдела */}
            <button
                onClick={() => handleDepartmentClick(department.id)}
                className="btn btn-success" // Используем класс Bootstrap для кнопки
                style={{ marginTop: "10px" }}
            >
                Показать медикаменты
            </button>
            </div>
        ))}
        </div>

    </div>
  );
};

const mapStateToProps = (state) => ({
  departments: state.departments, // Список департаментов из стейта
});

const mapDispatchToProps = {
  retrieveDepartments,
};

export default connect(mapStateToProps, mapDispatchToProps)(DepartmentList);

