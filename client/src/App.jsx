import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/private/Dashboard";
import ProfilePage from "./pages/private/ProfilePage";

import Login from "./pages/authentication/Login";

import Header from "./components/Header";
import { useAuth } from "./context/AuthContext";
import VideoView from "./components/VideoView";
import WatchHistory from "./pages/private/WatchHistory";
import ChannelPage from "./pages/public/ChannelPage";

// Move layout components outside App to prevent recreation
function CommonView({ toggleSidebar, isSidebarOpen }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />
        <div className="flex-1 overflow-y-auto bg-[#0f0f0f]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function WideView({ toggleSidebar }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header toggleSidebar={toggleSidebar} />

      <div className="flex-1 overflow-y-auto bg-[#0f0f0f]">
        <Outlet />
      </div>
    </div>
  );
}

function App() {
  const { token } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
          element={
            token ? (
              <CommonView
                toggleSidebar={toggleSidebar}
                isSidebarOpen={isSidebarOpen}
              />
            ) : (
              <Navigate to="/home" />
            )
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile-page" element={<ProfilePage />} />
          <Route path="/watch-history" element={<WatchHistory />} />
          <Route path="/user-channel" element={<ChannelPage />} />
        </Route>

        <Route element={<WideView toggleSidebar={toggleSidebar} />}>
          <Route path="/video-view" element={<VideoView />} />
        </Route>

        {/* Unauthenticated Routes with Header */}
        <Route
          element={
            !token ? (
              <CommonView
                toggleSidebar={toggleSidebar}
                isSidebarOpen={isSidebarOpen}
              />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        >
          <Route path="/home" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
