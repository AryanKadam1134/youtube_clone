import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom"; // React Router Dom

import Dashboard from "./pages/private/Dashboard";
import ProfilePage from "./pages/private/ProfilePage";

import Login from "./pages/authentication/Login";


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
          path="/login"
          element={!token ? <Login /> : <Navigate to="/dashboard" />}
        />

        {/* Authenticated Routes with Header */}
        <Route
          element={token ? <AuthenticatedLayout /> : <Navigate to="/home" />}
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile-page" element={<ProfilePage />} />
        </Route>

        {/* Unauthenticated Routes with Header */}
        <Route
          element={
            !token ? <UnauthenticatedLayout /> : <Navigate to="/dashboard" />
          }
        >
          <Route path="/home" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
