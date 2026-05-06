import { useState } from "react";
import { useFinanceStore } from "@/store/finance";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { CategoryDialog } from "@/components/dialogs/CategoryDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { toast } from "sonner";
import type { Category } from "@/lib/types";
import * as Icons from "lucide-react";

export default function Categories() {
  const { categories, deleteCategory } = useFinanceStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const renderGroup = (type: "income" | "expense", title: string) => {
    const items = categories.filter((c) => c.type === type);
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground">{title} ({items.length})</h3>
        {items.length === 0 ? (
          <div className="glass-card rounded-2xl p-6 text-center text-sm text-muted-foreground">Belum ada kategori</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map((c) => {
              const Ico = (Icons as any)[c.icon] as React.FC<React.SVGProps<SVGSVGElement>>;
              return (
                <div key={c.id} className="glass-card rounded-2xl p-4 flex items-center gap-3 group">
                  <div className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `hsl(${c.color} / 0.18)` }}>
                    {Ico && <Ico className="h-5 w-5" style={{ color: `hsl(${c.color})` }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{c.name}</div>
                    <div className="text-xs text-muted-foreground capitalize">{c.type === "income" ? "Pemasukan" : "Pengeluaran"}</div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="ghost" onClick={() => { setEditing(c); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => setConfirmId(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kategori</h1>
          <p className="text-muted-foreground mt-1">Kelompokkan transaksi Anda</p>
        </div>
        <Button onClick={() => { setEditing(null); setOpen(true); }} className="gap-2">
          <Plus className="h-4 w-4" /> Tambah Kategori
        </Button>
      </div>

      {renderGroup("expense", "Pengeluaran")}
      {renderGroup("income", "Pemasukan")}

      <CategoryDialog open={open} onOpenChange={setOpen} editing={editing} />
      <ConfirmDialog
        open={!!confirmId}
        onOpenChange={(o) => !o && setConfirmId(null)}
        title="Hapus kategori?"
        description="Kategori tidak dapat dihapus jika masih digunakan oleh transaksi atau anggaran."
        onConfirm={() => {
          if (!confirmId) return;
          const ok = deleteCategory(confirmId);
          if (ok) toast.success("Kategori dihapus");
          else toast.error("Kategori sedang digunakan");
          setConfirmId(null);
        }}
      />
    </div>
  );
}
