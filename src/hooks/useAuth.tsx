import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  isParticipant: boolean;
  userRole: string | null;
  participantId: string | null;
  profile: any | null;
  participant: any | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (data: { display_name?: string, avatar_url?: string }) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isParticipant, setIsParticipant] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [participant, setParticipant] = useState<any | null>(null);

  const fetchRole = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);

    const roles = (data || []).map((r: any) => r.role);
    const admin = roles.includes("admin");
    const participant = roles.includes("participant");
    setIsAdmin(admin);
    setIsParticipant(participant);
    setUserRole(admin ? "admin" : participant ? "participant" : null);
  };

  const fetchParticipantId = async (userId: string) => {
    try {
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*, participants(*)")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching participant id:", error);
      }

      if (profileData) {
        setProfile(profileData);
        setParticipantId(profileData.participant_id);
        setParticipant(profileData.participants);
      } else {
        console.warn("No profile found for user_id:", userId);
      }
    } catch (e) {
      console.error("Exception in fetchParticipantId:", e);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          setTimeout(() => {
            fetchRole(session.user.id);
            fetchParticipantId(session.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
          setIsParticipant(false);
          setUserRole(null);
          setParticipantId(null);
          setProfile(null);
          setParticipant(null);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchRole(session.user.id);
        fetchParticipantId(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
        emailRedirectTo: window.location.origin,
      },
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (data: { display_name?: string, avatar_url?: string }) => {
    if (!user) return { error: new Error("User not logged in") };

    try {
      if (data.display_name) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ display_name: data.display_name })
          .eq("user_id", user.id);
        
        if (profileError) throw profileError;

        if (participantId) {
          const { error: participantError } = await supabase
            .from("participants")
            .update({ name: data.display_name })
            .eq("id", participantId);
          
          if (participantError) throw participantError;
        }
      }

      if (data.avatar_url && participantId) {
        const { error: participantError } = await supabase
          .from("participants")
          .update({ avatar: data.avatar_url })
          .eq("id", participantId);
        
        if (participantError) throw participantError;
      }

      await fetchParticipantId(user.id);
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  return (
    <AuthContext.Provider value={{
      user, session, loading, isAdmin, isParticipant, userRole, participantId, profile, participant,
      signIn, signUp, signOut, updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
