import {
    ADD_TO_CART,
    DELETE_FROM_CART,
    CREATE_ORDER_FROM_CART,
    UPDATE_USER
  } from './types';
  
  import UserDataService from "../services/user.service";
  
  // Добавить медикамент в корзину
  export const addMedToCart = (userId, medId) => async (dispatch) => {
    try {
      console.log(medId);
      
      const res = await UserDataService.addToCart(userId, { medId });
  
      dispatch({
        type: ADD_TO_CART,
        payload: res.data, // Данные о корзине, обновленные после добавления
      });
  
      return Promise.resolve(res.data);
    } catch (err) {
      return Promise.reject(err);
    }
  };
  
  // Удалить медикамент из корзины
  export const deleteMedFromCart = (userId, cartItemId) => async (dispatch) => {
    try {
      const res = await UserDataService.deleteFromCart(userId, { cartItemId });
  
      dispatch({
        type: DELETE_FROM_CART,
        payload: res.data, // Данные о корзине, обновленные после удаления
      });
  
      return Promise.resolve(res.data);
    } catch (err) {
      return Promise.reject(err);
    }
  };
  
  // Создать заказ из корзины
  export const createOrderFromCart = (userId) => async (dispatch) => {
    try {
      const res = await UserDataService.createOrderFromCart(userId);
  
      dispatch({
        type: CREATE_ORDER_FROM_CART,
        payload: res.data, // Данные о заказе
      });
  
      return Promise.resolve(res.data);
    } catch (err) {
      return Promise.reject(err);
    }
  };
  
  // Обновить данные пользователя
  export const updateUser = (userId, userData) => async (dispatch) => {
    try {
      const res = await UserDataService.updateUser(userId, userData);
  
      dispatch({
        type: UPDATE_USER,
        payload: res.data,
      });
  
      return Promise.resolve(res.data);
    } catch (err) {
      return Promise.reject(err);
    }
  };
  
  