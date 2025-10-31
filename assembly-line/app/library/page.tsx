"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Image as ImageIcon,
  Video,
  Mail,
  Star,
  Download,
  Eye,
  MoreVertical,
  Search,
  Filter,
  Grid3x3,
  List,
  Heart,
  Share2,
} from "lucide-react";
import Sidebar from "@/components/layout/sidebar";

interface Asset {
  id: string;
  type:
    | "copy"
    | "headline"
    | "story"
    | "ad"
    | "email"
    | "video-script"
    | "image"
    | "banner";
  title: string;
  content: string;
  projectName: string;
  createdAt: string;
  favorite: boolean;
  downloads: number;
  tags: string[];
}

const mockAssets: Asset[] = [
  {
    id: "1",
    type: "headline",
    title: "Headline Principal - Black Friday",
    content: "🔥 BLACK FRIDAY: Até 70% OFF em TUDO! Aproveite Agora! ⚡",
    projectName: "Campanha Black Friday 2025",
    createdAt: "2025-10-20",
    favorite: true,
    downloads: 15,
    tags: ["urgência", "desconto", "promoção"],
  },
  {
    id: "2",
    type: "copy",
    title: "Copy Página de Vendas",
    content:
      "Descubra o método que já transformou mais de 10.000 empreendedores em autoridades digitais...",
    projectName: "Lançamento Produto Premium",
    createdAt: "2025-10-25",
    favorite: false,
    downloads: 8,
    tags: ["vendas", "autoridade", "transformação"],
  },
  {
    id: "3",
    type: "story",
    title: "Sequência de Stories - Lançamento",
    content: "Story 1: O problema que você enfrenta... Story 2: A solução...",
    projectName: "Lançamento Produto Premium",
    createdAt: "2025-10-26",
    favorite: true,
    downloads: 12,
    tags: ["instagram", "stories", "lançamento"],
  },
  {
    id: "4",
    type: "email",
    title: "Email de Boas-vindas",
    content:
      "Olá [Nome], Seja muito bem-vindo(a) à nossa comunidade exclusiva...",
    projectName: "Webinar Marketing Avançado",
    createdAt: "2025-10-28",
    favorite: false,
    downloads: 5,
    tags: ["email", "boas-vindas", "onboarding"],
  },
  {
    id: "5",
    type: "ad",
    title: "Anúncio Facebook - Conversão",
    content:
      "Pare de perder dinheiro com tráfego pago! Descubra a estratégia...",
    projectName: "Campanha Black Friday 2025",
    createdAt: "2025-10-22",
    favorite: true,
    downloads: 20,
    tags: ["facebook", "ads", "conversão"],
  },
  {
    id: "6",
    type: "video-script",
    title: "Roteiro VSL Completo",
    content: "[GANCHO] Você sabia que 97% dos empreendedores...",
    projectName: "Lançamento Produto Premium",
    createdAt: "2025-10-27",
    favorite: false,
    downloads: 10,
    tags: ["vsl", "roteiro", "vídeo"],
  },
];

const assetTypeConfig = {
  copy: {
    label: "Copy",
    icon: FileText,
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    borderColor: "border-blue-500/30",
  },
  headline: {
    label: "Headline",
    icon: Star,
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/20",
    borderColor: "border-yellow-500/30",
  },
  story: {
    label: "Story",
    icon: ImageIcon,
    color: "text-purple-400",
    bgColor: "bg-purple-500/20",
    borderColor: "border-purple-500/30",
  },
  ad: {
    label: "Anúncio",
    icon: Star,
    color: "text-green-400",
    bgColor: "bg-green-500/20",
    borderColor: "border-green-500/30",
  },
  email: {
    label: "Email",
    icon: Mail,
    color: "text-pink-400",
    bgColor: "bg-pink-500/20",
    borderColor: "border-pink-500/30",
  },
  "video-script": {
    label: "Roteiro",
    icon: Video,
    color: "text-red-400",
    bgColor: "bg-red-500/20",
    borderColor: "border-red-500/30",
  },
  image: {
    label: "Imagem",
    icon: ImageIcon,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/20",
    borderColor: "border-cyan-500/30",
  },
  banner: {
    label: "Banner",
    icon: ImageIcon,
    color: "text-orange-400",
    bgColor: "bg-orange-500/20",
    borderColor: "border-orange-500/30",
  },
};

