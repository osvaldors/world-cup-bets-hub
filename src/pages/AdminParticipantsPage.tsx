import { useState } from "react";
import { useParticipants, useInvalidate } from "@/hooks/use-bolao-data";
import { addParticipant, updateParticipant, deleteParticipant } from "@/lib/supabase-queries";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";

export default function AdminParticipantsPage() {
  const { data: participants = [], isLoading } = useParticipants();
  const [editing, setEditing] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newGroup, setNewGroup] = useState("");
  const [newActive, setNewActive] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [addName, setAddName] = useState("");
  const [addGroup, setAddGroup] = useState("");
  const { toast } = useToast();
  const invalidate = useInvalidate();

  if (isLoading) {
    return <div className="flex items-center justify-center py-20 text-muted-foreground">Carregando...</div>;
  }

  const handleSave = async (id: string) => {
    try {
      await updateParticipant(id, { 
        name: newName, 
        cup_group: newGroup || undefined,
        active: newActive
      });
      toast({ title: "Participante atualizado!" });
      invalidate("participants", "participants-with-points");
      setEditing(null);
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      await updateParticipant(id, { active: !currentActive });
      invalidate("participants", "participants-with-points");
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    }
  };

  const handleAdd = async () => {
    if (!addName.trim()) return;
    try {
      await addParticipant(addName, addGroup || undefined);
      toast({ title: "Participante adicionado!", description: addName });
      invalidate("participants", "participants-with-points");
      setAddName("");
      setAddGroup("");
      setShowAdd(false);
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteParticipant(id);
      toast({ title: "Participante removido", description: name, variant: "destructive" });
      invalidate("participants", "participants-with-points");
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    }
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
          <div className="flex items-center gap-3 flex-wrap">
            <Input placeholder="Nome do participante" value={addName} onChange={(e) => setAddName(e.target.value)} className="flex-1 min-w-[200px]" />
            <Input placeholder="Grupo Copa (A, B, C, D)" value={addGroup} onChange={(e) => setAddGroup(e.target.value)} className="w-40" />
            <Button onClick={handleAdd} className="gradient-primary text-primary-foreground">
              <Check className="h-4 w-4 mr-1" /> Confirmar
            </Button>
            <Button variant="ghost" onClick={() => setShowAdd(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {participants.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">Nenhum participante cadastrado</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {participants.map((p) => (
            <Card key={p.id} className={`glass p-4 transition-opacity ${!p.active ? "opacity-60 bg-muted/20" : ""}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className={`h-10 w-10 border shadow-sm ${!p.active ? "opacity-50" : ""}`}>
                    <AvatarImage src={p.avatar} />
                    <AvatarFallback className="bg-primary/20 text-primary font-bold">
                      {p.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    {editing === p.id ? (
                      <div className="space-y-2">
                        <Input value={newName} onChange={(e) => setNewName(e.target.value)} className="h-7 text-sm" placeholder="Nome" />
                        <Input value={newGroup} onChange={(e) => setNewGroup(e.target.value)} className="h-7 text-sm" placeholder="Grupo (A, B...)" />
                        <div className="flex items-center gap-2 mt-1">
                          <Checkbox 
                            id={`active-${p.id}`} 
                            checked={newActive} 
                            onCheckedChange={(checked) => setNewActive(checked === true)} 
                          />
                          <label htmlFor={`active-${p.id}`} className="text-xs font-medium cursor-pointer">
                            Ativo no Bolão
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <p className={`font-medium ${!p.active ? "line-through text-muted-foreground" : ""}`}>{p.name}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-muted-foreground">Grupo Copa: {p.cupGroup || "N/A"}</p>
                          {!p.active && <span className="text-[10px] bg-muted px-1.5 rounded font-bold uppercase tracking-tight">Inativo</span>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {editing === p.id ? (
                    <>
                      <Button size="icon" variant="ghost" onClick={() => handleSave(p.id)}>
                        <Check className="h-4 w-4 text-success" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => setEditing(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center mr-2 pt-1" title={p.active ? "Desativar" : "Ativar"}>
                        <Checkbox 
                          checked={p.active} 
                          onCheckedChange={() => handleToggleActive(p.id, p.active)}
                        />
                      </div>
                      <Button size="icon" variant="ghost" onClick={() => { setEditing(p.id); setNewName(p.name); setNewGroup(p.cupGroup || ""); setNewActive(p.active); }}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(p.id, p.name)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
