import { useMemo, useState } from "react";
import { useFinanceStore } from "@/store/finance";
import { formatIDR } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowDownRight, ArrowUpRight, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { TransactionDialog } from "@/components/dialogs/TransactionDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { toast } from "sonner";
import type { Transaction } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function Transactions() {
  const { transactions, categories, accounts, deleteTransaction } = useFinanceStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [catFilter, setCatFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (typeFilter !== "all" && t.type !== typeFilter) return false;
      if (catFilter !== "all" && t.categoryId !== catFilter) return false;
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [transactions, search, typeFilter, catFilter]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transaksi</h1>
          <p className="text-muted-foreground mt-1">{filtered.length} dari {transactions.length} transaksi</p>
        </div>
        <Button onClick={() => { setEditing(null); setOpen(true); }} className="gap-2">
          <Plus className="h-4 w-4" /> Tambah Transaksi
        </Button>
      </div>

      <div className="glass-card rounded-2xl p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari transaksi..." className="pl-9" />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tipe</SelectItem>
            <SelectItem value="income">Pemasukan</SelectItem>
            <SelectItem value="expense">Pengeluaran</SelectItem>
          </SelectContent>
        </Select>
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-sm text-muted-foreground">
            {transactions.length === 0 ? "Belum ada transaksi." : "Tidak ada transaksi yang cocok."}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((t) => {
              const cat = categories.find((c) => c.id === t.categoryId);
              const acc = accounts.find((a) => a.id === t.accountId);
              return (
                <div key={t.id} className="flex items-center gap-4 p-4 group hover:bg-secondary/40 transition-colors">
                  <div className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `hsl(${cat?.color ?? "220 9% 46%"} / 0.15)` }}>
                    {t.type === "income"
                      ? <ArrowUpRight className="h-5 w-5" style={{ color: `hsl(${cat?.color ?? "142 71% 45%"})` }} />
                      : <ArrowDownRight className="h-5 w-5" style={{ color: `hsl(${cat?.color ?? "0 84% 60%"})` }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{t.title}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {cat?.name ?? "—"} · {acc?.name ?? "—"} · {new Date(t.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                    {t.notes && <div className="text-xs text-muted-foreground/80 mt-1 truncate">{t.notes}</div>}
                  </div>
                  <div className={cn("font-mono-num font-semibold text-right", t.type === "income" ? "text-success" : "text-foreground")}>
                    {t.type === "income" ? "+" : "-"} {formatIDR(t.amount)}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="ghost" onClick={() => { setEditing(t); setOpen(true); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setConfirmId(t.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <TransactionDialog open={open} onOpenChange={setOpen} editing={editing} />
      <ConfirmDialog
        open={!!confirmId}
        onOpenChange={(o) => !o && setConfirmId(null)}
        title="Hapus transaksi?"
        description="Saldo akun terkait akan otomatis disesuaikan."
        onConfirm={() => {
          if (confirmId) { deleteTransaction(confirmId); toast.success("Transaksi dihapus"); }
          setConfirmId(null);
        }}
      />
    </div>
  );
}
