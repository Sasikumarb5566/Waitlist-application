import React from "react";
import { Routes, Route } from "react-router-dom";
import PageNotFound from "../pages/404/PageNotFound";
import UserLogin from "../pages/user-login/UserLogin";
import UserSignup from "../pages/user-signup/UserSignup";
import UserDashboard from "../pages/user-dashboard/UserDashboard";
import AdminLogin from "../pages/admin-login/AdminLogin";
import AdminDashboard from "../pages/admin-dashboard/AdminDashboard";

const Router = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<UserLogin />} /> 
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
};

export default Router;
