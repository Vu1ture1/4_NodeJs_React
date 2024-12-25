import React, { Component } from "react";
import { connect } from "react-redux";
import { retrieveMeds, deleteAllMeds, searchMed } from "../actions/meds"; // Импортируем методы для работы с медикаментами
import { Link } from "react-router-dom"; // Добавьте этот импорт

class MedsList extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchName = this.onChangeSearchName.bind(this); // Поиск по имени медикамента
    this.refreshData = this.refreshData.bind(this); // Сброс выбранного медикамента
    this.setActiveMed = this.setActiveMed.bind(this); // Устанавливаем активный медикамент
    this.findByName = this.findByName.bind(this); // Поиск по имени медикамента
    this.removeAllMeds = this.removeAllMeds.bind(this); // Удалить все медикаменты
    this.ViewAll = this.ViewAll.bind(this); // Привязываем метод ViewAll

    this.state = {
      currentMed: null, // Текущий выбранный медикамент
      currentIndex: -1, // Индекс текущего медикамента
      searchName: "", // Поисковая строка
    };
  }

  componentDidMount() {
    this.props.retrieveMeds(); // Получение всех медикаментов при монтировании компонента
  }

  onChangeSearchName(e) {
    const searchName = e.target.value;
    this.setState({
      searchName: searchName,
    });
  }

  refreshData() {
    this.setState({
      currentMed: null,
      currentIndex: -1,
    });
  }

  setActiveMed(med, index) {
    this.setState({
      currentMed: med,
      currentIndex: index,
    });
  }

  removeAllMeds() {
    this.props
      .deleteAllMeds()
      .then((response) => {
        console.log(response);
        this.refreshData(); // Сбрасываем данные после удаления
      })
      .catch((e) => {
        console.log(e);
      });
  }

  findByName() {
    this.refreshData();
    this.props.searchMed(this.state.searchName); // Поиск медикаментов по имени
  }

  ViewAll() {
    this.refreshData();
    this.props.retrieveMeds();
  }

  render() {
    const { searchName, currentMed, currentIndex } = this.state;
    const { meds } = this.props; // Медикаменты из состояния Redux

    return (
      <div className="list row">
        <div className="col-md-8">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Поиск по имени"
              value={searchName}
              onChange={this.onChangeSearchName}
            />
            <div className="input-group-append">
              <button
                className="btn btn-sm btn-outline-secondary"
                style={{marginLeft: "10px", marginTop: "4px"}}
                type="button"
                onClick={this.findByName}>
                Поиск
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                style={{marginLeft: "5px", marginTop: "4px"}}
                type="button"
                onClick={this.ViewAll}>
                Сбросить поиск
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <h4>Список медикаментов:</h4>

          <ul className="list-group">
            {meds &&
              meds.map((med, index) => (
                <li
                  className={
                    "list-group-item " + (index === currentIndex ? "active" : "")
                  }
                  onClick={() => this.setActiveMed(med, index)}
                  key={index}
                >
                  {med.name}
                </li>
              ))}
          </ul>

          <button
            className="btn btn-sm btn-danger"
            style={{marginTop: "10px"}}
            onClick={this.removeAllMeds}>
            Удалить все медикаменты
            </button>

        </div>

        <div className="col-md-6">
          {currentMed ? (
            <div>
              <h4>Медикамент</h4>
              <div>
                <label>
                  <strong>Имя:</strong>
                </label>{" "}
                {currentMed.name}
              </div>
              <div>
                <label>
                  <strong>Описание:</strong>
                </label>{" "}
                {currentMed.description}
              </div>
              <div>
                <label>
                  <strong>Инструкция:</strong>
                </label>{" "}
                {currentMed.instruction}
              </div>
              <div>
                <label>
                  <strong>Цена:</strong>
                </label>{" "}
                {currentMed.price} руб.
              </div>

              <div style={{marginTop: "10px"}}>
                <Link
                    to={`/meds/${currentMed.id}`}
                    className="btn btn-sm btn-warning">
                    Редактировать
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <br />
              <p>Выберите медикамент из списка для просмотра информации...</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    meds: state.meds, // Медикаменты из состояния Redux
  };
};

export default connect(mapStateToProps, { retrieveMeds, deleteAllMeds, searchMed })(MedsList);
