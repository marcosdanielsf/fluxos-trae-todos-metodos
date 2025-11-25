"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Key,
  Bell,
  Palette,
  Shield,
  Download,
  Trash2,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showApiKey, setShowApiKey] = useState(false);
  const [saved, setSaved] = useState(false);

  // Profile state
  const [profile, setProfile] = useState({
    fullName: "João Silva",
    email: "joao.silva@email.com",
    company: "Marketing Digital Ltda",
    role: "Gestor de Tráfego",
  });

  // API Keys state
  const [apiKeys, setApiKeys] = useState({
    gemini: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
    openai: "",
  });

  // Notifications state
  const [notifications, setNotifications] = useState({
    emailOnComplete: true,
    emailOnError: false,
    pushNotifications: true,
    weeklyReport: true,
  });

  // Theme state
  const [theme, setTheme] = useState({
    mode: "dark",
    accentColor: "blue",
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: "profile", label: "Perfil", icon: User },
    { id: "api", label: "API Keys", icon: Key },
    { id: "notifications", label: "Notificações", icon: Bell },
    { id: "theme", label: "Aparência", icon: Palette },
    { id: "security", label: "Segurança", icon: Shield },
  ];

  return (
    <div className="flex h-screen bg-[rgb(var(--background))]">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Configurações
            </h1>
            <p className="text-gray-400">
              Gerencie suas preferências e configurações
            </p>
          </div>

          {/* Save Notification */}
          {saved && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-400">
                Configurações salvas com sucesso!
              </span>
            </motion.div>
          )}

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Tabs */}
            <div className="lg:w-64">
              <div className="bg-[rgb(var(--card))] border border-[rgb(var(--card-border))] rounded-xl p-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all mb-1 ${
                        activeTab === tab.id
                          ? "bg-[rgb(var(--primary))] text-white"
                          : "text-gray-400 hover:bg-[rgb(var(--background))] hover:text-white"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="bg-[rgb(var(--card))] border border-[rgb(var(--card-border))] rounded-xl p-6">
                {/* Profile Tab */}
                {activeTab === "profile" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h2 className="text-2xl font-bold text-white mb-6">
                      Informações do Perfil
                    </h2>

                    <div className="space-y-6">
                      {/* Avatar */}
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--secondary))] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                          JS
                        </div>
                        <div>
                          <button className="px-4 py-2 bg-[rgb(var(--primary))] text-white rounded-lg hover:bg-[rgb(var(--primary))]/80 transition-colors">
                            Alterar Foto
                          </button>
                          <p className="text-sm text-gray-400 mt-2">
                            JPG, PNG ou GIF (máx. 2MB)
                          </p>
                        </div>
                      </div>

                      {/* Form Fields */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Nome Completo
                        </label>
                        <input
                          type="text"
                          value={profile.fullName}
                          onChange={(e) =>
                            setProfile({ ...profile, fullName: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-[rgb(var(--background))] border border-[rgb(var(--card-border))] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) =>
                            setProfile({ ...profile, email: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-[rgb(var(--background))] border border-[rgb(var(--card-border))] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Empresa
                        </label>
                        <input
                          type="text"
                          value={profile.company}
                          onChange={(e) =>
                            setProfile({ ...profile, company: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-[rgb(var(--background))] border border-[rgb(var(--card-border))] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Cargo
                        </label>
                        <input
                          type="text"
                          value={profile.role}
                          onChange={(e) =>
                            setProfile({ ...profile, role: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-[rgb(var(--background))] border border-[rgb(var(--card-border))] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* API Keys Tab */}
                {activeTab === "api" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Chaves de API
                    </h2>
                    <p className="text-gray-400 mb-6">
                      Configure suas chaves de API para integração com serviços de IA
                    </p>

                    <div className="space-y-6">
                      {/* Gemini API */}
                      <div className="p-4 bg-[rgb(var(--background))] border border-[rgb(var(--card-border))] rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="text-white font-semibold">
                              Google Gemini API
                            </h3>
                            <p className="text-sm text-gray-400">
                              Usado para geração de conteúdo e otimizações
                            </p>
                          </div>
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              apiKeys.gemini
                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                : "bg-red-500/20 text-red-400 border border-red-500/30"
                            }`}
                          >
                            {apiKeys.gemini ? "Configurada" : "Não configurada"}
                          </div>
                        </div>

                        <div className="relative">
                          <input
                            type={showApiKey ? "text" : "password"}
                            value={apiKeys.gemini}
                            onChange={(e) =>
                              setApiKeys({ ...apiKeys, gemini: e.target.value })
                            }
                            placeholder="AIzaSy..."
                            className="w-full px-4 py-3 bg-[rgb(var(--card))] border border-[rgb(var(--card-border))] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary))] transition-colors pr-12"
                          />
                          <button
                            onClick={() => setShowApiKey(!showApiKey)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                          >
                            {showApiKey ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>

                        <a
                          href="https://makersuite.google.com/app/apikey"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[rgb(var(--primary))] hover:underline mt-2 inline-block"
                        >
                          Obter chave de API do Gemini →
                        </a>
                      </div>

                      {/* OpenAI API */}
                      <div className="p-4 bg-[rgb(var(--background))] border border-[rgb(var(--card-border))] rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="text-white font-semibold">
                              OpenAI API
                            </h3>
                            <p className="text-sm text-gray-400">
                              Opcional - Para recursos avançados
                            </p>
                          </div>
                          <div className="px-3 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30">
                            Opcional
                          </div>
                        </div>

                        <input
                          type={showApiKey ? "text" : "password"}
                          value={apiKeys.openai}
                          onChange={(e) =>
                            setApiKeys({ ...apiKeys, openai: e.target.value })
                          }
                          placeholder="sk-..."
                          className="w-full px-4 py-3 bg-[rgb(var(--card))] border border-[rgb(var(--card-border))] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
                        />

                        <a
                          href="https://platform.openai.com/api-keys"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[rgb(var(--primary))] hover:underline mt-2 inline-block"
                        >
                          Obter chave de API da OpenAI →
                        </a>
                      </div>

                      {/* Warning */}
                      <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-yellow-400">
                          <p className="font-semibold mb-1">
                            Segurança das API Keys
                          </p>
                          <p>
                            Suas chaves de API são armazenadas localmente e nunca
                            são enviadas para nossos servidores. Mantenha-as
                            seguras e não compartilhe com terceiros.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Notifications Tab */}
                {activeTab === "notifications" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h2 className="text-2xl font-bold text-white mb-6">
                      Notificações
                    </h2>

                    <div className="space-y-4">
                      {[
                        {
                          key: "emailOnComplete",
                          label: "Email ao completar projeto",
                          description:
                            "Receba um email quando um projeto for concluído",
                        },
                        {
                          key: "emailOnError",
                          label: "Email em caso de erro",
                          description:
                            "Seja notificado se algum agente falhar",
                        },
                        {
                          key: "pushNotifications",
                          label: "Notificações push",
                          description:
                            "Receba notificações no navegador",
                        },
                        {
                          key: "weeklyReport",
                          label: "Relatório semanal",
                          description:
                            "Resumo semanal dos seus projetos e estatísticas",
                        },
                      ].map((item) => (
                        <div
                          key={item.key}
                          className="flex items-center justify-between p-4 bg-[rgb(var(--background))] border border-[rgb(var(--card-border))] rounded-lg"
                        >
                          <div>
                            <h3 className="text-white font-medium">
                              {item.label}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {item.description}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={
                                notifications[
                                  item.key as keyof typeof notifications
                                ]
                              }
                              onChange={(e) =>
                                setNotifications({
                                  ...notifications,
                                  [item.key]: e.target.checked,
                                })
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[rgb(var(--primary))]"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Theme Tab */}
                {activeTab === "theme" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h2 className="text-2xl font-bold text-white mb-6">
                      Aparência
                    </h2>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-white font-medium mb-3">
                          Modo de Cor
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            onClick={() => setTheme({ ...theme, mode: "dark" })}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              theme.mode === "dark"
                                ? "border-[rgb(var(--primary))] bg-[rgb(var(--background))]"
                                : "border-[rgb(var(--card-border))] bg-[rgb(var(--background))]"
                            }`}
                          >
                            <div className="w-full h-24 bg-gradient-to-br from-gray-900 to-gray-800 rounded mb-3"></div>
                            <p className="text-white font-medium">Escuro</p>
                          </button>
                          <button
                            onClick={() => setTheme({ ...theme, mode: "light" })}
                            className={`p-4 rounded-lg border-2 transition-all opacity-50 cursor-not-allowed ${
                              theme.mode === "light"
                                ? "border-[rgb(var(--primary))] bg-[rgb(var(--background))]"
                                : "border-[rgb(var(--card-border))] bg-[rgb(var(--background))]"
                            }`}
                            disabled
                          >
                            <div className="w-full h-24 bg-gradient-to-br from-gray-100 to-white rounded mb-3"></div>
                            <p className="text-white font-medium">
                              Claro (Em breve)
                            </p>
                          </button>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-white font-medium mb-3">
                          Cor de Destaque
                        </h3>
                        <div className="grid grid-cols-4 gap-3">
                          {[
                            { name: "blue", color: "rgb(74, 125, 255)" },
                            { name: "purple", color: "rgb(123, 104, 238)" },
                            { name: "green", color: "rgb(16, 185, 129)" },
                            { name: "orange", color: "rgb(245, 158, 11)" },
                          ].map((color) => (
                            <button
                              key={color.name}
                              onClick={() =>
                                setTheme({ ...theme, accentColor: color.name })
                              }
                              className={`h-12 rounded-lg border-2 transition-all ${
                                theme.accentColor === color.name
                                  ? "border-white scale-110"
                                  : "border-transparent"
                              }`}
                              style={{ backgroundColor: color.color }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Security Tab */}
                {activeTab === "security" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h2 className="text-2xl font-bold text-white mb-6">
                      Segurança
                    </h2>

                    <div className="space-y-6">
                      <div className="p-4 bg-[rgb(var(--background))] border border-[rgb(var(--card-border))] rounded-lg">
                        <h3 className="text-white font-semibold mb-2">
                          Alterar Senha
                        </h3>
                        <p className="text-sm text-gray-400 mb-4">
                          Atualize sua senha regularmente para manter sua conta
                          segura
                        </p>
                        <button className="px-4 py-2 bg-[rgb(var(--primary))] text-white rounded-lg hover:bg-[rgb(var(--primary))]/80 transition-colors">
                          Alterar Senha
                        </button>
                      </div>

                      <div className="p-4 bg-[rgb(var(--background))] border border-[rgb(var(--card-border))] rounded-lg">
                        <h3 className="text-white font-semibold mb-2">
                          Exportar Dados
                        </h3>
                        <p className="text-sm text-gray-400 mb-4">
                          Baixe uma cópia de todos os seus dados
                        </p>
                        <button className="flex items-center gap-2 px-4 py-2 bg-[rgb(var(--card))] border border-[rgb(var(--card-border))] text-white rounded-lg hover:bg-[rgb(var(--background))] transition-colors">
                          <Download className="w-4 h-4" />
                          Exportar Dados
                        </button>
                      </div>

                      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <h3 className="text-red-400 font-semibold mb-2">
                          Zona de Perigo
                        </h3>
                        <p className="text-sm text-red-400/80 mb-4">
                          Ações irreversíveis - tenha cuidado
                        </p>
                        <button className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
                          <Trash2 className="w-4 h-4" />
                          Excluir Conta
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Save Button */}
                <div className="flex gap-3 mt-8 pt-6 border-t border-[rgb(var(--card-border))]">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-3 bg-[rgb(var(--primary))] text-white rounded-lg hover:bg-[rgb(var(--primary))]/80 transition-colors font-semibold"
                  >
                    <Save className="w-5 h-5" />
                    Salvar Alterações
                  </button>
                  <button className="px-6 py-3 bg-[rgb(var(--card))] border border-[rgb(var(--card-border))] text-white rounded-lg hover:bg-[rgb(var(--background))] transition-colors">
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
