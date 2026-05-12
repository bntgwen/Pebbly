import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, ArrowLeftRight, PieChart, Target, Wallet,
  FolderOpen, Settings, LogOut, Plus, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { TransactionDialog } from "./dialogs/TransactionDialog";
import { CategoryDialog } from "./dialogs/CategoryDialog";
import { AccountDialog } from "./dialogs/AccountDialog";
import { BudgetDialog } from "./dialogs/BudgetDialog";
import { GoalDialog } from "./dialogs/GoalDialog";

const nav = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/app/transactions", label: "Transaksi", icon: ArrowLeftRight },
  { to: "/app/budgets", label: "Anggaran", icon: PieChart },
  { to: "/app/goals", label: "Target", icon: Target },
  { to: "/app/accounts", label: "Akun", icon: Wallet },
  { to: "/app/categories", label: "Kategori", icon: FolderOpen },
  { to: "/app/analytics", label: "Analitik", icon: Sparkles },
  { to: "/app/settings", label: "Pengaturan", icon: Settings },
];

const mobileNav = [
  { to: "/app", label: "Beranda", icon: LayoutDashboard, end: true },
  { to: "/app/transactions", label: "Transaksi", icon: ArrowLeftRight },
  { to: "/app/budgets", label: "Anggaran", icon: PieChart },
  { to: "/app/analytics", label: "Analitik", icon: Sparkles },
  { to: "/app/settings", label: "Setelan", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user());

  const [openDialog, setOpenDialog] = useState<null | "tx" | "cat" | "acc" | "bud" | "goal">(null);

  const fabContext = (() => {
    const p = location.pathname;
    if (p.startsWith("/app/categories")) return { label: "Kategori", action: () => setOpenDialog("cat") };
    if (p.startsWith("/app/accounts")) return { label: "Akun", action: () => setOpenDialog("acc") };
    if (p.startsWith("/app/budgets")) return { label: "Anggaran", action: () => setOpenDialog("bud") };
    if (p.startsWith("/app/goals")) return { label: "Target", action: () => setOpenDialog("goal") };
    return { label: "Transaksi", action: () => setOpenDialog("tx") };
  })();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-sidebar">
        <div className="h-16 px-6 flex items-center gap-2 border-b border-sidebar-border">
            {/* Ganti bagian ini */}
            <div className="h-8 w-8 rounded-lg overflow-hidden flex items-center justify-center">
              <img 
                src="/logo1.png" 
                alt="Pebble Logo" 
                className="h-full w-full object-contain" 
              />
            </div>
          <span className="text-lg font-bold tracking-tight">Pebble</span>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/60"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <div className="px-3 py-2 mb-2">
            <div className="text-sm font-semibold truncate">{user?.name}</div>
            <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground/70"
            onClick={() => { logout(); navigate("/"); }}
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-border flex items-center justify-between px-4 lg:px-8 sticky top-0 bg-background/80 backdrop-blur-xl z-30">
            {/* Ganti bagian ini */}
            <div className="lg:hidden flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg overflow-hidden flex items-center justify-center">
                <img 
                  src="/logo1.png" 
                  alt="Pebble Logo" 
                  className="h-full w-full object-contain" 
                />
              </div>
              <span className="text-lg font-bold tracking-tight">Pebble</span>
            </div>
          <div className="hidden lg:block">
            <h2 className="text-base font-semibold text-muted-foreground">
              Selamat datang kembali, <span className="text-foreground">{user?.name}</span>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button onClick={fabContext.action} className="hidden sm:inline-flex gap-2">
              <Plus className="h-4 w-4" /> Tambah {fabContext.label}
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 pb-24 lg:pb-8 animate-fade-in">{children}</main>
      </div>

    {/* Mobile bottom nav - iOS Liquid Glass */}
<div className="lg:hidden fixed bottom-5 inset-x-0 z-40 flex justify-center px-4">
  <nav
    className="
      relative
      w-full
      max-w-md
      h-[74px]
      rounded-[32px]
      overflow-hidden
      border border-white/20
      bg-white/10 dark:bg-white/[0.08]
      backdrop-blur-xl
      backdrop-saturate-200
      shadow-[0_8px_40px_rgba(0,0,0,0.12)]
      grid grid-cols-5
      px-2
    "
  >
    {/* glossy top reflection */}
    <div className="absolute inset-0 rounded-[32px] bg-gradient-to-b from-white/35 via-white/10 to-transparent pointer-events-none" />

    {/* liquid edge light */}
    <div className="absolute inset-[1px] rounded-[31px] border border-white/15 pointer-events-none" />

    {/* soft glow */}
    <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-20 bg-white/20 blur-3xl pointer-events-none" />

    {mobileNav.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        end={item.end}
        className={({ isActive }) =>
          cn(
            "relative flex flex-col items-center justify-center transition-all duration-500",
            isActive
              ? "text-foreground"
              : "text-muted-foreground"
          )
        }
      >
        {({ isActive }) => (
          <>
            {/* liquid active pill */}
            {isActive && (
              <div
                className="
                  absolute
                  h-14
                  w-14
                  rounded-2xl
                  bg-white/20
                  dark:bg-white/10
                  backdrop-blur-md
                  border border-white/20
                  shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_4px_20px_rgba(255,255,255,0.08)]
                "
              />
            )}

            <div className="relative z-10 flex flex-col items-center gap-1">
              <item.icon
                className={cn(
                  "h-5 w-5 transition-all duration-500",
                  isActive && "scale-110"
                )}
              />

              <span className="text-[10px] font-medium">
                {item.label}
              </span>
            </div>
          </>
        )}
      </NavLink>
    ))}
  </nav>
</div>

   {/* Mobile FAB - Liquid */}
<button
  onClick={fabContext.action}
  className="
    lg:hidden
    fixed
    bottom-28
    right-5
    h-14
    w-14
    rounded-full
    overflow-hidden
    border border-white/20
    bg-white/15
    dark:bg-white/10
    backdrop-blur-xl
    backdrop-saturate-200
    shadow-[0_8px_30px_rgba(0,0,0,0.18)]
    flex items-center justify-center
    text-foreground
    z-50
    transition-all duration-300
    active:scale-95
  "
  aria-label={`Tambah ${fabContext.label}`}
>
  <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />
  <Plus className="relative z-10 h-6 w-6" />
</button>

      {/* Dialogs */}
      <TransactionDialog open={openDialog === "tx"} onOpenChange={(o) => setOpenDialog(o ? "tx" : null)} />
      <CategoryDialog open={openDialog === "cat"} onOpenChange={(o) => setOpenDialog(o ? "cat" : null)} />
      <AccountDialog open={openDialog === "acc"} onOpenChange={(o) => setOpenDialog(o ? "acc" : null)} />
      <BudgetDialog open={openDialog === "bud"} onOpenChange={(o) => setOpenDialog(o ? "bud" : null)} />
      <GoalDialog open={openDialog === "goal"} onOpenChange={(o) => setOpenDialog(o ? "goal" : null)} />
    </div>
  );
}
