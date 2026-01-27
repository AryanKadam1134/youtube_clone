import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom"; // React Router Dom

import Dashboard from "./pages/private/Dashboard";
import Home from "./pages/public/Home";
import Login from "./pages/authentication/Login";
import Register from "./pages/authentication/Register";

import Header from "./components/Header";
import { useAuth } from "./context/AuthContext";

function AuthenticatedLayout() {
  return (
    <div>
      <Header />
      <div className="p-5 bg-[#0f0f0f]">
        <Outlet />
      </div>
    </div>
  );
}

function UnauthenticatedLayout() {
  return (
    <div>
      <Header />
      <div className="p-5 bg-[#0f0f0f]">
        <Outlet />
      </div>
    </div>
  );
}

function App() {
  const { token } = useAuth();

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={token ? "/dashboard" : "/home"} />}
        />
        <Route
          path="/home"
          element={!token ? <UnauthenticatedLayout /> : <AuthenticatedLayout />}
        />

        {/* Authenticated Routes with Header */}
        <Route
          element={token ? <AuthenticatedLayout /> : <Navigate to="/home" />}
        >
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Unauthenticated Routes with Header */}
        <Route
          element={
            !token ? <UnauthenticatedLayout /> : <Navigate to="/dashboard" />
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
