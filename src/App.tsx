import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { MessageSquare, MessageCircle, Phone, Video, Facebook, Instagram, Linkedin } from "lucide-react";
import AppLayout from "./layouts/AppLayout";
import BottomNav from "./layouts/BottomNav";
import { useTheme } from "./hooks/useTheme";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import ClientLoginPage from "./pages/ClientLoginPage";
import ClientsPage from "./pages/ClientsPage";
import ClientDetailPage from "./pages/ClientDetailPage";
import MyClientsPage from "./pages/clients/MyClientsPage";
import AssignmentsPage from "./pages/AssignmentsPage";
import AssignmentDetailPage from "./pages/AssignmentDetailPage";
import AwaitingApprovalPage from "./pages/opdrachten/AwaitingApprovalPage";
import ByTypePage from "./pages/opdrachten/ByTypePage";
import TasksPage from "./pages/TasksPage";
import TaskDetailPage from "./pages/TaskDetailPage";
import TeamTasksPage from "./pages/taken/TeamTasksPage";
import ToReviewPage from "./pages/taken/ToReviewPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import MyProjectsPage from "./pages/projects/MyProjectsPage";
import ProjectsCalendar from "./components/projects/ProjectsCalendar";
import BulkProjectsPage from "./pages/BulkProjectsPage";
import LateClientsPage from "./pages/LateClientsPage";
import TeamWorkloadPage from "./pages/TeamWorkloadPage";
import ClientPortalPage from "./pages/ClientPortalPage";
import BrandGuidePage from "./pages/BrandGuidePage";
import BrandAuditPage from "./pages/BrandAuditPage";
import ExtendedBrandGuidePage from "./pages/ExtendedBrandGuidePage";
import JulienPage from "./pages/JulienPage";
import HomePage from "./pages/HomePage";
import DienstenMKB from "./pages/DienstenMKB";
import DienstenZZP from "./pages/DienstenZZP";
import ContactKaspers from "./pages/ContactKaspers";
import FlowbiteUnifiedInbox from "./pages/FlowbiteUnifiedInbox";
import FlowbiteWhatsAppChannel from "./pages/channels/FlowbiteWhatsAppChannel";
import FlowbiteEmailChannel from "./pages/channels/FlowbiteEmailChannel";
import FlowbiteGenericChannel from "./pages/channels/FlowbiteGenericChannel";
import FlowbiteConversationDetail from "./pages/FlowbiteConversationDetail";
import FlowbiteCustomerDetail from "./pages/FlowbiteCustomerDetail";
import FlowbiteSettings from "./pages/FlowbiteSettings";
import FlowbiteAnalytics from "./pages/FlowbiteAnalytics";
import FlowbiteNotFound from "./pages/FlowbiteNotFound";
import ProspectsPage from "./pages/ProspectsPage";
import InboxReviewPage from "./pages/InboxReviewPage";

const queryClient = new QueryClient();

const AppContent = () => {
  useKeyboardShortcuts();
  return null;
};

