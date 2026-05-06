export type TxType = "income" | "expense";
export type AccountType = "cash" | "bank" | "e-wallet";
export type BudgetPeriod = "monthly" | "weekly" | "yearly";

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TxType;
  categoryId: string;
  accountId: string;
  date: string; // ISO
  notes?: string;
}

export interface Category {
  id: string;
  name: string;
  type: TxType;
  color: string; // hsl string e.g. "221 83% 53%"
  icon: string;  // lucide icon name
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number; // raw IDR
}

export interface Budget {
  id: string;
  categoryId: string;
  limit: number;
  period: BudgetPeriod;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // ISO date
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // simple hash, demo only
}
