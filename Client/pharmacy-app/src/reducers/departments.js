import {
    RETRIEVE_DEPARTMENTS
  } from "../actions/types";
  
  const initialState = [];
  
  function departmentReducer(departments = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case RETRIEVE_DEPARTMENTS:
        // Обновляем список департаментов
        return payload;
  
      default:
        return departments;
    }
  }
  
  export default departmentReducer;
  