import { DollarSign, Trophy, Shield, Medal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

const prizes = [
  { label: "Campeão da Liga", value: "R$ 800", icon: Shield, color: "text-primary", bg: "bg-primary/40" },
  { label: "Vice da Liga", value: "R$ 300", icon: Shield, color: "text-muted-foreground", bg: "bg-muted" },
  { label: "3º da Liga", value: "R$ 200", icon: Medal, color: "text-warning", bg: "bg-warning/10" },
  { label: "Campeão da Copa", value: "R$ 400", icon: Trophy, color: "text-primary", bg: "bg-primary/40" },
  { label: "Vice da Copa", value: "R$ 200", icon: Trophy, color: "text-muted-foreground", bg: "bg-muted" },

];


export default function PrizesPage() {
  const totalPrize = 120 * 16;
  const totalDistributed = 800 + 400 + 300 + 200 + 200;

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="font-heading text-3xl font-bold flex items-center gap-3">
          <DollarSign className="h-8 w-8 text-primary" />
          Premiação
        </h1>
        <p className="text-muted-foreground mt-1">Distribuição dos prêmios do bolão</p>
      </div>

      <Card className="glass p-6">
        <h2 className="font-heading text-xl font-semibold mb-4">Inscrição</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-lg bg-muted">
            <p className="text-2xl font-heading font-bold text-primary">R$ 120</p>
            <p className="text-xs text-muted-foreground mt-1">por participante</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted">
            <p className="text-2xl font-heading font-bold">16</p>
            <p className="text-xs text-muted-foreground mt-1">participantes</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-primary/10 col-span-2 sm:col-span-1">
            <p className="text-2xl font-heading font-bold text-primary">R$ {totalPrize}</p>
            <p className="text-xs text-muted-foreground mt-1">total arrecadado</p>
          </div>
        </div>
      </Card>

      <Card className="glass p-6">
        <h2 className="font-heading text-xl font-semibold mb-4">Distribuição de Prêmios</h2>
        <div className="space-y-3">
          {prizes.map((prize, i) => (
            <motion.div
              key={prize.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className={`p-2.5 rounded-lg ${prize.bg}`}>
                <prize.icon className={`h-5 w-5 ${prize.color}`} />
              </div>
              <div className="flex-1">
                <p className="font-medium">{prize.label}</p>
              </div>
              <span className="text-xl font-heading font-bold text-primary">{prize.value}</span>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
          <span className="text-sm text-muted-foreground font-medium">Total distribuído</span>
          <span className="text-lg font-heading font-bold text-primary">R$ {totalDistributed}</span>
        </div>
        {/* {totalPrize - totalDistributed > 0 && (
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-muted-foreground font-medium">Reserva/organização</span>
            <span className="text-sm font-heading font-bold text-warning">R$ {totalPrize - totalDistributed}</span>
          </div>
        )} */}
      </Card>
    </div>
  );
}
