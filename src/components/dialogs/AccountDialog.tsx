import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IDRInput } from "@/components/IDRInput";
import { useFinanceStore } from "@/store/finance";
import type { Account, AccountType } from "@/lib/types";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing?: Account | null;
}

export function AccountDialog({ open, onOpenChange, editing }: Props) {
  const { addAccount, updateAccount } = useFinanceStore();
  const [name, setName] = useState("");
  const [type, setType] = useState<AccountType>("bank");
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      if (editing) { setName(editing.name); setType(editing.type); setBalance(editing.balance); }
      else { setName(""); setType("bank"); setBalance(0); }
      setError("");
    }
  }, [open, editing]);

  const submit = () => {
    if (!name.trim()) { setError("Nama akun wajib diisi"); return; }
    if (editing) { updateAccount(editing.id, { name: name.trim(), type, balance }); toast.success("Akun diperbarui"); }
    else { addAccount({ name: name.trim(), type, balance }); toast.success("Akun ditambahkan"); }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>{editing ? "Edit Akun" : "Tambah Akun"}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nama Akun</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="cth. BCA" />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
          <div className="space-y-2">
            <Label>Tipe</Label>
            <Select value={type} onValueChange={(v) => setType(v as AccountType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Tunai</SelectItem>
                <SelectItem value="bank">Bank</SelectItem>
                <SelectItem value="e-wallet">E-Wallet</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{editing ? "Saldo" : "Saldo Awal"}</Label>
            <IDRInput value={balance} onValueChange={setBalance} />
            <p className="text-xs text-muted-foreground">
              {editing ? "Mengubah saldo di sini akan menimpa nilai saat ini." : "Saldo akan otomatis diperbarui dari transaksi."}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
          <Button onClick={submit}>{editing ? "Simpan" : "Tambah"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
