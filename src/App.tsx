import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";

import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppShell } from "./components/AppShell";
import SplashScreen from "./components/SplashScreen";

import Dashboard from "./pages/app/Dashboard";
import Transactions from "./pages/app/Transactions";
import Categories from "./pages/app/Categories";
import Accounts from "./pages/app/Accounts";
import Budgets from "./pages/app/Budgets";
import Goals from "./pages/app/Goals";
import Analytics from "./pages/app/Analytics";
import Settings from "./pages/app/Settings";

import { useThemeStore } from "./store/theme";

const queryClient = new QueryClient();

const App = () => {
  // Apply theme on mount in case persist hydrates before listener
  const theme = useThemeStore((s) => s.theme);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/welcome" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route path="/app" element={<ProtectedRoute><AppShell><Dashboard /></AppShell></ProtectedRoute>} />
            <Route path="/app/transactions" element={<ProtectedRoute><AppShell><Transactions /></AppShell></ProtectedRoute>} />
            <Route path="/app/categories" element={<ProtectedRoute><AppShell><Categories /></AppShell></ProtectedRoute>} />
            <Route path="/app/accounts" element={<ProtectedRoute><AppShell><Accounts /></AppShell></ProtectedRoute>} />
            <Route path="/app/budgets" element={<ProtectedRoute><AppShell><Budgets /></AppShell></ProtectedRoute>} />
            <Route path="/app/goals" element={<ProtectedRoute><AppShell><Goals /></AppShell></ProtectedRoute>} />
            <Route path="/app/analytics" element={<ProtectedRoute><AppShell><Analytics /></AppShell></ProtectedRoute>} />
            <Route path="/app/settings" element={<ProtectedRoute><AppShell><Settings /></AppShell></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
