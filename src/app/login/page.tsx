"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogIn, Sparkles, Sprout } from "lucide-react";

export default function LoginPage() {
  const { user, signInWithGoogle, loading } = useAuth();
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user && !loading) {
      router.push("/");
    }
  }, [user, loading, router]);

  const handleLogin = async () => {
    try {
      setIsSigningIn(true);
      setErrorMsg(null);
      await signInWithGoogle();
      router.push("/");
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg("Error al iniciar sesión con Google. Inténtalo de nuevo.");
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#5BC8F5] to-[#A8E6FF] flex flex-col items-center justify-between overflow-hidden select-none font-sans">
      {/* Nubes flotantes animadas */}
      <div className="absolute top-10 left-[-100px] w-48 h-20 bg-white opacity-80 rounded-full blur-[1px] animate-[bounce_8s_infinite]"></div>
      <div className="absolute top-24 right-[-80px] w-64 h-24 bg-white opacity-90 rounded-full blur-[1px] animate-[bounce_10s_infinite]"></div>
      <div className="absolute top-44 left-[15%] w-36 h-16 bg-white opacity-70 rounded-full blur-[1px]"></div>

      {/* Sol brillante superior */}
      <div className="absolute top-6 right-10 w-24 h-24 bg-[#F2B33D] rounded-full border-4 border-[#FFF6E0] shadow-[0_0_30px_#F2B33D] flex items-center justify-center animate-spin-slow">
        <Sparkles className="w-10 h-10 text-white" />
      </div>

      {/* Contenido principal - Título y Botón */}
      <main className="z-10 flex flex-col items-center justify-center flex-1 p-4 text-center max-w-lg w-full mt-12">
        {/* Banner de Título estilo videojuego */}
        <div className="relative mb-8 transform -rotate-1 hover:rotate-0 transition-transform">
          <div className="bg-[#FFF6E0] border-4 border-[#F2B33D] rounded-3xl p-6 shadow-[0_10px_0_#C1871F] flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 bg-[#3FA845] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider border-2 border-[#22703A]">
              <Sprout className="w-4 h-4" /> Huerta Verde ERP
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#8B5A2B] drop-shadow-[0_4px_0_#FFF6E0] tracking-tight flex items-center gap-2">
              HUERTA<span className="text-[#3FA845]">HÉROES</span>
            </h1>

            <p className="text-[#5C3A1A] text-sm sm:text-base font-bold max-w-xs">
              ¡La aventura de la gestión orgánica y la gamificación agrícola!
            </p>
          </div>
        </div>

        {/* Panel de Acción con único botón Google */}
        <div className="w-full bg-[#FFF6E0]/95 backdrop-blur-sm border-4 border-[#F2B33D] rounded-2xl p-6 sm:p-8 shadow-[0_8px_0_#C1871F] flex flex-col items-center gap-6">
          <p className="text-[#2B2118] text-sm sm:text-base font-semibold">
            Inicia sesión con tu cuenta institucional o personal de Google para acceder a tu huerta.
          </p>

          {errorMsg && (
            <div className="w-full bg-[#E0453E]/10 border-2 border-[#E0453E] text-[#E0453E] text-xs font-bold p-3 rounded-xl">
              {errorMsg}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={isSigningIn || loading}
            className="w-full group relative inline-flex items-center justify-center gap-3 bg-[#3FA845] hover:bg-[#46C46A] active:bg-[#22703A] text-white font-extrabold text-lg py-4 px-6 rounded-2xl border-b-6 border-[#22703A] active:border-b-0 active:translate-y-1 transition-all shadow-lg cursor-pointer disabled:opacity-50"
          >
            <div className="bg-white p-1 rounded-lg">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            <span>
              {isSigningIn ? "Entrando..." : "Entrar con Google"}
            </span>
            <LogIn className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </main>

      {/* Suelo de bloques estilo Super Mario Bros / Huerta */}
      <footer className="w-full z-10 flex flex-col items-center">
        {/* Pasto verde superior del suelo */}
        <div className="w-full h-6 bg-[#3FA845] border-t-4 border-b-4 border-[#22703A]"></div>
        {/* Tierra de bloques */}
        <div className="w-full bg-[#8B5A2B] border-t-2 border-[#5C3A1A] py-4 px-2 text-center text-[#FFF6E0] text-xs font-bold shadow-[inset_0_4px_0_#5C3A1A]">
          🌿 HuertaHéroes — Sistema Orgánico Gamificado
        </div>
      </footer>
    </div>
  );
}
