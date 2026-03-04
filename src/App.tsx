import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "./pages/Dashboard";
import LeaguePage from "./pages/LeaguePage";
import CupPage from "./pages/CupPage";
import MatchesPage from "./pages/MatchesPage";
import BetsPage from "./pages/BetsPage";
import RulesPage from "./pages/RulesPage";
import AdminMatchesPage from "./pages/AdminMatchesPage";
import AdminParticipantsPage from "./pages/AdminParticipantsPage";
import AdminConfigPage from "./pages/AdminConfigPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/liga" element={<LeaguePage />} />
              <Route path="/copa" element={<CupPage />} />
              <Route path="/jogos" element={<MatchesPage />} />
              <Route path="/palpites" element={<BetsPage />} />
              <Route path="/regras" element={<RulesPage />} />
              <Route path="/admin/jogos" element={<AdminMatchesPage />} />
              <Route path="/admin/participantes" element={<AdminParticipantsPage />} />
              <Route path="/admin/config" element={<AdminConfigPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
