import React, { Fragment } from "react";
import { Routes, Route } from "react-router-dom";

import LoginPage from "../pages/login/LoginPage";
import MainPage from "../pages/main/MainPage";
import UserRegisterPage from "../pages/Register/UserRegisterPage";
import Navbar from "./nav/Navbar";

function App() {
  return (
    <Fragment>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<MainPage />} />
        <Route exact path="/new-user" element={<UserRegisterPage />} />
        <Route exact path="/login" element={<LoginPage />} />
      </Routes>
    </Fragment>
  );
}

export default App;
