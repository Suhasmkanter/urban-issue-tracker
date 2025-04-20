
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import ComplaintsPage from "./pages/ComplaintsPage";
import NewComplaintPage from "./pages/NewComplaintPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import EmergencyPage from "./pages/EmergencyPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={
              <Layout>
                <DashboardPage />
              </Layout>
            } />
            <Route path="/departments" element={
              <Layout>
                <DepartmentsPage />
              </Layout>
            } />
            <Route path="/departments/:id" element={
              <Layout>
                <DepartmentsPage />
              </Layout>
            } />
            <Route path="/complaints" element={
              <Layout>
                <ComplaintsPage />
              </Layout>
            } />
            <Route path="/complaints/new" element={
              <Layout>
                <NewComplaintPage />
              </Layout>
            } />
            <Route path="/complaints/:id" element={
              <Layout>
                <ComplaintsPage />
              </Layout>
            } />
            <Route path="/analytics" element={
              <Layout>
                <AnalyticsPage />
              </Layout>
            } />
            <Route path="/emergency" element={
              <Layout>
                <EmergencyPage />
              </Layout>
            } />
            <Route path="/profile" element={
              <Layout>
                <ProfilePage />
              </Layout>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
