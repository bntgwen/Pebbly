import { useState } from "react";
import { useFinanceStore, useBudgetSpent } from "@/store/finance";
import { formatIDR } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Pencil, PieChart, Plus, Trash2 } from "lucide-react";
import { BudgetDialog } from "@/components/dialogs/BudgetDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { toast } from "sonner";
import type { Budget } from "@/lib/types";
import { cn } from "@/lib/utils";

const periodLabel = { weekly: "Mingguan", monthly: "Bulanan", yearly: "Tahunan" } as const;

export default function Budgets() {
  const { budgets, categories, deleteBudget } = useFinanceStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Budget | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Anggaran</h1>
          <p className="text-muted-foreground mt-1">Kontrol pengeluaran dengan limit per kategori</p>
        </div>
        <Button onClick={() => { setEditing(null); setOpen(true); }} className="gap-2">
          <Plus className="h-4 w-4" /> Tambah Anggaran
        </Button>
      </div>

      {budgets.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <PieChart className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Belum ada anggaran. Tetapkan limit untuk kategori pengeluaran Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgets.map((b) => <BudgetCard key={b.id} budget={b} onEdit={() => { setEditing(b); setOpen(true); }} onDelete={() => setConfirmId(b.id)} />)}
        </div>
      )}

      <BudgetDialog open={open} onOpenChange={setOpen} editing={editing} />
      <ConfirmDialog
        open={!!confirmId} onOpenChange={(o) => !o && setConfirmId(null)}
        title="Hapus anggaran?" description="Pengeluaran tidak akan dihapus, hanya batas anggarannya."
        onConfirm={() => { if (confirmId) { deleteBudget(confirmId); toast.success("Anggaran dihapus"); } setConfirmId(null); }}
      />
    </div>
  );

  function BudgetCard({ budget, onEdit, onDelete }: { budget: Budget; onEdit: () => void; onDelete: () => void }) {
    const cat = categories.find((c) => c.id === budget.categoryId);
    const spent = useBudgetSpent(budget.categoryId, budget.period);
    const pct = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
    const over = pct >= 100;
    const warn = pct >= 80 && !over;
    const remaining = budget.limit - spent;

    return (
      <div className="glass-card rounded-2xl p-5 group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-xl shrink-0" style={{ backgroundColor: `hsl(${cat?.color ?? "220 9% 46%"} / 0.2)` }} />
            <div className="min-w-0">
              <div className="font-semibold truncate">{cat?.name ?? "—"}</div>
              <div className="text-xs text-muted-foreground">{periodLabel[budget.period]}</div>
            </div>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="icon" variant="ghost" onClick={onEdit}><Pencil className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" onClick={onDelete}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <span className="text-2xl font-bold font-mono-num">{formatIDR(spent)}</span>
          <span className="text-sm text-muted-foreground font-mono-num">/ {formatIDR(budget.limit)}</span>
        </div>

        <Progress value={Math.min(100, pct)} className={cn("h-2 mb-3", over && "[&>div]:bg-destructive", warn && "[&>div]:bg-warning")} />

        <div className="flex items-center justify-between text-xs">
          <span className={cn("font-medium", over ? "text-destructive" : warn ? "text-warning" : "text-muted-foreground")}>
            {pct.toFixed(0)}% terpakai
          </span>
          <span className={cn("font-mono-num", remaining < 0 ? "text-destructive" : "text-muted-foreground")}>
            {remaining < 0 ? "Lewat " + formatIDR(-remaining) : "Sisa " + formatIDR(remaining)}
          </span>
        </div>

        {over && (
          <div className="mt-3 flex items-center gap-2 text-xs text-destructive bg-destructive/10 rounded-lg p-2">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> Anggaran sudah terlampaui
          </div>
        )}
      </div>
    );
  }
}
