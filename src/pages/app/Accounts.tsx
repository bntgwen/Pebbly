import { useState } from "react";
import { useFinanceStore, useNetWorth } from "@/store/finance";
import { formatIDR } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Banknote, CreditCard, Pencil, Plus, Smartphone, Trash2, Wallet } from "lucide-react";
import { AccountDialog } from "@/components/dialogs/AccountDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { toast } from "sonner";
import type { Account } from "@/lib/types";

const iconMap = { cash: Wallet, bank: CreditCard, "e-wallet": Smartphone };
const labelMap = { cash: "Tunai", bank: "Bank", "e-wallet": "E-Wallet" };

export default function Accounts() {
  const { accounts, deleteAccount } = useFinanceStore();
  const total = useNetWorth();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Account | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Akun</h1>
          <p className="text-muted-foreground mt-1">Total kekayaan: <span className="font-mono-num font-semibold text-foreground">{formatIDR(total)}</span></p>
        </div>
        <Button onClick={() => { setEditing(null); setOpen(true); }} className="gap-2">
          <Plus className="h-4 w-4" /> Tambah Akun
        </Button>
      </div>

      {accounts.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Banknote className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Belum ada akun. Tambah akun pertama Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((a) => {
            const Icon = iconMap[a.type];
            return (
              <div key={a.id} className="glass-card rounded-2xl p-5 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-11 w-11 rounded-xl gradient-primary flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="ghost" onClick={() => { setEditing(a); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => setConfirmId(a.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">{labelMap[a.type]}</div>
                <div className="text-lg font-semibold truncate">{a.name}</div>
                <div className="text-2xl font-bold font-mono-num mt-3">{formatIDR(a.balance)}</div>
              </div>
            );
          })}
        </div>
      )}

      <AccountDialog open={open} onOpenChange={setOpen} editing={editing} />
      <ConfirmDialog
        open={!!confirmId}
        onOpenChange={(o) => !o && setConfirmId(null)}
        title="Hapus akun?"
        description="Akun tidak dapat dihapus jika masih memiliki transaksi terkait. Hapus atau pindahkan transaksi terlebih dahulu."
        onConfirm={() => {
          if (!confirmId) return;
          const ok = deleteAccount(confirmId);
          if (ok) toast.success("Akun dihapus");
          else toast.error("Akun masih memiliki transaksi");
          setConfirmId(null);
        }}
      />
    </div>
  );
}
