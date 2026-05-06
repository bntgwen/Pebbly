import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFinanceStore } from "@/store/finance";
import type { Category, TxType } from "@/lib/types";
import { toast } from "sonner";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";

const COLORS = [
  "221 83% 53%", "199 89% 48%", "142 71% 45%", "271 81% 56%",
  "330 81% 60%", "0 84% 60%", "25 95% 53%", "38 92% 50%",
  "173 80% 40%", "262 83% 58%",
];

const ICONS = ["Wallet","Gift","TrendingUp","Utensils","Car","ShoppingBag","Receipt","Film","Home","Coffee","Heart","Plane","BookOpen","Dumbbell","Briefcase","CreditCard"];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing?: Category | null;
}

export function CategoryDialog({ open, onOpenChange, editing }: Props) {
  const { addCategory, updateCategory } = useFinanceStore();
  const [type, setType] = useState<TxType>("expense");
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [icon, setIcon] = useState("Wallet");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      if (editing) {
        setType(editing.type); setName(editing.name); setColor(editing.color); setIcon(editing.icon);
      } else {
        setType("expense"); setName(""); setColor(COLORS[0]); setIcon("Wallet");
      }
      setError("");
    }
  }, [open, editing]);

  const submit = () => {
    if (!name.trim()) { setError("Nama wajib diisi"); return; }
    if (editing) { updateCategory(editing.id, { name: name.trim(), type, color, icon }); toast.success("Kategori diperbarui"); }
    else { addCategory({ name: name.trim(), type, color, icon }); toast.success("Kategori ditambahkan"); }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>{editing ? "Edit Kategori" : "Tambah Kategori"}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <Tabs value={type} onValueChange={(v) => setType(v as TxType)}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="expense">Pengeluaran</TabsTrigger>
              <TabsTrigger value="income">Pemasukan</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="space-y-2">
            <Label>Nama</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="cth. Belanja" />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
          <div className="space-y-2">
            <Label>Warna</Label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button key={c} type="button" onClick={() => setColor(c)}
                  className={cn("h-8 w-8 rounded-full border-2 transition-transform", color === c ? "border-foreground scale-110" : "border-transparent")}
                  style={{ backgroundColor: `hsl(${c})` }} />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Ikon</Label>
            <div className="grid grid-cols-8 gap-2">
              {ICONS.map((iconName) => {
                const Ico = (Icons as any)[iconName] as React.FC<{ className?: string }>;
                return (
                  <button key={iconName} type="button" onClick={() => setIcon(iconName)}
                    className={cn("h-10 w-10 rounded-lg flex items-center justify-center border transition-colors", icon === iconName ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-secondary")}>
                    {Ico && <Ico className="h-4 w-4" />}
                  </button>
                );
              })}
            </div>
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
