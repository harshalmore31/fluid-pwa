// Database types generated from Supabase schema
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          roll_no: string
          branch: string
          year: number
          bio: string | null
          profile_picture_url: string | null
          github_url: string | null
          linkedin_url: string | null
          portfolio_url: string | null
          performance_score: number
          total_hackathons: number
          is_admin: boolean
          looking_for_team: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          roll_no: string
          branch: string
          year: number
          bio?: string | null
          profile_picture_url?: string | null
          github_url?: string | null
          linkedin_url?: string | null
          portfolio_url?: string | null
          performance_score?: number
          total_hackathons?: number
          is_admin?: boolean
          looking_for_team?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          roll_no?: string
          branch?: string
          year?: number
          bio?: string | null
          profile_picture_url?: string | null
          github_url?: string | null
          linkedin_url?: string | null
          portfolio_url?: string | null
          performance_score?: number
          total_hackathons?: number
          is_admin?: boolean
          looking_for_team?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      skills: {
        Row: {
          id: string
          name: string
          category: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string | null
          created_at?: string
        }
      }
      user_skills: {
        Row: {
          id: string
          user_id: string
          skill_id: string
          endorsed_by: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          skill_id: string
          endorsed_by?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          skill_id?: string
          endorsed_by?: string[] | null
          created_at?: string
        }
      }
      hackathons: {
        Row: {
          id: string
          name: string
          organizer: string
          description: string | null
          start_date: string
          end_date: string
          registration_deadline: string | null
          min_team_size: number
          max_team_size: number
          external_link: string | null
          banner_url: string | null
          status: 'upcoming' | 'active' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          organizer: string
          description?: string | null
          start_date: string
          end_date: string
          registration_deadline?: string | null
          min_team_size?: number
          max_team_size?: number
          external_link?: string | null
          banner_url?: string | null
          status?: 'upcoming' | 'active' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          organizer?: string
          description?: string | null
          start_date?: string
          end_date?: string
          registration_deadline?: string | null
          min_team_size?: number
          max_team_size?: number
          external_link?: string | null
          banner_url?: string | null
          status?: 'upcoming' | 'active' | 'completed'
          created_at?: string
          updated_at?: string
        }
      }
      hackathon_skills: {
        Row: {
          id: string
          hackathon_id: string
          skill_id: string
        }
        Insert: {
          id?: string
          hackathon_id: string
          skill_id: string
        }
        Update: {
          id?: string
          hackathon_id?: string
          skill_id?: string
        }
      }
      user_hackathons: {
        Row: {
          id: string
          user_id: string
          hackathon_id: string
          participation_status: 'interested' | 'participating' | 'completed'
          round_reached: number
          points_earned: number
          final_rank: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          hackathon_id: string
          participation_status?: 'interested' | 'participating' | 'completed'
          round_reached?: number
          points_earned?: number
          final_rank?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          hackathon_id?: string
          participation_status?: 'interested' | 'participating' | 'completed'
          round_reached?: number
          points_earned?: number
          final_rank?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      teams: {
        Row: {
          id: string
          hackathon_id: string
          name: string
          description: string | null
          leader_id: string
          max_members: number
          is_open: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          hackathon_id: string
          name: string
          description?: string | null
          leader_id: string
          max_members?: number
          is_open?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          hackathon_id?: string
          name?: string
          description?: string | null
          leader_id?: string
          max_members?: number
          is_open?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      team_members: {
        Row: {
          id: string
          team_id: string
          user_id: string
          role: string | null
          joined_at: string
        }
        Insert: {
          id?: string
          team_id: string
          user_id: string
          role?: string | null
          joined_at?: string
        }
        Update: {
          id?: string
          team_id?: string
          user_id?: string
          role?: string | null
          joined_at?: string
        }
      }
      team_applications: {
        Row: {
          id: string
          team_id: string
          user_id: string
          message: string | null
          status: 'pending' | 'accepted' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          team_id: string
          user_id: string
          message?: string | null
          status?: 'pending' | 'accepted' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          team_id?: string
          user_id?: string
          message?: string | null
          status?: 'pending' | 'accepted' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
      team_invites: {
        Row: {
          id: string
          team_id: string
          inviter_id: string
          invitee_id: string
          status: 'pending' | 'accepted' | 'declined'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          team_id: string
          inviter_id: string
          invitee_id: string
          status?: 'pending' | 'accepted' | 'declined'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          team_id?: string
          inviter_id?: string
          invitee_id?: string
          status?: 'pending' | 'accepted' | 'declined'
          created_at?: string
          updated_at?: string
        }
      }
      connections: {
        Row: {
          id: string
          user1_id: string
          user2_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user1_id: string
          user2_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user1_id?: string
          user2_id?: string
          created_at?: string
        }
      }
      team_chat_messages: {
        Row: {
          id: string
          team_id: string
          user_id: string
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          team_id: string
          user_id: string
          message: string
          created_at?: string
        }
        Update: {
          id?: string
          team_id?: string
          user_id?: string
          message?: string
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          link: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          link?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string
          link?: string | null
          is_read?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_performance_score: {
        Args: { user_uuid: string }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
