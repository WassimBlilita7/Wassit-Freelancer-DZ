// src/App.tsx
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { Signup } from "./pages/Signup";
import { VerifyOTP } from "./pages/VerifyOTP";
import { Login } from "./pages/Login";
import { Logout } from "./pages/Logout";
import { SignupWithGoogle } from "./pages/SignupWithGoogle";
import { ToastProvider } from "./components/common/ToastProvider";
import { ThemeProvider } from "./context/ThemeContext"; // Import du ThemeProvider

function AppContent() {
  const location = useLocation();
  const hideHeaderAndFooter = ["/signup", "/login"].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--background)" }}>
      {!hideHeaderAndFooter && <Header />}
      <main className="container mx-auto p-4 flex-grow" style={{ backgroundColor: "var(--background)" }}>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/signup-with-google" element={<SignupWithGoogle />} />
        </Routes>
      </main>
      
    </div>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider> {/* Enveloppe l'application */}
        <ToastProvider />
        <AppContent />
      </ThemeProvider>
    </Router>
  );
}

export default App;