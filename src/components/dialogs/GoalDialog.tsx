import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { IDRInput } from "@/components/IDRInput";
import { useFinanceStore } from "@/store/finance";
import type { Goal } from "@/lib/types";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing?: Goal | null;
}

export function GoalDialog({ open, onOpenChange, editing }: Props) {
  const { addGoal, updateGoal } = useFinanceStore();
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState(0);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      if (editing) {
        setName(editing.name); setTargetAmount(editing.targetAmount);
        setCurrentAmount(editing.currentAmount); setDeadline(editing.deadline.slice(0, 10));
      } else {
        setName(""); setTargetAmount(0); setCurrentAmount(0);
        const d = new Date(); d.setMonth(d.getMonth() + 6);
        setDeadline(d.toISOString().slice(0, 10));
      }
      setError("");
    }
  }, [open, editing]);

  const submit = () => {
    if (!name.trim()) { setError("Nama target wajib diisi"); return; }
    if (targetAmount <= 0) { setError("Target harus lebih dari Rp 0"); return; }
    if (!deadline) { setError("Tanggal wajib diisi"); return; }
    const payload = { name: name.trim(), targetAmount, currentAmount, deadline: new Date(deadline).toISOString() };
    if (editing) { updateGoal(editing.id, payload); toast.success("Target diperbarui"); }
    else { addGoal(payload); toast.success("Target ditambahkan"); }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>{editing ? "Edit Target" : "Tambah Target"}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nama Target</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="cth. Dana Darurat" />
          </div>
          <div className="space-y-2">
            <Label>Jumlah Target</Label>
            <IDRInput value={targetAmount} onValueChange={setTargetAmount} />
          </div>
          <div className="space-y-2">
            <Label>Sudah Terkumpul</Label>
            <IDRInput value={currentAmount} onValueChange={setCurrentAmount} />
          </div>
          <div className="space-y-2">
            <Label>Tenggat</Label>
            <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
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
