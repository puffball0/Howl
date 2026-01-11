import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Splash from "./pages/Splash";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Onboarding from "./pages/Onboarding";
import { cn } from "./lib/utils";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import TripDetails from "./pages/TripDetails";
import EditTrip from "./pages/EditTrip";
import CreateTrip from "./pages/CreateTrip";
import Groups from "./pages/Groups";
import Calendar from "./pages/Calendar";
import MyTrips from "./pages/MyTrips";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import GroupChat from "./pages/GroupChat";

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen bg-howl-navy flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-howl-orange border-t-transparent rounded-full animate-spin" />
    </div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// OAuth callback component
const AuthCallback = () => {
  // The AuthContext handles the token extraction from URL
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    if (user?.onboarding_completed) {
      return <Navigate to="/home" replace />;
    }
    return <Navigate to="/onboarding" replace />;
  }

  return <Navigate to="/login" replace />;
};

function AppContent() {
  const [loading, setLoading] = useState(() => {
    return !sessionStorage.getItem('startSplashShown');
  });
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Handle Splash Screen completion
  const handleSplashComplete = () => {
    sessionStorage.setItem('startSplashShown', 'true');
    setLoading(false);
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  if (loading) {
    return <Splash onComplete={handleSplashComplete} />;
  }

  return (
    <div className={cn(isDarkMode ? "dark" : "", "min-h-screen bg-background text-foreground font-sans")}>
      <Routes>
        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* OAuth callback */}
        <Route path="/auth/callback" element={<AuthCallback />} />

        <Route path="/onboarding" element={<Onboarding />} />

        {/* Core App Protected Routes */}
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/trip/:id" element={<TripDetails />} />
          <Route path="/trip/:id/edit" element={<EditTrip />} />
          <Route path="/create-trip" element={<CreateTrip />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/group/:id" element={<GroupChat />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/my-trips" element={<MyTrips />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;

