import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
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
import FlowbiteConversationDetail from "./pages/FlowbiteConversationDetail";
import FlowbiteCustomerDetail from "./pages/FlowbiteCustomerDetail";
import FlowbiteSettings from "./pages/FlowbiteSettings";
import FlowbiteAnalytics from "./pages/FlowbiteAnalytics";
import FlowbiteNotFound from "./pages/FlowbiteNotFound";
import ProspectsPage from "./pages/ProspectsPage";
import InboxReviewPage from "./pages/InboxReviewPage";
import TeamPage from "./pages/TeamPage";

const queryClient = new QueryClient();

const AppContent = () => {
  useTheme();
  useKeyboardShortcuts();
  return null;
};

function ConditionalBottomNav() {
  const location = useLocation();
  // Only show bottom nav inside the employee app area
  if (!location.pathname.startsWith('/app')) return null;
  return <BottomNav />;
}

const App = () => {
  
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
              {/* Marketing / public site */}
              <Route path="/" element={<HomePage />} />
              <Route path="/diensten-mkb" element={<DienstenMKB />} />
              <Route path="/diensten-zzp" element={<DienstenZZP />} />
              <Route path="/contact-kaspers" element={<ContactKaspers />} />
              
              {/* Auth */}
              <Route path="/auth/login" element={<LoginPage />} />

              {/* Client Portal */}
              <Route path="/portal/login" element={<ClientLoginPage />} />
              <Route path="/portal" element={<ProtectedRoute><ClientPortalPage /></ProtectedRoute>} />

              {/* Employee App (protected) */}
              <Route path="/app/inbox" element={<ProtectedRoute><AppLayout><FlowbiteUnifiedInbox /></AppLayout></ProtectedRoute>} />
              <Route path="/app/inbox/review" element={<ProtectedRoute><AppLayout><InboxReviewPage /></AppLayout></ProtectedRoute>} />
              <Route path="/app/inbox/channels/:channel" element={<ProtectedRoute><AppLayout><FlowbiteUnifiedInbox /></AppLayout></ProtectedRoute>} />
              <Route path="/app/inbox/conversations/:id" element={<ProtectedRoute><AppLayout><FlowbiteConversationDetail /></AppLayout></ProtectedRoute>} />

              <Route path="/app/prospects" element={<ProtectedRoute><AppLayout><ProspectsPage /></AppLayout></ProtectedRoute>} />

              <Route path="/app/clients" element={<ProtectedRoute><AppLayout><ClientsPage /></AppLayout></ProtectedRoute>} />
              <Route path="/app/clients/mine" element={<ProtectedRoute><AppLayout><MyClientsPage /></AppLayout></ProtectedRoute>} />
              <Route path="/app/clients/late-payers" element={<ProtectedRoute><AppLayout><LateClientsPage /></AppLayout></ProtectedRoute>} />
              <Route path="/app/clients/:id" element={<ProtectedRoute><AppLayout><ClientDetailPage /></AppLayout></ProtectedRoute>} />

              <Route path="/app/projects" element={<ProtectedRoute><AppLayout><ProjectsPage /></AppLayout></ProtectedRoute>} />
              <Route path="/app/projects/mine" element={<ProtectedRoute><AppLayout><MyProjectsPage /></AppLayout></ProtectedRoute>} />
              <Route path="/app/projects/bulk-import" element={<ProtectedRoute><AppLayout><BulkProjectsPage /></AppLayout></ProtectedRoute>} />
              <Route path="/app/projects/workload" element={<ProtectedRoute><AppLayout><TeamWorkloadPage /></AppLayout></ProtectedRoute>} />
              <Route path="/app/projects/:id" element={<ProtectedRoute><AppLayout><ProjectDetailPage /></AppLayout></ProtectedRoute>} />

              <Route path="/app/assignments" element={<ProtectedRoute><AppLayout><AssignmentsPage /></AppLayout></ProtectedRoute>} />
              <Route path="/app/assignments/mine" element={<ProtectedRoute><AppLayout><AssignmentsPage /></AppLayout></ProtectedRoute>} />
              <Route path="/app/assignments/pending-approval" element={<ProtectedRoute><AppLayout><AwaitingApprovalPage /></AppLayout></ProtectedRoute>} />
              <Route path="/app/assignments/by-type" element={<ProtectedRoute><AppLayout><ByTypePage /></AppLayout></ProtectedRoute>} />
              <Route path="/app/assignments/:id" element={<ProtectedRoute><AppLayout><AssignmentDetailPage /></AppLayout></ProtectedRoute>} />

              <Route path="/app/tasks" element={<ProtectedRoute><AppLayout><TasksPage /></AppLayout></ProtectedRoute>} />
              <Route path="/app/tasks/team" element={<ProtectedRoute><AppLayout><TeamTasksPage /></AppLayout></ProtectedRoute>} />
              <Route path="/app/tasks/review" element={<ProtectedRoute><AppLayout><ToReviewPage /></AppLayout></ProtectedRoute>} />
              <Route path="/app/tasks/:id" element={<ProtectedRoute><AppLayout><TaskDetailPage /></AppLayout></ProtectedRoute>} />

              <Route path="/app/settings" element={<ProtectedRoute><AppLayout><FlowbiteSettings /></AppLayout></ProtectedRoute>} />
              <Route path="/app/settings/team" element={<ProtectedRoute><AppLayout><TeamPage /></AppLayout></ProtectedRoute>} />
              <Route path="/app/analytics" element={<ProtectedRoute><AppLayout><FlowbiteAnalytics /></AppLayout></ProtectedRoute>} />

              {/* Docs (employee app) */}
              <Route path="/app/docs/brand-guide" element={<ProtectedRoute><AppLayout><BrandGuidePage /></AppLayout></ProtectedRoute>} />
              <Route path="/app/docs/brand-audit" element={<ProtectedRoute><AppLayout><BrandAuditPage /></AppLayout></ProtectedRoute>} />
              <Route path="/app/docs/brand-guide-extended" element={<ProtectedRoute><AppLayout><ExtendedBrandGuidePage /></AppLayout></ProtectedRoute>} />
              <Route path="/app/docs/julien" element={<ProtectedRoute><AppLayout><JulienPage /></AppLayout></ProtectedRoute>} />
              
              {/* 404 - Must be last */}
              <Route path="*" element={<FlowbiteNotFound />} />
            </Routes>
            <ConditionalBottomNav />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
