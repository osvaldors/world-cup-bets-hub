import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Camera, Loader2, Lock, User as UserIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useInvalidate } from "@/hooks/use-bolao-data";

export default function ProfilePage() {
  const { user, profile, participant, updateProfile } = useAuth();
  const { toast } = useToast();
  const invalidate = useInvalidate();
  
  const [displayName, setDisplayName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile?.display_name || participant?.name) {
      setDisplayName(profile?.display_name || participant?.name || "");
    }
  }, [profile, participant]);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;

    setLoading(true);
    const { error } = await updateProfile({ display_name: displayName });
    setLoading(false);

    if (error) {
      toast({ title: "Erro ao atualizar", description: error.message, variant: "destructive" });
    } else {
      invalidate("participants", "participants-with-points");
      toast({ title: "Sucesso!", description: "Nome atualizado com sucesso." });
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;
    if (newPassword !== confirmPassword) {
      return toast({ title: "Erro", description: "As senhas não coincidem.", variant: "destructive" });
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);

    if (error) {
      toast({ title: "Erro ao atualizar senha", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sucesso!", description: "Senha atualizada com sucesso." });
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return toast({ title: "Erro", description: "A imagem deve ter no máximo 2MB.", variant: "destructive" });
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Math.random()}.${fileExt}`;

      // Upload image to 'avatars' bucket
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        // If bucket doesn't exist, this might fail. In a real scenario, we'd ensure the bucket exists.
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await updateProfile({ avatar_url: publicUrl });
      
      if (updateError) throw updateError;

      invalidate("participants", "participants-with-points");
      toast({ title: "Sucesso!", description: "Avatar atualizado com sucesso." });
    } catch (error: any) {
      toast({ 
        title: "Erro ao fazer upload", 
        description: error.message === "Bucket not found" 
          ? "O sistema de arquivos não está configurado. Contate o administrador." 
          : error.message, 
        variant: "destructive" 
      });
    } finally {
      setUploading(false);
    }
  };

  const initials = displayName ? displayName.substring(0, 2).toUpperCase() : "U";

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-heading font-bold">Meu Perfil</h1>
        <p className="text-muted-foreground">Gerencie suas informações pessoais e segurança.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 glass border-primary/10">
          <CardHeader className="items-center text-center">
            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
              <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                <AvatarImage src={participant?.avatar} alt={displayName} />
                <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white h-8 w-8" />
              </div>
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
            <CardTitle className="mt-4">{displayName}</CardTitle>
            <CardDescription>{user?.email}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-xs text-muted-foreground">Clique na foto para alterar seu avatar.</p>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Card className="glass border-primary/10">
            <CardHeader>
              <div className="flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl">Informações Pessoais</CardTitle>
              </div>
              <CardDescription>Atualize como você aparece para os outros participantes.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateName} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="display-name">Nome de Exibição</Label>
                  <Input 
                    id="display-name" 
                    value={displayName} 
                    onChange={(e) => setDisplayName(e.target.value)} 
                    placeholder="Seu nome"
                  />
                </div>
                <Button type="submit" disabled={loading || !displayName.trim()}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Salvar Alterações
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="glass border-primary/10">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl">Segurança</CardTitle>
              </div>
              <CardDescription>Altere sua senha de acesso.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nova Senha</Label>
                      <Input 
                        id="new-password" 
                        type="password" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        minLength={6}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar Senha</Label>
                      <Input 
                        id="confirm-password" 
                        type="password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>
                <Button type="submit" variant="secondary" disabled={loading || !newPassword}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Atualizar Senha
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
