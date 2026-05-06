import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, BarChart3, ShieldCheck, Sparkles, Wallet, Target, PiggyBank,
  CheckCircle2, Star, Zap,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuthStore } from "@/store/auth";

const features = [
  { icon: Wallet, title: "Multi-Akun", desc: "Kelola tunai, bank, dan e-wallet dalam satu tempat. Saldo otomatis disinkronkan." },
  { icon: BarChart3, title: "Analitik Real-time", desc: "Grafik pemasukan, pengeluaran, dan tabungan yang langsung terbarui." },
  { icon: PiggyBank, title: "Anggaran Cerdas", desc: "Tetapkan limit per kategori dan dapatkan peringatan saat melewati batas." },
  { icon: Target, title: "Target Tabungan", desc: "Lacak progres dana darurat, liburan, atau investasi sampai tercapai." },
  { icon: ShieldCheck, title: "100% Privat", desc: "Data Anda tersimpan lokal di perangkat. Tidak ada pihak ketiga." },
  { icon: Zap, title: "Format Rupiah", desc: "Input dan tampilan otomatis terformat sebagai Rp 1.234.567 — natural untuk Indonesia." },
];

const testimonials = [
  { name: "Andini Permata", role: "UX Designer", text: "Akhirnya ada aplikasi keuangan yang benar-benar paham orang Indonesia. Format Rupiahnya sempurna." },
  { name: "Reza Ardiansyah", role: "Software Engineer", text: "Dashboardnya hidup. Setiap kali saya catat transaksi, semuanya langsung sinkron." },
  { name: "Maya Lestari", role: "Marketing Lead", text: "Saya bisa atur anggaran untuk kopi, transport, dan langganan dalam satu menit." },
];

export default function Landing() {
  const isAuthed = !!useAuthStore((s) => s.currentUserId);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/50">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg overflow-hidden flex items-center justify-center">
              <img 
                src="/logo1.png" 
                alt="Pebble Logo" 
                className="h-full w-full object-contain" 
              />
            </div>
            <span className="text-xl font-bold tracking-tight">Pebble</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Fitur</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Harga</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Testimoni</a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isAuthed ? (
              <Button asChild><Link to="/app">Buka Dashboard</Link></Button>
            ) : (
              <>
                <Button variant="ghost" asChild className="hidden sm:inline-flex"><Link to="/login">Masuk</Link></Button>
                <Button asChild><Link to="/register">Mulai Gratis</Link></Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden mesh-bg">
        <div className="container py-20 lg:py-32 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Personal Finance OS untuk Indonesia
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              Atur uang Anda<br />
              <span className="gradient-text">seperti seorang CFO.</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Finova adalah dashboard keuangan pribadi modern dengan format Rupiah, anggaran cerdas,
              dan target tabungan — semuanya tersinkron secara real-time.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button size="lg" asChild className="gap-2 text-base h-12 px-8 shadow-lg hover:shadow-xl transition-shadow">
                <Link to={isAuthed ? "/app" : "/register"}>
                  Mulai Gratis <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base h-12 px-8">
                <a href="#features">Lihat Fitur</a>
              </Button>
            </div>
            <div className="flex items-center justify-center gap-6 pt-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-success" /> Tanpa kartu kredit</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-success" /> Data lokal</div>
            </div>
          </div>

          {/* Hero preview card */}
          <div className="mt-16 max-w-5xl mx-auto animate-fade-in">
            <div className="glass-card rounded-2xl p-2 shadow-2xl">
              <div className="rounded-xl bg-card border border-border/50 p-6 lg:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {[
                    { label: "Total Kekayaan", value: "Rp 84.250.000", trend: "+12,4%", positive: true },
                    { label: "Pemasukan", value: "Rp 18.500.000", trend: "+8,1%", positive: true },
                    { label: "Pengeluaran", value: "Rp 9.430.000", trend: "-3,2%", positive: false },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl bg-secondary/50 border border-border/40 p-4">
                      <div className="text-xs text-muted-foreground">{s.label}</div>
                      <div className="text-xl font-bold font-mono-num mt-1">{s.value}</div>
                      <div className={`text-xs mt-1 ${s.positive ? "text-success" : "text-warning"}`}>{s.trend} bulan ini</div>
                    </div>
                  ))}
                </div>
                <div className="h-32 rounded-xl bg-gradient-to-br from-primary/10 via-accent/5 to-transparent border border-border/40 flex items-end px-4 pb-3 gap-1">
                  {[40, 60, 30, 80, 55, 70, 45, 90, 65, 75, 50, 85].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-md gradient-primary opacity-80" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 lg:py-28">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">Semua yang Anda butuhkan</h2>
            <p className="text-muted-foreground mt-4 text-lg">Dirancang untuk individu dan keluarga modern di Indonesia.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="glass-card rounded-2xl p-6 glass-card-hover">
                <div className="h-11 w-11 rounded-xl gradient-primary flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-1.5">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 lg:py-28 bg-secondary/30">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">Harga sederhana</h2>
            <p className="text-muted-foreground mt-4 text-lg">Mulai gratis. Upgrade kapan saja.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: "Free", price: "Rp 0", desc: "Selamanya", features: ["Transaksi tak terbatas", "3 akun", "Anggaran dasar", "Export CSV"], cta: "Mulai Gratis" },
              { name: "Pro", price: "Rp 49.000", desc: "per bulan", features: ["Semua fitur Free", "Akun tak terbatas", "Target tabungan", "Export PDF", "Analitik lanjutan"], cta: "Coba Pro", featured: true },
              { name: "Family", price: "Rp 99.000", desc: "per bulan", features: ["Semua fitur Pro", "Hingga 5 anggota", "Anggaran bersama", "Prioritas support"], cta: "Pilih Family" },
            ].map((p) => (
              <div key={p.name} className={`rounded-2xl p-6 lg:p-8 border ${p.featured ? "border-primary shadow-glow bg-card" : "border-border bg-card"}`}>
                {p.featured && <div className="inline-block px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold mb-3">PALING POPULER</div>}
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="text-4xl font-bold font-mono-num">{p.price}</span>
                  <span className="text-sm text-muted-foreground">{p.desc}</span>
                </div>
                <ul className="mt-6 space-y-2.5 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success shrink-0" /> {f}</li>
                  ))}
                </ul>
                <Button asChild className="w-full mt-8" variant={p.featured ? "default" : "outline"}>
                  <Link to="/register">{p.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 lg:py-28">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">Dipercaya pengguna</h2>
            <p className="text-muted-foreground mt-4 text-lg">Apa kata mereka tentang Finova.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="glass-card rounded-2xl p-6">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-warning text-warning" />)}
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed">"{t.text}"</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container">
          <div className="rounded-3xl gradient-primary p-12 lg:p-16 text-center text-primary-foreground relative overflow-hidden">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">Siap menguasai keuangan Anda?</h2>
            <p className="mt-4 text-lg opacity-90 max-w-xl mx-auto">Bergabung dengan ribuan pengguna yang sudah lebih tenang soal uang.</p>
            <Button size="lg" variant="secondary" asChild className="mt-8 h-12 px-8 text-base">
              <Link to={isAuthed ? "/app" : "/register"}>Mulai Sekarang</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg gradient-primary flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="font-bold">Pebble</span>
              <span className="text-xs text-muted-foreground">© {new Date().getFullYear()}</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground">Privasi</a>
              <a href="#" className="hover:text-foreground">Syarat</a>
              <a href="#" className="hover:text-foreground">Kontak</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
