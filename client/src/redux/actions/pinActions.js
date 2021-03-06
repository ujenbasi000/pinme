import axios from "axios";

const initialState = {
  loading: false,
  pins: [],
  error: null,
};

const FETCH_PIN_REQUEST = "FETCH_PIN_REQUEST";
const FETCH_PIN_SUCCESS = "FETCH_PIN_SUCCESS";
const FETCH_PIN_FAILURE = "FETCH_PIN_FAILURE";

const fetchPinRequest = () => ({
  type: FETCH_PIN_REQUEST,
});

const fetchPinSuccess = (pin) => ({
  type: FETCH_PIN_SUCCESS,
  payload: pin,
});

const fetchPinFailure = (error) => ({
  type: FETCH_PIN_FAILURE,
  payload: error,
});

const fetchPins = () => async (dispatch) => {
  dispatch(fetchPinRequest());
  try {
    const { data } = await axios.get("/api/pin");
    if (data.status !== 200) {
      window.location.href = "/login";
      return alert("Something went wrong!");
    }
    dispatch(fetchPinSuccess(data.pins));
  } catch (error) {
    window.location.href = "/login";
    dispatch(fetchPinFailure(error.response.data.message));
  }
};
const fetchSearchedPins = (value) => async (dispatch) => {
  dispatch(fetchPinRequest());
  try {
    const { data } = await axios.get("/api/pin/search?q=" + value);
    if (data.status !== 200) {
      window.location.href = "/login";
      return alert("Something went wrong!");
    }
    dispatch(fetchPinSuccess(data.pins));
  } catch (error) {
    window.location.href = "/login";
    dispatch(fetchPinFailure(error.response.data.message));
  }
};

export {
  fetchPins,
  fetchSearchedPins,
  FETCH_PIN_REQUEST,
  FETCH_PIN_SUCCESS,
  FETCH_PIN_FAILURE,
  initialState,
};
