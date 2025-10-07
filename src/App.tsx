import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MessageSquare, MessageCircle, Phone, Video, Facebook, Instagram, Linkedin } from "lucide-react";
import { FlowbiteLayout } from "./components/layout/FlowbiteLayout";
import FlowbiteIndex from "./pages/FlowbiteIndex";
import FlowbiteUnifiedInbox from "./pages/FlowbiteUnifiedInbox";
import FlowbiteWhatsAppChannel from "./pages/channels/FlowbiteWhatsAppChannel";
import FlowbiteEmailChannel from "./pages/channels/FlowbiteEmailChannel";
import FlowbiteGenericChannel from "./pages/channels/FlowbiteGenericChannel";
import ConversationDetail from "./pages/ConversationDetail";
import CustomerDetail from "./pages/CustomerDetail";
import FlowbiteSettings from "./pages/FlowbiteSettings";
import FlowbiteAnalytics from "./pages/FlowbiteAnalytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FlowbiteIndex />} />
          <Route path="/unified-inbox" element={<FlowbiteLayout><FlowbiteUnifiedInbox /></FlowbiteLayout>} />
          <Route path="/unified-inbox/conversation/:id" element={<FlowbiteLayout><ConversationDetail /></FlowbiteLayout>} />
          <Route path="/customer/:id" element={<FlowbiteLayout><CustomerDetail /></FlowbiteLayout>} />
          <Route path="/settings" element={<FlowbiteLayout><FlowbiteSettings /></FlowbiteLayout>} />
          <Route path="/analytics" element={<FlowbiteLayout><FlowbiteAnalytics /></FlowbiteLayout>} />
          <Route path="/channels/whatsapp" element={<FlowbiteLayout><FlowbiteWhatsAppChannel /></FlowbiteLayout>} />
          <Route path="/channels/email" element={<FlowbiteLayout><FlowbiteEmailChannel /></FlowbiteLayout>} />
          <Route path="/channels/sms" element={<FlowbiteLayout><FlowbiteGenericChannel channelName="SMS" icon={MessageCircle} color="text-blue-600" /></FlowbiteLayout>} />
          <Route path="/channels/phone" element={<FlowbiteLayout><FlowbiteGenericChannel channelName="Telefoon" icon={Phone} color="text-purple-600" /></FlowbiteLayout>} />
          <Route path="/channels/video" element={<FlowbiteLayout><FlowbiteGenericChannel channelName="Video" icon={Video} color="text-red-600" /></FlowbiteLayout>} />
          <Route path="/channels/facebook" element={<FlowbiteLayout><FlowbiteGenericChannel channelName="Facebook" icon={Facebook} color="text-indigo-600" /></FlowbiteLayout>} />
          <Route path="/channels/instagram" element={<FlowbiteLayout><FlowbiteGenericChannel channelName="Instagram" icon={Instagram} color="text-pink-600" /></FlowbiteLayout>} />
          <Route path="/channels/linkedin" element={<FlowbiteLayout><FlowbiteGenericChannel channelName="LinkedIn" icon={Linkedin} color="text-blue-600" /></FlowbiteLayout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
