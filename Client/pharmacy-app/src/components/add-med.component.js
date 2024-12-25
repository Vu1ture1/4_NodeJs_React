import React, { Component } from "react";
import { connect } from "react-redux";
import { createMed } from "../actions/meds";
import { retrieveDepartments } from "../actions/departments";

class AddMed extends Component {
  state = {
    id: null,
    name: "",
    description: "",
    instruction: "",
    price: "",
    med_png: "",
    department: "",
    isPriceValid: false,
    isNameValid: false,
    isDescriptionValid: false,
    isInstructionValid: false,
    isDepartmentValid: false,
    submitted: false,
  };

  componentDidMount() {
    this.props.retrieveDepartments();  // Загрузка отделов
  }

  // Обработчики изменений для формы
  onChangeName = (e) => {
    const name = e.target.value;
    const isNameValid = name.length >= 3;
    this.setState({ name, isNameValid });
  };

  onChangeDescription = (e) => {
    const description = e.target.value;
    const isDescriptionValid = description.length >= 10;
    this.setState({ description, isDescriptionValid });
  };

  onChangeInstruction = (e) => {
    const instruction = e.target.value;
    const isInstructionValid = instruction.length >= 10;
    this.setState({ instruction, isInstructionValid });
  };

  onChangePrice = (e) => {
    const price = e.target.value;
    const isPriceValid = price > 0;
    this.setState({ price, isPriceValid });
  };

  onChangeDepartment = (e) => {
    const department = e.target.value;
    const isDepartmentValid = department !== '';
    this.setState({ department, isDepartmentValid });
  };

  // Сохранение медикамента
  saveMed = () => {
    const { name, description, instruction, price, department } = this.state;

    if (
      this.state.isNameValid &&
      this.state.isDescriptionValid &&
      this.state.isInstructionValid &&
      this.state.isPriceValid &&
      this.state.isDepartmentValid
    ) {
      this.props
        .createMed(name, description, instruction, price, "", department)
        .then((data) => {
          this.setState(
            {
              id: data.id,
              name: data.name,
              description: data.description,
              instruction: data.instruction,
              price: data.price,
              med_png: "",
              department: data.department.id,
              submitted: true,
            },
            () => {
              console.log("Медикамент успешно добавлен:", data);
            }
          );
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  // Очистка формы
  newMed = () => {
    this.setState({
      id: null,
      name: "",
      description: "",
      instruction: "",
      price: "",
      med_png: "",
      department: "",
      submitted: false,
      isPriceValid: false,
      isNameValid: false,
      isDescriptionValid: false,
      isInstructionValid: false,
      isDepartmentValid: false,
    });
  };

  render() {
    const { departments } = this.props;
    const { isPriceValid, isNameValid, isDescriptionValid, isInstructionValid, isDepartmentValid, name, description, instruction, price, department, submitted } = this.state;

    const nameColor = isNameValid ? "green" : "red";
    const priceColor = isPriceValid ? "green" : "red";
    const descriptionColor = isDescriptionValid ? "green" : "red";
    const instructionColor = isInstructionValid ? "green" : "red";
    const departmentColor = isDepartmentValid ? "green" : "red";

    return (
      <div className="submit-form">
        {this.state.submitted ? (
          <div>
            <h4>Медикамент добавлен успешно</h4>
            <button className="btn btn-success" onClick={this.newMed}>
              Добавить еще медикамент
            </button>
          </div>
        ) : (
          <div>
            <h4>Добавление мед-та:</h4>
            <div className="form-group">
              <label htmlFor="name">Имя:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Введите имя"
                id="name"
                value={name}
                style={{ borderColor: nameColor }}
                onChange={this.onChangeName}
                name="name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Описание:</label>
              <textarea
                className="form-control"
                placeholder="Введите описание"
                id="description"
                value={description}
                style={{ borderColor: descriptionColor }}
                onChange={this.onChangeDescription}
                name="description"
              />
            </div>

            <div className="form-group">
              <label htmlFor="instruction">Инструкция:</label>
              <textarea
                className="form-control"
                placeholder="Введите инструкцию"
                id="instruction"
                required
                value={instruction}
                style={{ borderColor: instructionColor }}
                onChange={this.onChangeInstruction}
                name="instruction"
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Цена:</label>
              <input
                type="number"
                className="form-control"
                placeholder="Введите цену"
                id="price"
                required
                value={price}
                style={{ borderColor: priceColor }}
                onChange={this.onChangePrice}
                name="price"
              />
            </div>

            {/* Отдел */}
            <div className="form-group">
              <label htmlFor="department">Отдел:</label>
              <select
                id="department"
                className="form-control"
                value={department}
                onChange={this.onChangeDepartment}
                style={{ borderColor: departmentColor }}
                required
              >
                <option value="">Выберите отдел</option>
                {departments && departments.length > 0 ? (
                  departments.map((dep) => (
                    <option key={dep.id} value={dep.id}>
                      {dep.type_of_medicine}
                    </option>
                  ))
                ) : (
                  <option disabled>Загрузка отделов...</option>
                )}
              </select>
            </div>

            <button onClick={this.saveMed} className="btn btn-success" style={{marginTop: "10px"}}>
                Добавить
            </button>
          </div>
        )}
      </div>
    );
  }
}

// Маппинг состояния из Redux в пропсы компонента
const mapStateToProps = (state) => ({
  departments: state.departments,  // Список отделов из Redux
});

export default connect(mapStateToProps, { createMed, retrieveDepartments })(AddMed);