export default function LibraryPage() {
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesType = filterType === "all" || asset.type === filterType;
    const matchesFavorite = !showFavoritesOnly || asset.favorite;

    return matchesSearch && matchesType && matchesFavorite;
  });

  const toggleFavorite = (assetId: string) => {
    setAssets(
      assets.map((asset) =>
        asset.id === assetId
          ? { ...asset, favorite: !asset.favorite }
          : asset
      )
    );
  };

  const handleDownload = (asset: Asset) => {
    setAssets(
      assets.map((a) =>
        a.id === asset.id ? { ...a, downloads: a.downloads + 1 } : a
      )
    );
    alert(`Download iniciado: ${asset.title}`);
  };

  const AssetCard = ({ asset, index }: { asset: Asset; index: number }) => {
    const config = assetTypeConfig[asset.type];
    const Icon = config.icon;

    if (viewMode === "list") {
      return (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-[rgb(var(--card))] border border-[rgb(var(--card-border))] rounded-xl p-4 hover:border-[rgb(var(--primary))] transition-all"
        >
          <div className="flex items-center gap-4">
            <div
              className={`p-3 ${config.bgColor} border ${config.borderColor} rounded-lg`}
            >
              <Icon className={`w-6 h-6 ${config.color}`} />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold mb-1 truncate">
                {asset.title}
              </h3>
              <p className="text-sm text-gray-400 truncate">{asset.content}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-xs text-gray-500">
                  {asset.projectName}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(asset.createdAt).toLocaleDateString("pt-BR")}
                </span>
                <span className="text-xs text-gray-500">
                  {asset.downloads} downloads
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleFavorite(asset.id)}
                className={`p-2 rounded-lg transition-colors ${
                  asset.favorite
                    ? "bg-red-500/20 text-red-400"
                    : "hover:bg-[rgb(var(--background))] text-gray-400"
                }`}
              >
                <Heart
                  className="w-5 h-5"
                  fill={asset.favorite ? "currentColor" : "none"}
                />
              </button>
              <button
                onClick={() => handleDownload(asset)}
                className="p-2 hover:bg-[rgb(var(--background))] rounded-lg transition-colors text-gray-400 hover:text-[rgb(var(--primary))]"
              >
                <Download className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-[rgb(var(--background))] rounded-lg transition-colors text-gray-400 hover:text-[rgb(var(--primary))]">
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05 }}
        className="bg-[rgb(var(--card))] border border-[rgb(var(--card-border))] rounded-xl p-6 hover:border-[rgb(var(--primary))] transition-all group"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div
            className={`p-3 ${config.bgColor} border ${config.borderColor} rounded-lg`}
          >
            <Icon className={`w-6 h-6 ${config.color}`} />
          </div>
          <button
            onClick={() => toggleFavorite(asset.id)}
            className={`p-2 rounded-lg transition-colors ${
              asset.favorite
                ? "bg-red-500/20 text-red-400"
                : "hover:bg-[rgb(var(--background))] text-gray-400"
            }`}
          >
            <Heart
              className="w-5 h-5"
              fill={asset.favorite ? "currentColor" : "none"}
            />
          </button>
        </div>

        {/* Type Badge */}
        <div className="mb-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${config.bgColor} ${config.color} ${config.borderColor}`}
          >
            {config.label}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[rgb(var(--primary))] transition-colors line-clamp-2">
          {asset.title}
        </h3>

        {/* Content Preview */}
        <p className="text-sm text-gray-400 mb-4 line-clamp-3">
          {asset.content}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {asset.tags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="px-2 py-1 bg-[rgb(var(--background))] text-gray-400 text-xs rounded"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[rgb(var(--card-border))]">
          <div className="text-xs text-gray-500">
            <p>{asset.projectName}</p>
            <p className="mt-1">
              {new Date(asset.createdAt).toLocaleDateString("pt-BR")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {asset.downloads} downloads
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[rgb(var(--background))] hover:bg-[rgb(var(--primary))] text-white rounded-lg transition-colors">
            <Eye className="w-4 h-4" />
            Ver
          </button>
          <button
            onClick={() => handleDownload(asset)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[rgb(var(--primary))] hover:bg-[rgb(var(--primary))]/80 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Baixar
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex h-screen bg-[rgb(var(--background))]">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Biblioteca de Assets
            </h1>
            <p className="text-gray-400">
              Todos os seus materiais de marketing em um só lugar
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[rgb(var(--card))] border border-[rgb(var(--card-border))] rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Total de Assets</p>
              <p className="text-2xl font-bold text-white">{assets.length}</p>
            </div>
            <div className="bg-[rgb(var(--card))] border border-[rgb(var(--card-border))] rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Favoritos</p>
              <p className="text-2xl font-bold text-white">
                {assets.filter((a) => a.favorite).length}
              </p>
            </div>
            <div className="bg-[rgb(var(--card))] border border-[rgb(var(--card-border))] rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Downloads</p>
              <p className="text-2xl font-bold text-white">
                {assets.reduce((sum, a) => sum + a.downloads, 0)}
              </p>
            </div>
            <div className="bg-[rgb(var(--card))] border border-[rgb(var(--card-border))] rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Esta Semana</p>
              <p className="text-2xl font-bold text-green-400">+12</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[rgb(var(--card))] border border-[rgb(var(--card-border))] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`px-4 py-3 rounded-lg transition-colors flex items-center gap-2 ${
                  showFavoritesOnly
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : "bg-[rgb(var(--card))] border border-[rgb(var(--card-border))] text-gray-400"
                }`}
              >
                <Heart
                  className="w-5 h-5"
                  fill={showFavoritesOnly ? "currentColor" : "none"}
                />
                Favoritos
              </button>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 bg-[rgb(var(--card))] border border-[rgb(var(--card-border))] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary))] transition-colors cursor-pointer"
              >
                <option value="all">Todos os Tipos</option>
                <option value="copy">Copy</option>
                <option value="headline">Headlines</option>
                <option value="story">Stories</option>
                <option value="ad">Anúncios</option>
                <option value="email">Emails</option>
                <option value="video-script">Roteiros</option>
              </select>

              <div className="flex bg-[rgb(var(--card))] border border-[rgb(var(--card-border))] rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-3 transition-colors ${
                    viewMode === "grid"
                      ? "bg-[rgb(var(--primary))] text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-3 transition-colors border-l border-[rgb(var(--card-border))] ${
                    viewMode === "list"
                      ? "bg-[rgb(var(--primary))] text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Assets Grid/List */}
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "flex flex-col gap-4"
            }
          >
            {filteredAssets.map((asset, index) => (
              <AssetCard key={asset.id} asset={asset} index={index} />
            ))}
          </div>

          {/* Empty State */}
          {filteredAssets.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Nenhum asset encontrado
              </h3>
              <p className="text-gray-400">
                Tente ajustar os filtros de busca
              </p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
