import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/lib/types";

// Tiny non-cryptographic hash — demo auth only (data is local-first)
function hash(s: string) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) + s.charCodeAt(i);
  return String(h >>> 0);
}

interface AuthState {
  users: User[];
  currentUserId: string | null;
  register: (name: string, email: string, password: string) => { ok: boolean; error?: string };
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  resetPassword: (email: string, newPassword: string) => { ok: boolean; error?: string };
  updateProfile: (patch: Partial<Pick<User, "name" | "email">>) => void;
  user: () => User | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      users: [],
      currentUserId: null,
      register: (name, email, password) => {
        const e = email.trim().toLowerCase();
        if (get().users.some((u) => u.email === e)) return { ok: false, error: "Email sudah terdaftar" };
        const user: User = { id: Math.random().toString(36).slice(2, 11), name: name.trim(), email: e, passwordHash: hash(password) };
        set((s) => ({ users: [...s.users, user], currentUserId: user.id }));
        return { ok: true };
      },
      login: (email, password) => {
        const e = email.trim().toLowerCase();
        const u = get().users.find((u) => u.email === e);
        if (!u) return { ok: false, error: "Email tidak ditemukan" };
        if (u.passwordHash !== hash(password)) return { ok: false, error: "Password salah" };
        set({ currentUserId: u.id });
        return { ok: true };
      },
      logout: () => set({ currentUserId: null }),
      resetPassword: (email, newPassword) => {
        const e = email.trim().toLowerCase();
        const u = get().users.find((u) => u.email === e);
        if (!u) return { ok: false, error: "Email tidak ditemukan" };
        set((s) => ({ users: s.users.map((x) => (x.id === u.id ? { ...x, passwordHash: hash(newPassword) } : x)) }));
        return { ok: true };
      },
      updateProfile: (patch) => {
        const id = get().currentUserId;
        if (!id) return;
        set((s) => ({ users: s.users.map((u) => (u.id === id ? { ...u, ...patch } : u)) }));
      },
      user: () => {
        const id = get().currentUserId;
        return get().users.find((u) => u.id === id) ?? null;
      },
    }),
    { name: "finova-auth" }
  )
);
