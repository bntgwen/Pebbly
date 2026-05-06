import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth";
import { AuthLayout } from "./Login";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const users = useAuthStore((s) => s.users);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Email tidak valid"); return; }
    if (!users.find((u) => u.email === email.trim().toLowerCase())) {
      setError("Email tidak terdaftar"); return;
    }
    navigate(`/reset-password?email=${encodeURIComponent(email.trim().toLowerCase())}`);
  };

  return (
    <AuthLayout title="Lupa password?" subtitle="Masukkan email untuk mengatur ulang password Anda">
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="anda@email.com" />
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
        <Button type="submit" className="w-full">Lanjutkan</Button>
      </form>
      <p className="text-sm text-center text-muted-foreground mt-6">
        Ingat password? <Link to="/login" className="text-primary font-medium hover:underline">Masuk</Link>
      </p>
    </AuthLayout>
  );
}
