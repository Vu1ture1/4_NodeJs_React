import {
    ADD_TO_CART,
    DELETE_FROM_CART,
    CREATE_ORDER_FROM_CART,
    UPDATE_USER
  } from '../actions/types';
  
  // Начальное состояние для корзины и пользователя
  const initialState = {
    user: null, // Данные о пользователе
    cart: {
      cart_items: [] // Элементы в корзине
    },
    order: null, // Данные о заказе
    loading: false, // Статус загрузки
    error: null // Ошибки при работе с данными
  };
  
  const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case ADD_TO_CART:
        // При добавлении медикамента в корзину
        return {
          ...state,
          cart: {
            ...state.cart,
            cart_items: action.payload.cart_items // Обновляем список товаров в корзине
          }
        };
  
      case DELETE_FROM_CART:
        // При удалении медикамента из корзины
        return {
          ...state,
          cart: {
            ...state.cart,
            cart_items: action.payload.cart_items // Обновляем корзину после удаления
          }
        };
  
      case CREATE_ORDER_FROM_CART:
        // При создании заказа из корзины
        return {
          ...state,
          order: action.payload.order, // Добавляем новый заказ
          cart: {
            ...state.cart,
            cart_items: [] // Очищаем корзину после оформления заказа
          }
        };
  
      case UPDATE_USER:
        // При обновлении данных пользователя
        return {
          ...state,
          user: action.payload // Обновляем информацию о пользователе
        };
  
      default:
        return state;
    }
  };
  
  export default userReducer;
  