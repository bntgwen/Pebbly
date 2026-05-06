import { useState } from "react";
import { useFinanceStore } from "@/store/finance";
import { useAuthStore } from "@/store/auth";
import { useThemeStore } from "@/store/theme";
import { formatIDR } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { toast } from "sonner";
import { Download, FileText, LogOut, Moon, Sun, Trash2 } from "lucide-react";
import { exportCSV, exportPDF } from "@/lib/exporters";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user());
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const logout = useAuthStore((s) => s.logout);
  const { theme, setTheme } = useThemeStore();
  const finance = useFinanceStore();
  const [resetOpen, setResetOpen] = useState(false);

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pengaturan</h1>
        <p className="text-muted-foreground mt-1">Profil, tampilan, dan data Anda</p>
      </div>

      <Section title="Profil">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nama</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button onClick={() => { updateProfile({ name, email }); toast.success("Profil diperbarui"); }}>Simpan</Button>
        </div>
      </Section>

      <Section title="Tampilan">
        <div className="flex items-center gap-2">
          <Button variant={theme === "light" ? "default" : "outline"} onClick={() => setTheme("light")} className="gap-2"><Sun className="h-4 w-4" /> Terang</Button>
          <Button variant={theme === "dark" ? "default" : "outline"} onClick={() => setTheme("dark")} className="gap-2"><Moon className="h-4 w-4" /> Gelap</Button>
        </div>
      </Section>

      <Section title="Ekspor Data">
        <p className="text-sm text-muted-foreground mb-4">Unduh laporan keuangan Anda dalam format PDF atau CSV.</p>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => { exportPDF(finance); toast.success("PDF diunduh"); }} className="gap-2">
            <FileText className="h-4 w-4" /> Ekspor PDF
          </Button>
          <Button variant="outline" onClick={() => { exportCSV(finance); toast.success("CSV diunduh"); }} className="gap-2">
            <Download className="h-4 w-4" /> Ekspor CSV
          </Button>
        </div>
      </Section>

      <Section title="Ringkasan Data">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <Stat label="Transaksi" value={finance.transactions.length.toString()} />
          <Stat label="Akun" value={finance.accounts.length.toString()} />
          <Stat label="Kategori" value={finance.categories.length.toString()} />
          <Stat label="Anggaran" value={finance.budgets.length.toString()} />
        </div>
      </Section>

      <Section title="Sesi">
        <Button variant="outline" onClick={() => { logout(); navigate("/"); }} className="gap-2">
          <LogOut className="h-4 w-4" /> Keluar
        </Button>
      </Section>

      <Section title="Zona Bahaya" tone="destructive">
        <p className="text-sm text-muted-foreground mb-4">Menghapus semua data tidak dapat dibatalkan.</p>
        <Button variant="destructive" onClick={() => setResetOpen(true)} className="gap-2">
          <Trash2 className="h-4 w-4" /> Reset Semua Data
        </Button>
      </Section>

      <ConfirmDialog
        open={resetOpen} onOpenChange={setResetOpen}
        title="Reset semua data?" description="Semua transaksi, akun, kategori, anggaran, dan target akan dihapus. Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, hapus semua"
        onConfirm={() => { finance.resetAll(); toast.success("Semua data direset"); setResetOpen(false); }}
      />
    </div>
  );
}

function Section({ title, children, tone }: { title: string; children: React.ReactNode; tone?: "destructive" }) {
  return (
    <div className={`glass-card rounded-2xl p-5 ${tone === "destructive" ? "border-destructive/40" : ""}`}>
      <h3 className={`font-semibold mb-4 ${tone === "destructive" ? "text-destructive" : ""}`}>{title}</h3>
      {children}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-secondary/50 p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-xl font-bold font-mono-num mt-0.5">{value}</div>
    </div>
  );
}
