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
            {/* Future routes will go here */}
            <Route path="/calendar" element={<div className="p-10 font-black">Calendar Under Construction</div>} />
            <Route path="/explore" element={<div className="p-10 font-black">Explore Under Construction</div>} />
            <Route path="/profile" element={<div className="p-10 font-black">Profile Under Construction</div>} />
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

