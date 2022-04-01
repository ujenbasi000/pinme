import { combineReducers } from "redux";
import userReducer from "./userReducers";
import pinReducer from "./pinReducers";

export default combineReducers({
  user: userReducer,
  pins: pinReducer,
});
