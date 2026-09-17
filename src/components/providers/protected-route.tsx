"use client";

import { useAuth } from "./auth-provider";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== "/login") {
      router.push("/login");
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#5BC8F5] flex flex-col items-center justify-center p-4">
        <div className="bg-[#FFF6E0] border-4 border-[#F2B33D] rounded-2xl p-8 max-w-sm w-full shadow-[0_8px_0_#C1871F] flex flex-col items-center gap-4 text-center">
          <div className="text-2xl font-bold text-[#8B5A2B] animate-bounce tracking-wide font-sans">
            🌱 Causal Huerta...
          </div>
          <p className="text-[#2B2118] text-sm font-medium">
            Cargando mundo de la huerta...
          </p>
          <div className="w-full bg-[#8B5A2B]/20 rounded-full h-4 overflow-hidden border-2 border-[#8B5A2B]">
            <div className="bg-[#46C46A] h-full animate-pulse w-3/4 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user && pathname !== "/login") {
    return null;
  }

  return <>{children}</>;
};
