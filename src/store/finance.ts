import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Account, Budget, Category, Goal, Transaction } from "@/lib/types";

const uid = () => Math.random().toString(36).slice(2, 11);

interface FinanceState {
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  budgets: Budget[];
  goals: Goal[];

  // Transactions
  addTransaction: (t: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, t: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // Categories
  addCategory: (c: Omit<Category, "id">) => void;
  updateCategory: (id: string, c: Partial<Category>) => void;
  deleteCategory: (id: string) => boolean; // returns false if in use

  // Accounts
  addAccount: (a: Omit<Account, "id">) => void;
  updateAccount: (id: string, a: Partial<Account>) => void;
  deleteAccount: (id: string) => boolean; // false if linked to txns

  // Budgets
  addBudget: (b: Omit<Budget, "id">) => void;
  updateBudget: (id: string, b: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;

  // Goals
  addGoal: (g: Omit<Goal, "id">) => void;
  updateGoal: (id: string, g: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  contributeGoal: (id: string, amount: number) => void;

  resetAll: () => void;
  seedDefaults: () => void;
}

const defaultCategories: Category[] = [
  { id: uid(), name: "Gaji", type: "income", color: "142 71% 45%", icon: "Wallet" },
  { id: uid(), name: "Bonus", type: "income", color: "199 89% 48%", icon: "Gift" },
  { id: uid(), name: "Investasi", type: "income", color: "271 81% 56%", icon: "TrendingUp" },
  { id: uid(), name: "Makanan", type: "expense", color: "25 95% 53%", icon: "Utensils" },
  { id: uid(), name: "Transportasi", type: "expense", color: "221 83% 53%", icon: "Car" },
  { id: uid(), name: "Belanja", type: "expense", color: "330 81% 60%", icon: "ShoppingBag" },
  { id: uid(), name: "Tagihan", type: "expense", color: "0 84% 60%", icon: "Receipt" },
  { id: uid(), name: "Hiburan", type: "expense", color: "271 81% 56%", icon: "Film" },
];

const defaultAccounts: Account[] = [
  { id: uid(), name: "Dompet Tunai", type: "cash", balance: 0 },
  { id: uid(), name: "Bank Utama", type: "bank", balance: 0 },
  { id: uid(), name: "E-Wallet", type: "e-wallet", balance: 0 },
];

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      transactions: [],
      categories: defaultCategories,
      accounts: defaultAccounts,
      budgets: [],
      goals: [],

      addTransaction: (t) => {
        const tx: Transaction = { ...t, id: uid() };
        set((s) => ({ transactions: [tx, ...s.transactions] }));
        // update account balance
        const acc = get().accounts.find((a) => a.id === tx.accountId);
        if (acc) {
          const delta = tx.type === "income" ? tx.amount : -tx.amount;
          get().updateAccount(acc.id, { balance: acc.balance + delta });
        }
      },
      updateTransaction: (id, patch) => {
        const prev = get().transactions.find((t) => t.id === id);
        if (!prev) return;
        // revert old effect
        const oldAcc = get().accounts.find((a) => a.id === prev.accountId);
        if (oldAcc) {
          const delta = prev.type === "income" ? -prev.amount : prev.amount;
          get().updateAccount(oldAcc.id, { balance: oldAcc.balance + delta });
        }
        const next: Transaction = { ...prev, ...patch };
        set((s) => ({ transactions: s.transactions.map((t) => (t.id === id ? next : t)) }));
        const newAcc = get().accounts.find((a) => a.id === next.accountId);
        if (newAcc) {
          const delta = next.type === "income" ? next.amount : -next.amount;
          get().updateAccount(newAcc.id, { balance: newAcc.balance + delta });
        }
      },
      deleteTransaction: (id) => {
        const tx = get().transactions.find((t) => t.id === id);
        if (!tx) return;
        const acc = get().accounts.find((a) => a.id === tx.accountId);
        if (acc) {
          const delta = tx.type === "income" ? -tx.amount : tx.amount;
          get().updateAccount(acc.id, { balance: acc.balance + delta });
        }
        set((s) => ({ transactions: s.transactions.filter((t) => t.id !== id) }));
      },

      addCategory: (c) => set((s) => ({ categories: [...s.categories, { ...c, id: uid() }] })),
      updateCategory: (id, patch) =>
        set((s) => ({ categories: s.categories.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),
      deleteCategory: (id) => {
        const inUse = get().transactions.some((t) => t.categoryId === id) ||
                      get().budgets.some((b) => b.categoryId === id);
        if (inUse) return false;
        set((s) => ({ categories: s.categories.filter((c) => c.id !== id) }));
        return true;
      },

      addAccount: (a) => set((s) => ({ accounts: [...s.accounts, { ...a, id: uid() }] })),
      updateAccount: (id, patch) =>
        set((s) => ({ accounts: s.accounts.map((a) => (a.id === id ? { ...a, ...patch } : a)) })),
      deleteAccount: (id) => {
        const inUse = get().transactions.some((t) => t.accountId === id);
        if (inUse) return false;
        set((s) => ({ accounts: s.accounts.filter((a) => a.id !== id) }));
        return true;
      },

      addBudget: (b) => set((s) => ({ budgets: [...s.budgets, { ...b, id: uid() }] })),
      updateBudget: (id, patch) =>
        set((s) => ({ budgets: s.budgets.map((b) => (b.id === id ? { ...b, ...patch } : b)) })),
      deleteBudget: (id) => set((s) => ({ budgets: s.budgets.filter((b) => b.id !== id) })),

      addGoal: (g) => set((s) => ({ goals: [...s.goals, { ...g, id: uid() }] })),
      updateGoal: (id, patch) =>
        set((s) => ({ goals: s.goals.map((g) => (g.id === id ? { ...g, ...patch } : g)) })),
      deleteGoal: (id) => set((s) => ({ goals: s.goals.filter((g) => g.id !== id) })),
      contributeGoal: (id, amount) =>
        set((s) => ({
          goals: s.goals.map((g) =>
            g.id === id ? { ...g, currentAmount: Math.max(0, g.currentAmount + amount) } : g
          ),
        })),

      resetAll: () =>
        set({
          transactions: [],
          categories: defaultCategories.map((c) => ({ ...c, id: uid() })),
          accounts: defaultAccounts.map((a) => ({ ...a, id: uid() })),
          budgets: [],
          goals: [],
        }),
      seedDefaults: () => {
        const s = get();
        if (s.categories.length === 0) set({ categories: defaultCategories });
        if (s.accounts.length === 0) set({ accounts: defaultAccounts });
      },
    }),
    { name: "pebble-finance" }
  )
);

// Derived selectors
export function useMonthlyTotals(monthOffset = 0) {
  const transactions = useFinanceStore((s) => s.transactions);
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const month = target.getMonth();
  const year = target.getFullYear();
  let income = 0;
  let expense = 0;
  for (const t of transactions) {
    const d = new Date(t.date);
    if (d.getMonth() === month && d.getFullYear() === year) {
      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    }
  }
  return { income, expense, net: income - expense };
}

export function useNetWorth() {
  const accounts = useFinanceStore((s) => s.accounts);
  return accounts.reduce((sum, a) => sum + a.balance, 0);
}

export function useBudgetSpent(categoryId: string, period: "monthly" | "weekly" | "yearly" = "monthly") {
  const transactions = useFinanceStore((s) => s.transactions);
  const now = new Date();
  let from = new Date();
  if (period === "monthly") from = new Date(now.getFullYear(), now.getMonth(), 1);
  else if (period === "weekly") {
    const day = now.getDay();
    from = new Date(now);
    from.setDate(now.getDate() - day);
    from.setHours(0, 0, 0, 0);
  } else from = new Date(now.getFullYear(), 0, 1);

  return transactions
    .filter((t) => t.type === "expense" && t.categoryId === categoryId && new Date(t.date) >= from)
    .reduce((sum, t) => sum + t.amount, 0);
}
