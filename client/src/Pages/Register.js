import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../svg/Logo";
import axios from "axios";
import { useDispatch } from "react-redux";
import { fetchUser } from "../redux/actions/userActions";
import Spinner from "../helpers/Spinner";
import TextField from "@mui/material/TextField";

const Register = () => {
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

  const [register, setRegister] = useState({
    name: "",
    password: "",
    confirmPassword: "",
    email: "",
  });

  const handleChange = (e) => {
    setRegister({
      ...register,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log(register);
      const { data } = await axios.post("/api/user", register);
      setLoading(false);

      console.log("Register user reponse: ", data);

      if (data.status === 201) {
        dispatch(fetchUser());
        Navigate("/");
      }
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
      setRegister({
        ...register,
        password: "",
        confirmPassword: "",
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

        <h1 className="text-4xl font-semibold mt-6">Create a new Account</h1>
        <p className="text-md mt-1">Find new ideas to try</p>

        <form onSubmit={handleSubmit} className="mt-6">
          {error && (
            <div className="relative px-4 py-2 bg-red-500 bg-opacity-90 font-semibold text-white border-2 border-red-700 rounded-md">
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
            name="name"
            label="Full Name"
            className="w-full"
            style={{ marginTop: "4px", marginBottom: "15px" }}
            variant="outlined"
            value={register.name}
            onChange={handleChange}
          />
          <TextField
            id="outlined-basic"
            name="email"
            type={"email"}
            label="Email"
            className="w-full"
            style={{ marginTop: "15px", marginBottom: "15px" }}
            variant="outlined"
            value={register.email}
            onChange={handleChange}
          />

          <div className="relative">
            <TextField
              id="outlined-basic"
              name="password"
              type={showPassword ? "text" : "password"}
              label="Password"
              className="w-full"
              style={{ marginTop: "4px", marginBottom: "15px" }}
              variant="outlined"
              value={register.password}
              onChange={handleChange}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              type="button"
              className="absolute right-6"
              style={{ top: "45%", transform: "translateY(-55%)" }}
            >
              <i
                className={`uil uil-eye${
                  !showPassword ? "-slash" : ""
                } text-xl`}
              ></i>
            </button>
          </div>
          <div className="relative">
            <TextField
              id="outlined-basic"
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              label="Confirm Password"
              className="w-full"
              style={{ marginTop: "4px", marginBottom: "15px" }}
              variant="outlined"
              value={register.confirmPassword}
              onChange={handleChange}
            />
            <button
              type="submit"
              className="w-full rounded-full bg-red-600 text-white font-semibold py-3 text-lg flex justify-center items-center gap-2"
            >
              {loading && <Spinner />}
              Continue
            </button>
          </div>
          <p className="text-sm mt-4">
            By continuing, you agree to Pinme's{" "}
            <strong> Terms of Service </strong> and acknowledge you've read our{" "}
            <strong> Privacy Policy</strong>
          </p>
          <p className="text-mg mt-4">
            Already on Pinme?{" "}
            <Link to="/login">
              <strong>Login</strong>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
