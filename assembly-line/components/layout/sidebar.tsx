"use client";

import { Bot, LayoutDashboard, FolderKanban, Library, Settings, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      icon: FolderKanban,
      label: "Projetos",
      href: "/projects",
    },
    {
      icon: Library,
      label: "Biblioteca",
      href: "/library",
    },
    {
      icon: Settings,
      label: "Configurações",
      href: "/settings",
    },
  ];

  return (
    <aside className="w-64 h-screen bg-[rgb(var(--background-secondary))] border-r border-[rgb(var(--border))] flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[rgb(var(--border))]">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--secondary))] rounded-lg">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] bg-clip-text text-transparent">
            Assembly Line
          </h1>
        </Link>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-[rgb(var(--border))]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--secondary))] flex items-center justify-center text-white font-bold">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">João da Silva</p>
            <p className="text-xs text-[rgb(var(--foreground-secondary))] truncate">
              joao@email.com
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                    isActive
                      ? "bg-[rgb(var(--primary))] text-white shadow-lg"
                      : "text-[rgb(var(--foreground-secondary))] hover:bg-[rgb(var(--card))] hover:text-[rgb(var(--foreground))]"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* New Project Button */}
      <div className="p-4 border-t border-[rgb(var(--border))]">
        <Button className="w-full" size="lg">
          <Plus className="h-5 w-5" />
          Novo Projeto
        </Button>
      </div>
    </aside>
  );
}
