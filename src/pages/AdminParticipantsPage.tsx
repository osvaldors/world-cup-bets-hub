import { useState } from "react";
import { participants } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminParticipantsPage() {
  const [editing, setEditing] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [addName, setAddName] = useState("");
  const { toast } = useToast();

  const handleSave = () => {
    toast({ title: "Participante atualizado!" });
    setEditing(null);
  };

  const handleAdd = () => {
    if (!addName.trim()) return;
    toast({ title: "Participante adicionado!", description: addName });
    setAddName("");
    setShowAdd(false);
  };

  const handleDelete = (name: string) => {
    toast({ title: "Participante removido", description: name, variant: "destructive" });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            Participantes
          </h1>
          <p className="text-muted-foreground mt-1">Gerencie os participantes do bolão</p>
        </div>
        <Button className="gradient-primary text-primary-foreground" onClick={() => setShowAdd(true)}>
          <Plus className="h-4 w-4 mr-2" /> Adicionar
        </Button>
      </div>

      {showAdd && (
        <Card className="glass p-4">
          <div className="flex items-center gap-3">
            <Input
              placeholder="Nome do participante"
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAdd} className="gradient-primary text-primary-foreground">
              <Check className="h-4 w-4 mr-1" /> Confirmar
            </Button>
            <Button variant="ghost" onClick={() => setShowAdd(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {participants.map((p) => (
          <Card key={p.id} className="glass p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                  {p.avatar}
                </div>
                <div>
                  {editing === p.id ? (
                    <Input
                      value={newName || p.name}
                      onChange={(e) => setNewName(e.target.value)}
                      className="h-7 text-sm"
                    />
                  ) : (
                    <p className="font-medium">{p.name}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Grupo Copa: {p.cupGroup || "N/A"} • {p.totalPoints} pts
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {editing === p.id ? (
                  <>
                    <Button size="icon" variant="ghost" onClick={handleSave}>
                      <Check className="h-4 w-4 text-success" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setEditing(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="icon" variant="ghost" onClick={() => { setEditing(p.id); setNewName(p.name); }}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(p.name)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
