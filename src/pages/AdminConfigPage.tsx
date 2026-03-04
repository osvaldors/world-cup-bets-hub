import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function AdminConfigPage() {
  const { toast } = useToast();

  const handleSave = () => {
    toast({ title: "Configurações salvas!" });
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="font-heading text-3xl font-bold flex items-center gap-3">
          <Settings className="h-8 w-8 text-primary" />
          Configurações
        </h1>
        <p className="text-muted-foreground mt-1">Configurações gerais do bolão</p>
      </div>

      <Card className="glass p-6 space-y-6">
        <div>
          <h2 className="font-heading text-lg font-semibold mb-4">Informações do Bolão</h2>
          <div className="space-y-4">
            <div>
              <Label>Nome do Bolão</Label>
              <Input defaultValue="Bolão Copa 2026 - Amigos" className="mt-1" />
            </div>
            <div>
              <Label>Valor de Entrada (R$)</Label>
              <Input type="number" defaultValue="50" className="mt-1" />
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <h2 className="font-heading text-lg font-semibold mb-4">Pontuação</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Placar Exato</Label>
              <Input type="number" defaultValue="25" className="mt-1" />
            </div>
            <div>
              <Label>Vencedor + Saldo</Label>
              <Input type="number" defaultValue="18" className="mt-1" />
            </div>
            <div>
              <Label>Vencedor + 1 Gol</Label>
              <Input type="number" defaultValue="15" className="mt-1" />
            </div>
            <div>
              <Label>Acertou Vencedor</Label>
              <Input type="number" defaultValue="10" className="mt-1" />
            </div>
            <div>
              <Label>Acertou Empate</Label>
              <Input type="number" defaultValue="15" className="mt-1" />
            </div>
            <div>
              <Label>Acertou 1 Gol</Label>
              <Input type="number" defaultValue="3" className="mt-1" />
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <h2 className="font-heading text-lg font-semibold mb-4">Modos</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Modo Liga</p>
                <p className="text-sm text-muted-foreground">Ranking geral de todos participantes</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Modo Copa</p>
                <p className="text-sm text-muted-foreground">Grupos + mata-mata entre participantes</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full gradient-primary text-primary-foreground">
          <Save className="h-4 w-4 mr-2" /> Salvar Configurações
        </Button>
      </Card>
    </div>
  );
}
