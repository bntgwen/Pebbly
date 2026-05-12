import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, BarChart3, ShieldCheck, Sparkles, Wallet, Target, PiggyBank,
  CheckCircle2, Star, Zap, TrendingUp, Users, Lock, Smartphone, Cloud,
  ArrowUpRight, Download, Code, Bell, Eye, EyeOff, ChevronDown, Send,
  Github, Twitter, Linkedin, Chrome, Figma, Slack,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuthStore } from "@/store/auth";
import { useState, useEffect } from "react";

const features = [
  { icon: Wallet, title: "Multi-Akun", desc: "Kelola tunai, bank, dan e-wallet dalam satu tempat. Saldo otomatis disinkronkan." },
  { icon: BarChart3, title: "Analitik Real-time", desc: "Grafik pemasukan, pengeluaran, dan tabungan yang langsung terbarui." },
  { icon: PiggyBank, title: "Anggaran Cerdas", desc: "Tetapkan limit per kategori dan dapatkan peringatan saat melewati batas." },
  { icon: Target, title: "Target Tabungan", desc: "Lacak progres dana darurat, liburan, atau investasi sampai tercapai." },
  { icon: ShieldCheck, title: "100% Privat", desc: "Data Anda tersimpan lokal di perangkat. Tidak ada pihak ketiga." },
  { icon: Zap, title: "Format Rupiah", desc: "Input dan tampilan otomatis terformat sebagai Rp 1.234.567 — natural untuk Indonesia." },
  { icon: Bell, title: "Smart Notifications", desc: "Notifikasi cerdas ketika budget hampir habis atau target tercapai." },
  { icon: Smartphone, title: "Mobile First", desc: "Desain responsif sempurna di semua perangkat, online atau offline." },
];

const testimonials = [
  { name: "Bitang Raul", role: "UX Designer", text: "Akhirnya ada aplikasi keuangan yang benar-benar paham orang Indonesia. Format Rupiahnya sempurna.", avatar: "AP", verified: true },
  { name: "Reza Khairon", role: "Software Engineer", text: "Dashboardnya hidup. Setiap kali saya catat transaksi, semuanya langsung sinkron.", avatar: "RA", verified: true },
  { name: "Nova Akbar", role: "Marketing Lead", text: "Saya bisa atur anggaran untuk kopi, transport, dan langganan dalam satu menit.", avatar: "ML", verified: true },
  { name: "Bedul Bakher", role: "Entrepreneur", text: "Tools terbaik untuk mengelola cash flow bisnis kecil saya. Rekomendasi banget!", avatar: "BS", verified: true },
];

const faqs = [
  {
    q: "Bagaimana cara data saya tetap aman?",
    a: "Semua data disimpan lokal di perangkat Anda menggunakan enkripsi end-to-end. Kami tidak pernah mengirim data ke server tanpa persetujuan Anda."
  },
  {
    q: "Apakah saya bisa menggunakan Pebble offline?",
    a: "Ya! Pebble berfungsi sepenuhnya offline. Sinkronisasi antar perangkat hanya terjadi ketika koneksi tersedia."
  },
  {
    q: "Berapa lama data saya tersimpan?",
    a: "Data Anda tersimpan selama Anda menggunakan aplikasi. Anda memiliki kontrol penuh untuk ekspor atau hapus kapan saja."
  },
  {
    q: "Apa perbedaan plan Free vs Pro?",
    a: "Plan Free unlimited untuk semua fitur dasar. Pro menambahkan target tabungan, analytics lanjutan, dan export PDF."
  },
  {
    q: "Apakah ada biaya tersembunyi?",
    a: "Tidak sama sekali. Harga transparan, tanpa biaya tambahan. Anda bisa downgrade atau cancel kapan saja tanpa penalti."
  },
  {
    q: "Bagaimana jika saya ingin backup data saya?",
    a: "Anda bisa export seluruh data dalam format CSV atau JSON. Backup otomatis juga tersedia di plan Pro dan Family."
  },
];

const stats = [
  { label: "Pengguna Aktif", value: 15000, suffix: "+" },
  { label: "Transaksi Tercatat", value: 2500000, suffix: "+" },
  { label: "Uptime", value: 99.9, suffix: "%" },
  { label: "Rating", value: 4.8, suffix: "/5" },
];

const integrations = [
  { name: "Google Chrome", icon: Chrome },
  { name: "Figma", icon: Figma },
  { name: "Slack", icon: Slack },
];


const AnimatedCounter = ({ value, suffix }: { value: number; suffix: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const target = value;
    const increment = target / 100;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 30);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <>
      {count.toLocaleString('id-ID')}
      {suffix}
    </>
  );
};

const FAQItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border/50 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-5 flex items-center justify-between bg-card hover:bg-secondary/30 transition-colors text-left"
      >
        <span className="font-semibold text-foreground">{q}</span>
        <ChevronDown className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="p-5 border-t border-border/50 bg-secondary/20 text-muted-foreground text-sm leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
};

