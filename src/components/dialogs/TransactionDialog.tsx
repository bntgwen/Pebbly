import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IDRInput } from "@/components/IDRInput";
import { useFinanceStore } from "@/store/finance";
import type { Transaction, TxType } from "@/lib/types";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing?: Transaction | null;
  defaultType?: TxType;
}

export function TransactionDialog({ open, onOpenChange, editing, defaultType }: Props) {
  const { categories, accounts, addTransaction, updateTransaction } = useFinanceStore();

  const [type, setType] = useState<TxType>(defaultType ?? "expense");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState(0);
  const [categoryId, setCategoryId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      if (editing) {
        setType(editing.type);
        setTitle(editing.title);
        setAmount(editing.amount);
        setCategoryId(editing.categoryId);
        setAccountId(editing.accountId);
        setDate(editing.date.slice(0, 10));
        setNotes(editing.notes ?? "");
      } else {
        setType(defaultType ?? "expense");
        setTitle("");
        setAmount(0);
        setCategoryId("");
        setAccountId(accounts[0]?.id ?? "");
        setDate(new Date().toISOString().slice(0, 10));
        setNotes("");
      }
      setErrors({});
    }
  }, [open, editing, defaultType, accounts]);

  const filteredCategories = categories.filter((c) => c.type === type);

  // Reset categoryId if type changes and the current category doesn't match
  useEffect(() => {
    if (categoryId && !filteredCategories.find((c) => c.id === categoryId)) {
      setCategoryId(filteredCategories[0]?.id ?? "");
    }
  }, [type, categoryId, filteredCategories]);

  const submit = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "Judul wajib diisi";
    if (amount <= 0) e.amount = "Jumlah harus lebih dari Rp 0";
    if (!categoryId) e.categoryId = "Kategori wajib dipilih";
    if (!accountId) e.accountId = "Akun wajib dipilih";
    if (!date) e.date = "Tanggal wajib diisi";
    setErrors(e);
    if (Object.keys(e).length) return;

    const payload = {
      title: title.trim(), amount, type, categoryId, accountId,
      date: new Date(date).toISOString(), notes: notes.trim() || undefined,
    };
    if (editing) {
      updateTransaction(editing.id, payload);
      toast.success("Transaksi diperbarui");
    } else {
      addTransaction(payload);
      toast.success("Transaksi ditambahkan");
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Transaksi" : "Tambah Transaksi"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Tabs value={type} onValueChange={(v) => setType(v as TxType)}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="expense">Pengeluaran</TabsTrigger>
              <TabsTrigger value="income">Pemasukan</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-2">
            <Label>Judul</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="cth. Makan siang" />
            {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label>Jumlah</Label>
            <IDRInput value={amount} onValueChange={setAmount} placeholder="0" />
            {errors.amount && <p className="text-xs text-destructive">{errors.amount}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Kategori</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                <SelectContent>
                  {filteredCategories.length === 0 && (
                    <div className="px-2 py-1.5 text-xs text-muted-foreground">Belum ada kategori {type === "income" ? "pemasukan" : "pengeluaran"}</div>
                  )}
                  {filteredCategories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && <p className="text-xs text-destructive">{errors.categoryId}</p>}
            </div>
            <div className="space-y-2">
              <Label>Akun</Label>
              <Select value={accountId} onValueChange={setAccountId}>
                <SelectTrigger><SelectValue placeholder="Pilih akun" /></SelectTrigger>
                <SelectContent>
                  {accounts.map((a) => (
                    <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.accountId && <p className="text-xs text-destructive">{errors.accountId}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tanggal</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Catatan (opsional)</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
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
