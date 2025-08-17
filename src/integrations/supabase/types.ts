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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      circuit_activity_log: {
        Row: {
          action_data: Json
          action_type: string
          circuit_id: string
          id: string
          timestamp: string
          user_id: string
        }
        Insert: {
          action_data?: Json
          action_type: string
          circuit_id: string
          id?: string
          timestamp?: string
          user_id: string
        }
        Update: {
          action_data?: Json
          action_type?: string
          circuit_id?: string
          id?: string
          timestamp?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "circuit_activity_log_circuit_id_fkey"
            columns: ["circuit_id"]
            isOneToOne: false
            referencedRelation: "circuits"
            referencedColumns: ["id"]
          },
        ]
      }
      circuit_collaboration: {
        Row: {
          change_data: Json
          change_type: string
          circuit_id: string
          created_at: string
          id: string
          timestamp: string
          user_id: string
        }
        Insert: {
          change_data?: Json
          change_type: string
          circuit_id: string
          created_at?: string
          id?: string
          timestamp?: string
          user_id: string
        }
        Update: {
          change_data?: Json
          change_type?: string
          circuit_id?: string
          created_at?: string
          id?: string
          timestamp?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "circuit_collaboration_circuit_id_fkey"
            columns: ["circuit_id"]
            isOneToOne: false
            referencedRelation: "circuits"
            referencedColumns: ["id"]
          },
        ]
      }
      circuit_collaborators: {
        Row: {
          accepted_at: string | null
          circuit_id: string
          id: string
          invited_at: string
          invited_by: string
          is_active: boolean
          permission_level: string
          user_id: string
        }
        Insert: {
          accepted_at?: string | null
          circuit_id: string
          id?: string
          invited_at?: string
          invited_by: string
          is_active?: boolean
          permission_level?: string
          user_id: string
        }
        Update: {
          accepted_at?: string | null
          circuit_id?: string
          id?: string
          invited_at?: string
          invited_by?: string
          is_active?: boolean
          permission_level?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "circuit_collaborators_circuit_id_fkey"
            columns: ["circuit_id"]
            isOneToOne: false
            referencedRelation: "circuits"
            referencedColumns: ["id"]
          },
        ]
      }
      circuit_comments: {
        Row: {
          circuit_id: string
          content: string
          created_at: string
          gate_id: string
          id: string
          resolved: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          circuit_id: string
          content: string
          created_at?: string
          gate_id: string
          id?: string
          resolved?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          circuit_id?: string
          content?: string
          created_at?: string
          gate_id?: string
          id?: string
          resolved?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "circuit_comments_circuit_id_fkey"
            columns: ["circuit_id"]
            isOneToOne: false
            referencedRelation: "circuits"
            referencedColumns: ["id"]
          },
        ]
      }
      circuits: {
        Row: {
          circuit_data: Json
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          circuit_data: Json
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          circuit_data?: Json
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      classrooms: {
        Row: {
          access_code: string
          created_at: string
          description: string | null
          educator_id: string
          id: string
          is_active: boolean
          max_students: number
          name: string
          semester: string | null
          subject: string | null
          updated_at: string
        }
        Insert: {
          access_code?: string
          created_at?: string
          description?: string | null
          educator_id: string
          id?: string
          is_active?: boolean
          max_students?: number
          name: string
          semester?: string | null
          subject?: string | null
          updated_at?: string
        }
        Update: {
          access_code?: string
          created_at?: string
          description?: string | null
          educator_id?: string
          id?: string
          is_active?: boolean
          max_students?: number
          name?: string
          semester?: string | null
          subject?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "classrooms_educator_id_fkey"
            columns: ["educator_id"]
            isOneToOne: false
            referencedRelation: "educator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      collaboration_projects: {
        Row: {
          collaborator_ids: string[] | null
          content_data: Json | null
          created_at: string
          creator_id: string
          description: string | null
          id: string
          is_public: boolean | null
          max_collaborators: number | null
          project_type: string | null
          title: string
          updated_at: string
        }
        Insert: {
          collaborator_ids?: string[] | null
          content_data?: Json | null
          created_at?: string
          creator_id: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          max_collaborators?: number | null
          project_type?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          collaborator_ids?: string[] | null
          content_data?: Json | null
          created_at?: string
          creator_id?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          max_collaborators?: number | null
          project_type?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      community_forums: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          moderator_ids: string[] | null
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          moderator_ids?: string[] | null
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          moderator_ids?: string[] | null
          name?: string
        }
        Relationships: []
      }
      community_profiles: {
        Row: {
          badges: Json | null
          bio: string | null
          created_at: string
          followers_count: number | null
          following_ids: string[] | null
          github_url: string | null
          id: string
          is_creator: boolean | null
          reputation_score: number | null
          total_contributions: number | null
          total_downloads: number | null
          updated_at: string
          user_id: string
          website_url: string | null
        }
        Insert: {
          badges?: Json | null
          bio?: string | null
          created_at?: string
          followers_count?: number | null
          following_ids?: string[] | null
          github_url?: string | null
          id?: string
          is_creator?: boolean | null
          reputation_score?: number | null
          total_contributions?: number | null
          total_downloads?: number | null
          updated_at?: string
          user_id: string
          website_url?: string | null
        }
        Update: {
          badges?: Json | null
          bio?: string | null
          created_at?: string
          followers_count?: number | null
          following_ids?: string[] | null
          github_url?: string | null
          id?: string
          is_creator?: boolean | null
          reputation_score?: number | null
          total_contributions?: number | null
          total_downloads?: number | null
          updated_at?: string
          user_id?: string
          website_url?: string | null
        }
        Relationships: []
      }
      educator_profiles: {
        Row: {
          created_at: string
          department: string | null
          id: string
          institution_name: string | null
          institution_type: string | null
          max_simulations_per_month: number
          max_students: number
          plan_type: string
          subjects: string[] | null
          updated_at: string
          user_id: string
          verification_status: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          id?: string
          institution_name?: string | null
          institution_type?: string | null
          max_simulations_per_month?: number
          max_students?: number
          plan_type?: string
          subjects?: string[] | null
          updated_at?: string
          user_id: string
          verification_status?: string
        }
        Update: {
          created_at?: string
          department?: string | null
          id?: string
          institution_name?: string | null
          institution_type?: string | null
          max_simulations_per_month?: number
          max_students?: number
          plan_type?: string
          subjects?: string[] | null
          updated_at?: string
          user_id?: string
          verification_status?: string
        }
        Relationships: []
      }
      enrollment_access_log: {
        Row: {
          access_type: string
          accessed_by: string | null
          classroom_id: string
          id: string
          student_user_id: string
          timestamp: string | null
        }
        Insert: {
          access_type: string
          accessed_by?: string | null
          classroom_id: string
          id?: string
          student_user_id: string
          timestamp?: string | null
        }
        Update: {
          access_type?: string
          accessed_by?: string | null
          classroom_id?: string
          id?: string
          student_user_id?: string
          timestamp?: string | null
        }
        Relationships: []
      }
      forum_replies: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          parent_reply_id: string | null
          topic_id: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          parent_reply_id?: string | null
          topic_id: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          parent_reply_id?: string | null
          topic_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_replies_parent_reply_id_fkey"
            columns: ["parent_reply_id"]
            isOneToOne: false
            referencedRelation: "forum_replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_replies_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "forum_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_topics: {
        Row: {
          content: string
          created_at: string
          creator_id: string
          forum_id: string
          id: string
          is_locked: boolean | null
          is_pinned: boolean | null
          last_reply_at: string | null
          replies_count: number | null
          title: string
          updated_at: string
          views_count: number | null
        }
        Insert: {
          content: string
          created_at?: string
          creator_id: string
          forum_id: string
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          last_reply_at?: string | null
          replies_count?: number | null
          title: string
          updated_at?: string
          views_count?: number | null
        }
        Update: {
          content?: string
          created_at?: string
          creator_id?: string
          forum_id?: string
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          last_reply_at?: string | null
          replies_count?: number | null
          title?: string
          updated_at?: string
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_topics_forum_id_fkey"
            columns: ["forum_id"]
            isOneToOne: false
            referencedRelation: "community_forums"
            referencedColumns: ["id"]
          },
        ]
      }
      lms_integrations: {
        Row: {
          created_at: string
          educator_id: string
          id: string
          integration_data: Json
          is_active: boolean
          lms_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          educator_id: string
          id?: string
          integration_data?: Json
          is_active?: boolean
          lms_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          educator_id?: string
          id?: string
          integration_data?: Json
          is_active?: boolean
          lms_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lms_integrations_educator_id_fkey"
            columns: ["educator_id"]
            isOneToOne: false
            referencedRelation: "educator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          parent_category_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          parent_category_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          parent_category_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_categories_parent_category_id_fkey"
            columns: ["parent_category_id"]
            isOneToOne: false
            referencedRelation: "marketplace_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_item_versions: {
        Row: {
          changelog: string | null
          content_data: Json
          created_at: string
          id: string
          item_id: string
          version: string
        }
        Insert: {
          changelog?: string | null
          content_data?: Json
          created_at?: string
          id?: string
          item_id: string
          version: string
        }
        Update: {
          changelog?: string | null
          content_data?: Json
          created_at?: string
          id?: string
          item_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_item_versions_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "marketplace_items"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_items: {
        Row: {
          category_id: string | null
          content_data: Json
          created_at: string
          creator_id: string
          description: string | null
          downloads_count: number | null
          id: string
          is_featured: boolean | null
          is_free: boolean | null
          is_published: boolean | null
          item_type: string
          price_cents: number | null
          rating_average: number | null
          rating_count: number | null
          tags: string[] | null
          title: string
          updated_at: string
          version: string | null
        }
        Insert: {
          category_id?: string | null
          content_data?: Json
          created_at?: string
          creator_id: string
          description?: string | null
          downloads_count?: number | null
          id?: string
          is_featured?: boolean | null
          is_free?: boolean | null
          is_published?: boolean | null
          item_type: string
          price_cents?: number | null
          rating_average?: number | null
          rating_count?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string
          version?: string | null
        }
        Update: {
          category_id?: string | null
          content_data?: Json
          created_at?: string
          creator_id?: string
          description?: string | null
          downloads_count?: number | null
          id?: string
          is_featured?: boolean | null
          is_free?: boolean | null
          is_published?: boolean | null
          item_type?: string
          price_cents?: number | null
          rating_average?: number | null
          rating_count?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "marketplace_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_purchases: {
        Row: {
          buyer_id: string
          created_at: string
          id: string
          item_id: string
          price_paid_cents: number
          transaction_id: string | null
        }
        Insert: {
          buyer_id: string
          created_at?: string
          id?: string
          item_id: string
          price_paid_cents: number
          transaction_id?: string | null
        }
        Update: {
          buyer_id?: string
          created_at?: string
          id?: string
          item_id?: string
          price_paid_cents?: number
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_purchases_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "marketplace_items"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_reviews: {
        Row: {
          created_at: string
          id: string
          item_id: string
          rating: number
          review_text: string | null
          reviewer_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          rating: number
          review_text?: string | null
          reviewer_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          rating?: number
          review_text?: string | null
          reviewer_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_reviews_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "marketplace_items"
            referencedColumns: ["id"]
          },
        ]
      }
      memory_states: {
        Row: {
          bank_id: string
          bank_name: string
          capacity_qubits: number
          coherence_percentage: number
          created_at: string
          id: string
          qubit_states: Json
          updated_at: string
          used_qubits: number
          user_id: string
        }
        Insert: {
          bank_id: string
          bank_name: string
          capacity_qubits?: number
          coherence_percentage?: number
          created_at?: string
          id?: string
          qubit_states?: Json
          updated_at?: string
          used_qubits?: number
          user_id: string
        }
        Update: {
          bank_id?: string
          bank_name?: string
          capacity_qubits?: number
          coherence_percentage?: number
          created_at?: string
          id?: string
          qubit_states?: Json
          updated_at?: string
          used_qubits?: number
          user_id?: string
        }
        Relationships: []
      }
      optimization_sessions: {
        Row: {
          created_at: string
          data: Json
          data_type: string
          description: string | null
          execution_time_ms: number | null
          id: string
          parameters: Json
          results: Json | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data: Json
          data_type: string
          description?: string | null
          execution_time_ms?: number | null
          id?: string
          parameters?: Json
          results?: Json | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          data_type?: string
          description?: string | null
          execution_time_ms?: number | null
          id?: string
          parameters?: Json
          results?: Json | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quantum_files: {
        Row: {
          content_data: Json | null
          created_at: string
          favorite: boolean
          id: string
          last_version: string
          name: string
          parent_folder_id: string | null
          size_bytes: number
          size_display: string
          superposition: boolean
          tags: string[]
          type: string
          updated_at: string
          user_id: string
          versions: number
        }
        Insert: {
          content_data?: Json | null
          created_at?: string
          favorite?: boolean
          id?: string
          last_version?: string
          name: string
          parent_folder_id?: string | null
          size_bytes?: number
          size_display: string
          superposition?: boolean
          tags?: string[]
          type: string
          updated_at?: string
          user_id: string
          versions?: number
        }
        Update: {
          content_data?: Json | null
          created_at?: string
          favorite?: boolean
          id?: string
          last_version?: string
          name?: string
          parent_folder_id?: string | null
          size_bytes?: number
          size_display?: string
          superposition?: boolean
          tags?: string[]
          type?: string
          updated_at?: string
          user_id?: string
          versions?: number
        }
        Relationships: []
      }
      quantum_jobs: {
        Row: {
          circuit_data: Json
          created_at: string
          end_time: string | null
          estimated_time: string | null
          id: string
          logs: Json
          name: string
          priority: string
          progress: number
          qubits: number
          start_time: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          circuit_data?: Json
          created_at?: string
          end_time?: string | null
          estimated_time?: string | null
          id?: string
          logs?: Json
          name: string
          priority?: string
          progress?: number
          qubits?: number
          start_time?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          circuit_data?: Json
          created_at?: string
          end_time?: string | null
          estimated_time?: string | null
          id?: string
          logs?: Json
          name?: string
          priority?: string
          progress?: number
          qubits?: number
          start_time?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      runtime_logs: {
        Row: {
          component: string
          created_at: string
          details: string | null
          id: string
          level: string
          message: string
          metadata: Json | null
          timestamp: string
          user_id: string
        }
        Insert: {
          component: string
          created_at?: string
          details?: string | null
          id?: string
          level: string
          message: string
          metadata?: Json | null
          timestamp?: string
          user_id: string
        }
        Update: {
          component?: string
          created_at?: string
          details?: string | null
          id?: string
          level?: string
          message?: string
          metadata?: Json | null
          timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      shared_circuits: {
        Row: {
          circuit_id: string
          created_at: string
          created_by: string
          expires_at: string | null
          id: string
          is_active: boolean
          permission_level: string
          share_token: string
          updated_at: string
        }
        Insert: {
          circuit_id: string
          created_at?: string
          created_by: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          permission_level?: string
          share_token?: string
          updated_at?: string
        }
        Update: {
          circuit_id?: string
          created_at?: string
          created_by?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          permission_level?: string
          share_token?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shared_circuits_circuit_id_fkey"
            columns: ["circuit_id"]
            isOneToOne: false
            referencedRelation: "circuits"
            referencedColumns: ["id"]
          },
        ]
      }
      student_activity: {
        Row: {
          activity_data: Json
          activity_type: string
          id: string
          student_enrollment_id: string
          timestamp: string
        }
        Insert: {
          activity_data?: Json
          activity_type: string
          id?: string
          student_enrollment_id: string
          timestamp?: string
        }
        Update: {
          activity_data?: Json
          activity_type?: string
          id?: string
          student_enrollment_id?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_activity_student_enrollment_id_fkey"
            columns: ["student_enrollment_id"]
            isOneToOne: false
            referencedRelation: "student_enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      student_enrollments: {
        Row: {
          classroom_id: string
          enrollment_date: string
          id: string
          is_active: boolean
          student_user_id: string
        }
        Insert: {
          classroom_id: string
          enrollment_date?: string
          id?: string
          is_active?: boolean
          student_user_id: string
        }
        Update: {
          classroom_id?: string
          enrollment_date?: string
          id?: string
          is_active?: boolean
          student_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_enrollments_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
        ]
      }
      user_follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_classroom_enrollments_safe: {
        Args: { target_classroom_id?: string }
        Returns: {
          classroom_id: string
          enrollment_date: string
          id: string
          is_active: boolean
          student_name: string
          student_user_id: string
        }[]
      }
      get_student_email_if_authorized: {
        Args: { classroom_id: string; student_id: string }
        Returns: string
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
