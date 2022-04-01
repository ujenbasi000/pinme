import {
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
  initialState,
} from "../actions/userActions";

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
        error: null,
      };

    case FETCH_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        user: {},
      };
    default:
      return state;
  }
};
export default userReducer;
