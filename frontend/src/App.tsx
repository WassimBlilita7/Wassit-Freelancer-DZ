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
import CategoryPage from "./pages/CategoryPage";
import { Footer } from "./components/layout/Footer";
import { PostProvider } from "./context/PostContext";
import PostDetails from "./pages/PostDetail"; // Correctement importé
import { ProfilePage } from "./pages/ProfilePage";
import EditPost from "./pages/EditPost";
import { ApplicationsPage } from "./pages/ApplicationsPage";
import MyApplicationsPage from "./pages/MyApplicationsPage";
import NotFoundPage from './pages/NotFoundPage';
import { MessagesPage } from "./pages/MessagesPage";

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
          <Route path="/post/:postId" element={<PostDetails />} />
          <Route path="/post/:postId/applications" element={<ApplicationsPage />} />
          <Route path="/my-applications" element={<MyApplicationsPage />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/edit-post/:postId" element={<EditPost />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="*" element={<NotFoundPage />} />
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
          <ToastProvider />
          <AppContent />
        </ThemeProvider>
      </PostProvider>
    </Router>
  );
}

export default App;