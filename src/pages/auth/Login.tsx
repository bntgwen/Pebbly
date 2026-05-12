import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Email tidak valid";
    if (password.length < 6) errs.password = "Password minimal 6 karakter";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const res = login(email, password);
    if (!res.ok) { setErrors({ form: res.error }); return; }
    toast.success("Berhasil masuk");
    const from = (location.state as any)?.from?.pathname ?? "/app";
    navigate(from, { replace: true });
  };

  return (
    <AuthLayout title="Selamat datang kembali" subtitle="Masuk ke dashboard keuangan Anda">
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="anda@email.com" autoComplete="email" />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Password</Label>
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">Lupa password?</Link>
          </div>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
        </div>
        {errors.form && <p className="text-sm text-destructive">{errors.form}</p>}
        <Button type="submit" className="w-full">Masuk</Button>
      </form>
      <p className="text-sm text-center text-muted-foreground mt-6">
        Belum punya akun? <Link to="/register" className="text-primary font-medium hover:underline">Daftar gratis</Link>
      </p>
    </AuthLayout>
  );
}

export function AuthLayout({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 mesh-bg relative">
      <div className="absolute top-4 right-4"><ThemeToggle /></div>
      <Link to="/" className="absolute top-4 left-4 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg overflow-hidden flex items-center justify-center">
            <img 
              src="/logo1.png" 
              alt="Pebble Logo" 
              className="h-full w-full object-contain" 
            />
          </div>
        <span className="text-lg font-bold tracking-tight">Pebble</span>
      </Link>
      <div className="w-full max-w-md">
        <div className="glass-card rounded-2xl p-8 shadow-2xl animate-scale-in">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1.5 mb-6">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
