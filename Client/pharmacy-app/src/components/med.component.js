import React, { Component } from "react";
import { connect } from "react-redux";
import { updateMed, deleteMed } from "../actions/meds"; // Импортируем методы из actions
import MedDataService from "../services/med.service";

class Med extends Component {
  constructor(props) {
    super(props);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeInstruction = this.onChangeInstruction.bind(this);
    this.onChangePrice = this.onChangePrice.bind(this);
    this.onChangeMedPng = this.onChangeMedPng.bind(this);
    this.onChangeDepartment = this.onChangeDepartment.bind(this);
    this.getMed = this.getMed.bind(this);
    this.updateMedDetails = this.updateMedDetails.bind(this);
    this.removeMed = this.removeMed.bind(this);

    this.state = {
      currentMed: {
        id: null,
        name: "",
        description: "",
        instruction: "",
        price: "",
        med_png: "",
        department: "",
      },
      message: "",
      isPriceValid: true,
    };
  }

  componentDidMount() {
    this.getMed(this.props.match.params.id);
  }

  onChangeName(e) {
    const name = e.target.value;
    this.setState((prevState) => ({
      currentMed: { ...prevState.currentMed, name },
    }));
  }

  onChangeDescription(e) {
    const description = e.target.value;
    this.setState((prevState) => ({
      currentMed: { ...prevState.currentMed, description },
    }));
  }

  onChangeInstruction(e) {
    const instruction = e.target.value;
    this.setState((prevState) => ({
      currentMed: { ...prevState.currentMed, instruction },
    }));
  }

  onChangePrice(e) {
    const price = e.target.value;
    // Проверка на положительное число (включая десятичные)
    let isPriceValid = false;

    if(price <= 0){
        isPriceValid = false;
    }
    else{
        isPriceValid = true;
    }
     // Регулярное выражение для проверки на положительное число
    this.setState((prevState) => ({
      currentMed: { ...prevState.currentMed, price },
      isPriceValid, // Обновляем переменную для проверки валидности
    }));
  }

  onChangeMedPng(e) {
    const med_png = e.target.value;
    this.setState((prevState) => ({
      currentMed: { ...prevState.currentMed, med_png },
    }));
  }

  onChangeDepartment(e) {
    const department = e.target.value;
    this.setState((prevState) => ({
      currentMed: { ...prevState.currentMed, department },
    }));
  }

  getMed(id) {
    MedDataService.get(id)
      .then((response) => {
        this.setState({ currentMed: response.data });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  updateMedDetails() {
    const { id, name, description, instruction, price, isPriceValid} = this.state.currentMed;
    
    const data = {
        id,
        name,
        description,
        instruction,
        price,
      };
  
      this.props
        .updateMed(id, data)
        .then((response) => {
          console.log(response);
          this.setState({ message: "The medication was updated successfully!" });
        })
        .catch((e) => {
          console.log(e);
        });
  }

  removeMed() {
    this.props
      .deleteMed(this.state.currentMed.id)
      .then(() => {
        this.props.history.push("/meds"); // Переход после удаления
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    const { currentMed, isPriceValid } = this.state;

    const priceColor = this.state.isPriceValid ? "green" : "red";

    return (
        <div>
        {currentMed ? (
          <div className="edit-form">
            <h4>Изменение медикамента:</h4>
            <form>
              <div className="form-group">
                <label htmlFor="name">Имя</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={currentMed.name}
                  onChange={this.onChangeName}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Описание:</label>
                <textarea
                  className="form-control"
                  id="description"
                  rows="4" // Установим количество строк
                  value={currentMed.description}
                  onChange={this.onChangeDescription}
                />
              </div>
      
              <div className="form-group">
                <label htmlFor="instruction">Инструкция:</label>
                <textarea
                  className="form-control"
                  id="instruction"
                  rows="4" // Установим количество строк
                  value={currentMed.instruction}
                  onChange={this.onChangeInstruction}
                />
              </div>
      
              <div className="form-group">
                <label htmlFor="price">Цена:</label>
                <input
                  type="Number"
                  className="form-control"
                  style={{borderColor: priceColor }}
                  id="price"
                  value={currentMed.price}
                  onChange={this.onChangePrice}
                />
              </div>
            </form>
      
            <button
              className="btn btn-sm btn-danger"
              style={{marginTop: "10px"}}
              onClick={this.removeMed}
            >
              Удалить
            </button>
      
            <button
              type="submit"
              className="btn btn-sm btn-warning"
              style={{marginTop: "10px", marginLeft: "5px"}}
              onClick={this.updateMedDetails}
            >
              Обновить
            </button>
      
            <p>{this.state.message}</p>
          </div>
        ) : (
          <div>
            <br />
            <p>Пожалуйста, выберите медикамент...</p>
          </div>
        )}
      </div>
      
    );
  }
}

export default connect(null, { updateMed, deleteMed })(Med);