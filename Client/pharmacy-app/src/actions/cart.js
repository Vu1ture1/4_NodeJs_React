import { GET_ALL_CART_ITEMS } from './types';
import CartDataService from "../services/cart.service";

// Экшен для получения всех элементов корзины
export const getCartItems = (userId) => async (dispatch) => {
  try {
    // Отправляем запрос на сервер
    const res = await CartDataService.getAllCartItems(userId);
    
    // Диспатчим экшен с данными
    dispatch({
      type: GET_ALL_CART_ITEMS,
      payload: res.data, // Ответ от сервера с элементами корзины
    });
  } catch (error) {
    console.error("Ошибка при загрузке корзины:", error);
    // Опционально: вы можете добавить обработку ошибок в Redux
    dispatch({
      type: 'GET_CART_ITEMS_ERROR',
      payload: error.message || "Произошла ошибка при загрузке корзины",
    });
  }
};
