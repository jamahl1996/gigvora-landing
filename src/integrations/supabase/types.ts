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
      applications: {
        Row: {
          applied_at: string
          attachments: Json
          candidate_id: string
          cover_note: string | null
          created_at: string
          decided_at: string | null
          id: string
          job_id: string | null
          organization_id: string | null
          project_id: string | null
          recruiter_id: string
          score: number | null
          source: string | null
          stage: string
          updated_at: string
        }
        Insert: {
          applied_at?: string
          attachments?: Json
          candidate_id: string
          cover_note?: string | null
          created_at?: string
          decided_at?: string | null
          id?: string
          job_id?: string | null
          organization_id?: string | null
          project_id?: string | null
          recruiter_id: string
          score?: number | null
          source?: string | null
          stage?: string
          updated_at?: string
        }
        Update: {
          applied_at?: string
          attachments?: Json
          candidate_id?: string
          cover_note?: string | null
          created_at?: string
          decided_at?: string | null
          id?: string
          job_id?: string | null
          organization_id?: string | null
          project_id?: string | null
          recruiter_id?: string
          score?: number | null
          source?: string | null
          stage?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          actor_role: string | null
          after_data: Json | null
          before_data: Json | null
          created_at: string
          id: string
          ip_address: unknown
          metadata: Json
          prev_hash: string | null
          reason: string | null
          row_hash: string | null
          target_id: string | null
          target_table: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_role?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          prev_hash?: string | null
          reason?: string | null
          row_hash?: string | null
          target_id?: string | null
          target_table?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_role?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          prev_hash?: string | null
          reason?: string | null
          row_hash?: string | null
          target_id?: string | null
          target_table?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      business_cards: {
        Row: {
          avatar_url: string | null
          bio: string | null
          company: string | null
          cover_url: string | null
          created_at: string
          display_name: string
          email: string | null
          id: string
          is_public: boolean
          links: Json
          owner_id: string
          phone: string | null
          save_count: number
          shortcode: string
          theme: string
          title: string | null
          updated_at: string
          view_count: number
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          cover_url?: string | null
          created_at?: string
          display_name: string
          email?: string | null
          id?: string
          is_public?: boolean
          links?: Json
          owner_id: string
          phone?: string | null
          save_count?: number
          shortcode: string
          theme?: string
          title?: string | null
          updated_at?: string
          view_count?: number
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          cover_url?: string | null
          created_at?: string
          display_name?: string
          email?: string | null
          id?: string
          is_public?: boolean
          links?: Json
          owner_id?: string
          phone?: string | null
          save_count?: number
          shortcode?: string
          theme?: string
          title?: string | null
          updated_at?: string
          view_count?: number
          website?: string | null
        }
        Relationships: []
      }
      calls: {
        Row: {
          created_at: string
          duration_seconds: number | null
          ended_at: string | null
          id: string
          initiator_id: string
          kind: string
          metadata: Json
          participant_ids: string[]
          recording_url: string | null
          started_at: string | null
          status: string
        }
        Insert: {
          created_at?: string
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          initiator_id: string
          kind?: string
          metadata?: Json
          participant_ids: string[]
          recording_url?: string | null
          started_at?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          initiator_id?: string
          kind?: string
          metadata?: Json
          participant_ids?: string[]
          recording_url?: string | null
          started_at?: string | null
          status?: string
        }
        Relationships: []
      }
      candidates: {
        Row: {
          created_at: string
          current_company: string | null
          current_title: string | null
          email: string | null
          full_name: string
          id: string
          links: Json
          location: string | null
          notes: string
          organization_id: string | null
          phone: string | null
          rating: number | null
          recruiter_id: string
          resume_url: string | null
          source: string | null
          stage: string
          tags: string[]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          current_company?: string | null
          current_title?: string | null
          email?: string | null
          full_name: string
          id?: string
          links?: Json
          location?: string | null
          notes?: string
          organization_id?: string | null
          phone?: string | null
          rating?: number | null
          recruiter_id: string
          resume_url?: string | null
          source?: string | null
          stage?: string
          tags?: string[]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          current_company?: string | null
          current_title?: string | null
          email?: string | null
          full_name?: string
          id?: string
          links?: Json
          location?: string | null
          notes?: string
          organization_id?: string | null
          phone?: string | null
          rating?: number | null
          recruiter_id?: string
          resume_url?: string | null
          source?: string | null
          stage?: string
          tags?: string[]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      connection_requests: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          message: string | null
          recipient_id: string
          requester_id: string
          responded_at: string | null
          status: string
        }
        Insert: {
          created_at?: string
          expires_at?: string
          id?: string
          message?: string | null
          recipient_id: string
          requester_id: string
          responded_at?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          message?: string | null
          recipient_id?: string
          requester_id?: string
          responded_at?: string | null
          status?: string
        }
        Relationships: []
      }
      connections: {
        Row: {
          created_at: string
          initiated_by: string | null
          status: string
          user_hi_id: string
          user_lo_id: string
        }
        Insert: {
          created_at?: string
          initiated_by?: string | null
          status?: string
          user_hi_id: string
          user_lo_id: string
        }
        Update: {
          created_at?: string
          initiated_by?: string | null
          status?: string
          user_hi_id?: string
          user_lo_id?: string
        }
        Relationships: []
      }
      contracts: {
        Row: {
          client_id: string
          client_signed_at: string | null
          created_at: string
          currency: string
          end_date: string | null
          id: string
          organization_id: string | null
          project_id: string | null
          proposal_id: string | null
          provider_id: string
          provider_signed_at: string | null
          scope: string
          start_date: string | null
          status: string
          terms: Json
          title: string
          total_amount_cents: number | null
          updated_at: string
        }
        Insert: {
          client_id: string
          client_signed_at?: string | null
          created_at?: string
          currency?: string
          end_date?: string | null
          id?: string
          organization_id?: string | null
          project_id?: string | null
          proposal_id?: string | null
          provider_id: string
          provider_signed_at?: string | null
          scope?: string
          start_date?: string | null
          status?: string
          terms?: Json
          title: string
          total_amount_cents?: number | null
          updated_at?: string
        }
        Update: {
          client_id?: string
          client_signed_at?: string | null
          created_at?: string
          currency?: string
          end_date?: string | null
          id?: string
          organization_id?: string | null
          project_id?: string | null
          proposal_id?: string | null
          provider_id?: string
          provider_signed_at?: string | null
          scope?: string
          start_date?: string | null
          status?: string
          terms?: Json
          title?: string
          total_amount_cents?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      deliverables: {
        Row: {
          created_at: string
          files: Json
          id: string
          links: Json
          milestone_id: string | null
          notes: string
          project_id: string
          review_notes: string | null
          reviewed_at: string | null
          reviewer_id: string | null
          status: string
          submitted_by: string
          task_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          files?: Json
          id?: string
          links?: Json
          milestone_id?: string | null
          notes?: string
          project_id: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: string
          submitted_by: string
          task_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          files?: Json
          id?: string
          links?: Json
          milestone_id?: string | null
          notes?: string
          project_id?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: string
          submitted_by?: string
          task_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "deliverables_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliverables_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliverables_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      disputes: {
        Row: {
          amount_disputed_cents: number | null
          assigned_to: string | null
          case_number: string
          created_at: string
          currency: string
          evidence: Json
          id: string
          narrative: string
          order_id: string | null
          outcome: string | null
          outcome_notes: string | null
          raised_by: string
          reason: string
          resolved_at: string | null
          respondent_id: string
          status: string
          updated_at: string
        }
        Insert: {
          amount_disputed_cents?: number | null
          assigned_to?: string | null
          case_number?: string
          created_at?: string
          currency?: string
          evidence?: Json
          id?: string
          narrative?: string
          order_id?: string | null
          outcome?: string | null
          outcome_notes?: string | null
          raised_by: string
          reason: string
          resolved_at?: string | null
          respondent_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          amount_disputed_cents?: number | null
          assigned_to?: string | null
          case_number?: string
          created_at?: string
          currency?: string
          evidence?: Json
          id?: string
          narrative?: string
          order_id?: string | null
          outcome?: string | null
          outcome_notes?: string | null
          raised_by?: string
          reason?: string
          resolved_at?: string | null
          respondent_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "disputes_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          attendee_count: number
          capacity: number | null
          cover_image_url: string | null
          created_at: string
          description: string
          ends_at: string | null
          group_id: string | null
          host_id: string
          id: string
          location: string | null
          online_url: string | null
          organization_id: string | null
          starts_at: string
          status: string
          title: string
          updated_at: string
          visibility: string
        }
        Insert: {
          attendee_count?: number
          capacity?: number | null
          cover_image_url?: string | null
          created_at?: string
          description?: string
          ends_at?: string | null
          group_id?: string | null
          host_id: string
          id?: string
          location?: string | null
          online_url?: string | null
          organization_id?: string | null
          starts_at: string
          status?: string
          title: string
          updated_at?: string
          visibility?: string
        }
        Update: {
          attendee_count?: number
          capacity?: number | null
          cover_image_url?: string | null
          created_at?: string
          description?: string
          ends_at?: string | null
          group_id?: string | null
          host_id?: string
          id?: string
          location?: string | null
          online_url?: string | null
          organization_id?: string | null
          starts_at?: string
          status?: string
          title?: string
          updated_at?: string
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
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
      gigs: {
        Row: {
          category: string | null
          cover_image_url: string | null
          created_at: string
          currency: string
          description: string
          gallery: Json
          id: string
          order_count: number
          owner_id: string
          published_at: string | null
          rating_avg: number | null
          rating_count: number
          slug: string | null
          starting_price_cents: number | null
          status: string
          tags: string[]
          tiers: Json
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          category?: string | null
          cover_image_url?: string | null
          created_at?: string
          currency?: string
          description?: string
          gallery?: Json
          id?: string
          order_count?: number
          owner_id: string
          published_at?: string | null
          rating_avg?: number | null
          rating_count?: number
          slug?: string | null
          starting_price_cents?: number | null
          status?: string
          tags?: string[]
          tiers?: Json
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          category?: string | null
          cover_image_url?: string | null
          created_at?: string
          currency?: string
          description?: string
          gallery?: Json
          id?: string
          order_count?: number
          owner_id?: string
          published_at?: string | null
          rating_avg?: number | null
          rating_count?: number
          slug?: string | null
          starting_price_cents?: number | null
          status?: string
          tags?: string[]
          tiers?: Json
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: []
      }
      group_members: {
        Row: {
          group_id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          group_id: string
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          group_id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          category: string | null
          cover_image_url: string | null
          created_at: string
          description: string
          id: string
          member_count: number
          name: string
          owner_id: string
          slug: string | null
          tags: string[]
          updated_at: string
          visibility: string
        }
        Insert: {
          category?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string
          id?: string
          member_count?: number
          name: string
          owner_id: string
          slug?: string | null
          tags?: string[]
          updated_at?: string
          visibility?: string
        }
        Update: {
          category?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string
          id?: string
          member_count?: number
          name?: string
          owner_id?: string
          slug?: string | null
          tags?: string[]
          updated_at?: string
          visibility?: string
        }
        Relationships: []
      }
      interviews: {
        Row: {
          agenda: string
          application_id: string
          created_at: string
          duration_minutes: number
          id: string
          kind: string
          location: string | null
          meeting_url: string | null
          organization_id: string | null
          panelist_ids: string[]
          recording_url: string | null
          recruiter_id: string
          scheduled_at: string
          status: string
          updated_at: string
        }
        Insert: {
          agenda?: string
          application_id: string
          created_at?: string
          duration_minutes?: number
          id?: string
          kind?: string
          location?: string | null
          meeting_url?: string | null
          organization_id?: string | null
          panelist_ids?: string[]
          recording_url?: string | null
          recruiter_id: string
          scheduled_at: string
          status?: string
          updated_at?: string
        }
        Update: {
          agenda?: string
          application_id?: string
          created_at?: string
          duration_minutes?: number
          id?: string
          kind?: string
          location?: string | null
          meeting_url?: string | null
          organization_id?: string | null
          panelist_ids?: string[]
          recording_url?: string | null
          recruiter_id?: string
          scheduled_at?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "interviews_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interviews_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount_paid_cents: number
          created_at: string
          currency: string
          due_at: string | null
          id: string
          invoice_number: string
          issued_at: string | null
          issuer_id: string
          line_items: Json
          notes: string | null
          order_id: string | null
          organization_id: string | null
          paid_at: string | null
          project_id: string | null
          recipient_id: string
          status: string
          subtotal_cents: number
          tax_cents: number
          total_cents: number
          updated_at: string
        }
        Insert: {
          amount_paid_cents?: number
          created_at?: string
          currency?: string
          due_at?: string | null
          id?: string
          invoice_number?: string
          issued_at?: string | null
          issuer_id: string
          line_items?: Json
          notes?: string | null
          order_id?: string | null
          organization_id?: string | null
          paid_at?: string | null
          project_id?: string | null
          recipient_id: string
          status?: string
          subtotal_cents: number
          tax_cents?: number
          total_cents: number
          updated_at?: string
        }
        Update: {
          amount_paid_cents?: number
          created_at?: string
          currency?: string
          due_at?: string | null
          id?: string
          invoice_number?: string
          issued_at?: string | null
          issuer_id?: string
          line_items?: Json
          notes?: string | null
          order_id?: string | null
          organization_id?: string | null
          paid_at?: string | null
          project_id?: string | null
          recipient_id?: string
          status?: string
          subtotal_cents?: number
          tax_cents?: number
          total_cents?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          applicant_count: number
          category: string | null
          closes_at: string | null
          created_at: string
          currency: string
          description: string
          employment_type: string
          id: string
          location: string | null
          organization_id: string | null
          owner_id: string
          published_at: string | null
          remote_policy: string
          salary_max_cents: number | null
          salary_min_cents: number | null
          skills: string[]
          slug: string | null
          status: string
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          applicant_count?: number
          category?: string | null
          closes_at?: string | null
          created_at?: string
          currency?: string
          description?: string
          employment_type?: string
          id?: string
          location?: string | null
          organization_id?: string | null
          owner_id: string
          published_at?: string | null
          remote_policy?: string
          salary_max_cents?: number | null
          salary_min_cents?: number | null
          skills?: string[]
          slug?: string | null
          status?: string
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          applicant_count?: number
          category?: string | null
          closes_at?: string | null
          created_at?: string
          currency?: string
          description?: string
          employment_type?: string
          id?: string
          location?: string | null
          organization_id?: string | null
          owner_id?: string
          published_at?: string | null
          remote_policy?: string
          salary_max_cents?: number | null
          salary_min_cents?: number | null
          skills?: string[]
          slug?: string | null
          status?: string
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "jobs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      legal_acceptances: {
        Row: {
          accepted_at: string
          document_kind: string
          document_version: string
          id: string
          ip_address: unknown
          metadata: Json
          user_agent: string | null
          user_id: string
        }
        Insert: {
          accepted_at?: string
          document_kind: string
          document_version: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          user_agent?: string | null
          user_id: string
        }
        Update: {
          accepted_at?: string
          document_kind?: string
          document_version?: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      media_assets: {
        Row: {
          alt_text: string | null
          created_at: string
          duration_seconds: number | null
          height: number | null
          id: string
          kind: string
          metadata: Json
          mime_type: string | null
          owner_id: string
          size_bytes: number | null
          storage_bucket: string
          storage_path: string
          thumbnail_url: string | null
          updated_at: string
          url: string | null
          visibility: string
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          duration_seconds?: number | null
          height?: number | null
          id?: string
          kind: string
          metadata?: Json
          mime_type?: string | null
          owner_id: string
          size_bytes?: number | null
          storage_bucket?: string
          storage_path: string
          thumbnail_url?: string | null
          updated_at?: string
          url?: string | null
          visibility?: string
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          duration_seconds?: number | null
          height?: number | null
          id?: string
          kind?: string
          metadata?: Json
          mime_type?: string | null
          owner_id?: string
          size_bytes?: number | null
          storage_bucket?: string
          storage_path?: string
          thumbnail_url?: string | null
          updated_at?: string
          url?: string | null
          visibility?: string
          width?: number | null
        }
        Relationships: []
      }
      mentorship_relationships: {
        Row: {
          cadence: string | null
          created_at: string
          ended_at: string | null
          goals: string
          id: string
          mentee_id: string
          mentor_id: string
          started_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          cadence?: string | null
          created_at?: string
          ended_at?: string | null
          goals?: string
          id?: string
          mentee_id: string
          mentor_id: string
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          cadence?: string | null
          created_at?: string
          ended_at?: string | null
          goals?: string
          id?: string
          mentee_id?: string
          mentor_id?: string
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      message_threads: {
        Row: {
          archived_by: string[]
          created_at: string
          id: string
          last_message_at: string | null
          last_message_preview: string | null
          metadata: Json
          participant_ids: string[]
          subject: string | null
          updated_at: string
        }
        Insert: {
          archived_by?: string[]
          created_at?: string
          id?: string
          last_message_at?: string | null
          last_message_preview?: string | null
          metadata?: Json
          participant_ids: string[]
          subject?: string | null
          updated_at?: string
        }
        Update: {
          archived_by?: string[]
          created_at?: string
          id?: string
          last_message_at?: string | null
          last_message_preview?: string | null
          metadata?: Json
          participant_ids?: string[]
          subject?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          attachments: Json
          body: string
          created_at: string
          deleted_at: string | null
          edited_at: string | null
          id: string
          read_at: string | null
          recipient_id: string
          sender_id: string
          thread_id: string
        }
        Insert: {
          attachments?: Json
          body: string
          created_at?: string
          deleted_at?: string | null
          edited_at?: string | null
          id?: string
          read_at?: string | null
          recipient_id: string
          sender_id: string
          thread_id: string
        }
        Update: {
          attachments?: Json
          body?: string
          created_at?: string
          deleted_at?: string | null
          edited_at?: string | null
          id?: string
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
          thread_id?: string
        }
        Relationships: []
      }
      milestones: {
        Row: {
          amount_cents: number | null
          approved_at: string | null
          created_at: string
          currency: string
          description: string
          due_at: string | null
          id: string
          paid_at: string | null
          position: number
          project_id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          amount_cents?: number | null
          approved_at?: string | null
          created_at?: string
          currency?: string
          description?: string
          due_at?: string | null
          id?: string
          paid_at?: string | null
          position?: number
          project_id: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          amount_cents?: number | null
          approved_at?: string | null
          created_at?: string
          currency?: string
          description?: string
          due_at?: string | null
          id?: string
          paid_at?: string | null
          position?: number
          project_id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          actor_id: string | null
          body: string | null
          created_at: string
          id: string
          kind: string
          link_url: string | null
          payload: Json
          read_at: string | null
          seen_at: string | null
          source_id: string | null
          source_kind: string | null
          title: string
          user_id: string
        }
        Insert: {
          actor_id?: string | null
          body?: string | null
          created_at?: string
          id?: string
          kind: string
          link_url?: string | null
          payload?: Json
          read_at?: string | null
          seen_at?: string | null
          source_id?: string | null
          source_kind?: string | null
          title: string
          user_id: string
        }
        Update: {
          actor_id?: string | null
          body?: string | null
          created_at?: string
          id?: string
          kind?: string
          link_url?: string | null
          payload?: Json
          read_at?: string | null
          seen_at?: string | null
          source_id?: string | null
          source_kind?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount_cents: number
          buyer_id: string
          cancelled_at: string | null
          completed_at: string | null
          created_at: string
          currency: string
          delivered_at: string | null
          delivery_due_at: string | null
          fee_cents: number
          gig_id: string | null
          id: string
          job_id: string | null
          metadata: Json
          notes: string | null
          order_number: string
          project_id: string | null
          seller_id: string
          service_id: string | null
          status: string
          tier_name: string | null
          updated_at: string
        }
        Insert: {
          amount_cents: number
          buyer_id: string
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string
          currency?: string
          delivered_at?: string | null
          delivery_due_at?: string | null
          fee_cents?: number
          gig_id?: string | null
          id?: string
          job_id?: string | null
          metadata?: Json
          notes?: string | null
          order_number?: string
          project_id?: string | null
          seller_id: string
          service_id?: string | null
          status?: string
          tier_name?: string | null
          updated_at?: string
        }
        Update: {
          amount_cents?: number
          buyer_id?: string
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string
          currency?: string
          delivered_at?: string | null
          delivery_due_at?: string | null
          fee_cents?: number
          gig_id?: string | null
          id?: string
          job_id?: string | null
          metadata?: Json
          notes?: string | null
          order_number?: string
          project_id?: string | null
          seller_id?: string
          service_id?: string | null
          status?: string
          tier_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_gig_id_fkey"
            columns: ["gig_id"]
            isOneToOne: false
            referencedRelation: "gigs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          id: string
          joined_at: string
          member_role: Database["public"]["Enums"]["org_member_role"]
          organization_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          member_role?: Database["public"]["Enums"]["org_member_role"]
          organization_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          member_role?: Database["public"]["Enums"]["org_member_role"]
          organization_id?: string
          user_id?: string
        }
        Relationships: []
      }
      organizations: {
        Row: {
          about: string | null
          created_at: string
          created_by: string | null
          id: string
          industry: string | null
          is_public: boolean
          logo_url: string | null
          name: string
          size: string | null
          slug: string
          updated_at: string
          website: string | null
        }
        Insert: {
          about?: string | null
          created_at?: string
          created_by?: string | null
          id: string
          industry?: string | null
          is_public?: boolean
          logo_url?: string | null
          name: string
          size?: string | null
          slug: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          about?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          industry?: string | null
          is_public?: boolean
          logo_url?: string | null
          name?: string
          size?: string | null
          slug?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount_cents: number
          created_at: string
          currency: string
          failure_reason: string | null
          fee_cents: number
          id: string
          invoice_id: string | null
          metadata: Json
          order_id: string | null
          payee_id: string | null
          payer_id: string
          processed_at: string | null
          provider: string
          provider_ref: string | null
          refunded_cents: number
          status: string
          updated_at: string
        }
        Insert: {
          amount_cents: number
          created_at?: string
          currency?: string
          failure_reason?: string | null
          fee_cents?: number
          id?: string
          invoice_id?: string | null
          metadata?: Json
          order_id?: string | null
          payee_id?: string | null
          payer_id: string
          processed_at?: string | null
          provider: string
          provider_ref?: string | null
          refunded_cents?: number
          status?: string
          updated_at?: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          currency?: string
          failure_reason?: string | null
          fee_cents?: number
          id?: string
          invoice_id?: string | null
          metadata?: Json
          order_id?: string | null
          payee_id?: string | null
          payer_id?: string
          processed_at?: string | null
          provider?: string
          provider_ref?: string | null
          refunded_cents?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      payouts: {
        Row: {
          created_at: string
          currency: string
          failure_reason: string | null
          fee_cents: number
          gross_cents: number
          id: string
          metadata: Json
          net_cents: number
          organization_id: string | null
          payee_id: string
          payout_method: string | null
          period_end: string | null
          period_start: string | null
          processed_at: string | null
          provider: string
          provider_ref: string | null
          scheduled_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          failure_reason?: string | null
          fee_cents?: number
          gross_cents: number
          id?: string
          metadata?: Json
          net_cents: number
          organization_id?: string | null
          payee_id: string
          payout_method?: string | null
          period_end?: string | null
          period_start?: string | null
          processed_at?: string | null
          provider: string
          provider_ref?: string | null
          scheduled_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          failure_reason?: string | null
          fee_cents?: number
          gross_cents?: number
          id?: string
          metadata?: Json
          net_cents?: number
          organization_id?: string | null
          payee_id?: string
          payout_method?: string | null
          period_end?: string | null
          period_start?: string | null
          processed_at?: string | null
          provider?: string
          provider_ref?: string | null
          scheduled_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payouts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      post_comments: {
        Row: {
          author_id: string
          body: string
          created_at: string
          deleted_at: string | null
          id: string
          parent_id: string | null
          post_id: string
          updated_at: string
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          parent_id?: string | null
          post_id: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          deleted_at?: string | null
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
      post_reactions: {
        Row: {
          actor_id: string
          created_at: string
          kind: string
          post_id: string
        }
        Insert: {
          actor_id: string
          created_at?: string
          kind?: string
          post_id: string
        }
        Update: {
          actor_id?: string
          created_at?: string
          kind?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_reactions_post_id_fkey"
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
          body: string
          comment_count: number
          created_at: string
          id: string
          link_preview: Json | null
          media: Json
          published_at: string
          reaction_count: number
          status: string
          updated_at: string
          visibility: string
        }
        Insert: {
          author_id: string
          body: string
          comment_count?: number
          created_at?: string
          id?: string
          link_preview?: Json | null
          media?: Json
          published_at?: string
          reaction_count?: number
          status?: string
          updated_at?: string
          visibility?: string
        }
        Update: {
          author_id?: string
          body?: string
          comment_count?: number
          created_at?: string
          id?: string
          link_preview?: Json | null
          media?: Json
          published_at?: string
          reaction_count?: number
          status?: string
          updated_at?: string
          visibility?: string
        }
        Relationships: []
      }
      professional_profiles: {
        Row: {
          availability: string | null
          created_at: string
          currency: string
          github_url: string | null
          hourly_rate_cents: number | null
          id: string
          is_for_hire: boolean
          languages: string[]
          linkedin_url: string | null
          portfolio_url: string | null
          rating_avg: number | null
          rating_count: number
          skills: string[]
          title: string | null
          updated_at: string
          years_experience: number | null
        }
        Insert: {
          availability?: string | null
          created_at?: string
          currency?: string
          github_url?: string | null
          hourly_rate_cents?: number | null
          id: string
          is_for_hire?: boolean
          languages?: string[]
          linkedin_url?: string | null
          portfolio_url?: string | null
          rating_avg?: number | null
          rating_count?: number
          skills?: string[]
          title?: string | null
          updated_at?: string
          years_experience?: number | null
        }
        Update: {
          availability?: string | null
          created_at?: string
          currency?: string
          github_url?: string | null
          hourly_rate_cents?: number | null
          id?: string
          is_for_hire?: boolean
          languages?: string[]
          linkedin_url?: string | null
          portfolio_url?: string | null
          rating_avg?: number | null
          rating_count?: number
          skills?: string[]
          title?: string | null
          updated_at?: string
          years_experience?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          headline: string | null
          id: string
          is_public: boolean
          location: string | null
          updated_at: string
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          headline?: string | null
          id: string
          is_public?: boolean
          location?: string | null
          updated_at?: string
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          headline?: string | null
          id?: string
          is_public?: boolean
          location?: string | null
          updated_at?: string
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          brief: string
          budget_max_cents: number | null
          budget_min_cents: number | null
          budget_type: string
          category: string | null
          closes_at: string | null
          created_at: string
          currency: string
          duration: string | null
          id: string
          organization_id: string | null
          owner_id: string
          proposal_count: number
          published_at: string | null
          skills_required: string[]
          slug: string | null
          status: string
          title: string
          updated_at: string
          view_count: number
          visibility: string
        }
        Insert: {
          brief?: string
          budget_max_cents?: number | null
          budget_min_cents?: number | null
          budget_type?: string
          category?: string | null
          closes_at?: string | null
          created_at?: string
          currency?: string
          duration?: string | null
          id?: string
          organization_id?: string | null
          owner_id: string
          proposal_count?: number
          published_at?: string | null
          skills_required?: string[]
          slug?: string | null
          status?: string
          title: string
          updated_at?: string
          view_count?: number
          visibility?: string
        }
        Update: {
          brief?: string
          budget_max_cents?: number | null
          budget_min_cents?: number | null
          budget_type?: string
          category?: string | null
          closes_at?: string | null
          created_at?: string
          currency?: string
          duration?: string | null
          id?: string
          organization_id?: string | null
          owner_id?: string
          proposal_count?: number
          published_at?: string | null
          skills_required?: string[]
          slug?: string | null
          status?: string
          title?: string
          updated_at?: string
          view_count?: number
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      proposals: {
        Row: {
          attachments: Json
          bid_amount_cents: number | null
          cover_note: string
          created_at: string
          currency: string
          freelancer_id: string
          id: string
          organization_id: string | null
          project_id: string
          responded_at: string | null
          status: string
          timeline_days: number | null
          updated_at: string
        }
        Insert: {
          attachments?: Json
          bid_amount_cents?: number | null
          cover_note?: string
          created_at?: string
          currency?: string
          freelancer_id: string
          id?: string
          organization_id?: string | null
          project_id: string
          responded_at?: string | null
          status?: string
          timeline_days?: number | null
          updated_at?: string
        }
        Update: {
          attachments?: Json
          bid_amount_cents?: number | null
          cover_note?: string
          created_at?: string
          currency?: string
          freelancer_id?: string
          id?: string
          organization_id?: string | null
          project_id?: string
          responded_at?: string | null
          status?: string
          timeline_days?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string
          communication_rating: number | null
          created_at: string
          expertise_rating: number | null
          gig_id: string | null
          id: string
          moderation_status: string
          order_id: string | null
          overall_rating: number
          project_id: string | null
          quality_rating: number | null
          responded_at: string | null
          response: string | null
          reviewee_id: string
          reviewer_id: string
          service_id: string | null
          updated_at: string
          value_rating: number | null
        }
        Insert: {
          comment?: string
          communication_rating?: number | null
          created_at?: string
          expertise_rating?: number | null
          gig_id?: string | null
          id?: string
          moderation_status?: string
          order_id?: string | null
          overall_rating: number
          project_id?: string | null
          quality_rating?: number | null
          responded_at?: string | null
          response?: string | null
          reviewee_id: string
          reviewer_id: string
          service_id?: string | null
          updated_at?: string
          value_rating?: number | null
        }
        Update: {
          comment?: string
          communication_rating?: number | null
          created_at?: string
          expertise_rating?: number | null
          gig_id?: string | null
          id?: string
          moderation_status?: string
          order_id?: string | null
          overall_rating?: number
          project_id?: string | null
          quality_rating?: number | null
          responded_at?: string | null
          response?: string | null
          reviewee_id?: string
          reviewer_id?: string
          service_id?: string | null
          updated_at?: string
          value_rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_gig_id_fkey"
            columns: ["gig_id"]
            isOneToOne: false
            referencedRelation: "gigs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_items: {
        Row: {
          collection: string | null
          created_at: string
          id: string
          item_id: string
          item_kind: string
          note: string | null
          user_id: string
        }
        Insert: {
          collection?: string | null
          created_at?: string
          id?: string
          item_id: string
          item_kind: string
          note?: string | null
          user_id: string
        }
        Update: {
          collection?: string | null
          created_at?: string
          id?: string
          item_id?: string
          item_kind?: string
          note?: string | null
          user_id?: string
        }
        Relationships: []
      }
      scorecards: {
        Row: {
          application_id: string
          competencies: Json
          concerns: string
          created_at: string
          id: string
          interview_id: string
          notes: string
          organization_id: string | null
          overall_rating: number
          recommendation: string
          recruiter_id: string
          reviewer_id: string
          strengths: string
          submitted_at: string
          updated_at: string
        }
        Insert: {
          application_id: string
          competencies?: Json
          concerns?: string
          created_at?: string
          id?: string
          interview_id: string
          notes?: string
          organization_id?: string | null
          overall_rating: number
          recommendation: string
          recruiter_id: string
          reviewer_id: string
          strengths?: string
          submitted_at?: string
          updated_at?: string
        }
        Update: {
          application_id?: string
          competencies?: Json
          concerns?: string
          created_at?: string
          id?: string
          interview_id?: string
          notes?: string
          organization_id?: string | null
          overall_rating?: number
          recommendation?: string
          recruiter_id?: string
          reviewer_id?: string
          strengths?: string
          submitted_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scorecards_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scorecards_interview_id_fkey"
            columns: ["interview_id"]
            isOneToOne: false
            referencedRelation: "interviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scorecards_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          category: string | null
          cover_image_url: string | null
          created_at: string
          currency: string
          description: string
          hourly_rate_cents: number | null
          id: string
          inquiry_count: number
          owner_id: string
          pricing_model: string
          published_at: string | null
          rating_avg: number | null
          rating_count: number
          retainer_cents: number | null
          slug: string | null
          status: string
          summary: string
          tags: string[]
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          category?: string | null
          cover_image_url?: string | null
          created_at?: string
          currency?: string
          description?: string
          hourly_rate_cents?: number | null
          id?: string
          inquiry_count?: number
          owner_id: string
          pricing_model?: string
          published_at?: string | null
          rating_avg?: number | null
          rating_count?: number
          retainer_cents?: number | null
          slug?: string | null
          status?: string
          summary?: string
          tags?: string[]
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          category?: string | null
          cover_image_url?: string | null
          created_at?: string
          currency?: string
          description?: string
          hourly_rate_cents?: number | null
          id?: string
          inquiry_count?: number
          owner_id?: string
          pricing_model?: string
          published_at?: string | null
          rating_avg?: number | null
          rating_count?: number
          retainer_cents?: number | null
          slug?: string | null
          status?: string
          summary?: string
          tags?: string[]
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assignee_id: string | null
          completed_at: string | null
          created_at: string
          created_by: string
          description: string
          due_at: string | null
          estimate_hours: number | null
          id: string
          parent_id: string | null
          position: number
          priority: string
          project_id: string
          status: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          assignee_id?: string | null
          completed_at?: string | null
          created_at?: string
          created_by: string
          description?: string
          due_at?: string | null
          estimate_hours?: number | null
          id?: string
          parent_id?: string | null
          position?: number
          priority?: string
          project_id: string
          status?: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          assignee_id?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string
          description?: string
          due_at?: string | null
          estimate_hours?: number | null
          id?: string
          parent_id?: string | null
          position?: number
          priority?: string
          project_id?: string
          status?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      time_entries: {
        Row: {
          billable: boolean
          created_at: string
          currency: string
          description: string
          duration_seconds: number | null
          ended_at: string | null
          hourly_rate_cents: number | null
          id: string
          invoice_id: string | null
          project_id: string
          started_at: string
          task_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          billable?: boolean
          created_at?: string
          currency?: string
          description?: string
          duration_seconds?: number | null
          ended_at?: string | null
          hourly_rate_cents?: number | null
          id?: string
          invoice_id?: string | null
          project_id: string
          started_at: string
          task_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          billable?: boolean
          created_at?: string
          currency?: string
          description?: string
          duration_seconds?: number | null
          ended_at?: string | null
          hourly_rate_cents?: number | null
          id?: string
          invoice_id?: string | null
          project_id?: string
          started_at?: string
          task_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_entries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      user_blocks: {
        Row: {
          blocked_id: string
          blocker_id: string
          created_at: string
          reason: string | null
        }
        Insert: {
          blocked_id: string
          blocker_id: string
          created_at?: string
          reason?: string | null
        }
        Update: {
          blocked_id?: string
          blocker_id?: string
          created_at?: string
          reason?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          granted_at: string
          granted_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string
          email_notifications: boolean
          locale: string
          marketing_opt_in: boolean
          preferences: Json
          push_notifications: boolean
          theme: string
          timezone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_notifications?: boolean
          locale?: string
          marketing_opt_in?: boolean
          preferences?: Json
          push_notifications?: boolean
          theme?: string
          timezone?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_notifications?: boolean
          locale?: string
          marketing_opt_in?: boolean
          preferences?: Json
          push_notifications?: boolean
          theme?: string
          timezone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      webhooks: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          event_types: string[]
          failure_count: number
          id: string
          last_triggered_at: string | null
          organization_id: string | null
          owner_id: string
          secret: string
          updated_at: string
          url: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          event_types?: string[]
          failure_count?: number
          id?: string
          last_triggered_at?: string | null
          organization_id?: string | null
          owner_id: string
          secret: string
          updated_at?: string
          url: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          event_types?: string[]
          failure_count?: number
          id?: string
          last_triggered_at?: string | null
          organization_id?: string | null
          owner_id?: string
          secret?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      webinars: {
        Row: {
          attendee_count: number
          capacity: number | null
          cover_image_url: string | null
          created_at: string
          description: string
          ends_at: string | null
          host_id: string
          id: string
          meeting_url: string | null
          organization_id: string | null
          slug: string | null
          starts_at: string
          status: string
          title: string
          updated_at: string
          visibility: string
        }
        Insert: {
          attendee_count?: number
          capacity?: number | null
          cover_image_url?: string | null
          created_at?: string
          description?: string
          ends_at?: string | null
          host_id: string
          id?: string
          meeting_url?: string | null
          organization_id?: string | null
          slug?: string | null
          starts_at: string
          status?: string
          title: string
          updated_at?: string
          visibility?: string
        }
        Update: {
          attendee_count?: number
          capacity?: number | null
          cover_image_url?: string | null
          created_at?: string
          description?: string
          ends_at?: string | null
          host_id?: string
          id?: string
          meeting_url?: string | null
          organization_id?: string | null
          slug?: string | null
          starts_at?: string
          status?: string
          title?: string
          updated_at?: string
          visibility?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      are_connected: { Args: { _a: string; _b: string }; Returns: boolean }
      can_access_project: { Args: { _project_id: string }; Returns: boolean }
      can_manage_project: { Args: { _project_id: string }; Returns: boolean }
      current_user_roles: {
        Args: never
        Returns: Database["public"]["Enums"]["app_role"][]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_org_member: {
        Args: {
          _min_role?: Database["public"]["Enums"]["org_member_role"]
          _org_id: string
          _user_id: string
        }
        Returns: boolean
      }
      record_audit_event: {
        Args: {
          _action: string
          _after?: Json
          _before?: Json
          _metadata?: Json
          _reason?: string
          _target_id?: string
          _target_table?: string
        }
        Returns: string
      }
      send_notification: {
        Args: {
          _body?: string
          _kind: string
          _link_url?: string
          _payload?: Json
          _source_id?: string
          _source_kind?: string
          _title: string
          _user_id: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role:
        | "user"
        | "professional"
        | "enterprise"
        | "super-admin"
        | "cs-admin"
        | "finance-admin"
        | "moderator"
        | "trust-safety"
        | "dispute-mgr"
        | "ads-ops"
        | "compliance"
        | "marketing-admin"
      org_member_role: "owner" | "admin" | "member" | "viewer"
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
      app_role: [
        "user",
        "professional",
        "enterprise",
        "super-admin",
        "cs-admin",
        "finance-admin",
        "moderator",
        "trust-safety",
        "dispute-mgr",
        "ads-ops",
        "compliance",
        "marketing-admin",
      ],
      org_member_role: ["owner", "admin", "member", "viewer"],
    },
  },
} as const
