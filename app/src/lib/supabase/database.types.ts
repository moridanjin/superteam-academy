export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          wallet_address: string | null;
          locale: "en" | "pt-br" | "es";
          total_xp: number;
          level: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          wallet_address?: string | null;
          locale?: "en" | "pt-br" | "es";
          total_xp?: number;
          level?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          wallet_address?: string | null;
          locale?: "en" | "pt-br" | "es";
          total_xp?: number;
          level?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      courses: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string | null;
          difficulty: "beginner" | "intermediate" | "advanced";
          duration_minutes: number;
          thumbnail_url: string | null;
          track: string | null;
          xp_reward: number;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description?: string | null;
          difficulty?: "beginner" | "intermediate" | "advanced";
          duration_minutes?: number;
          thumbnail_url?: string | null;
          track?: string | null;
          xp_reward?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          description?: string | null;
          difficulty?: "beginner" | "intermediate" | "advanced";
          duration_minutes?: number;
          thumbnail_url?: string | null;
          track?: string | null;
          xp_reward?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      modules: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          title: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          title?: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "modules_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
        ];
      };
      lessons: {
        Row: {
          id: string;
          module_id: string;
          title: string;
          type: "content" | "challenge";
          content: string | null;
          sort_order: number;
          xp_reward: number;
          challenge_config: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          module_id: string;
          title: string;
          type?: "content" | "challenge";
          content?: string | null;
          sort_order?: number;
          xp_reward?: number;
          challenge_config?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          module_id?: string;
          title?: string;
          type?: "content" | "challenge";
          content?: string | null;
          sort_order?: number;
          xp_reward?: number;
          challenge_config?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey";
            columns: ["module_id"];
            isOneToOne: false;
            referencedRelation: "modules";
            referencedColumns: ["id"];
          },
        ];
      };
      enrollments: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          status: "active" | "completed" | "dropped";
          progress_pct: number;
          enrolled_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          status?: "active" | "completed" | "dropped";
          progress_pct?: number;
          enrolled_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          status?: "active" | "completed" | "dropped";
          progress_pct?: number;
          enrolled_at?: string;
          completed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "enrollments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "enrollments_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
        ];
      };
      lesson_progress: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          completed: boolean;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id: string;
          completed?: boolean;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          lesson_id?: string;
          completed?: boolean;
          completed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "lesson_progress_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
        ];
      };
      achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_key: string;
          unlocked_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          achievement_key: string;
          unlocked_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          achievement_key?: string;
          unlocked_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "achievements_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      streaks: {
        Row: {
          id: string;
          user_id: string;
          current_streak: number;
          longest_streak: number;
          last_activity_date: string | null;
          freeze_count: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          current_streak?: number;
          longest_streak?: number;
          last_activity_date?: string | null;
          freeze_count?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          current_streak?: number;
          longest_streak?: number;
          last_activity_date?: string | null;
          freeze_count?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "streaks_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      xp_events: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          source:
            | "lesson_completion"
            | "course_completion"
            | "streak_bonus"
            | "achievement"
            | "referral";
          reference_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          source:
            | "lesson_completion"
            | "course_completion"
            | "streak_bonus"
            | "achievement"
            | "referral";
          reference_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          source?:
            | "lesson_completion"
            | "course_completion"
            | "streak_bonus"
            | "achievement"
            | "referral";
          reference_id?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "xp_events_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      difficulty: "beginner" | "intermediate" | "advanced";
      lesson_type: "content" | "challenge";
      enrollment_status: "active" | "completed" | "dropped";
      xp_source:
        | "lesson_completion"
        | "course_completion"
        | "streak_bonus"
        | "achievement"
        | "referral";
    };
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];
