import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MessageSquare, MessageCircle, Phone, Video, Facebook, Instagram, Linkedin } from "lucide-react";
import { FlowbiteLayout } from "./components/layout/FlowbiteLayout";
import Index from "./pages/Index";
import FlowbiteUnifiedInbox from "./pages/FlowbiteUnifiedInbox";
import FlowbiteWhatsAppChannel from "./pages/channels/FlowbiteWhatsAppChannel";
import FlowbiteEmailChannel from "./pages/channels/FlowbiteEmailChannel";
import GenericChannel from "./pages/channels/GenericChannel";
import ConversationDetail from "./pages/ConversationDetail";
import CustomerDetail from "./pages/CustomerDetail";
import Settings from "./pages/Settings";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/unified-inbox" element={<FlowbiteLayout><FlowbiteUnifiedInbox /></FlowbiteLayout>} />
          <Route path="/unified-inbox/conversation/:id" element={<FlowbiteLayout><ConversationDetail /></FlowbiteLayout>} />
          <Route path="/customer/:id" element={<FlowbiteLayout><CustomerDetail /></FlowbiteLayout>} />
          <Route path="/settings" element={<FlowbiteLayout><Settings /></FlowbiteLayout>} />
          <Route path="/analytics" element={<FlowbiteLayout><Analytics /></FlowbiteLayout>} />
          <Route path="/channels/whatsapp" element={<FlowbiteLayout><FlowbiteWhatsAppChannel /></FlowbiteLayout>} />
          <Route path="/channels/email" element={<FlowbiteLayout><FlowbiteEmailChannel /></FlowbiteLayout>} />
          <Route path="/channels/sms" element={<FlowbiteLayout><GenericChannel channelName="SMS" icon={MessageCircle} color="text-channel-phone" /></FlowbiteLayout>} />
          <Route path="/channels/phone" element={<FlowbiteLayout><GenericChannel channelName="Telefoon" icon={Phone} color="text-channel-phone" /></FlowbiteLayout>} />
          <Route path="/channels/video" element={<FlowbiteLayout><GenericChannel channelName="Video" icon={Video} color="text-channel-video" /></FlowbiteLayout>} />
          <Route path="/channels/facebook" element={<FlowbiteLayout><GenericChannel channelName="Facebook" icon={Facebook} color="text-channel-social" /></FlowbiteLayout>} />
          <Route path="/channels/instagram" element={<FlowbiteLayout><GenericChannel channelName="Instagram" icon={Instagram} color="text-channel-social" /></FlowbiteLayout>} />
          <Route path="/channels/linkedin" element={<FlowbiteLayout><GenericChannel channelName="LinkedIn" icon={Linkedin} color="text-channel-email" /></FlowbiteLayout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
