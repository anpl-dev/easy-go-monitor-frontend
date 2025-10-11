import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login.tsx";
import Dashboard from "./Dashboard.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
