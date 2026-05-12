import { useMemo, useState } from "react";
import { useFinanceStore, useMonthlyTotals, useNetWorth } from "@/store/finance";
import { formatIDR, formatIDRCompact } from "@/lib/currency";
import { ArrowDownRight, ArrowUpRight, Wallet, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { KPIEditDialog } from "@/components/dialogs/KPIEditDialog";
import { TransactionDialog } from "@/components/dialogs/TransactionDialog";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const transactions = useFinanceStore((s) => s.transactions);
  const categories = useFinanceStore((s) => s.categories);
  const budgets = useFinanceStore((s) => s.budgets);
  const netWorth = useNetWorth();
  const { income, expense } = useMonthlyTotals(0);

  const [kpiMode, setKpiMode] = useState<null | "networth" | "income" | "expense">(null);
  const [editingTx, setEditingTx] = useState<typeof transactions[number] | null>(null);
  const [txOpen, setTxOpen] = useState(false);

  const last6Months = useMemo(() => {
    const out: { month: string; income: number; expense: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const m = d.getMonth(), y = d.getFullYear();
      let inc = 0, exp = 0;
      for (const t of transactions) {
        const td = new Date(t.date);
        if (td.getMonth() === m && td.getFullYear() === y) {
          if (t.type === "income") inc += t.amount; else exp += t.amount;
        }
      }
      out.push({ month: d.toLocaleDateString("id-ID", { month: "short" }), income: inc, expense: exp });
    }
    return out;
  }, [transactions]);

  const expenseByCategory = useMemo(() => {
    const map = new Map<string, number>();
    const now = new Date();
    for (const t of transactions) {
      if (t.type !== "expense") continue;
      const d = new Date(t.date);
      if (d.getMonth() !== now.getMonth() || d.getFullYear() !== now.getFullYear()) continue;
      map.set(t.categoryId, (map.get(t.categoryId) ?? 0) + t.amount);
    }
    return Array.from(map.entries())
      .map(([id, value]) => {
        const c = categories.find((x) => x.id === id);
        return { name: c?.name ?? "Lainnya", value, color: c?.color ?? "220 9% 46%" };
      })
      .sort((a, b) => b.value - a.value);
  }, [transactions, categories]);

  const savingsGrowth = useMemo(() => {
    const out: { month: string; savings: number }[] = [];
    const now = new Date();
    let cum = 0;
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const m = d.getMonth(), y = d.getFullYear();
      let net = 0;
      for (const t of transactions) {
        const td = new Date(t.date);
        if (td.getMonth() === m && td.getFullYear() === y) {
          net += t.type === "income" ? t.amount : -t.amount;
        }
      }
      cum += net;
      out.push({ month: d.toLocaleDateString("id-ID", { month: "short" }), savings: cum });
    }
    return out;
  }, [transactions]);

  const recentTx = transactions.slice(0, 6);

  const kpis = [
    {
      key: "networth" as const, label: "Total Kekayaan", value: netWorth,
      icon: Wallet, gradient: "from-primary to-primary-glow",
    },
    {
      key: "income" as const, label: "Pemasukan Bulan Ini", value: income,
      icon: TrendingUp, gradient: "from-success to-success",
    },
    {
      key: "expense" as const, label: "Pengeluaran Bulan Ini", value: expense,
      icon: TrendingDown, gradient: "from-destructive to-warning",
    },
    {
      key: null as any, label: "Net Bulan Ini", value: income - expense,
      icon: PiggyBank, gradient: "from-accent to-primary",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Ringkasan keuangan Anda · {new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" })}</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <button
            key={k.label}
            onClick={() => k.key && setKpiMode(k.key)}
            disabled={!k.key}
            className={cn(
              "glass-card rounded-2xl p-5 text-left transition-all",
              k.key && "glass-card-hover hover:border-primary/40"
            )}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground">{k.label}</span>
              <div className={cn("h-8 w-8 rounded-lg bg-gradient-to-br flex items-center justify-center", k.gradient)}>
                <k.icon className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="text-xl lg:text-2xl font-bold font-mono-num truncate">{formatIDR(k.value)}</div>
            {k.key && <div className="text-[10px] text-muted-foreground mt-1">Klik untuk ubah</div>}
          </button>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Pemasukan vs Pengeluaran</h3>
            <span className="text-xs text-muted-foreground">6 bulan terakhir</span>
          </div>
          {transactions.length === 0 ? (
            <EmptyChart />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={last6Months}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => formatIDRCompact(v)} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }}
                  formatter={(v: number) => formatIDR(v)}
                />
                <Bar dataKey="income" fill="hsl(var(--success))" radius={[6, 6, 0, 0]} name="Pemasukan" />
                <Bar dataKey="expense" fill="hsl(var(--destructive))" radius={[6, 6, 0, 0]} name="Pengeluaran" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold mb-4">Pengeluaran per Kategori</h3>
          {expenseByCategory.length === 0 ? (
            <EmptyChart />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={expenseByCategory} dataKey="value" nameKey="name" innerRadius={50} outerRadius={75} paddingAngle={2}>
                    {expenseByCategory.map((d, i) => <Cell key={i} fill={`hsl(${d.color})`} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatIDR(v)} contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2 max-h-32 overflow-y-auto">
                {expenseByCategory.slice(0, 5).map((d) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: `hsl(${d.color})` }} />
                      <span className="truncate">{d.name}</span>
                    </div>
                    <span className="font-mono-num font-medium">{formatIDRCompact(d.value)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Pertumbuhan Tabungan</h3>
            <span className="text-xs text-muted-foreground">Akumulasi 6 bulan</span>
          </div>
          {transactions.length === 0 ? (
            <EmptyChart />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={savingsGrowth}>
                <defs>
                  <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => formatIDRCompact(v)} />
                <Tooltip formatter={(v: number) => formatIDR(v)} contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="savings" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#savingsGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Budget overview */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Anggaran</h3>
            <Link to="/app/budgets" className="text-xs text-primary hover:underline">Lihat semua</Link>
          </div>
          {budgets.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada anggaran. <Link to="/app/budgets" className="text-primary hover:underline">Tambah</Link></p>
          ) : (
            <div className="space-y-4">
              {budgets.slice(0, 4).map((b) => {
                const cat = categories.find((c) => c.id === b.categoryId);
                const spent = transactions.filter((t) => {
                  if (t.type !== "expense" || t.categoryId !== b.categoryId) return false;
                  const d = new Date(t.date), now = new Date();
                  if (b.period === "monthly") return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                  if (b.period === "yearly") return d.getFullYear() === now.getFullYear();
                  const day = now.getDay(); const from = new Date(now); from.setDate(now.getDate() - day); from.setHours(0,0,0,0);
                  return d >= from;
                }).reduce((s, t) => s + t.amount, 0);
                const pct = Math.min(200, (spent / b.limit) * 100);
                const over = pct >= 100;
                return (
                  <div key={b.id}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium">{cat?.name ?? "?"}</span>
                      <span className={cn("font-mono-num", over && "text-destructive font-semibold")}>
                        {formatIDRCompact(spent)} / {formatIDRCompact(b.limit)}
                      </span>
                    </div>
                    <Progress value={Math.min(100, pct)} className={cn("h-1.5", over && "[&>div]:bg-destructive")} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent transactions */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Transaksi Terkini</h3>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" asChild><Link to="/app/transactions">Lihat semua</Link></Button>
            <Button size="sm" onClick={() => { setEditingTx(null); setTxOpen(true); }}>Tambah</Button>
          </div>
        </div>
        {recentTx.length === 0 ? (
          <div className="text-center py-12 text-sm text-muted-foreground">
            Belum ada transaksi. Mulai dengan menambahkan transaksi pertama Anda.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentTx.map((t) => {
              const cat = categories.find((c) => c.id === t.categoryId);
              return (
                <button
                  key={t.id}
                  onClick={() => { setEditingTx(t); setTxOpen(true); }}
                  className="w-full flex items-center gap-4 py-3 hover:bg-secondary/40 -mx-2 px-2 rounded-lg text-left transition-colors"
                >
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `hsl(${cat?.color ?? "220 9% 46%"} / 0.15)` }}
                  >
                    {t.type === "income"
                      ? <ArrowUpRight className="h-5 w-5" style={{ color: `hsl(${cat?.color ?? "142 71% 45%"})` }} />
                      : <ArrowDownRight className="h-5 w-5" style={{ color: `hsl(${cat?.color ?? "0 84% 60%"})` }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{t.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {cat?.name ?? "—"} · {new Date(t.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                    </div>
                  </div>
                  <div className={cn("font-mono-num font-semibold text-right shrink-0", t.type === "income" ? "text-success" : "text-foreground")}>
                    {t.type === "income" ? "+" : "-"} {formatIDR(t.amount)}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {kpiMode && <KPIEditDialog open onOpenChange={(o) => !o && setKpiMode(null)} mode={kpiMode} />}
      <TransactionDialog open={txOpen} onOpenChange={setTxOpen} editing={editingTx} />
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="h-[220px] flex flex-col items-center justify-center text-center text-sm text-muted-foreground">
      <PiggyBank className="h-10 w-10 mb-2 opacity-40" />
      Belum ada data untuk ditampilkan
    </div>
  );
}