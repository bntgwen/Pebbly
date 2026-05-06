import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IDRInput } from "@/components/IDRInput";
import { Label } from "@/components/ui/label";
import { useFinanceStore } from "@/store/finance";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionDialog } from "./TransactionDialog";
import type { TxType } from "@/lib/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "networth" | "income" | "expense";
}

export function KPIEditDialog({ open, onOpenChange, mode }: Props) {
  const { accounts, updateAccount } = useFinanceStore();
  const [openTx, setOpenTx] = useState<{ open: boolean; type: TxType }>({ open: false, type: "income" });

  if (mode === "networth") {
    return (
      <>
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Atur Saldo Akun</DialogTitle>
              <DialogDescription>Ubah saldo akun secara langsung. Total kekayaan akan diperbarui otomatis.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 max-h-[50vh] overflow-y-auto">
              {accounts.length === 0 && <p className="text-sm text-muted-foreground">Belum ada akun.</p>}
              {accounts.map((a) => (
                <div key={a.id} className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">{a.name} <span className="capitalize">· {a.type}</span></Label>
                  <IDRInput value={a.balance} onValueChange={(v) => updateAccount(a.id, { balance: v })} />
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button onClick={() => { onOpenChange(false); toast.success("Saldo diperbarui"); }}>Selesai</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // income / expense → quick add transaction
  return (
    <>
      <Dialog open={open && !openTx.open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{mode === "income" ? "Pemasukan Bulan Ini" : "Pengeluaran Bulan Ini"}</DialogTitle>
            <DialogDescription>Tambahkan transaksi baru untuk memperbarui ringkasan ini.</DialogDescription>
          </DialogHeader>
          <Tabs value={mode}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="expense" onClick={() => setOpenTx({ open: true, type: "expense" })}>Tambah Pengeluaran</TabsTrigger>
              <TabsTrigger value="income" onClick={() => setOpenTx({ open: true, type: "income" })}>Tambah Pemasukan</TabsTrigger>
            </TabsList>
          </Tabs>
          <DialogFooter>
            <Button onClick={() => setOpenTx({ open: true, type: mode })}>
              Tambah {mode === "income" ? "Pemasukan" : "Pengeluaran"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <TransactionDialog
        open={openTx.open}
        onOpenChange={(o) => { setOpenTx({ ...openTx, open: o }); if (!o) onOpenChange(false); }}
        defaultType={openTx.type}
      />
    </>
  );
}
