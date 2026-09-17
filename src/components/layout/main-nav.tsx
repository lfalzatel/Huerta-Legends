"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  UserCheck,
  BarChart3,
  User,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "../providers/auth-provider";

export const MainNav: React.FC = () => {
  const pathname = usePathname();
  const { userProfile } = useAuth();

  const navItems = [
    { href: "/", label: "Mapa Huerta", icon: LayoutDashboard },
    { href: "/ventas", label: "Ventas", icon: ShoppingCart },
    { href: "/productos", label: "Mochila Ítems", icon: Package },
    { href: "/clientes", label: "Aliados", icon: Users },
    ...(userProfile?.role === "admin"
      ? [{ href: "/empleados", label: "Héroes Equipo", icon: UserCheck }]
      : []),
    { href: "/resumen", label: "Reportes & Podio", icon: BarChart3 },
    { href: "/perfil", label: "Mi Personaje", icon: User },
    { href: "/kitchen-sink", label: "Kitchen Sink", icon: Sparkles },
  ];

  return (
    <nav className="bg-[#8B5A2B] border-b-4 border-[#5C3A1A] p-2 overflow-x-auto shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-start sm:justify-center gap-2 min-w-max">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all border-b-4 cursor-pointer select-none",
                isActive
                  ? "bg-[#F2B33D] text-[#8B5A2B] border-[#C1871F] shadow-sm scale-105"
                  : "bg-[#FFF6E0]/90 text-[#8B5A2B] border-[#F2B33D]/60 hover:bg-[#FFF6E0] hover:scale-102"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
