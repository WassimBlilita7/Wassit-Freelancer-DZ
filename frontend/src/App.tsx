import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { Signup } from "./pages/Signup";
import { ToastProvider } from "./components/common/ToastProvider";
import { VerifyOTP } from "./pages/VerifyOTP";
import { Login } from "./pages/Login";
import { Logout } from "./pages/Logout";

function App() {
  return (
    <Router>
      <ToastProvider />
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            {/* Ajoutez d'autres routes ici */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;