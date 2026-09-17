"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User as FirebaseUser,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";
import { UserProfile, UserRole } from "@/types";

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  signInWithGoogle: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);

        // Listen to user profile document changes in real time
        unsubscribeProfile = onSnapshot(
          userRef,
          async (snapshot) => {
            if (snapshot.exists()) {
              setUserProfile(snapshot.data() as UserProfile);
              setLoading(false);
            } else {
              // Create user document on first login
              try {
                // Check if user is in config/admins
                let role: UserRole = "employee";
                try {
                  const configAdminRef = doc(db, "config", "admins");
                  const configAdminSnap = await getDoc(configAdminRef);
                  if (configAdminSnap.exists()) {
                    const adminEmails: string[] =
                      configAdminSnap.data().emails || [];
                    if (
                      firebaseUser.email &&
                      adminEmails.includes(firebaseUser.email)
                    ) {
                      role = "admin";
                    }
                  }
                } catch {
                  // Fallback for admin check if config doesn't exist yet
                }

                // Default fallback admin check for owner email
                if (
                  firebaseUser.email &&
                  (firebaseUser.email === "lfalzatel@gmail.com" ||
                    firebaseUser.email.toLowerCase().includes("admin"))
                ) {
                  role = "admin";
                }

                const newUserProfile: Omit<UserProfile, "id"> = {
                  uid: firebaseUser.uid,
                  email: firebaseUser.email || "",
                  name: firebaseUser.displayName || "Héroe de la Huerta",
                  photoURL: firebaseUser.photoURL || null,
                  role,
                  level: 1,
                  xp: 0,
                  coins: 0,
                  streakDays: 1,
                  lastActiveAt: serverTimestamp() as unknown as Timestamp,
                  achievements: [],
                  createdAt: serverTimestamp() as unknown as Timestamp,
                  updatedAt: serverTimestamp() as unknown as Timestamp,
                };

                await setDoc(userRef, newUserProfile);
              } catch (err) {
                console.error("Error al crear el perfil de usuario:", err);
              } finally {
                setLoading(false);
              }
            }
          },
          (error) => {
            console.error("Error en snapshot de perfil de usuario:", error);
            setLoading(false);
          }
        );
      } else {
        setUserProfile(null);
        setLoading(false);
        if (unsubscribeProfile) {
          unsubscribeProfile();
        }
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) {
        unsubscribeProfile();
      }
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        signInWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
