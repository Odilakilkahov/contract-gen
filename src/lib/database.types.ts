// Auto-generated types for Supabase database

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          company_name: string | null
          phone: string | null
          timezone: string
          language: string
          plan: 'free' | 'creator' | 'agency'
          plan_expires_at: string | null
          stripe_customer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          company_name?: string | null
          phone?: string | null
          timezone?: string
          language?: string
          plan?: 'free' | 'creator' | 'agency'
          plan_expires_at?: string | null
          stripe_customer_id?: string | null
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }

      teams: {
        Row: {
          id: string
          name: string
          slug: string
          owner_id: string | null
          logo_url: string | null
          settings: Json
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          owner_id?: string | null
          logo_url?: string | null
          settings?: Json
        }
        Update: Partial<Database['public']['Tables']['teams']['Insert']>
      }

      team_members: {
        Row: {
          id: string
          team_id: string
          user_id: string
          role: 'owner' | 'admin' | 'member' | 'viewer'
          invited_at: string
          joined_at: string | null
        }
        Insert: {
          id?: string
          team_id: string
          user_id: string
          role?: 'owner' | 'admin' | 'member' | 'viewer'
          invited_at?: string
          joined_at?: string | null
        }
        Update: Partial<Database['public']['Tables']['team_members']['Insert']>
      }

      contracts: {
        Row: {
          id: string
          user_id: string
          team_id: string | null
          template_id: string | null
          title: string
          status: 'draft' | 'pending_review' | 'pending_signature' | 'signed' | 'expired' | 'cancelled'
          content: string | null
          summary: string | null
          creator_name: string | null
          creator_email: string | null
          brand_name: string | null
          brand_contact_name: string | null
          brand_contact_email: string | null
          platform: string | null
          deliverables: Json
          compensation: number | null
          compensation_type: 'flat' | 'hourly' | 'commission' | 'hybrid' | null
          currency: string
          start_date: string | null
          end_date: string | null
          exclusivity: boolean
          exclusivity_details: string | null
          usage_rights: Json
          pdf_url: string | null
          expires_at: string | null
          signed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          team_id?: string | null
          template_id?: string | null
          title: string
          status?: 'draft' | 'pending_review' | 'pending_signature' | 'signed' | 'expired' | 'cancelled'
          content?: string | null
          summary?: string | null
          creator_name?: string | null
          creator_email?: string | null
          brand_name?: string | null
          brand_contact_name?: string | null
          brand_contact_email?: string | null
          platform?: string | null
          deliverables?: Json
          compensation?: number | null
          compensation_type?: 'flat' | 'hourly' | 'commission' | 'hybrid' | null
          currency?: string
          start_date?: string | null
          end_date?: string | null
          exclusivity?: boolean
          exclusivity_details?: string | null
          usage_rights?: Json
          pdf_url?: string | null
          expires_at?: string | null
          signed_at?: string | null
        }
        Update: Partial<Database['public']['Tables']['contracts']['Insert']>
      }

      contract_versions: {
        Row: {
          id: string
          contract_id: string
          version_number: number
          content: string
          changes_summary: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          contract_id: string
          version_number: number
          content: string
          changes_summary?: string | null
          created_by?: string | null
        }
        Update: Partial<Database['public']['Tables']['contract_versions']['Insert']>
      }

      contract_comments: {
        Row: {
          id: string
          contract_id: string
          user_id: string | null
          parent_id: string | null
          content: string
          selection_start: number | null
          selection_end: number | null
          selected_text: string | null
          status: 'open' | 'resolved' | 'rejected'
          author_name: string | null
          author_email: string | null
          is_external: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          contract_id: string
          user_id?: string | null
          parent_id?: string | null
          content: string
          selection_start?: number | null
          selection_end?: number | null
          selected_text?: string | null
          status?: 'open' | 'resolved' | 'rejected'
          author_name?: string | null
          author_email?: string | null
          is_external?: boolean
        }
        Update: Partial<Database['public']['Tables']['contract_comments']['Insert']>
      }

      signature_requests: {
        Row: {
          id: string
          contract_id: string
          recipient_name: string
          recipient_email: string
          status: 'pending' | 'sent' | 'viewed' | 'signed' | 'declined' | 'expired'
          sent_at: string | null
          viewed_at: string | null
          signed_at: string | null
          declined_at: string | null
          expires_at: string | null
          signature_data: string | null
          signer_ip: string | null
          signer_user_agent: string | null
          external_provider: string | null
          external_id: string | null
          access_token: string
          created_at: string
        }
        Insert: {
          id?: string
          contract_id: string
          recipient_name: string
          recipient_email: string
          status?: 'pending' | 'sent' | 'viewed' | 'signed' | 'declined' | 'expired'
          sent_at?: string | null
          viewed_at?: string | null
          signed_at?: string | null
          declined_at?: string | null
          expires_at?: string | null
          signature_data?: string | null
          signer_ip?: string | null
          signer_user_agent?: string | null
          external_provider?: string | null
          external_id?: string | null
          access_token?: string
        }
        Update: Partial<Database['public']['Tables']['signature_requests']['Insert']>
      }

      brands: {
        Row: {
          id: string
          user_id: string
          name: string
          website: string | null
          industry: string | null
          logo_url: string | null
          contact_name: string | null
          contact_email: string | null
          contact_phone: string | null
          contact_role: string | null
          notes: string | null
          tags: string[]
          last_contacted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          website?: string | null
          industry?: string | null
          logo_url?: string | null
          contact_name?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          contact_role?: string | null
          notes?: string | null
          tags?: string[]
          last_contacted_at?: string | null
        }
        Update: Partial<Database['public']['Tables']['brands']['Insert']>
      }

      deals: {
        Row: {
          id: string
          user_id: string
          brand_id: string | null
          contract_id: string | null
          title: string
          description: string | null
          status: 'lead' | 'contacted' | 'negotiation' | 'proposal_sent' | 'contract_sent' | 'signed' | 'completed' | 'lost'
          value: number | null
          currency: string
          probability: number
          platform: string | null
          expected_close_date: string | null
          actual_close_date: string | null
          lost_reason: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          brand_id?: string | null
          contract_id?: string | null
          title: string
          description?: string | null
          status?: 'lead' | 'contacted' | 'negotiation' | 'proposal_sent' | 'contract_sent' | 'signed' | 'completed' | 'lost'
          value?: number | null
          currency?: string
          probability?: number
          platform?: string | null
          expected_close_date?: string | null
          actual_close_date?: string | null
          lost_reason?: string | null
          notes?: string | null
        }
        Update: Partial<Database['public']['Tables']['deals']['Insert']>
      }

      invoices: {
        Row: {
          id: string
          user_id: string
          contract_id: string | null
          deal_id: string | null
          invoice_number: string
          status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'cancelled'
          subtotal: number
          tax_rate: number
          tax_amount: number
          total: number
          currency: string
          issue_date: string
          due_date: string
          paid_date: string | null
          payment_method: string | null
          payment_reference: string | null
          line_items: Json
          notes: string | null
          bill_to_name: string | null
          bill_to_email: string | null
          bill_to_address: string | null
          pdf_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          contract_id?: string | null
          deal_id?: string | null
          invoice_number?: string
          status?: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'cancelled'
          subtotal: number
          tax_rate?: number
          tax_amount?: number
          total: number
          currency?: string
          issue_date: string
          due_date: string
          paid_date?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          line_items?: Json
          notes?: string | null
          bill_to_name?: string | null
          bill_to_email?: string | null
          bill_to_address?: string | null
          pdf_url?: string | null
        }
        Update: Partial<Database['public']['Tables']['invoices']['Insert']>
      }

      time_entries: {
        Row: {
          id: string
          user_id: string
          contract_id: string | null
          deal_id: string | null
          description: string | null
          hours: number
          hourly_rate: number | null
          date: string
          billable: boolean
          invoiced: boolean
          invoice_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          contract_id?: string | null
          deal_id?: string | null
          description?: string | null
          hours: number
          hourly_rate?: number | null
          date: string
          billable?: boolean
          invoiced?: boolean
          invoice_id?: string | null
        }
        Update: Partial<Database['public']['Tables']['time_entries']['Insert']>
      }

      expenses: {
        Row: {
          id: string
          user_id: string
          contract_id: string | null
          deal_id: string | null
          description: string
          amount: number
          currency: string
          category: string | null
          date: string
          receipt_url: string | null
          billable: boolean
          invoiced: boolean
          invoice_id: string | null
          tax_deductible: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          contract_id?: string | null
          deal_id?: string | null
          description: string
          amount: number
          currency?: string
          category?: string | null
          date: string
          receipt_url?: string | null
          billable?: boolean
          invoiced?: boolean
          invoice_id?: string | null
          tax_deductible?: boolean
        }
        Update: Partial<Database['public']['Tables']['expenses']['Insert']>
      }

      proposals: {
        Row: {
          id: string
          user_id: string
          brand_id: string | null
          deal_id: string | null
          title: string
          status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined' | 'expired'
          content: Json
          sent_at: string | null
          viewed_at: string | null
          responded_at: string | null
          expires_at: string | null
          access_token: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          brand_id?: string | null
          deal_id?: string | null
          title: string
          status?: 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined' | 'expired'
          content: Json
          sent_at?: string | null
          viewed_at?: string | null
          responded_at?: string | null
          expires_at?: string | null
          access_token?: string
        }
        Update: Partial<Database['public']['Tables']['proposals']['Insert']>
      }

      media_kits: {
        Row: {
          id: string
          user_id: string
          display_name: string | null
          bio: string | null
          location: string | null
          website: string | null
          email: string | null
          niches: string[]
          social_stats: Json
          past_brands: string[]
          is_public: boolean
          slug: string | null
          theme: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          display_name?: string | null
          bio?: string | null
          location?: string | null
          website?: string | null
          email?: string | null
          niches?: string[]
          social_stats?: Json
          past_brands?: string[]
          is_public?: boolean
          slug?: string | null
          theme?: Json
        }
        Update: Partial<Database['public']['Tables']['media_kits']['Insert']>
      }

      workflows: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          is_active: boolean
          trigger_type: string
          trigger_config: Json
          actions: Json
          last_triggered_at: string | null
          trigger_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          is_active?: boolean
          trigger_type: string
          trigger_config?: Json
          actions?: Json
          last_triggered_at?: string | null
          trigger_count?: number
        }
        Update: Partial<Database['public']['Tables']['workflows']['Insert']>
      }

      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string | null
          link: string | null
          read: boolean
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message?: string | null
          link?: string | null
          read?: boolean
          read_at?: string | null
        }
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>
      }

      calendar_events: {
        Row: {
          id: string
          user_id: string
          contract_id: string | null
          deal_id: string | null
          title: string
          description: string | null
          start_time: string
          end_time: string
          all_day: boolean
          location: string | null
          meeting_url: string | null
          external_id: string | null
          external_provider: string | null
          reminders: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          contract_id?: string | null
          deal_id?: string | null
          title: string
          description?: string | null
          start_time: string
          end_time: string
          all_day?: boolean
          location?: string | null
          meeting_url?: string | null
          external_id?: string | null
          external_provider?: string | null
          reminders?: Json
        }
        Update: Partial<Database['public']['Tables']['calendar_events']['Insert']>
      }

      templates: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          category: string | null
          icon: string | null
          content: string
          fields: Json
          is_public: boolean
          usage_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          category?: string | null
          icon?: string | null
          content: string
          fields?: Json
          is_public?: boolean
          usage_count?: number
        }
        Update: Partial<Database['public']['Tables']['templates']['Insert']>
      }

      api_keys: {
        Row: {
          id: string
          user_id: string
          name: string
          key_hash: string
          key_prefix: string
          scopes: string[]
          last_used_at: string | null
          expires_at: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          key_hash: string
          key_prefix: string
          scopes?: string[]
          last_used_at?: string | null
          expires_at?: string | null
          is_active?: boolean
        }
        Update: Partial<Database['public']['Tables']['api_keys']['Insert']>
      }

      white_label_settings: {
        Row: {
          id: string
          team_id: string
          brand_name: string | null
          logo_url: string | null
          favicon_url: string | null
          primary_color: string
          secondary_color: string
          custom_domain: string | null
          email_from_name: string | null
          email_from_address: string | null
          footer_text: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          team_id: string
          brand_name?: string | null
          logo_url?: string | null
          favicon_url?: string | null
          primary_color?: string
          secondary_color?: string
          custom_domain?: string | null
          email_from_name?: string | null
          email_from_address?: string | null
          footer_text?: string | null
        }
        Update: Partial<Database['public']['Tables']['white_label_settings']['Insert']>
      }

      recurring_contracts: {
        Row: {
          id: string
          user_id: string
          template_contract_id: string | null
          title: string
          frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly'
          next_creation_date: string | null
          last_created_at: string | null
          auto_send: boolean
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          template_contract_id?: string | null
          title: string
          frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly'
          next_creation_date?: string | null
          last_created_at?: string | null
          auto_send?: boolean
          is_active?: boolean
        }
        Update: Partial<Database['public']['Tables']['recurring_contracts']['Insert']>
      }

      tax_reports: {
        Row: {
          id: string
          user_id: string
          year: number
          report_type: '1099' | 'income_summary' | 'expense_summary'
          data: Json
          generated_at: string
          pdf_url: string | null
        }
        Insert: {
          id?: string
          user_id: string
          year: number
          report_type: '1099' | 'income_summary' | 'expense_summary'
          data: Json
          generated_at?: string
          pdf_url?: string | null
        }
        Update: Partial<Database['public']['Tables']['tax_reports']['Insert']>
      }
    }
  }
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Commonly used types
export type Profile = Tables<'profiles'>
export type Contract = Tables<'contracts'>
export type ContractVersion = Tables<'contract_versions'>
export type ContractComment = Tables<'contract_comments'>
export type SignatureRequest = Tables<'signature_requests'>
export type Brand = Tables<'brands'>
export type Deal = Tables<'deals'>
export type Invoice = Tables<'invoices'>
export type TimeEntry = Tables<'time_entries'>
export type Expense = Tables<'expenses'>
export type Proposal = Tables<'proposals'>
export type MediaKit = Tables<'media_kits'>
export type Workflow = Tables<'workflows'>
export type Notification = Tables<'notifications'>
export type CalendarEvent = Tables<'calendar_events'>
export type Template = Tables<'templates'>
export type Team = Tables<'teams'>
export type TeamMember = Tables<'team_members'>
