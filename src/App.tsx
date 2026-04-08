import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/AppLayout";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import LeaguePage from "./pages/LeaguePage";
import CupPage from "./pages/CupPage";
import MatchesPage from "./pages/MatchesPage";
import BetsPage from "./pages/BetsPage";
import RulesPage from "./pages/RulesPage";
import PrizesPage from "./pages/PrizesPage";
import AdminMatchesPage from "./pages/AdminMatchesPage";
import AdminParticipantsPage from "./pages/AdminParticipantsPage";
import AdminConfigPage from "./pages/AdminConfigPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

import { SimulatorProvider } from "./contexts/SimulatorContext";
import SimMatchesPage from "./pages/simulator/SimMatchesPage";
import SimCupStandingsPage from "./pages/simulator/SimCupStandingsPage";
import SimBracketPage from "./pages/simulator/SimBracketPage";
import SimLeaguePage from "./pages/simulator/SimLeaguePage";
import SimBetsPage from "./pages/simulator/SimBetsPage";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <SimulatorProvider>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="*" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/liga" element={<LeaguePage />} />
                        <Route path="/copa" element={<CupPage />} />
                        <Route path="/jogos" element={<MatchesPage />} />
                        <Route path="/palpites" element={<BetsPage />} />
                        <Route path="/regras" element={<RulesPage />} />
                        <Route path="/premiacao" element={<PrizesPage />} />

                        <Route path="/simulador/jogos" element={<SimMatchesPage />} />
                        <Route path="/simulador/copa" element={<SimCupStandingsPage />} />
                        <Route path="/simulador/chaveamento" element={<SimBracketPage />} />
                        <Route path="/simulador/liga" element={<SimLeaguePage />} />
                        <Route path="/simulador/palpites" element={<SimBetsPage />} />
                        <Route path="/perfil" element={<ProfilePage />} />

                        <Route path="/admin/jogos" element={<ProtectedRoute requiredRole="admin"><AdminMatchesPage /></ProtectedRoute>} />
                        <Route path="/admin/participantes" element={<ProtectedRoute requiredRole="admin"><AdminParticipantsPage /></ProtectedRoute>} />
                        <Route path="/admin/config" element={<ProtectedRoute requiredRole="admin"><AdminConfigPage /></ProtectedRoute>} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </AppLayout>
                  </ProtectedRoute>
                } />
              </Routes>
            </SimulatorProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
