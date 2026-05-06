import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import { AuthLayout } from "./Login";
import { cn } from "@/lib/utils";

function strengthScore(p: string) {
  let s = 0;
  if (p.length >= 6) s++;
  if (p.length >= 10) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return Math.min(s, 4);
}

export default function Register() {
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const score = useMemo(() => strengthScore(password), [password]);
  const labels = ["Sangat lemah", "Lemah", "Cukup", "Kuat", "Sangat kuat"];
  const colors = ["bg-destructive", "bg-warning", "bg-warning", "bg-success", "bg-success"];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (name.trim().length < 2) errs.name = "Nama minimal 2 karakter";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Email tidak valid";
    if (password.length < 6) errs.password = "Password minimal 6 karakter";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const res = register(name, email, password);
    if (!res.ok) { setErrors({ form: res.error ?? "Terjadi kesalahan" }); return; }
    toast.success("Akun berhasil dibuat");
    navigate("/app", { replace: true });
  };

  return (
    <AuthLayout title="Buat akun gratis" subtitle="Mulai kelola keuangan dalam 30 detik">
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2">
          <Label>Nama</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama Anda" autoComplete="name" />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="anda@email.com" autoComplete="email" />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>
        <div className="space-y-2">
          <Label>Password</Label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
          {password && (
            <div className="space-y-1">
              <div className="flex gap-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className={cn("h-1 flex-1 rounded-full", i < score ? colors[score] : "bg-muted")} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Kekuatan: <span className="font-medium text-foreground">{labels[score]}</span></p>
            </div>
          )}
          {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
        </div>
        {errors.form && <p className="text-sm text-destructive">{errors.form}</p>}
        <Button type="submit" className="w-full">Buat Akun</Button>
      </form>
      <p className="text-sm text-center text-muted-foreground mt-6">
        Sudah punya akun? <Link to="/login" className="text-primary font-medium hover:underline">Masuk</Link>
      </p>
    </AuthLayout>
  );
}
