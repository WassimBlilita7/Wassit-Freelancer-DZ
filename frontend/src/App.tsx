// src/App.tsx
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { Signup } from "./pages/Signup";
import { VerifyOTP } from "./pages/VerifyOTP";
import { Login } from "./pages/Login";
import { Logout } from "./pages/Logout";
import { SignupWithGoogle } from "./pages/SignupWithGoogle";
import { Home } from "./pages/home/Home";
import { NewProject } from "./pages/NewProject";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { Profile } from "./pages/Profile";
import { AllPosts } from "./pages/AllPosts";
import { ToastProvider } from "./components/common/ToastProvider";
import { ThemeProvider } from "./context/ThemeContext";
import { SearchResults } from "./pages/SearchResults";
import CategoryPage from "./pages/CategoryPage"; // Pas besoin d'importer comme { CategoryPage }
import { Footer } from "./components/layout/Footer";
import { PostProvider } from "./context/PostContext";

function AppContent() {
  const location = useLocation();

  const hideHeader = ["/signup", "/login", "/verify-otp", "/forgot-password", "/reset-password"].includes(
    location.pathname
  );

  const showFooter = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--background)" }}>
      {!hideHeader && <Header />}
      <main className="container mx-auto p-4 flex-grow" style={{ backgroundColor: "var(--background)" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/signup-with-google" element={<SignupWithGoogle />} />
          <Route path="/new-project" element={<NewProject />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/all-posts" element={<AllPosts />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} /> {/* Changé slug en categoryId */}
          <Route path="*" element={<div>404 - Page non trouvée</div>} />
        </Routes>
      </main>
      {showFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <PostProvider>
        <ThemeProvider>
          <ToastProvider /> {/* ToastProvider doit être un composant, pas un contexte */}
          <AppContent />
        </ThemeProvider>
      </PostProvider>
    </Router>
  );
}

export default App;