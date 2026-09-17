# 🌿 HuertaHéroes — Sistema Orgánico Gamificado

**HuertaHéroes** es una PWA de gestión administrativa y gamificada para huertas orgánicas inspirada visualmente en *Top Heroes* y *Super Mario Bros*, construida sobre **Next.js 15 (App Router)**, **TypeScript 5**, **Tailwind CSS 4**, **Framer Motion**, **Recharts** y **Cloud Firestore** con **Firebase Authentication**.

---

## 🚀 Stack Tecnológico y Decisiones de Arquitectura

- **Framework**: Next.js 15 (App Router) + TypeScript 5.
- **Estilos & UI**: Tailwind CSS 4 + Componentes de juego retro (`src/components/game/`).
- **Animaciones**: Framer Motion.
- **Base de Datos**: Cloud Firestore (SDK Web v10+ cliente).
- **Autenticación**: Firebase Authentication — Exclusivamente proveedor **Google Sign-In**.
- **Reportes & Gráficos**: Recharts.
- **Íconos**: Lucide React.
- **Seguridad**: Reglas de producción en `firestore.rules` con helper `isAdmin()`.

---

## 🛠️ Configuración de Firebase y Variables de Entorno

### 1. Consola de Firebase
El proyecto utiliza la app registrada en **huerta-management**:
- **Authentication**: Proveedor Google activado. Dominios autorizados: `localhost` y el dominio asignado en Vercel.
- **Firestore Database**: Base de datos en producción.

### 2. Archivo `.env.local`
Crea el archivo `.env.local` en la raíz del proyecto con las siguientes credenciales públicas del SDK cliente:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBfV8ODhAvlqeyIYU62Hc9wiwW-p2Es8l0
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=huerta-management.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=huerta-management
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=huerta-management.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=5352833734
NEXT_PUBLIC_FIREBASE_APP_ID=1:5352833734:web:7633d29195b64c014e0dc7
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-3E8BMR6NED
```

---

## 🎮 Sistema de Juego y Gamificación

1. **Experiencia (XP)**: Se otorga automáticamente por registrar ventas (+10 XP base + 1 XP por cada 10.000 COP), agregar clientes (+15 XP), reponer stock (+8 XP) y misiones diarias.
2. **Niveles**: $XP = \text{round}(100 \times N^{1.5})$. Al subir de nivel se otorgan +50 monedas.
3. **Monedas**: Alimentan el ranking y podio de héroes.
4. **Rareza Derivada**:
   - `< $5.000 COP` $\rightarrow$ Común
   - `< $15.000 COP` $\rightarrow$ Raro
   - `< $40.000 COP` $\rightarrow$ Épico
   - `≥ $40.000 COP` $\rightarrow$ Legendario ✨
5. **Transacción Atómica de Ventas**: Registra la venta, actualiza el stock con `increment(-qty)`, incrementa `counters/sales` y suma XP y monedas en una única transacción `runTransaction`.

---

## 📦 Instalación y Desarrollo Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/lfalzatel/Huerta-Legends.git
cd Huerta-Legends

# 2. Iniciar el servidor de desarrollo
npm run dev

# 3. Compilación de producción
npm run build
```

---

## 🚀 Despliegue en Vercel

1. Sube el proyecto a tu repositorio de GitHub.
2. Importa el proyecto en [Vercel](https://vercel.com).
3. Añade las mismas variables de entorno `NEXT_PUBLIC_FIREBASE_*` en la sección **Environment Variables** de Vercel.
4. Despliega la aplicación y agrega el nuevo dominio asignado por Vercel a la lista de **Dominios Autorizados** en Firebase Authentication.

---

## 🔒 Despliegue de Reglas de Seguridad en Firestore

Asegúrate de desplegar las reglas de `firestore.rules` con Firebase CLI:

```bash
firebase deploy --only firestore:rules
```
