import axios from "axios";
import { Navigate } from "react-router-dom";

const initialState = {
  loading: false,
  user: {},
  error: null,
};

const FETCH_USER_REQUEST = "FETCH_USER_REQUEST";
const FETCH_USER_SUCCESS = "FETCH_USER_SUCCESS";
const FETCH_USER_FAILURE = "FETCH_USER_FAILURE";

const fetchUserRequest = () => ({
  type: FETCH_USER_REQUEST,
});

const fetchUserSuccess = (user) => ({
  type: FETCH_USER_SUCCESS,
  payload: user,
});

const fetchUserFailure = (error) => ({
  type: FETCH_USER_FAILURE,
  payload: error,
});

export const fetchUser = () => async (dispatch) => {
  dispatch(fetchUserRequest());
  try {
    const { data } = await axios.get("/api/user");
    if (data.success) {
      dispatch(fetchUserSuccess(data.user));
    }
  } catch (error) {
    if (
      error.response.data.message === "Please login to continue" ||
      error.response.data.message === "User not found"
    ) {
      dispatch(fetchUserFailure(error.response.data.message));
    }
  }
};

export {
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
  fetchUserRequest,
  fetchUserSuccess,
  fetchUserFailure,
  initialState,
};
