import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./state/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import Landing from "./pages/Landing.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import HealthCheck from "./pages/HealthCheck.jsx";
import Result from "./pages/Result.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import Analytics from "./pages/Analytics.jsx";
import Layout from "./components/Layout.jsx";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="page-center">Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user || user.role !== "admin") {
    return <Navigate to="/app/dashboard" replace />;
  }
  return children;
};

const App = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<Login />} />
    <Route
      path="/app"
      element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to="/app/dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="health-check" element={<HealthCheck />} />
      <Route path="result/:id" element={<Result />} />
      <Route
        path="admin"
        element={
          <AdminRoute>
            <AdminPanel />
          </AdminRoute>
        }
      />
      <Route
        path="analytics"
        element={
          <AdminRoute>
            <Analytics />
          </AdminRoute>
        }
      />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
