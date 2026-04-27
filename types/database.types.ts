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
      article_versions: {
        Row: {
          ai_source_input: string | null
          article_id: string
          content_md: string
          created_at: string | null
          edited_by: string | null
          id: string
          source_type: string
          summary: string
          title: string
          version_number: number
        }
        Insert: {
          ai_source_input?: string | null
          article_id: string
          content_md: string
          created_at?: string | null
          edited_by?: string | null
          id?: string
          source_type: string
          summary: string
          title: string
          version_number: number
        }
        Update: {
          ai_source_input?: string | null
          article_id?: string
          content_md?: string
          created_at?: string | null
          edited_by?: string | null
          id?: string
          source_type?: string
          summary?: string
          title?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "article_versions_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          }
        ]
      }
      article_ratings: {
        Row: {
          id: string
          article_id: string
          session_id: string
          helpful: boolean
          rated_at: string
        }
        Insert: {
          id?: string
          article_id: string
          session_id: string
          helpful: boolean
          rated_at?: string
        }
        Update: {
          id?: string
          article_id?: string
          session_id?: string
          helpful?: boolean
          rated_at?: string
        }
        Relationships: []
      }
      articles: {
        Row: {
          article_type: string
          category: string
          content_md: string
          created_at: string | null
          created_by: string | null
          id: string
          published_at: string | null
          reading_minutes: number | null
          related_module_ids: string[] | null
          slug: string
          sources: Json | null
          status: string
          summary: string
          title: string
          updated_at: string | null
        }
        Insert: {
          article_type: string
          category: string
          content_md: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          published_at?: string | null
          reading_minutes?: number | null
          related_module_ids?: string[] | null
          slug: string
          sources?: Json | null
          status?: string
          summary: string
          title: string
          updated_at?: string | null
        }
        Update: {
          article_type?: string
          category?: string
          content_md?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          published_at?: string | null
          reading_minutes?: number | null
          related_module_ids?: string[] | null
          slug?: string
          sources?: Json | null
          status?: string
          summary?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      confidence_surveys: {
        Row: {
          id: string
          user_id: string
          module_id: string
          score: number
          submitted_at: string
        }
        Insert: {
          id?: string
          user_id: string
          module_id: string
          score: number
          submitted_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          module_id?: string
          score?: number
          submitted_at?: string
        }
        Relationships: []
      }
      fireup_completions: {
        Row: {
          certificate_url: string | null
          self_attested_at: string | null
          user_id: string
          verified_at: string | null
        }
        Insert: {
          certificate_url?: string | null
          self_attested_at?: string | null
          user_id: string
          verified_at?: string | null
        }
        Update: {
          certificate_url?: string | null
          self_attested_at?: string | null
          user_id?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      institutions: {
        Row: {
          active: boolean | null
          id: string
          name: string
          short_name: string
          type: string | null
        }
        Insert: {
          active?: boolean | null
          id?: string
          name: string
          short_name: string
          type?: string | null
        }
        Update: {
          active?: boolean | null
          id?: string
          name?: string
          short_name?: string
          type?: string | null
        }
        Relationships: []
      }
      modules: {
        Row: {
          duration_minutes: number
          id: string
          ordinal: number
          steps_count: number
          subtitle: string | null
          tag: string | null
          title: string
        }
        Insert: {
          duration_minutes: number
          id: string
          ordinal: number
          steps_count: number
          subtitle?: string | null
          tag?: string | null
          title: string
        }
        Update: {
          duration_minutes?: number
          id?: string
          ordinal?: number
          steps_count?: number
          subtitle?: string | null
          tag?: string | null
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          cohort_id: string | null
          created_at: string | null
          first_name: string | null
          id: string
          institution_id: string | null
          institution_name: string | null
          role: string | null
          theme: string | null
        }
        Insert: {
          cohort_id?: string | null
          created_at?: string | null
          first_name?: string | null
          id: string
          institution_id?: string | null
          institution_name?: string | null
          role?: string | null
          theme?: string | null
        }
        Update: {
          cohort_id?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          institution_id?: string | null
          institution_name?: string | null
          role?: string | null
          theme?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          }
        ]
      }
      saved_calculations: {
        Row: {
          calculation_type: string
          created_at: string | null
          gross_annual_cents: number
          id: string
          label: string | null
          net_annual_cents: number
          tax_year: string
          user_id: string
        }
        Insert: {
          calculation_type: string
          created_at?: string | null
          gross_annual_cents: number
          id?: string
          label?: string | null
          net_annual_cents: number
          tax_year: string
          user_id: string
        }
        Update: {
          calculation_type?: string
          created_at?: string | null
          gross_annual_cents?: number
          id?: string
          label?: string | null
          net_annual_cents?: number
          tax_year?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_loans: {
        Row: {
          amount_cents: number
          apr_bps: number
          created_at: string | null
          id: string
          label: string
          lender_type: string | null
          term_months: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount_cents: number
          apr_bps: number
          created_at?: string | null
          id?: string
          label: string
          lender_type?: string | null
          term_months: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount_cents?: number
          apr_bps?: number
          created_at?: string | null
          id?: string
          label?: string
          lender_type?: string | null
          term_months?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          current_step: number | null
          module_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          current_step?: number | null
          module_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          current_step?: number | null
          module_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never
