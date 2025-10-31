"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  FolderOpen,
  Calendar,
  TrendingUp,
  MoreVertical,
  Trash2,
  Eye,
  Plus,
  Search,
  Filter,
} from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";

interface Project {
  id: string;
  name: string;
  niche: string;
  phase: number;
  progress: number;
  createdAt: string;
  status: "em-andamento" | "concluido" | "pausado";
  clientName: string;
  assetsGenerated: number;
}

const mockProjects: Project[] = [
  {
    id: "1",
    name: "Campanha Black Friday 2025",
    niche: "E-commerce",
    phase: 4,
    progress: 100,
    createdAt: "2025-10-15",
    status: "concluido",
    clientName: "Loja Virtual ABC",
    assetsGenerated: 47,
  },
  {
    id: "2",
    name: "Lançamento Produto Premium",
    niche: "Infoprodutos",
    phase: 2,
    progress: 45,
    createdAt: "2025-10-25",
    status: "em-andamento",
    clientName: "Expert Digital",
    assetsGenerated: 12,
  },
  {
    id: "3",
    name: "Webinar Marketing Avançado",
    niche: "Serviços",
    phase: 1,
    progress: 20,
    createdAt: "2025-10-28",
    status: "em-andamento",
    clientName: "Consultoria XYZ",
    assetsGenerated: 5,
  },
];

const statusColors = {
  "em-andamento": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  concluido: "bg-green-500/20 text-green-400 border-green-500/30",
  pausado: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

const statusLabels = {
  "em-andamento": "Em Andamento",
  concluido: "Concluído",
  pausado: "Pausado",
};

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.niche.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || project.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const handleOpenProject = (projectId: string) => {
    router.push("/dashboard");
  };

  const handleDeleteProject = (projectId: string) => {
    if (confirm("Tem certeza que deseja excluir este projeto?")) {
      setProjects(projects.filter((p) => p.id !== projectId));
    }
  };

  const handleNewProject = () => {
    router.push("/onboarding");
  };

  return (
    <div className="flex h-screen bg-[rgb(var(--background))]">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Meus Projetos
            </h1>
            <p className="text-gray-400">
              Gerencie todos os seus projetos de marketing
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[rgb(var(--card))] border border-[rgb(var(--card-border))] rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Total de Projetos</span>
                <FolderOpen className="w-5 h-5 text-[rgb(var(--primary))]" />
              </div>
              <p className="text-3xl font-bold text-white">{projects.length}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[rgb(var(--card))] border border-[rgb(var(--card-border))] rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Em Andamento</span>
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-white">
                {projects.filter((p) => p.status === "em-andamento").length}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[rgb(var(--card))] border border-[rgb(var(--card-border))] rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Concluídos</span>
                <Calendar className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-3xl font-bold text-white">
                {projects.filter((p) => p.status === "concluido").length}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] rounded-xl p-6 cursor-pointer hover:scale-105 transition-transform"
              onClick={handleNewProject}
            >
              <div className="flex items-center justify-center gap-2 h-full">
                <Plus className="w-6 h-6 text-white" />
                <span className="text-white font-semibold">Novo Projeto</span>
              </div>
            </motion.div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar projetos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[rgb(var(--card))] border border-[rgb(var(--card-border))] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-3 bg-[rgb(var(--card))] border border-[rgb(var(--card-border))] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary))] transition-colors cursor-pointer appearance-none"
              >
                <option value="all">Todos os Status</option>
                <option value="em-andamento">Em Andamento</option>
                <option value="concluido">Concluído</option>
                <option value="pausado">Pausado</option>
              </select>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[rgb(var(--card))] border border-[rgb(var(--card-border))] rounded-xl p-6 hover:border-[rgb(var(--primary))] transition-all cursor-pointer group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[rgb(var(--primary))] transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-400">{project.clientName}</p>
                  </div>
                  <div className="relative">
                    <button className="p-1 hover:bg-[rgb(var(--background))] rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      statusColors[project.status]
                    }`}
                  >
                    {statusLabels[project.status]}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    {project.niche}
                  </span>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">
                      Fase {project.phase} de 4
                    </span>
                    <span className="text-sm font-medium text-white">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[rgb(var(--background))] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-full bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))]"
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between mb-4 text-sm text-gray-400">
                  <span>
                    {project.assetsGenerated} assets gerados
                  </span>
                  <span>
                    {new Date(project.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenProject(project.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[rgb(var(--primary))] hover:bg-[rgb(var(--primary))]/80 text-white rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Abrir
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project.id);
                    }}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <FolderOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Nenhum projeto encontrado
              </h3>
              <p className="text-gray-400 mb-6">
                {searchTerm || filterStatus !== "all"
                  ? "Tente ajustar os filtros de busca"
                  : "Crie seu primeiro projeto para começar"}
              </p>
              {!searchTerm && filterStatus === "all" && (
                <button
                  onClick={handleNewProject}
                  className="px-6 py-3 bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] text-white rounded-lg font-semibold hover:scale-105 transition-transform"
                >
                  Criar Primeiro Projeto
                </button>
              )}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
