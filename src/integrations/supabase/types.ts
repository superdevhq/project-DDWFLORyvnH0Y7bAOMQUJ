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
      companies: {
        Row: {
          created_at: string
          description: string
          founded: number
          headquarters: string
          id: string
          industry: string
          logo: string
          name: string
          size: string
          website: string
        }
        Insert: {
          created_at?: string
          description: string
          founded: number
          headquarters: string
          id: string
          industry: string
          logo: string
          name: string
          size: string
          website: string
        }
        Update: {
          created_at?: string
          description?: string
          founded?: number
          headquarters?: string
          id?: string
          industry?: string
          logo?: string
          name?: string
          size?: string
          website?: string
        }
        Relationships: []
      }
      facebook_pages: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          is_configured: boolean | null
          name: string
          page_id: string
          url: string
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          is_configured?: boolean | null
          name: string
          page_id: string
          url: string
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          is_configured?: boolean | null
          name?: string
          page_id?: string
          url?: string
          user_id?: string | null
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          cover_letter: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          job_id: string
          phone: string | null
          resume_url: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cover_letter?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          job_id: string
          phone?: string | null
          resume_url?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cover_letter?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          job_id?: string
          phone?: string | null
          resume_url?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          company: string
          company_id: string
          created_at: string
          description: string
          id: string
          location: string
          logo: string
          posted: string
          requirements: Json
          salary: string
          title: string
          type: string
        }
        Insert: {
          company: string
          company_id: string
          created_at?: string
          description: string
          id: string
          location: string
          logo: string
          posted: string
          requirements: Json
          salary: string
          title: string
          type: string
        }
        Update: {
          company?: string
          company_id?: string
          created_at?: string
          description?: string
          id?: string
          location?: string
          logo?: string
          posted?: string
          requirements?: Json
          salary?: string
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      scraped_posts: {
        Row: {
          comments: number | null
          content: string | null
          created_at: string | null
          facebook_post_id: string
          id: string
          image_url: string | null
          likes: number | null
          page_id: string | null
          post_date: string | null
          shares: number | null
        }
        Insert: {
          comments?: number | null
          content?: string | null
          created_at?: string | null
          facebook_post_id: string
          id?: string
          image_url?: string | null
          likes?: number | null
          page_id?: string | null
          post_date?: string | null
          shares?: number | null
        }
        Update: {
          comments?: number | null
          content?: string | null
          created_at?: string | null
          facebook_post_id?: string
          id?: string
          image_url?: string | null
          likes?: number | null
          page_id?: string | null
          post_date?: string | null
          shares?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "scraped_posts_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "facebook_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      scraping_configs: {
        Row: {
          created_at: string | null
          data_points: string[]
          depth: number
          end_date: string | null
          frequency: string
          id: string
          page_id: string | null
          start_date: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data_points: string[]
          depth?: number
          end_date?: string | null
          frequency: string
          id?: string
          page_id?: string | null
          start_date?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data_points?: string[]
          depth?: number
          end_date?: string | null
          frequency?: string
          id?: string
          page_id?: string | null
          start_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scraping_configs_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "facebook_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      scraping_stats: {
        Row: {
          created_at: string | null
          id: string
          last_scraped: string | null
          next_scheduled: string | null
          success_rate: number | null
          total_pages: number | null
          total_posts: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_scraped?: string | null
          next_scheduled?: string | null
          success_rate?: number | null
          total_pages?: number | null
          total_posts?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_scraped?: string | null
          next_scheduled?: string | null
          success_rate?: number | null
          total_pages?: number | null
          total_posts?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
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
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
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
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
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
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
