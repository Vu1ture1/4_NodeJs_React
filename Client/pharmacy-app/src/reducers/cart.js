import { GET_ALL_CART_ITEMS } from '../actions/types';

const initialState = {
  cartItems: [], // Массив элементов корзины
  loading: false, // Индикатор загрузки
  error: null, // Ошибка при загрузке данных
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_CART_ITEMS:
      return {
        ...state,
        cartItems: action.payload.map((item) => ({
          id: item.id,
          count: item.count,
          med: {
            id: item.med._id,
            name: item.med.name,
            description: item.med.description,
            instruction: item.med.instruction,
            price: item.med.price,
          },
        })),
        loading: false, // Завершение загрузки
        error: null, // Сброс ошибки
      };

    case 'GET_CART_ITEMS_LOADING':
      return {
        ...state,
        loading: true, // Устанавливаем статус загрузки
      };

    case 'GET_CART_ITEMS_ERROR':
      return {
        ...state,
        loading: false, // Завершение загрузки
        error: action.payload, // Установка ошибки
      };

    default:
      return state;
  }
};

export default cartReducer;
