export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          niche: string;
          description: string;
          client_name: string;
          current_phase: number;
          status: "em-andamento" | "concluido" | "pausado";
          total_cost: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          niche: string;
          description?: string;
          client_name: string;
          current_phase?: number;
          status?: "em-andamento" | "concluido" | "pausado";
          total_cost?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          niche?: string;
          description?: string;
          client_name?: string;
          current_phase?: number;
          status?: "em-andamento" | "concluido" | "pausado";
          total_cost?: number;
          updated_at?: string;
        };
      };
      phases: {
        Row: {
          id: string;
          project_id: string;
          phase_number: number;
          title: string;
          status: "active" | "locked" | "completed";
          progress: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          phase_number: number;
          title: string;
          status?: "active" | "locked" | "completed";
          progress?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          phase_number?: number;
          title?: string;
          status?: "active" | "locked" | "completed";
          progress?: number;
          updated_at?: string;
        };
      };
      agents: {
        Row: {
          id: string;
          phase_id: string;
          name: string;
          agent_id: string;
          status: "completed" | "processing" | "pending" | "locked";
          progress: number;
          tokens_used: number;
          cost: number;
          badge: string | null;
          badge_variant: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          phase_id: string;
          name: string;
          agent_id: string;
          status?: "completed" | "processing" | "pending" | "locked";
          progress?: number;
          tokens_used?: number;
          cost?: number;
          badge?: string | null;
          badge_variant?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          phase_id?: string;
          name?: string;
          agent_id?: string;
          status?: "completed" | "processing" | "pending" | "locked";
          progress?: number;
          tokens_used?: number;
          cost?: number;
          badge?: string | null;
          badge_variant?: string | null;
          updated_at?: string;
        };
      };
      assets: {
        Row: {
          id: string;
          project_id: string;
          agent_id: string;
          type: string;
          title: string;
          content: string;
          tags: string[];
          favorite: boolean;
          downloads: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          agent_id: string;
          type: string;
          title: string;
          content: string;
          tags?: string[];
          favorite?: boolean;
          downloads?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          agent_id?: string;
          type?: string;
          title?: string;
          content?: string;
          tags?: string[];
          favorite?: boolean;
          downloads?: number;
          updated_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
