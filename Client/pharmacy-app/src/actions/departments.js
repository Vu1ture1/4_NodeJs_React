import {
    RETRIEVE_DEPARTMENTS
  } from "./types";
  
  import DepartmentDataService from "../services/department.service";
  
  export const retrieveDepartments = () => async (dispatch) => {
    try {
     
      const res = await DepartmentDataService.getAll();
  
      dispatch({
        type: RETRIEVE_DEPARTMENTS,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };