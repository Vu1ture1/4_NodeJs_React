import {
    CREATE_MED,
    RETRIEVE_MEDS,
    UPDATE_MED,
    DELETE_MED,
    DELETE_ALL_MEDS,
    SEARCH_MED
  } from "../actions/types";
  
  const initialState = [];
  
  function medReducer(meds = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case CREATE_MED:
        // Добавляем новый медикамент в массив
        return [...meds, payload];
  
      case RETRIEVE_MEDS:
        // Обновляем список медикаментов
        return payload;

      case SEARCH_MED:
        return payload;
  
      case UPDATE_MED:
        // Обновляем медикамент по ID
        return meds.map((med) => {
          if (med.id === payload.id) {
            return {
              ...med,
              ...payload,  // Обновляем только изменённые данные
            };
          } else {
            return med;
          }
        });
  
      case DELETE_MED:
        // Удаляем медикамент по ID
        return meds.filter(({ id }) => id !== payload.id);
  
      case DELETE_ALL_MEDS:
        // Удаляем все медикаменты
        return [];
  
      default:
        return meds;
    }
  }
  
  export default medReducer;
  