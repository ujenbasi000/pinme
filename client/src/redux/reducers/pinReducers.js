import {
  FETCH_PIN_REQUEST,
  FETCH_PIN_SUCCESS,
  FETCH_PIN_FAILURE,
  initialState,
} from "../actions/pinActions";

const pinReducers = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PIN_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_PIN_SUCCESS:
      return {
        ...state,
        loading: false,
        pins: action.payload,
      };
    case FETCH_PIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        pins: [],
      };
    default:
      return state;
  }
};

export default pinReducers;
