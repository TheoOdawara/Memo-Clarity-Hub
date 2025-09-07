export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          updated_at: string
          user_id: string
          username: string | null
          full_name: string | null
          streak_count: number
          last_checkin_date: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
          username?: string | null
          full_name?: string | null
          streak_count?: number
          last_checkin_date?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
          username?: string | null
          full_name?: string | null
          streak_count?: number
          last_checkin_date?: string | null
        }
        Relationships: []
      }
      checkins: {
        Row: {
          id: string
          user_id: string
          checked_at: string
          streak_day: number
          mood_score: number | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          checked_at?: string
          streak_day?: number
          mood_score?: number | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          checked_at?: string
          streak_day?: number
          mood_score?: number | null
          notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "checkins_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }
      tests: {
        Row: {
          id: string
          user_id: string
          phase_scores: Json
          total_score: number
          completed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          phase_scores: Json
          total_score: number
          completed_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          phase_scores?: Json
          total_score?: number
          completed_at?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tests_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          }
        ]
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
