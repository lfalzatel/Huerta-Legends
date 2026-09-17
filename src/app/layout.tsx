import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ProtectedRoute } from "@/components/providers/protected-route";

export const metadata: Metadata = {
  title: "HuertaHéroes — Sistema Orgánico Gamificado",
  description:
    "Gestión administrativa y gamificada de la huerta orgánica con Cloud Firestore y Firebase Auth.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased min-h-screen bg-[#5BC8F5]">
        <AuthProvider>
          <ProtectedRoute>{children}</ProtectedRoute>
        </AuthProvider>
      </body>
    </html>
  );
}
