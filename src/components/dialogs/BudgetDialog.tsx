import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IDRInput } from "@/components/IDRInput";
import { useFinanceStore } from "@/store/finance";
import type { Budget, BudgetPeriod } from "@/lib/types";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing?: Budget | null;
}

export function BudgetDialog({ open, onOpenChange, editing }: Props) {
  const { categories, budgets, addBudget, updateBudget } = useFinanceStore();
  const expenseCategories = categories.filter((c) => c.type === "expense");

  const [categoryId, setCategoryId] = useState("");
  const [limit, setLimit] = useState(0);
  const [period, setPeriod] = useState<BudgetPeriod>("monthly");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      if (editing) { setCategoryId(editing.categoryId); setLimit(editing.limit); setPeriod(editing.period); }
      else { setCategoryId(expenseCategories[0]?.id ?? ""); setLimit(0); setPeriod("monthly"); }
      setError("");
    }
  }, [open, editing, expenseCategories]);

  const submit = () => {
    if (!categoryId) { setError("Pilih kategori"); return; }
    if (limit <= 0) { setError("Limit harus lebih dari Rp 0"); return; }
    if (!editing && budgets.some((b) => b.categoryId === categoryId && b.period === period)) {
      setError("Anggaran untuk kategori & periode ini sudah ada"); return;
    }
    if (editing) { updateBudget(editing.id, { categoryId, limit, period }); toast.success("Anggaran diperbarui"); }
    else { addBudget({ categoryId, limit, period }); toast.success("Anggaran ditambahkan"); }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>{editing ? "Edit Anggaran" : "Tambah Anggaran"}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Kategori</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger><SelectValue placeholder="Pilih kategori pengeluaran" /></SelectTrigger>
              <SelectContent>
                {expenseCategories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Limit</Label>
            <IDRInput value={limit} onValueChange={setLimit} />
          </div>
          <div className="space-y-2">
            <Label>Periode</Label>
            <Select value={period} onValueChange={(v) => setPeriod(v as BudgetPeriod)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Mingguan</SelectItem>
                <SelectItem value="monthly">Bulanan</SelectItem>
                <SelectItem value="yearly">Tahunan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
          <Button onClick={submit}>{editing ? "Simpan" : "Tambah"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
