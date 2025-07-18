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
          student_email: string
          student_name: string
          student_user_id: string
        }
        Insert: {
          classroom_id: string
          enrollment_date?: string
          id?: string
          is_active?: boolean
          student_email: string
          student_name: string
          student_user_id: string
        }
        Update: {
          classroom_id?: string
          enrollment_date?: string
          id?: string
          is_active?: boolean
          student_email?: string
          student_name?: string
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
