import { useMemo } from "react";
import { useFinanceStore } from "@/store/finance";
import { formatIDR, formatIDRCompact } from "@/lib/currency";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";
import { Sparkles } from "lucide-react";

export default function Analytics() {
  const transactions = useFinanceStore((s) => s.transactions);
  const categories = useFinanceStore((s) => s.categories);

  const monthly = useMemo(() => {
    const out: { month: string; income: number; expense: number; net: number }[] = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      let inc = 0, exp = 0;
      for (const t of transactions) {
        const td = new Date(t.date);
        if (td.getMonth() === d.getMonth() && td.getFullYear() === d.getFullYear()) {
          if (t.type === "income") inc += t.amount; else exp += t.amount;
        }
      }
      out.push({
        month: d.toLocaleDateString("id-ID", { month: "short", year: "2-digit" }),
        income: inc, expense: exp, net: inc - exp,
      });
    }
    return out;
  }, [transactions]);

  const byCategoryAll = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of transactions) {
      if (t.type !== "expense") continue;
      map.set(t.categoryId, (map.get(t.categoryId) ?? 0) + t.amount);
    }
    return Array.from(map.entries())
      .map(([id, value]) => {
        const c = categories.find((x) => x.id === id);
        return { name: c?.name ?? "Lainnya", value, color: c?.color ?? "220 9% 46%" };
      })
      .sort((a, b) => b.value - a.value);
  }, [transactions, categories]);

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analitik</h1>
        <p className="text-muted-foreground mt-1">Pelajari pola keuangan Anda</p>
      </div>

      {transactions.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center">
          <Sparkles className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Tambahkan transaksi untuk melihat analitik.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Stat label="Total Pemasukan" value={totalIncome} accent="text-success" />
            <Stat label="Total Pengeluaran" value={totalExpense} accent="text-destructive" />
            <Stat label="Tingkat Tabungan" value={`${savingsRate.toFixed(1)}%`} accent={savingsRate >= 20 ? "text-success" : "text-warning"} />
          </div>

          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-semibold mb-4">Tren 12 Bulan</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthly}>
                <defs>
                  <linearGradient id="ai" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="ae" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--destructive))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => formatIDRCompact(v)} />
                <Tooltip formatter={(v: number) => formatIDR(v)} contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="income" stroke="hsl(var(--success))" fill="url(#ai)" name="Pemasukan" />
                <Area type="monotone" dataKey="expense" stroke="hsl(var(--destructive))" fill="url(#ae)" name="Pengeluaran" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-semibold mb-4">Net per Bulan</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => formatIDRCompact(v)} />
                  <Tooltip formatter={(v: number) => formatIDR(v)} contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} />
                  <Bar dataKey="net" radius={[6, 6, 0, 0]}>
                    {monthly.map((m, i) => <Cell key={i} fill={m.net >= 0 ? "hsl(var(--success))" : "hsl(var(--destructive))"} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-semibold mb-4">Pengeluaran per Kategori (Total)</h3>
              {byCategoryAll.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-12">Belum ada pengeluaran.</p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={byCategoryAll} dataKey="value" nameKey="name" outerRadius={90} label={(e: any) => e.name}>
                      {byCategoryAll.map((d, i) => <Cell key={i} fill={`hsl(${d.color})`} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => formatIDR(v)} contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number | string; accent: string }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`text-2xl font-bold font-mono-num mt-1 ${accent}`}>
        {typeof value === "number" ? formatIDR(value) : value}
      </div>
    </div>
  );
}
