import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input"; 
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
  const [limit, setLimit] = useState<number>(0);
  const [period, setPeriod] = useState<BudgetPeriod>("monthly");
  const [error, setError] = useState("");

  // FIX: Hapus expenseCategories dari dependency array di bawah
  useEffect(() => {
    if (open) {
      if (editing) { 
        setCategoryId(editing.categoryId); 
        setLimit(editing.limit); 
        setPeriod(editing.period); 
      }
      else { 
        // Ambil kategori pertama langsung dari store untuk nilai awal
        const initialCatId = categories.find((c) => c.type === "expense")?.id ?? "";
        setCategoryId(initialCatId); 
        setLimit(0); 
        setPeriod("monthly"); 
      }
      setError("");
    }
  }, [open, editing, categories]); // <-- DI SINI KUNCI FIX-NYA

  const submit = () => {
    if (!categoryId) { setError("Pilih kategori"); return; }
    if (limit <= 0) { setError("Limit harus lebih dari Rp 0"); return; }
    if (!editing && budgets.some((b) => b.categoryId === categoryId && b.period === period)) {
      setError("Anggaran untuk kategori & periode ini sudah ada"); return;
    }
    if (editing) { 
      updateBudget(editing.id, { categoryId, limit, period }); 
      toast.success("Anggaran diperbarui"); 
    } else { 
      addBudget({ categoryId, limit, period }); 
      toast.success("Anggaran ditambahkan"); 
    }
    onOpenChange(false);
  };

  const formattedLimit = limit > 0 ? limit.toLocaleString("id-ID") : "";

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    setLimit(Number(rawValue));
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
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">Rp</span>
              <Input 
                type="text" 
                className="pl-9 font-mono-num"
                value={formattedLimit}
                onChange={handleLimitChange}
                placeholder="0"
              />
            </div>
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