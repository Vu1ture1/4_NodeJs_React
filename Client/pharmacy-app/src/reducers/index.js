import { combineReducers } from "redux";
import meds from "./meds";
import departments from "./departments";
import users from "./users";
import cart from "./cart"

export default combineReducers({
  meds,
  departments,
  users,
  cart
});