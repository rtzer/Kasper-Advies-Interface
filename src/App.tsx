import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MessageSquare, MessageCircle, Phone, Video, Facebook, Instagram, Linkedin } from "lucide-react";
import { MainLayout } from "./components/layout/MainLayout";
import Index from "./pages/Index";
import UnifiedInbox from "./pages/UnifiedInbox";
import WhatsAppChannel from "./pages/channels/WhatsAppChannel";
import EmailChannel from "./pages/channels/EmailChannel";
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
          <Route path="/unified-inbox" element={<MainLayout><UnifiedInbox /></MainLayout>} />
          <Route path="/unified-inbox/conversation/:id" element={<MainLayout><ConversationDetail /></MainLayout>} />
          <Route path="/customer/:id" element={<MainLayout><CustomerDetail /></MainLayout>} />
          <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />
          <Route path="/analytics" element={<MainLayout><Analytics /></MainLayout>} />
          <Route path="/channels/whatsapp" element={<MainLayout><WhatsAppChannel /></MainLayout>} />
          <Route path="/channels/email" element={<MainLayout><EmailChannel /></MainLayout>} />
          <Route path="/channels/sms" element={<MainLayout><GenericChannel channelName="SMS" icon={MessageCircle} color="text-channel-phone" /></MainLayout>} />
          <Route path="/channels/phone" element={<MainLayout><GenericChannel channelName="Telefoon" icon={Phone} color="text-channel-phone" /></MainLayout>} />
          <Route path="/channels/video" element={<MainLayout><GenericChannel channelName="Video" icon={Video} color="text-channel-video" /></MainLayout>} />
          <Route path="/channels/facebook" element={<MainLayout><GenericChannel channelName="Facebook" icon={Facebook} color="text-channel-social" /></MainLayout>} />
          <Route path="/channels/instagram" element={<MainLayout><GenericChannel channelName="Instagram" icon={Instagram} color="text-channel-social" /></MainLayout>} />
          <Route path="/channels/linkedin" element={<MainLayout><GenericChannel channelName="LinkedIn" icon={Linkedin} color="text-channel-email" /></MainLayout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
