import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MessageSquare, MessageCircle, Phone, Video, Facebook, Instagram, Linkedin } from "lucide-react";
import AppLayout from "./layouts/AppLayout";
import BottomNav from "./layouts/BottomNav";
import { useTheme } from "./hooks/useTheme";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import FlowbiteIndex from "./pages/FlowbiteIndex";
import InboxPage from "./pages/InboxPage";
import ClientDetailPage from "./pages/ClientDetailPage";
import AssignmentsPage from "./pages/AssignmentsPage";
import TasksPage from "./pages/TasksPage";
import ChannelWhatsAppPage from "./pages/channels/ChannelWhatsAppPage";
import ChannelEmailPage from "./pages/channels/ChannelEmailPage";
import ChannelPhonePage from "./pages/channels/ChannelPhonePage";
import ChannelVideoPage from "./pages/channels/ChannelVideoPage";
import FlowbiteUnifiedInbox from "./pages/FlowbiteUnifiedInbox";
import FlowbiteWhatsAppChannel from "./pages/channels/FlowbiteWhatsAppChannel";
import FlowbiteEmailChannel from "./pages/channels/FlowbiteEmailChannel";
import FlowbiteGenericChannel from "./pages/channels/FlowbiteGenericChannel";
import FlowbiteConversationDetail from "./pages/FlowbiteConversationDetail";
import FlowbiteCustomerDetail from "./pages/FlowbiteCustomerDetail";
import FlowbiteSettings from "./pages/FlowbiteSettings";
import FlowbiteAnalytics from "./pages/FlowbiteAnalytics";
import FlowbiteNotFound from "./pages/FlowbiteNotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  useKeyboardShortcuts();
  return null;
};

const App = () => {
  useTheme();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppContent />
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<FlowbiteIndex />} />
              
              {/* Protected routes */}
              <Route path="/inbox" element={<ProtectedRoute><AppLayout><InboxPage /></AppLayout></ProtectedRoute>} />
              <Route path="/unified-inbox" element={<ProtectedRoute><AppLayout><FlowbiteUnifiedInbox /></AppLayout></ProtectedRoute>} />
              <Route path="/unified-inbox/conversation/:id" element={<ProtectedRoute><AppLayout><FlowbiteConversationDetail /></AppLayout></ProtectedRoute>} />
              <Route path="/customer/:id" element={<ProtectedRoute><AppLayout><FlowbiteCustomerDetail /></AppLayout></ProtectedRoute>} />
              <Route path="/clients/:id" element={<ProtectedRoute><AppLayout><ClientDetailPage /></AppLayout></ProtectedRoute>} />
              <Route path="/assignments" element={<ProtectedRoute><AppLayout><AssignmentsPage /></AppLayout></ProtectedRoute>} />
              <Route path="/tasks" element={<ProtectedRoute><AppLayout><TasksPage /></AppLayout></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><AppLayout><FlowbiteSettings /></AppLayout></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><AppLayout><FlowbiteAnalytics /></AppLayout></ProtectedRoute>} />
              <Route path="/channels/whatsapp" element={<ProtectedRoute><AppLayout><ChannelWhatsAppPage /></AppLayout></ProtectedRoute>} />
              <Route path="/channels/email" element={<ProtectedRoute><AppLayout><ChannelEmailPage /></AppLayout></ProtectedRoute>} />
              <Route path="/channels/phone" element={<ProtectedRoute><AppLayout><ChannelPhonePage /></AppLayout></ProtectedRoute>} />
              <Route path="/channels/video" element={<ProtectedRoute><AppLayout><ChannelVideoPage /></AppLayout></ProtectedRoute>} />
              <Route path="/channels/sms" element={<ProtectedRoute><AppLayout><FlowbiteGenericChannel channelName="SMS" icon={MessageCircle} color="text-blue-600" /></AppLayout></ProtectedRoute>} />
              <Route path="/channels/facebook" element={<ProtectedRoute><AppLayout><FlowbiteGenericChannel channelName="Facebook" icon={Facebook} color="text-indigo-600" /></AppLayout></ProtectedRoute>} />
              <Route path="/channels/instagram" element={<ProtectedRoute><AppLayout><FlowbiteGenericChannel channelName="Instagram" icon={Instagram} color="text-pink-600" /></AppLayout></ProtectedRoute>} />
              <Route path="/channels/linkedin" element={<ProtectedRoute><AppLayout><FlowbiteGenericChannel channelName="LinkedIn" icon={Linkedin} color="text-blue-600" /></AppLayout></ProtectedRoute>} />
              <Route path="/conversations" element={<ProtectedRoute><AppLayout><div className="p-6"><h1 className="text-2xl font-semibold text-ka-navy dark:text-white">Alle Gesprekken</h1></div></AppLayout></ProtectedRoute>} />
              <Route path="/clients" element={<ProtectedRoute><AppLayout><div className="p-6"><h1 className="text-2xl font-semibold text-ka-navy dark:text-white">Klanten</h1></div></AppLayout></ProtectedRoute>} />
              <Route path="/opdrachten" element={<ProtectedRoute><AppLayout><AssignmentsPage /></AppLayout></ProtectedRoute>} />
              <Route path="/taken" element={<ProtectedRoute><AppLayout><TasksPage /></AppLayout></ProtectedRoute>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<FlowbiteNotFound />} />
            </Routes>
            <BottomNav />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
