import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Pin from "./Pages/Pin";
import Register from "./Pages/Register";
import CreatePin from "./Pages/CreatePin";
import Plus from "./svg/Plus";
import ProtectedRoute from "./helpers/ProtectedRoute";
import Profile from "./Pages/Profile";
import Settings from "./Pages/Settings";

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/pin/:username" element={<Pin />} />
          <Route path="/pin-builder" element={<CreatePin />} />
          <Route path="/:username" element={<Profile />} />
        </Route>
      </Routes>
      <CreateBtn />
    </>
  );
};

const CreateBtn = () => {
  return (
    <div className="fixed bottom-14 right-10 shadow w-14 h-14 bg-white rounded-full">
      <Link
        to="/pin-builder"
        className="w-full h-full flex justify-center items-center"
      >
        <Plus />
      </Link>
    </div>
  );
};

export default App;
