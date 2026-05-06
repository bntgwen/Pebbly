import { useState } from "react";
import { useFinanceStore } from "@/store/finance";
import { formatIDR } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Minus, Pencil, Plus, Target as TargetIcon, Trash2 } from "lucide-react";
import { GoalDialog } from "@/components/dialogs/GoalDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { toast } from "sonner";
import type { Goal } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { IDRInput } from "@/components/IDRInput";
import { Label } from "@/components/ui/label";

export default function Goals() {
  const { goals, deleteGoal, contributeGoal } = useFinanceStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [contribGoal, setContribGoal] = useState<Goal | null>(null);
  const [contribAmount, setContribAmount] = useState(0);
  const [contribKind, setContribKind] = useState<"add" | "withdraw">("add");

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Target</h1>
          <p className="text-muted-foreground mt-1">Capai tujuan finansial Anda satu per satu</p>
        </div>
        <Button onClick={() => { setEditing(null); setOpen(true); }} className="gap-2">
          <Plus className="h-4 w-4" /> Tambah Target
        </Button>
      </div>

      {goals.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <TargetIcon className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Belum ada target. Mulai dengan membuat target tabungan pertama.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((g) => {
            const pct = g.targetAmount > 0 ? (g.currentAmount / g.targetAmount) * 100 : 0;
            const done = pct >= 100;
            const daysLeft = Math.ceil((new Date(g.deadline).getTime() - Date.now()) / 86400000);
            return (
              <div key={g.id} className="glass-card rounded-2xl p-5 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-11 w-11 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                      <TargetIcon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{g.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {daysLeft > 0 ? `${daysLeft} hari lagi` : daysLeft === 0 ? "Hari ini" : `Lewat ${-daysLeft} hari`}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="ghost" onClick={() => { setEditing(g); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => setConfirmId(g.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>

                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-2xl font-bold font-mono-num">{formatIDR(g.currentAmount)}</span>
                  <span className="text-sm text-muted-foreground font-mono-num">/ {formatIDR(g.targetAmount)}</span>
                </div>
                <Progress value={Math.min(100, pct)} className="h-2 mb-3" />
                <div className="flex items-center justify-between text-xs mb-4">
                  <span className={done ? "text-success font-semibold" : "text-muted-foreground"}>
                    {done ? "🎉 Target tercapai!" : `${pct.toFixed(1)}% tercapai`}
                  </span>
                  <span className="text-muted-foreground font-mono-num">
                    Sisa {formatIDR(Math.max(0, g.targetAmount - g.currentAmount))}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 gap-1.5" onClick={() => { setContribGoal(g); setContribKind("add"); setContribAmount(0); }}>
                    <Plus className="h-3.5 w-3.5" /> Setor
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 gap-1.5" onClick={() => { setContribGoal(g); setContribKind("withdraw"); setContribAmount(0); }}>
                    <Minus className="h-3.5 w-3.5" /> Tarik
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <GoalDialog open={open} onOpenChange={setOpen} editing={editing} />
      <ConfirmDialog
        open={!!confirmId} onOpenChange={(o) => !o && setConfirmId(null)}
        title="Hapus target?"
        onConfirm={() => { if (confirmId) { deleteGoal(confirmId); toast.success("Target dihapus"); } setConfirmId(null); }}
      />

      <Dialog open={!!contribGoal} onOpenChange={(o) => !o && setContribGoal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{contribKind === "add" ? "Setor ke" : "Tarik dari"} {contribGoal?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Jumlah</Label>
            <IDRInput value={contribAmount} onValueChange={setContribAmount} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setContribGoal(null)}>Batal</Button>
            <Button onClick={() => {
              if (!contribGoal || contribAmount <= 0) { toast.error("Jumlah harus lebih dari Rp 0"); return; }
              contributeGoal(contribGoal.id, contribKind === "add" ? contribAmount : -contribAmount);
              toast.success(contribKind === "add" ? "Setoran ditambahkan" : "Penarikan dicatat");
              setContribGoal(null);
            }}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
