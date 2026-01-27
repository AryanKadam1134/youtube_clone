import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom"; // React Router Dom

import Home from "./pages/public/Home";

import Header from "./components/Header";

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

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AuthenticatedLayout />}>
          <Route path="/home" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
