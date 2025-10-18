import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import type { JSX } from "react";
import Runner from "./pages/Runner";
import Monitor from "./pages/Monitor";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ログインページ */}
        <Route path="/" element={<Login />} />

        {/* 認証が必要なページ */}
        {/* (デフォルト) ダッシュボードページ */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* モニターページ */}
        <Route
          path="/monitors"
          element={
            <ProtectedRoute>
              <Monitor />
            </ProtectedRoute>
          }
        />

        {/* ランナーページ */}
        <Route
          path="/runners"
          element={
            <ProtectedRoute>
              <Runner />
            </ProtectedRoute>
          }
        />

        {/* 設定ページ */}
        {/* <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Setting />
            </ProtectedRoute>
          }
        /> */}
      </Routes>
    </BrowserRouter>
  );
}
