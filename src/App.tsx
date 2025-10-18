import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/pages/Login";
import Dashboard from "./components/pages/Dashboard";

export default function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        {/* ログインページ */}
        <Route path="/" element={<Login />} />

        {/* 認証が必要なページ */}
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
