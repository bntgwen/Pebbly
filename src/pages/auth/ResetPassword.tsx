import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import { AuthLayout } from "./Login";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const email = params.get("email") ?? "";
  const resetPassword = useAuthStore((s) => s.resetPassword);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { setError("Password minimal 6 karakter"); return; }
    if (password !== confirm) { setError("Konfirmasi password tidak cocok"); return; }
    const res = resetPassword(email, password);
    if (!res.ok) { setError(res.error ?? "Gagal mengatur ulang"); return; }
    toast.success("Password berhasil diatur ulang");
    navigate("/login");
  };

  return (
    <AuthLayout title="Atur Password Baru" subtitle={`Untuk akun ${email || "Anda"}`}>
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2">
          <Label>Password Baru</Label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Konfirmasi Password</Label>
          <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
        <Button type="submit" className="w-full">Atur Ulang</Button>
      </form>
      <p className="text-sm text-center text-muted-foreground mt-6">
        <Link to="/login" className="text-primary font-medium hover:underline">Kembali ke masuk</Link>
      </p>
    </AuthLayout>
  );
}
