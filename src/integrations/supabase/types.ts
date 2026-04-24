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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      account_lockouts: {
        Row: {
          created_at: string
          email: string
          id: string
          locked_until: string
          reason: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          locked_until: string
          reason?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          locked_until?: string
          reason?: string
          updated_at?: string
        }
        Relationships: []
      }
      auth_audit_log: {
        Row: {
          created_at: string
          email: string | null
          event_type: string
          id: string
          ip_address: string | null
          metadata: Json
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          event_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          event_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      auth_login_attempts: {
        Row: {
          created_at: string
          email: string
          failure_reason: string | null
          id: string
          ip_address: string | null
          success: boolean
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          email: string
          failure_reason?: string | null
          id?: string
          ip_address?: string | null
          success?: boolean
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          failure_reason?: string | null
          id?: string
          ip_address?: string | null
          success?: boolean
          user_agent?: string | null
        }
        Relationships: []
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          joined_at: string
          last_read_at: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          joined_at?: string
          last_read_at?: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          joined_at?: string
          last_read_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          context_id: string | null
          context_type: string | null
          created_at: string
          created_by: string
          id: string
          last_message_at: string
          subject: string | null
        }
        Insert: {
          context_id?: string | null
          context_type?: string | null
          created_at?: string
          created_by: string
          id?: string
          last_message_at?: string
          subject?: string | null
        }
        Update: {
          context_id?: string | null
          context_type?: string | null
          created_at?: string
          created_by?: string
          id?: string
          last_message_at?: string
          subject?: string | null
        }
        Relationships: []
      }
      device_sessions: {
        Row: {
          browser: string | null
          city: string | null
          country: string | null
          created_at: string
          device_name: string | null
          device_type: string | null
          id: string
          ip_address: string | null
          last_active_at: string
          os: string | null
          revoked_at: string | null
          session_token_hash: string | null
          user_id: string
        }
        Insert: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          device_name?: string | null
          device_type?: string | null
          id?: string
          ip_address?: string | null
          last_active_at?: string
          os?: string | null
          revoked_at?: string | null
          session_token_hash?: string | null
          user_id: string
        }
        Update: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          device_name?: string | null
          device_type?: string | null
          id?: string
          ip_address?: string | null
          last_active_at?: string
          os?: string | null
          revoked_at?: string | null
          session_token_hash?: string | null
          user_id?: string
        }
        Relationships: []
      }
      follows: {
        Row: {
          created_at: string
          followee_id: string
          follower_id: string
        }
        Insert: {
          created_at?: string
          followee_id: string
          follower_id: string
        }
        Update: {
          created_at?: string
          followee_id?: string
          follower_id?: string
        }
        Relationships: []
      }
      gig_orders: {
        Row: {
          amount_cents: number
          buyer_id: string
          completed_at: string | null
          created_at: string
          currency: string
          delivered_at: string | null
          gig_id: string
          id: string
          package_id: string
          requirements: string | null
          seller_id: string
          status: string
          stripe_payment_intent: string | null
          stripe_session_id: string | null
          updated_at: string
        }
        Insert: {
          amount_cents: number
          buyer_id: string
          completed_at?: string | null
          created_at?: string
          currency?: string
          delivered_at?: string | null
          gig_id: string
          id?: string
          package_id: string
          requirements?: string | null
          seller_id: string
          status?: string
          stripe_payment_intent?: string | null
          stripe_session_id?: string | null
          updated_at?: string
        }
        Update: {
          amount_cents?: number
          buyer_id?: string
          completed_at?: string | null
          created_at?: string
          currency?: string
          delivered_at?: string | null
          gig_id?: string
          id?: string
          package_id?: string
          requirements?: string | null
          seller_id?: string
          status?: string
          stripe_payment_intent?: string | null
          stripe_session_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gig_orders_gig_id_fkey"
            columns: ["gig_id"]
            isOneToOne: false
            referencedRelation: "gigs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gig_orders_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "gig_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      gig_packages: {
        Row: {
          created_at: string
          currency: string
          delivery_days: number
          description: string | null
          features: Json
          gig_id: string
          id: string
          position: number
          price_cents: number
          revisions: number
          tier: string
          title: string
        }
        Insert: {
          created_at?: string
          currency?: string
          delivery_days?: number
          description?: string | null
          features?: Json
          gig_id: string
          id?: string
          position?: number
          price_cents: number
          revisions?: number
          tier: string
          title: string
        }
        Update: {
          created_at?: string
          currency?: string
          delivery_days?: number
          description?: string | null
          features?: Json
          gig_id?: string
          id?: string
          position?: number
          price_cents?: number
          revisions?: number
          tier?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "gig_packages_gig_id_fkey"
            columns: ["gig_id"]
            isOneToOne: false
            referencedRelation: "gigs"
            referencedColumns: ["id"]
          },
        ]
      }
      gig_reviews: {
        Row: {
          body: string | null
          created_at: string
          gig_id: string
          id: string
          order_id: string
          rating: number
          reviewer_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          gig_id: string
          id?: string
          order_id: string
          rating: number
          reviewer_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          gig_id?: string
          id?: string
          order_id?: string
          rating?: number
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gig_reviews_gig_id_fkey"
            columns: ["gig_id"]
            isOneToOne: false
            referencedRelation: "gigs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gig_reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "gig_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      gigs: {
        Row: {
          category: string
          cover_url: string | null
          created_at: string
          description: string | null
          id: string
          orders_count: number
          rating_avg: number
          rating_count: number
          seller_id: string
          slug: string
          status: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          orders_count?: number
          rating_avg?: number
          rating_count?: number
          seller_id: string
          slug: string
          status?: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          orders_count?: number
          rating_avg?: number
          rating_count?: number
          seller_id?: string
          slug?: string
          status?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          buyer_id: string
          created_at: string
          currency: string
          fee_cents: number
          id: string
          issued_at: string | null
          metadata: Json
          number: string
          order_id: string
          pdf_url: string | null
          seller_id: string
          status: string
          subtotal_cents: number
          total_cents: number
          updated_at: string
        }
        Insert: {
          buyer_id: string
          created_at?: string
          currency?: string
          fee_cents?: number
          id?: string
          issued_at?: string | null
          metadata?: Json
          number?: string
          order_id: string
          pdf_url?: string | null
          seller_id: string
          status?: string
          subtotal_cents: number
          total_cents: number
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          created_at?: string
          currency?: string
          fee_cents?: number
          id?: string
          issued_at?: string | null
          metadata?: Json
          number?: string
          order_id?: string
          pdf_url?: string | null
          seller_id?: string
          status?: string
          subtotal_cents?: number
          total_cents?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "gig_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          candidate_id: string
          cover_letter: string | null
          created_at: string
          expected_salary_cents: number | null
          id: string
          job_id: string
          notes: string | null
          resume_url: string | null
          stage: Database["public"]["Enums"]["application_stage"]
          updated_at: string
        }
        Insert: {
          candidate_id: string
          cover_letter?: string | null
          created_at?: string
          expected_salary_cents?: number | null
          id?: string
          job_id: string
          notes?: string | null
          resume_url?: string | null
          stage?: Database["public"]["Enums"]["application_stage"]
          updated_at?: string
        }
        Update: {
          candidate_id?: string
          cover_letter?: string | null
          created_at?: string
          expected_salary_cents?: number | null
          id?: string
          job_id?: string
          notes?: string | null
          resume_url?: string | null
          stage?: Database["public"]["Enums"]["application_stage"]
          updated_at?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          applications_count: number
          created_at: string
          currency: string
          description: string | null
          id: string
          location: string | null
          org_name: string | null
          owner_id: string
          salary_max_cents: number | null
          salary_min_cents: number | null
          slug: string
          status: Database["public"]["Enums"]["job_status"]
          tags: string[]
          title: string
          type: Database["public"]["Enums"]["job_type"]
          updated_at: string
          workplace: Database["public"]["Enums"]["job_workplace"]
        }
        Insert: {
          applications_count?: number
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          location?: string | null
          org_name?: string | null
          owner_id: string
          salary_max_cents?: number | null
          salary_min_cents?: number | null
          slug: string
          status?: Database["public"]["Enums"]["job_status"]
          tags?: string[]
          title: string
          type?: Database["public"]["Enums"]["job_type"]
          updated_at?: string
          workplace?: Database["public"]["Enums"]["job_workplace"]
        }
        Update: {
          applications_count?: number
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          location?: string | null
          org_name?: string | null
          owner_id?: string
          salary_max_cents?: number | null
          salary_min_cents?: number | null
          slug?: string
          status?: Database["public"]["Enums"]["job_status"]
          tags?: string[]
          title?: string
          type?: Database["public"]["Enums"]["job_type"]
          updated_at?: string
          workplace?: Database["public"]["Enums"]["job_workplace"]
        }
        Relationships: []
      }
      messages: {
        Row: {
          attachment_url: string | null
          body: string | null
          conversation_id: string
          created_at: string
          id: string
          sender_id: string
        }
        Insert: {
          attachment_url?: string | null
          body?: string | null
          conversation_id: string
          created_at?: string
          id?: string
          sender_id: string
        }
        Update: {
          attachment_url?: string | null
          body?: string | null
          conversation_id?: string
          created_at?: string
          id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      mfa_factors: {
        Row: {
          created_at: string
          factor_type: string
          friendly_name: string | null
          id: string
          last_used_at: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          factor_type: string
          friendly_name?: string | null
          id?: string
          last_used_at?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          factor_type?: string
          friendly_name?: string | null
          id?: string
          last_used_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          actor_id: string | null
          body: string | null
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          read: boolean
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          actor_id?: string | null
          body?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          read?: boolean
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          actor_id?: string | null
          body?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          read?: boolean
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: []
      }
      payouts: {
        Row: {
          amount_cents: number
          arrival_date: string | null
          created_at: string
          currency: string
          failure_reason: string | null
          id: string
          metadata: Json
          seller_id: string
          status: string
          stripe_payout_id: string | null
          updated_at: string
        }
        Insert: {
          amount_cents: number
          arrival_date?: string | null
          created_at?: string
          currency?: string
          failure_reason?: string | null
          id?: string
          metadata?: Json
          seller_id: string
          status?: string
          stripe_payout_id?: string | null
          updated_at?: string
        }
        Update: {
          amount_cents?: number
          arrival_date?: string | null
          created_at?: string
          currency?: string
          failure_reason?: string | null
          id?: string
          metadata?: Json
          seller_id?: string
          status?: string
          stripe_payout_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      post_comments: {
        Row: {
          author_id: string
          body: string
          created_at: string
          id: string
          parent_id: string | null
          post_id: string
          updated_at: string
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          id?: string
          parent_id?: string | null
          post_id: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          id?: string
          parent_id?: string | null
          post_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string
          body: string | null
          comment_count: number
          created_at: string
          id: string
          like_count: number
          media_type: string | null
          media_url: string | null
          updated_at: string
          visibility: Database["public"]["Enums"]["post_visibility"]
        }
        Insert: {
          author_id: string
          body?: string | null
          comment_count?: number
          created_at?: string
          id?: string
          like_count?: number
          media_type?: string | null
          media_url?: string | null
          updated_at?: string
          visibility?: Database["public"]["Enums"]["post_visibility"]
        }
        Update: {
          author_id?: string
          body?: string | null
          comment_count?: number
          created_at?: string
          id?: string
          like_count?: number
          media_type?: string | null
          media_url?: string | null
          updated_at?: string
          visibility?: Database["public"]["Enums"]["post_visibility"]
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          country: string | null
          cover_url: string | null
          created_at: string
          display_name: string | null
          headline: string | null
          id: string
          onboarded: boolean
          timezone: string | null
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          country?: string | null
          cover_url?: string | null
          created_at?: string
          display_name?: string | null
          headline?: string | null
          id?: string
          onboarded?: boolean
          timezone?: string | null
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          country?: string | null
          cover_url?: string | null
          created_at?: string
          display_name?: string | null
          headline?: string | null
          id?: string
          onboarded?: boolean
          timezone?: string | null
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      saved_items: {
        Row: {
          created_at: string
          entity_id: string
          href: string | null
          id: string
          kind: string
          metadata: Json
          subtitle: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          entity_id: string
          href?: string | null
          id?: string
          kind: string
          metadata?: Json
          subtitle?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          entity_id?: string
          href?: string | null
          id?: string
          kind?: string
          metadata?: Json
          subtitle?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      seller_accounts: {
        Row: {
          charges_enabled: boolean
          created_at: string
          details_submitted: boolean
          payouts_enabled: boolean
          stripe_account_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          charges_enabled?: boolean
          created_at?: string
          details_submitted?: boolean
          payouts_enabled?: boolean
          stripe_account_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          charges_enabled?: boolean
          created_at?: string
          details_submitted?: boolean
          payouts_enabled?: boolean
          stripe_account_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      support_ticket_messages: {
        Row: {
          author_id: string
          body: string
          created_at: string
          id: string
          ticket_id: string
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          id?: string
          ticket_id: string
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          id?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          last_message_at: string
          priority: string
          reference_code: string
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          last_message_at?: string
          priority?: string
          reference_code?: string
          status?: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          last_message_at?: string
          priority?: string
          reference_code?: string
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tracker_columns: {
        Row: {
          created_at: string
          id: string
          key: string
          label: string
          position: number
          required: boolean
          tracker_id: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          label: string
          position?: number
          required?: boolean
          tracker_id: string
          type?: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          label?: string
          position?: number
          required?: boolean
          tracker_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "tracker_columns_tracker_id_fkey"
            columns: ["tracker_id"]
            isOneToOne: false
            referencedRelation: "trackers"
            referencedColumns: ["id"]
          },
        ]
      }
      tracker_rows: {
        Row: {
          assignee_id: string | null
          created_at: string
          data: Json
          id: string
          position: number
          status: string
          tracker_id: string
          updated_at: string
        }
        Insert: {
          assignee_id?: string | null
          created_at?: string
          data?: Json
          id?: string
          position?: number
          status?: string
          tracker_id: string
          updated_at?: string
        }
        Update: {
          assignee_id?: string | null
          created_at?: string
          data?: Json
          id?: string
          position?: number
          status?: string
          tracker_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tracker_rows_tracker_id_fkey"
            columns: ["tracker_id"]
            isOneToOne: false
            referencedRelation: "trackers"
            referencedColumns: ["id"]
          },
        ]
      }
      trackers: {
        Row: {
          category: Database["public"]["Enums"]["tracker_category"]
          created_at: string
          description: string | null
          id: string
          key: string
          name: string
          owner_id: string
          updated_at: string
        }
        Insert: {
          category: Database["public"]["Enums"]["tracker_category"]
          created_at?: string
          description?: string | null
          id?: string
          key: string
          name: string
          owner_id: string
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["tracker_category"]
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          name?: string
          owner_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount_cents: number
          created_at: string
          currency: string
          direction: string
          id: string
          kind: string
          metadata: Json
          order_id: string | null
          stripe_event_id: string | null
          user_id: string | null
        }
        Insert: {
          amount_cents: number
          created_at?: string
          currency?: string
          direction: string
          id?: string
          kind: string
          metadata?: Json
          order_id?: string | null
          stripe_event_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount_cents?: number
          created_at?: string
          currency?: string
          direction?: string
          id?: string
          kind?: string
          metadata?: Json
          order_id?: string | null
          stripe_event_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "gig_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          accessibility: Json
          appearance: Json
          connected_apps: Json
          created_at: string
          id: string
          localization: Json
          notifications: Json
          privacy: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          accessibility?: Json
          appearance?: Json
          connected_apps?: Json
          created_at?: string
          id?: string
          localization?: Json
          notifications?: Json
          privacy?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          accessibility?: Json
          appearance?: Json
          connected_apps?: Json
          created_at?: string
          id?: string
          localization?: Json
          notifications?: Json
          privacy?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      website_settings: {
        Row: {
          created_at: string
          discoverability: Json
          homepage_sections: Json
          id: string
          navigation: Json
          owner_id: string
          page_settings: Json
          redirects: Json
          seo: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          discoverability?: Json
          homepage_sections?: Json
          id?: string
          navigation?: Json
          owner_id: string
          page_settings?: Json
          redirects?: Json
          seo?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          discoverability?: Json
          homepage_sections?: Json
          id?: string
          navigation?: Json
          owner_id?: string
          page_settings?: Json
          redirects?: Json
          seo?: Json
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_account_lockout: {
        Args: { _email: string }
        Returns: {
          attempts_remaining: number
          locked: boolean
          locked_until: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_conversation_participant: {
        Args: { _conv: string; _user: string }
        Returns: boolean
      }
      is_following: {
        Args: { _followee: string; _follower: string }
        Returns: boolean
      }
      record_login_attempt: {
        Args: {
          _email: string
          _ip?: string
          _reason?: string
          _success: boolean
          _ua?: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "user" | "pro" | "enterprise" | "moderator" | "admin"
      application_stage:
        | "applied"
        | "screen"
        | "interview"
        | "offer"
        | "hired"
        | "rejected"
        | "withdrawn"
      job_status: "draft" | "open" | "closed" | "archived"
      job_type:
        | "full_time"
        | "part_time"
        | "contract"
        | "internship"
        | "temporary"
      job_workplace: "remote" | "hybrid" | "onsite"
      notification_type: "like" | "comment" | "follow" | "mention" | "system"
      post_visibility: "public" | "connections" | "private"
      tracker_category:
        | "marketplace"
        | "hiring"
        | "onboarding"
        | "design"
        | "navigation"
        | "shells"
        | "seo"
        | "feed"
        | "finance"
        | "ai"
        | "security"
        | "ops"
        | "analytics"
        | "support"
        | "enterprise"
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
      app_role: ["user", "pro", "enterprise", "moderator", "admin"],
      application_stage: [
        "applied",
        "screen",
        "interview",
        "offer",
        "hired",
        "rejected",
        "withdrawn",
      ],
      job_status: ["draft", "open", "closed", "archived"],
      job_type: [
        "full_time",
        "part_time",
        "contract",
        "internship",
        "temporary",
      ],
      job_workplace: ["remote", "hybrid", "onsite"],
      notification_type: ["like", "comment", "follow", "mention", "system"],
      post_visibility: ["public", "connections", "private"],
      tracker_category: [
        "marketplace",
        "hiring",
        "onboarding",
        "design",
        "navigation",
        "shells",
        "seo",
        "feed",
        "finance",
        "ai",
        "security",
        "ops",
        "analytics",
        "support",
        "enterprise",
      ],
    },
  },
} as const
