import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../redux/actions/userActions";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const { user } = useSelector((state) => state);
  const dispatch = useDispatch();
  let location = useLocation();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    if (user.error) {
      return (location.pathname = "/login");
    }
  }, [user, location]);

  if (
    (!user.loading &&
      JSON.stringify(user.user) === "{}" &&
      user.error === "Please login to continue") ||
    user.error === "User not found"
  ) {
    return <Navigate to="/login" state={{ from: location }} />;
  } else {
    return <Outlet />;
  }
};

export default ProtectedRoute;
