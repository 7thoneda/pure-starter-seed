export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      call_sessions: {
        Row: {
          call_type: string
          connected_at: string | null
          created_at: string
          end_reason: string | null
          ended_at: string | null
          id: string
          initiator_id: string
          receiver_id: string | null
          status: string
        }
        Insert: {
          call_type: string
          connected_at?: string | null
          created_at?: string
          end_reason?: string | null
          ended_at?: string | null
          id?: string
          initiator_id: string
          receiver_id?: string | null
          status?: string
        }
        Update: {
          call_type?: string
          connected_at?: string | null
          created_at?: string
          end_reason?: string | null
          ended_at?: string | null
          id?: string
          initiator_id?: string
          receiver_id?: string | null
          status?: string
        }
        Relationships: []
      }
      diary_entries: {
        Row: {
          background_theme: string | null
          content: string
          created_at: string | null
          entry_date: string
          id: number
          mood: string
          photo_url: string | null
          stickers: Json | null
          updated_at: string | null
          user_id: number
        }
        Insert: {
          background_theme?: string | null
          content: string
          created_at?: string | null
          entry_date: string
          id?: number
          mood: string
          photo_url?: string | null
          stickers?: Json | null
          updated_at?: string | null
          user_id: number
        }
        Update: {
          background_theme?: string | null
          content?: string
          created_at?: string | null
          entry_date?: string
          id?: number
          mood?: string
          photo_url?: string | null
          stickers?: Json | null
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "diary_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      mood_analytics: {
        Row: {
          created_at: string | null
          entry_date: string
          id: number
          mood: string
          user_id: number
        }
        Insert: {
          created_at?: string | null
          entry_date: string
          id?: number
          mood: string
          user_id: number
        }
        Update: {
          created_at?: string | null
          entry_date?: string
          id?: number
          mood?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "mood_analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      signaling_messages: {
        Row: {
          call_session_id: string
          created_at: string
          from_user_id: string
          id: string
          message_data: Json
          message_type: string
          to_user_id: string
        }
        Insert: {
          call_session_id: string
          created_at?: string
          from_user_id: string
          id?: string
          message_data: Json
          message_type: string
          to_user_id: string
        }
        Update: {
          call_session_id?: string
          created_at?: string
          from_user_id?: string
          id?: string
          message_data?: Json
          message_type?: string
          to_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "signaling_messages_call_session_id_fkey"
            columns: ["call_session_id"]
            isOneToOne: false
            referencedRelation: "call_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_matching: {
        Row: {
          call_session_id: string | null
          call_type: string
          created_at: string
          gender: string
          id: string
          is_premium: boolean
          matched_with_user_id: string | null
          preferred_gender: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          call_session_id?: string | null
          call_type: string
          created_at?: string
          gender: string
          id?: string
          is_premium?: boolean
          matched_with_user_id?: string | null
          preferred_gender: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          call_session_id?: string | null
          call_type?: string
          created_at?: string
          gender?: string
          id?: string
          is_premium?: boolean
          matched_with_user_id?: string | null
          preferred_gender?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_matching_call_session_id_fkey"
            columns: ["call_session_id"]
            isOneToOne: false
            referencedRelation: "call_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          id: number
          magic_answer_hash: string | null
          magic_question: string | null
          pin_hash: string | null
          theme: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          magic_answer_hash?: string | null
          magic_question?: string | null
          pin_hash?: string | null
          theme?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          magic_answer_hash?: string | null
          magic_question?: string | null
          pin_hash?: string | null
          theme?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