export default function Landing() {
  const isAuthed = !!useAuthStore((s) => s.currentUserId);
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation */}
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
            <a href="#stats" className="hover:text-foreground transition-colors">Statistik</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Testimoni</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
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

      {/* Hero Section - Enhanced */}
      <section className="relative overflow-hidden mesh-bg pt-20 pb-32 lg:py-40">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-xs font-medium border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              Personal Finance OS untuk Indonesia
              <ArrowRight className="h-3 w-3" />
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.1]">
              Atur uang Anda<br />
              <span className="gradient-text">seperti seorang CFO.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Dashboard keuangan pribadi modern dengan format Rupiah otomatis, anggaran cerdas, target tabungan, dan sinkronisasi real-time. Dirancang khusus untuk cara orang Indonesia mengelola uang.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button size="lg" asChild className="gap-2 text-base h-13 px-8 shadow-lg hover:shadow-xl transition-all">
                <Link to={isAuthed ? "/app" : "/register"}>
                  Mulai Gratis <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base h-13 px-8">
                <a href="#features">Lihat Demo</a>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 pt-8 text-sm">
              <div className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-success" /> <span>Tanpa kartu kredit</span></div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-success" /> <span>Data 100% lokal</span></div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-success" /> <span>Bisa offline</span></div>
            </div>
          </div>

          {/* Hero Preview - Enhanced */}
          <div className="mt-20 max-w-6xl mx-auto">
            <div className="glass-card rounded-3xl p-3 shadow-2xl">
              <div className="rounded-2xl bg-card border border-border/50 p-8 lg:p-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {[
                    { label: "Total Kekayaan", value: "Rp 84.250.000", trend: "+12,4%", positive: true, icon: TrendingUp },
                    { label: "Pemasukan", value: "Rp 18.500.000", trend: "+8,1%", positive: true, icon: ArrowUpRight },
                    { label: "Pengeluaran", value: "Rp 9.430.000", trend: "-3,2%", positive: false, icon: Download },
                  ].map((s) => {
                    const Icon = s.icon;
                    return (
                      <div key={s.label} className="rounded-xl bg-secondary/50 border border-border/40 p-6 hover:border-border/70 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-muted-foreground uppercase tracking-wide">{s.label}</span>
                          <Icon className={`h-4 w-4 ${s.positive ? "text-success" : "text-warning"}`} />
                        </div>
                        <div className="text-2xl font-bold font-mono-num">{s.value}</div>
                        <div className={`text-xs mt-2 font-medium ${s.positive ? "text-success" : "text-warning"}`}>{s.trend} bulan ini</div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground font-medium">Grafik Pemasukan vs Pengeluaran</div>
                  <div className="h-40 rounded-xl bg-gradient-to-br from-primary/10 via-accent/5 to-transparent border border-border/40 flex items-end px-6 pb-4 gap-2">
                    {[40, 60, 30, 80, 55, 70, 45, 90, 65, 75, 50, 85].map((h, i) => (
                      <div key={i} className="flex-1 space-y-1 flex flex-col justify-end items-center">
                        <div className="w-full rounded-t gradient-primary opacity-80" style={{ height: `${h * 1.2}px` }} />
                        <div className="text-xs text-muted-foreground">{i + 1}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 lg:py-28 border-t border-border/50 bg-secondary/20">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl sm:text-5xl font-black gradient-text mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm sm:text-base text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Grid */}
      <section id="features" className="py-20 lg:py-28">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Fitur-fitur Unggulan</h2>
            <p className="text-muted-foreground mt-6 text-lg">Semua yang Anda butuhkan untuk menguasai keuangan pribadi dalam satu aplikasi.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, idx) => (
              <div key={f.title} className="glass-card rounded-2xl p-8 glass-card-hover group border border-border/50 hover:border-primary/50 transition-all">
                <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <f.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-lg mb-3">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                <div className="mt-6 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Pelajari lebih lanjut <ArrowRight className="h-4 w-4 ml-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 lg:py-28 bg-secondary/20">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Cara Kerjanya</h2>
            <p className="text-muted-foreground mt-6 text-lg">Mulai dari nol hingga menguasai keuangan Anda hanya dalam 3 langkah.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {[
              { step: "01", title: "Buat Akun", desc: "Daftar gratis dalam 30 detik. Tanpa perlu kartu kredit atau data pribadi yang rumit.", icon: Users },
              { step: "02", title: "Catat Transaksi", desc: "Input pemasukan dan pengeluaran. Format Rupiah otomatis membuat semuanya mudah dibaca.", icon: Wallet },
              { step: "03", title: "Pantau & Analisis", desc: "Lihat statistik real-time, tentukan budget, dan capai target tabungan Anda.", icon: BarChart3 },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="relative">
                  <div className="flex flex-col items-center">
                    <div className="h-16 w-16 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-2xl mb-6">
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground text-center text-sm leading-relaxed">{item.desc}</p>
                  </div>
                  {idx < 2 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[40%] h-1 bg-gradient-to-r from-primary to-transparent" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 lg:py-28">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-8">Keamanan Data Terjamin</h2>
              <div className="space-y-6">
                {[
                  { icon: Lock, title: "Enkripsi End-to-End", desc: "Data Anda terenkripsi dengan standar militer." },
                  { icon: Eye, title: "Privacy First", desc: "Tidak ada tracking, iklan, atau penjualan data." },
                  { icon: Smartphone, title: "Penyimpanan Lokal", desc: "Semua data tersimpan di perangkat Anda." },
                  { icon: Cloud, title: "Backup Aman", desc: "Opsi backup cloud dengan enkripsi maksimal." },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex gap-4">
                      <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="glass-card rounded-2xl p-8 border border-border/50">
              <div className="space-y-4">
                {[
                  { label: "Sertifikasi", value: "ISO 27001" },
                  { label: "Encryption", value: "AES-256" },
                  { label: "Data Center", value: "Indonesia" },
                  { label: "Audit", value: "Berkala" },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center pb-4 border-b border-border/30 last:border-0">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Testimonials - Enhanced */}
      <section id="testimonials" className="py-20 lg:py-28">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Dipercaya Ribuan Pengguna</h2>
            <p className="text-muted-foreground mt-6 text-lg">Apa kata mereka tentang Pebble.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="glass-card rounded-2xl p-6 border border-border/50 hover:border-primary/50 transition-all">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-border/30">
                  <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold flex items-center gap-1.5">
                      {t.name}
                      {t.verified && <CheckCircle2 className="h-3.5 w-3.5 text-success" />}
                    </div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 lg:py-28 bg-secondary/20">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Pertanyaan Umum</h2>
            <p className="text-muted-foreground mt-6 text-lg">Jawaban untuk pertanyaan yang sering ditanyakan.</p>
          </div>

          <div className="max-w-2xl mx-auto space-y-3">
            {faqs.map((faq, idx) => (
              <FAQItem key={idx} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-20 lg:py-28">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Terintegrasi dengan Tools Favorit Anda</h2>
            <p className="text-muted-foreground mt-6 text-lg">Pebble bekerja dengan aplikasi yang sudah Anda gunakan setiap hari.</p>
          </div>

          <div className="flex justify-center items-center gap-12 flex-wrap">
            {integrations.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.name} className="flex flex-col items-center gap-3 p-6 rounded-xl glass-card border border-border/50 hover:border-primary/50 transition-all group cursor-pointer">
                  <Icon className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20">
        <div className="container max-w-2xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Tips Keuangan Mingguan</h2>
            <p className="text-muted-foreground">Daftarkan email untuk mendapat tips, update fitur, dan special offer.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Masukkan email Anda..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg border border-border/50 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <Button className="gap-2 h-11 px-6">
              <Send className="h-4 w-4" />
              Daftar
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3">Kami tidak spam. Unsubscribe kapan saja.</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container">
          <div className="rounded-3xl gradient-primary p-12 lg:p-20 text-center text-primary-foreground relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <Sparkles className="absolute top-10 left-10 h-20 w-20" />
              <Sparkles className="absolute bottom-10 right-10 h-16 w-16" />
            </div>
            <div className="relative">
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Siap Menguasai Keuangan Anda?</h2>
              <p className="text-lg opacity-90 max-w-xl mx-auto mb-10">Bergabung dengan ribuan pengguna Indonesia yang sudah lebih tenang soal uang. Mulai gratis, tidak perlu kartu kredit.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild className="h-12 px-8 text-base font-semibold">
                  <Link to={isAuthed ? "/app" : "/register"}>Mulai Sekarang</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="h-12 px-8 text-base font-semibold bg-transparent border-white/20 text-white hover:bg-white/10">
                  <a href="#features">Pelajari Lebih Lanjut</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-16 bg-secondary/20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center">
                  <img src="logo2.png" alt="logo" className="rounded-lg" />
                </div>
                <span className="font-bold text-lg">Pebble</span>
              </div>
              <p className="text-sm text-muted-foreground">Personal Finance OS untuk Indonesia.</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produk</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Fitur</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Harga</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Roadmap</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Perusahaan</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Tentang</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Karir</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Kontak</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Press</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Sosial</h4>
              <div className="flex gap-3">
                <a href="#" className="h-10 w-10 rounded-lg bg-secondary hover:bg-primary/20 flex items-center justify-center transition-colors">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="h-10 w-10 rounded-lg bg-secondary hover:bg-primary/20 flex items-center justify-center transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="h-10 w-10 rounded-lg bg-secondary hover:bg-primary/20 flex items-center justify-center transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Pebble. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privasi</a>
              <a href="#" className="hover:text-foreground transition-colors">Syarat</a>
              <a href="#" className="hover:text-foreground transition-colors">Cookie</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}