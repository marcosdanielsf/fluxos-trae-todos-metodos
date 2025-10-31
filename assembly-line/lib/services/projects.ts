import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

export interface ProjectData {
  id?: string;
  name: string;
  niche: string;
  description?: string;
  clientName: string;
  currentPhase?: number;
  status?: "em-andamento" | "concluido" | "pausado";
  totalCost?: number;
  phases?: any[];
}

/**
 * Save project to Supabase (if configured) or localStorage
 */
export async function saveProject(projectData: ProjectData): Promise<string> {
  if (isSupabaseConfigured && supabase) {
    // Save to Supabase
    const { data, error } = await supabase
      .from("projects")
      .insert({
        user_id: "demo-user", // TODO: Replace with actual auth user ID
        name: projectData.name,
        niche: projectData.niche,
        description: projectData.description || "",
        client_name: projectData.clientName,
        current_phase: projectData.currentPhase || 1,
        status: projectData.status || "em-andamento",
        total_cost: projectData.totalCost || 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving project to Supabase:", error);
      throw error;
    }

    console.log("✅ Projeto salvo no Supabase:", data.id);
    return data.id;
  } else {
    // Save to localStorage as fallback
    const projectId = crypto.randomUUID();
    const projects = getLocalProjects();
    projects.push({ ...projectData, id: projectId });
    localStorage.setItem("assembly-line-projects", JSON.stringify(projects));

    console.log("✅ Projeto salvo no localStorage:", projectId);
    return projectId;
  }
}

/**
 * Update project in Supabase or localStorage
 */
export async function updateProject(
  projectId: string,
  updates: Partial<ProjectData>
): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from("projects")
      .update({
        name: updates.name,
        niche: updates.niche,
        description: updates.description,
        client_name: updates.clientName,
        current_phase: updates.currentPhase,
        status: updates.status,
        total_cost: updates.totalCost,
      })
      .eq("id", projectId);

    if (error) {
      console.error("Error updating project:", error);
      throw error;
    }

    console.log("✅ Projeto atualizado no Supabase");
  } else {
    const projects = getLocalProjects();
    const index = projects.findIndex((p) => p.id === projectId);
    if (index !== -1) {
      projects[index] = { ...projects[index], ...updates };
      localStorage.setItem("assembly-line-projects", JSON.stringify(projects));
      console.log("✅ Projeto atualizado no localStorage");
    }
  }
}

/**
 * Get all projects from Supabase or localStorage
 */
export async function getProjects(): Promise<ProjectData[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error);
      return [];
    }

    return data.map((p) => ({
      id: p.id,
      name: p.name,
      niche: p.niche,
      description: p.description,
      clientName: p.client_name,
      currentPhase: p.current_phase,
      status: p.status,
      totalCost: p.total_cost,
    }));
  } else {
    return getLocalProjects();
  }
}

/**
 * Get single project by ID
 */
export async function getProject(projectId: string): Promise<ProjectData | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (error) {
      console.error("Error fetching project:", error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      niche: data.niche,
      description: data.description,
      clientName: data.client_name,
      currentPhase: data.current_phase,
      status: data.status,
      totalCost: data.total_cost,
    };
  } else {
    const projects = getLocalProjects();
    return projects.find((p) => p.id === projectId) || null;
  }
}

/**
 * Delete project
 */
export async function deleteProject(projectId: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);

    if (error) {
      console.error("Error deleting project:", error);
      throw error;
    }

    console.log("✅ Projeto deletado do Supabase");
  } else {
    const projects = getLocalProjects();
    const filtered = projects.filter((p) => p.id !== projectId);
    localStorage.setItem("assembly-line-projects", JSON.stringify(filtered));
    console.log("✅ Projeto deletado do localStorage");
  }
}

/**
 * Helper: Get projects from localStorage
 */
function getLocalProjects(): ProjectData[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("assembly-line-projects");
  return stored ? JSON.parse(stored) : [];
}