const App = () => {
  useTheme();
  
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
            <AppContent />
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/client-login" element={<ClientLoginPage />} />
              <Route path="/kaspers-advies" element={<HomePage />} />
              <Route path="/diensten-mkb" element={<DienstenMKB />} />
              <Route path="/diensten-zzp" element={<DienstenZZP />} />
              <Route path="/contact-kaspers" element={<ContactKaspers />} />
              
              {/* Protected routes - Inbox & Communication */}
              <Route path="/" element={<ProtectedRoute><AppLayout><FlowbiteUnifiedInbox /></AppLayout></ProtectedRoute>} />
              <Route path="/inbox/review" element={<ProtectedRoute><AppLayout><InboxReviewPage /></AppLayout></ProtectedRoute>} />
              <Route path="/unified-inbox/conversation/:id" element={<ProtectedRoute><AppLayout><FlowbiteConversationDetail /></AppLayout></ProtectedRoute>} />
              <Route path="/customers/:id" element={<ProtectedRoute><AppLayout><FlowbiteCustomerDetail /></AppLayout></ProtectedRoute>} />
              
              {/* Prospects route */}
              <Route path="/prospects" element={<ProtectedRoute><AppLayout><ProspectsPage /></AppLayout></ProtectedRoute>} />
              
              {/* Klanten routes */}
              <Route path="/clients" element={<ProtectedRoute><AppLayout><ClientsPage /></AppLayout></ProtectedRoute>} />
              <Route path="/clients/my" element={<ProtectedRoute><AppLayout><MyClientsPage /></AppLayout></ProtectedRoute>} />
              <Route path="/clients/late-payers" element={<ProtectedRoute><AppLayout><LateClientsPage /></AppLayout></ProtectedRoute>} />
              <Route path="/clients/:id" element={<ProtectedRoute><AppLayout><ClientDetailPage /></AppLayout></ProtectedRoute>} />
              
              {/* Projecten routes */}
              <Route path="/projects" element={<ProtectedRoute><AppLayout><ProjectsPage /></AppLayout></ProtectedRoute>} />
              <Route path="/projects/my" element={<ProtectedRoute><AppLayout><MyProjectsPage /></AppLayout></ProtectedRoute>} />
              <Route path="/projects/calendar" element={<ProtectedRoute><AppLayout><ProjectsPage /></AppLayout></ProtectedRoute>} />
              <Route path="/projects/bulk" element={<ProtectedRoute><AppLayout><BulkProjectsPage /></AppLayout></ProtectedRoute>} />
              <Route path="/projects/workload" element={<ProtectedRoute><AppLayout><TeamWorkloadPage /></AppLayout></ProtectedRoute>} />
              <Route path="/projects/:id" element={<ProtectedRoute><AppLayout><ProjectDetailPage /></AppLayout></ProtectedRoute>} />
              
              {/* Assignments (Opdrachten) routes */}
              <Route path="/assignments" element={<ProtectedRoute><AppLayout><AssignmentsPage /></AppLayout></ProtectedRoute>} />
              <Route path="/assignments/my" element={<ProtectedRoute><AppLayout><AssignmentsPage /></AppLayout></ProtectedRoute>} />
              <Route path="/assignments/pending" element={<ProtectedRoute><AppLayout><AwaitingApprovalPage /></AppLayout></ProtectedRoute>} />
              <Route path="/assignments/by-type" element={<ProtectedRoute><AppLayout><ByTypePage /></AppLayout></ProtectedRoute>} />
              <Route path="/assignments/:id" element={<ProtectedRoute><AppLayout><AssignmentDetailPage /></AppLayout></ProtectedRoute>} />
              
              {/* Tasks (Taken) routes */}
              <Route path="/tasks" element={<ProtectedRoute><AppLayout><TasksPage /></AppLayout></ProtectedRoute>} />
              <Route path="/tasks/team" element={<ProtectedRoute><AppLayout><TeamTasksPage /></AppLayout></ProtectedRoute>} />
              <Route path="/tasks/review" element={<ProtectedRoute><AppLayout><ToReviewPage /></AppLayout></ProtectedRoute>} />
              <Route path="/tasks/:id" element={<ProtectedRoute><AppLayout><TaskDetailPage /></AppLayout></ProtectedRoute>} />
              
              {/* Other protected routes */}
              <Route path="/settings" element={<ProtectedRoute><AppLayout><FlowbiteSettings /></AppLayout></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><AppLayout><FlowbiteAnalytics /></AppLayout></ProtectedRoute>} />
              <Route path="/channels/sms" element={<ProtectedRoute><AppLayout><FlowbiteGenericChannel channelName="SMS" icon={MessageCircle} color="text-blue-600" /></AppLayout></ProtectedRoute>} />
              <Route path="/channels/facebook" element={<ProtectedRoute><AppLayout><FlowbiteGenericChannel channelName="Facebook" icon={Facebook} color="text-indigo-600" /></AppLayout></ProtectedRoute>} />
              <Route path="/channels/instagram" element={<ProtectedRoute><AppLayout><FlowbiteGenericChannel channelName="Instagram" icon={Instagram} color="text-pink-600" /></AppLayout></ProtectedRoute>} />
              <Route path="/channels/linkedin" element={<ProtectedRoute><AppLayout><FlowbiteGenericChannel channelName="LinkedIn" icon={Linkedin} color="text-blue-600" /></AppLayout></ProtectedRoute>} />
              
              {/* Client Portal */}
              <Route path="/client-portal" element={<ProtectedRoute><ClientPortalPage /></ProtectedRoute>} />
              
              {/* Project Info & Documentation */}
              <Route path="/brand-guide" element={<ProtectedRoute><AppLayout><BrandGuidePage /></AppLayout></ProtectedRoute>} />
              <Route path="/brand-audit" element={<ProtectedRoute><AppLayout><BrandAuditPage /></AppLayout></ProtectedRoute>} />
              <Route path="/brand-guide-extended" element={<ProtectedRoute><ExtendedBrandGuidePage /></ProtectedRoute>} />
              <Route path="/julien" element={<ProtectedRoute><AppLayout><JulienPage /></AppLayout></ProtectedRoute>} />
              
              {/* 404 - Must be last */}
              <Route path="*" element={<FlowbiteNotFound />} />
            </Routes>
            <BottomNav />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
