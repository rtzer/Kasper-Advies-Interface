import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MessageSquare, MessageCircle, Phone, Video, Facebook, Instagram, Linkedin } from "lucide-react";
import { FlowbiteLayout } from "./components/layout/FlowbiteLayout";
import AppLayout from "./layouts/AppLayout";
import BottomNav from "./layouts/BottomNav";
import { useTheme } from "./hooks/useTheme";
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

const App = () => {
  useTheme();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FlowbiteIndex />} />
          <Route path="/inbox" element={<AppLayout><InboxPage /></AppLayout>} />
          <Route path="/unified-inbox" element={<AppLayout><FlowbiteUnifiedInbox /></AppLayout>} />
          <Route path="/unified-inbox/conversation/:id" element={<AppLayout><FlowbiteConversationDetail /></AppLayout>} />
          <Route path="/customer/:id" element={<AppLayout><FlowbiteCustomerDetail /></AppLayout>} />
          <Route path="/clients/:id" element={<AppLayout><ClientDetailPage /></AppLayout>} />
          <Route path="/assignments" element={<AppLayout><AssignmentsPage /></AppLayout>} />
          <Route path="/tasks" element={<AppLayout><TasksPage /></AppLayout>} />
          <Route path="/settings" element={<AppLayout><FlowbiteSettings /></AppLayout>} />
          <Route path="/analytics" element={<AppLayout><FlowbiteAnalytics /></AppLayout>} />
          <Route path="/channels/whatsapp" element={<AppLayout><ChannelWhatsAppPage /></AppLayout>} />
          <Route path="/channels/email" element={<AppLayout><ChannelEmailPage /></AppLayout>} />
          <Route path="/channels/phone" element={<AppLayout><ChannelPhonePage /></AppLayout>} />
          <Route path="/channels/video" element={<AppLayout><ChannelVideoPage /></AppLayout>} />
          <Route path="/channels/sms" element={<AppLayout><FlowbiteGenericChannel channelName="SMS" icon={MessageCircle} color="text-blue-600" /></AppLayout>} />
          <Route path="/channels/facebook" element={<AppLayout><FlowbiteGenericChannel channelName="Facebook" icon={Facebook} color="text-indigo-600" /></AppLayout>} />
          <Route path="/channels/instagram" element={<AppLayout><FlowbiteGenericChannel channelName="Instagram" icon={Instagram} color="text-pink-600" /></AppLayout>} />
          <Route path="/channels/linkedin" element={<AppLayout><FlowbiteGenericChannel channelName="LinkedIn" icon={Linkedin} color="text-blue-600" /></AppLayout>} />
          <Route path="/conversations" element={<AppLayout><div className="p-6"><h1 className="text-2xl font-semibold text-ka-navy dark:text-white">Alle Gesprekken</h1></div></AppLayout>} />
          <Route path="/clients" element={<AppLayout><div className="p-6"><h1 className="text-2xl font-semibold text-ka-navy dark:text-white">Klanten</h1></div></AppLayout>} />
          <Route path="/opdrachten" element={<AppLayout><AssignmentsPage /></AppLayout>} />
          <Route path="/taken" element={<AppLayout><TasksPage /></AppLayout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<FlowbiteNotFound />} />
        </Routes>
        <BottomNav />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
