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
      categories: {
        Row: {
          created_at: string
          id: string
          is_featured: boolean | null
          name: string
          status: Database["public"]["Enums"]["category_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_featured?: boolean | null
          name: string
          status?: Database["public"]["Enums"]["category_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_featured?: boolean | null
          name?: string
          status?: Database["public"]["Enums"]["category_status"]
          updated_at?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          parent_id: string | null
          product_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          product_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      featured_products: {
        Row: {
          created_at: string
          display_order: number
          id: string
          product_id: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          product_id: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "featured_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      judge_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          id: string
          judge_id: string
          product_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          judge_id: string
          product_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          judge_id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "judge_assignments_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      judging_criteria: {
        Row: {
          created_at: string
          description: string | null
          id: string
          max_value: number | null
          min_value: number | null
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          max_value?: number | null
          min_value?: number | null
          name: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          max_value?: number | null
          min_value?: number | null
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      judging_evaluations: {
        Row: {
          created_at: string
          deadline: string | null
          id: string
          judge_id: string
          notes: string | null
          priority: string
          product_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deadline?: string | null
          id?: string
          judge_id: string
          notes?: string | null
          priority?: string
          product_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deadline?: string | null
          id?: string
          judge_id?: string
          notes?: string | null
          priority?: string
          product_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "judging_evaluations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      judging_submissions: {
        Row: {
          boolean_value: boolean | null
          created_at: string
          criteria_id: string
          id: string
          judge_id: string
          product_id: string
          rating_value: number | null
          text_value: string | null
          updated_at: string
        }
        Insert: {
          boolean_value?: boolean | null
          created_at?: string
          criteria_id: string
          id?: string
          judge_id: string
          product_id: string
          rating_value?: number | null
          text_value?: string | null
          updated_at?: string
        }
        Update: {
          boolean_value?: boolean | null
          created_at?: string
          criteria_id?: string
          id?: string
          judge_id?: string
          product_id?: string
          rating_value?: number | null
          text_value?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "judging_submissions_criteria_id_fkey"
            columns: ["criteria_id"]
            isOneToOne: false
            referencedRelation: "judging_criteria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "judging_submissions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string
          read: boolean
          related_id: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message: string
          read?: boolean
          related_id?: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          read?: boolean
          related_id?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: []
      }
      product_makers: {
        Row: {
          created_at: string
          id: string
          product_id: string
          profile_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          profile_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_makers_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_makers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_screenshots: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          id: string
          image_url: string
          product_id: string
          title: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image_url: string
          product_id: string
          title?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image_url?: string
          product_id?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_screenshots_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_technologies: {
        Row: {
          created_at: string
          display_order: number
          id: string
          product_id: string
          technology_name: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          product_id: string
          technology_name: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          product_id?: string
          technology_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_technologies_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_videos: {
        Row: {
          created_at: string
          display_order: number
          id: string
          product_id: string
          title: string | null
          video_url: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          product_id: string
          title?: string | null
          video_url: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          product_id?: string
          title?: string | null
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_videos_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          categories: string[] | null
          created_at: string | null
          created_by: string | null
          description: string
          id: string
          image_url: string | null
          name: string
          rejection_feedback: string | null
          status: string
          tagline: string
          upvotes: number | null
          website_url: string | null
        }
        Insert: {
          categories?: string[] | null
          created_at?: string | null
          created_by?: string | null
          description: string
          id?: string
          image_url?: string | null
          name: string
          rejection_feedback?: string | null
          status?: string
          tagline: string
          upvotes?: number | null
          website_url?: string | null
        }
        Update: {
          categories?: string[] | null
          created_at?: string | null
          created_by?: string | null
          description?: string
          id?: string
          image_url?: string | null
          name?: string
          rejection_feedback?: string | null
          status?: string
          tagline?: string
          upvotes?: number | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string | null
          github: string | null
          id: string
          linkedin: string | null
          twitter: string | null
          username: string | null
          verified_socials: string[] | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          github?: string | null
          id: string
          linkedin?: string | null
          twitter?: string | null
          username?: string | null
          verified_socials?: string[] | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          github?: string | null
          id?: string
          linkedin?: string | null
          twitter?: string | null
          username?: string | null
          verified_socials?: string[] | null
          website?: string | null
        }
        Relationships: []
      }
      saved_products: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      upvotes: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "upvotes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "upvotes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      featured_categories_view: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string | null
          name: string | null
          status: Database["public"]["Enums"]["category_status"] | null
          updated_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      assign_user_role: {
        Args: { input_user_id: string; role_name: string }
        Returns: undefined
      }
      delete_comment_with_replies: {
        Args: { comment_id: string }
        Returns: undefined
      }
      filter_products: {
        Args: {
          search_query?: string
          selected_category?: string
          sort_by?: string
          sort_direction?: string
          page_number?: number
          page_size?: number
        }
        Returns: {
          id: string
          name: string
          description: string
          tagline: string
          image_url: string
          website_url: string
          categories: string[]
          upvotes: number
          created_at: string
          created_by: string
          profile_id: string
          profile_username: string
          profile_avatar_url: string
          total_count: number
        }[]
      }
      get_admin_users: {
        Args: {
          search_text?: string
          role_filter?: string
          page_num?: number
          page_size?: number
        }
        Returns: {
          id: string
          username: string
          email: string
          avatar_url: string
          role: string
          created_at: string
          product_count: number
          total_count: number
        }[]
      }
      get_featured_products: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          name: string
          description: string
          tagline: string
          image_url: string
          website_url: string
          categories: string[]
          upvotes: number
          created_at: string
          created_by: string
          display_order: number
        }[]
      }
      get_judge_assigned_products: {
        Args: { judge_uuid: string }
        Returns: {
          id: string
          name: string
          tagline: string
          image_url: string
          status: string
          assigned_at: string
        }[]
      }
      get_product_judging_summary: {
        Args: { product_uuid: string }
        Returns: {
          criteria_id: string
          criteria_name: string
          criteria_type: string
          avg_rating: number
          count_judges: number
          count_true: number
          count_false: number
        }[]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
      is_admin: {
        Args: { uid: string }
        Returns: boolean
      }
      is_judge: {
        Args: { uid: string }
        Returns: boolean
      }
      mark_all_notifications_read: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      mark_notification_read: {
        Args: { notification_id: string; is_read?: boolean }
        Returns: boolean
      }
      search_products: {
        Args: { search_query: string; result_limit?: number }
        Returns: {
          categories: string[] | null
          created_at: string | null
          created_by: string | null
          description: string
          id: string
          image_url: string | null
          name: string
          rejection_feedback: string | null
          status: string
          tagline: string
          upvotes: number | null
          website_url: string | null
        }[]
      }
    }
    Enums: {
      category_status: "active" | "inactive"
      notification_type:
        | "product_pending"
        | "product_approved"
        | "product_rejected"
        | "report"
        | "system"
      user_role: "admin" | "user" | "judge"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      category_status: ["active", "inactive"],
      notification_type: [
        "product_pending",
        "product_approved",
        "product_rejected",
        "report",
        "system",
      ],
      user_role: ["admin", "user", "judge"],
    },
  },
} as const
