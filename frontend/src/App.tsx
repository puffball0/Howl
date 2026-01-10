import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Splash from "./pages/Splash";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Onboarding from "./pages/Onboarding";
import { cn } from "./lib/utils";

import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import TripDetails from "./pages/TripDetails";
import CreateTrip from "./pages/CreateTrip";
import Groups from "./pages/Groups";
import Calendar from "./pages/Calendar";
import MyTrips from "./pages/MyTrips";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import GroupChat from "./pages/GroupChat";

function App() {
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Handle Splash Screen completion
  const handleSplashComplete = () => {
    setLoading(false);
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  if (loading) {
    return <Splash onComplete={handleSplashComplete} />;
  }

  return (
    <Router>
      <div className={cn(isDarkMode ? "dark" : "", "min-h-screen bg-background text-foreground font-sans")}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route path="/onboarding" element={<Onboarding />} />

          {/* Core App Protected Routes */}
          <Route element={<MainLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/trip/:id" element={<TripDetails />} />
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
    </Router>
  );
}

export default App;

