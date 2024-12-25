import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCartItems } from '../actions/cart';  // Для получения корзины
import { deleteMedFromCart } from '../actions/users';  // Для удаления через actions/user
import { useUser } from '../hooks/user.hooks';  // Хук для получения текущего пользователя

const CartItemsList = () => {
  const dispatch = useDispatch();
  const { cartItems, loading, error } = useSelector((state) => state.cart);  // Получаем элементы корзины из Redux
  const { user } = useUser();  // Получаем текущего пользователя из контекста

  useEffect(() => {
    if (user && user.id) {
      dispatch(getCartItems(user.id));  // Загружаем корзину для текущего пользователя
    }
  }, [user, dispatch]);

  const handleDelete = async (cartItemId) => {
    if (user && user.id) {
      try {
        // Вызываем action для удаления элемента из корзины
        await dispatch(deleteMedFromCart(user.id, cartItemId));
        
        // После удаления перезагружаем корзину
        dispatch(getCartItems(user.id));
      } catch (err) {
        console.error('Ошибка при удалении товара:', err);
      }
    }
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <div>
      <h3>Ваши элементы в корзине:</h3>
      {cartItems.length > 0 ? (
        cartItems.map((item) => (
          <div key={item.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <h4>{item.med.name}</h4>
            <p>Описание: {item.med.description}</p>
            <p>Инструкция: {item.med.instruction}</p>
            <p>Цена: {item.med.price} руб.</p>
            <p>Количество: {item.count}</p>
            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)} style={{ color: 'white' }}>
              Убрать 1шт.
            </button>
          </div>
        ))
      ) : (
        <p>Корзина пуста, добавьте что нибудь в корзину.</p>
      )}
    </div>
  );
};

export default CartItemsList;
