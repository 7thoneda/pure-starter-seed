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
      daily_rewards: {
        Row: {
          claim_date: string
          created_at: string
          id: string
          login_streak: number
          reward_amount: number
          user_id: string
        }
        Insert: {
          claim_date: string
          created_at?: string
          id?: string
          login_streak?: number
          reward_amount: number
          user_id: string
        }
        Update: {
          claim_date?: string
          created_at?: string
          id?: string
          login_streak?: number
          reward_amount?: number
          user_id?: string
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
      friends: {
        Row: {
          created_at: string
          friend_id: string
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          friend_id: string
          id?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          friend_id?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      gift_transactions: {
        Row: {
          call_session_id: string | null
          coins_spent: number
          created_at: string
          gift_id: string
          id: string
          receiver_id: string
          sender_id: string
        }
        Insert: {
          call_session_id?: string | null
          coins_spent: number
          created_at?: string
          gift_id: string
          id?: string
          receiver_id: string
          sender_id: string
        }
        Update: {
          call_session_id?: string | null
          coins_spent?: number
          created_at?: string
          gift_id?: string
          id?: string
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gift_transactions_call_session_id_fkey"
            columns: ["call_session_id"]
            isOneToOne: false
            referencedRelation: "call_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gift_transactions_gift_id_fkey"
            columns: ["gift_id"]
            isOneToOne: false
            referencedRelation: "virtual_gifts"
            referencedColumns: ["id"]
          },
        ]
      }
      group_rooms: {
        Row: {
          created_at: string
          creator_id: string
          description: string | null
          id: string
          is_active: boolean
          is_private: boolean
          max_participants: number
          name: string
          password_hash: string | null
          room_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_id: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_private?: boolean
          max_participants?: number
          name: string
          password_hash?: string | null
          room_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_private?: boolean
          max_participants?: number
          name?: string
          password_hash?: string | null
          room_type?: string
          updated_at?: string
        }
        Relationships: []
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
      offer_analytics: {
        Row: {
          completed_at: string
          created_at: string
          device_info: string | null
          id: string
          ip_address: string | null
          offer_id: string
          offer_type: string
          reward_amount: number
          user_id: string
        }
        Insert: {
          completed_at: string
          created_at?: string
          device_info?: string | null
          id?: string
          ip_address?: string | null
          offer_id: string
          offer_type: string
          reward_amount: number
          user_id: string
        }
        Update: {
          completed_at?: string
          created_at?: string
          device_info?: string | null
          id?: string
          ip_address?: string | null
          offer_id?: string
          offer_type?: string
          reward_amount?: number
          user_id?: string
        }
        Relationships: []
      }
      offer_completions: {
        Row: {
          completed_at: string
          created_at: string
          id: string
          offer_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          created_at?: string
          id?: string
          offer_id: string
          user_id: string
        }
        Update: {
          completed_at?: string
          created_at?: string
          id?: string
          offer_id?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          product_details: Json
          product_type: string
          razorpay_order_id: string
          razorpay_payment_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          product_details: Json
          product_type: string
          razorpay_order_id: string
          razorpay_payment_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          product_details?: Json
          product_type?: string
          razorpay_order_id?: string
          razorpay_payment_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      premium_subscriptions: {
        Row: {
          created_at: string
          expires_at: string
          granted_by: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          granted_by?: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          granted_by?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          referral_code: string
          referred_id: string
          referrer_id: string
          reward_granted: boolean
          status: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          referral_code: string
          referred_id: string
          referrer_id: string
          reward_granted?: boolean
          status?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          referral_code?: string
          referred_id?: string
          referrer_id?: string
          reward_granted?: boolean
          status?: string
        }
        Relationships: []
      }
      room_participants: {
        Row: {
          id: string
          is_active: boolean
          joined_at: string
          left_at: string | null
          role: string
          room_id: string
          user_id: string
        }
        Insert: {
          id?: string
          is_active?: boolean
          joined_at?: string
          left_at?: string | null
          role?: string
          room_id: string
          user_id: string
        }
        Update: {
          id?: string
          is_active?: boolean
          joined_at?: string
          left_at?: string | null
          role?: string
          room_id?: string
          user_id?: string
        }
        Relationships: []
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
      user_coins: {
        Row: {
          balance: number
          created_at: string
          lifetime_earned: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          lifetime_earned?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          lifetime_earned?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          created_at: string
          favorite_user_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          favorite_user_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          favorite_user_id?: string
          id?: string
          user_id?: string
        }
        Relationships: []
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
      user_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          is_public: boolean
          status: string | null
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_public?: boolean
          status?: string | null
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_public?: boolean
          status?: string | null
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
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
      virtual_gifts: {
        Row: {
          animation_type: string
          category: string
          created_at: string
          emoji: string
          id: string
          is_premium: boolean
          name: string
          price_coins: number
        }
        Insert: {
          animation_type?: string
          category?: string
          created_at?: string
          emoji: string
          id?: string
          is_premium?: boolean
          name: string
          price_coins: number
        }
        Update: {
          animation_type?: string
          category?: string
          created_at?: string
          emoji?: string
          id?: string
          is_premium?: boolean
          name?: string
          price_coins?: number
        }
        Relationships: []
      }
      voice_settings: {
        Row: {
          created_at: string
          echo_level: number
          id: string
          is_enabled: boolean
          modulation_type: string
          pitch_shift: number
          reverb_level: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          echo_level?: number
          id?: string
          is_enabled?: boolean
          modulation_type?: string
          pitch_shift?: number
          reverb_level?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          echo_level?: number
          id?: string
          is_enabled?: boolean
          modulation_type?: string
          pitch_shift?: number
          reverb_level?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_referral_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_login_streak: {
        Args: { user_id: string }
        Returns: number
      }
      get_mutual_friends: {
        Args: { user1_id: string; user2_id: string }
        Returns: number
      }
      grant_referral_premium: {
        Args: { referrer_uuid: string }
        Returns: undefined
      }
      increment_user_coins: {
        Args: { amount: number; user_id: string }
        Returns: undefined
      }
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
