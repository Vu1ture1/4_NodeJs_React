import {
    CREATE_MED,
    RETRIEVE_MEDS,
    UPDATE_MED,
    DELETE_MED,
    DELETE_ALL_MEDS,
    SEARCH_MED
  } from "./types";
  
  import MedDataService from "../services/med.service";
  
  export const createMed = (name, description, instruction, price, med_png, department) => async (dispatch) => {
    try {
      const res = await MedDataService.create({ name, description, instruction, price, med_png, department });
  
      dispatch({
        type: CREATE_MED,
        payload: res.data,
      });
  
      return Promise.resolve(res.data);
    } catch (err) {
      return Promise.reject(err);
    }
  };
  
  export const retrieveMeds = (sortOrder, departmentId) => async (dispatch) => {
    try {
      console.log("Отправка запроса с параметрами:", { sortOrder, departmentId });
  
      const res = await MedDataService.getAll(sortOrder, departmentId);
  
      console.log("Данные с сервера:", res.data);
  
      dispatch({
        type: RETRIEVE_MEDS,
        payload: res.data, // Обновляем состояние с новыми медикаментами
      });
    } catch (err) {
      console.log("Ошибка при получении медикаментов:", err);
    }
  };

  export const searchMed = (name, departmentId) => async (dispatch) => {
    try {
      console.log(name);
      
      const res = await MedDataService.search(name, departmentId);
  
      dispatch({
        type: SEARCH_MED,
        payload: res.data, // Обновляем состояние с новыми медикаментами
      });
    } catch (err) {
      console.log("Ошибка при получении медикаментов:", err);
    }
  };
  
  export const updateMed = (id, data) => async (dispatch) => {
    try {
      const res = await MedDataService.update(id, data);
  
      dispatch({
        type: UPDATE_MED,
        payload: data,
      });
  
      return Promise.resolve(res.data);
    } catch (err) {
      return Promise.reject(err);
    }
  };
  
  export const deleteMed = (id) => async (dispatch) => {
    try {
      console.log(id);
      await MedDataService.delete(id);
  
      dispatch({
        type: DELETE_MED,
        payload: { id },
      });
    } catch (err) {
      console.log(err);
    }
  };
  
  export const deleteAllMeds = () => async (dispatch) => {
    try {
      const res = await MedDataService.deleteAll();
  
      dispatch({
        type: DELETE_ALL_MEDS,
        payload: res.data,
      });
  
      return Promise.resolve(res.data);
    } catch (err) {
      return Promise.reject(err);
    }
  };