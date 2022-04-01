import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../helpers/Spinner";
import { fetchUser } from "../redux/actions/userActions";
import Logo from "../svg/Logo";
import { Box, TextField } from "@mui/material";

const Login = () => {
  const Navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (error !== "") {
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  }, [error]);

  const [login, setLogin] = useState({
    password: "",
    email: "",
  });

  const handleChange = (e) => {
    setLogin({
      ...login,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post("/api/user/login", login);
      setLoading(false);
      console.log("Login use reponse: ", data);
      if (data.status === 200) {
        dispatch(fetchUser());
        Navigate("/");
      }
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
      setLogin({
        ...login,
        password: "",
      });
      console.log(error.response.data.message);
    }
  };

  return (
    <div className="pt-24">
      <div className="rounded-xl text-center m-auto mt-14 loginCard py-8 px-6 w-[30rem]">
        <Link to="/" className="logo flex justify-center items-center">
          <Logo width={40} />
        </Link>
        <h1 className="text-4xl font-semibold my-6">Welcome to Pinme</h1>
        <form className="w-full" onSubmit={handleSubmit}>
          {error && (
            <div className="relative px-4 py-3 bg-red-500 bg-opacity-80 font-semibold text-white border-4 border-red-300 rounded-md mb-8">
              {error}
              <span
                className="text-white absolute top-1/4 right-2 cursor-pointer"
                onClick={() => setError("")}
              >
                <i className="uil uil-times"></i>
              </span>
            </div>
          )}
          <TextField
            id="outlined-basic"
            name="email"
            type="email"
            label="Email"
            className="w-full"
            variant="outlined"
            value={login.email}
            onChange={handleChange}
          />
          <div className="relative">
            <TextField
              id="outlined-basic"
              type={showPassword ? "text" : "password"}
              style={{ marginTop: "25px", marginBottom: "15px" }}
              name="password"
              label="Password"
              className="w-full"
              variant="outlined"
              value={login.password}
              onChange={handleChange}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              type="button"
              className="absolute right-6"
              style={{ top: "55%", transform: "translateY(-50%)" }}
            >
              <i
                className={`uil uil-eye${
                  !showPassword ? "-slash" : ""
                } text-xl`}
              ></i>
            </button>
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-red-600 text-white font-semibold py-3 text-lg flex justify-center items-center gap-2"
          >
            {loading && <Spinner />}
            Login
          </button>
          <p className="text-mg mt-4">
            Not on Pinme yet?{" "}
            <Link to="/create-account">
              <strong>Sign up</strong>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
