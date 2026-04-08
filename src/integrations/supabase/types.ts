export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      bets: {
        Row: {
          away_score: number
          created_at: string
          home_score: number
          id: string
          match_id: string
          participant_id: string
          updated_at: string
        }
        Insert: {
          away_score: number
          created_at?: string
          home_score: number
          id?: string
          match_id: string
          participant_id: string
          updated_at?: string
        }
        Update: {
          away_score?: number
          created_at?: string
          home_score?: number
          id?: string
          match_id?: string
          participant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bets_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bets_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      cup_bracket_matches: {
        Row: {
          id: string
          participant1_id: string | null
          participant2_id: string | null
          score1: number | null
          score2: number | null
          sort_order: number
          stage: string
          winner_id: string | null
        }
        Insert: {
          id: string
          participant1_id?: string | null
          participant2_id?: string | null
          score1?: number | null
          score2?: number | null
          sort_order?: number
          stage: string
          winner_id?: string | null
        }
        Update: {
          id?: string
          participant1_id?: string | null
          participant2_id?: string | null
          score1?: number | null
          score2?: number | null
          sort_order?: number
          stage?: string
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cup_bracket_matches_participant1_id_fkey"
            columns: ["participant1_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cup_bracket_matches_participant2_id_fkey"
            columns: ["participant2_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cup_bracket_matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          away_score: number | null
          away_team_id: string | null
          date: string
          group: string | null
          home_score: number | null
          home_team_id: string | null
          id: string
          played: boolean
          stage: string
        }
        Insert: {
          away_score?: number | null
          away_team_id?: string | null
          date: string
          group?: string | null
          home_score?: number | null
          home_team_id?: string | null
          id: string
          played?: boolean
          stage?: string
        }
        Update: {
          away_score?: number | null
          away_team_id?: string | null
          date?: string
          group?: string | null
          home_score?: number | null
          home_team_id?: string | null
          id?: string
          played?: boolean
          stage?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      participants: {
        Row: {
          avatar: string
          created_at: string
          cup_eliminated: boolean
          cup_group: string | null
          id: string
          name: string
        }
        Insert: {
          avatar?: string
          created_at?: string
          cup_eliminated?: boolean
          cup_group?: string | null
          id?: string
          name: string
        }
        Update: {
          avatar?: string
          created_at?: string
          cup_eliminated?: boolean
          cup_group?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string
          id: string
          participant_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email: string
          id?: string
          participant_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string
          id?: string
          participant_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      special_bets: {
        Row: {
          champion_team_id: string | null
          created_at: string
          id: string
          participant_id: string
          top_scorer_name: string | null
          updated_at: string
        }
        Insert: {
          champion_team_id?: string | null
          created_at?: string
          id?: string
          participant_id: string
          top_scorer_name?: string | null
          updated_at?: string
        }
        Update: {
          champion_team_id?: string | null
          created_at?: string
          id?: string
          participant_id?: string
          top_scorer_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "special_bets_champion_team_id_fkey"
            columns: ["champion_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "special_bets_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: true
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      special_results: {
        Row: {
          champion_team_id: string | null
          id: string
          top_scorer_name: string | null
          updated_at: string
        }
        Insert: {
          champion_team_id?: string | null
          id?: string
          top_scorer_name?: string | null
          updated_at?: string
        }
        Update: {
          champion_team_id?: string | null
          id?: string
          top_scorer_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "special_results_champion_team_id_fkey"
            columns: ["champion_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          flag: string
          group: string | null
          id: string
          name: string
        }
        Insert: {
          flag?: string
          group?: string | null
          id: string
          name: string
        }
        Update: {
          flag?: string
          group?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "participant"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "participant"],
    },
  },
} as const
