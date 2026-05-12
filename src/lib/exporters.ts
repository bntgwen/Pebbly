import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Account, Budget, Category, Goal, Transaction } from "@/lib/types";
import { formatIDR } from "@/lib/currency";

interface FinanceData {
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  budgets: Budget[];
  goals: Goal[];
}

function trigger(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportCSV(d: FinanceData) {
  const cat = (id: string) => d.categories.find((c) => c.id === id)?.name ?? "";
  const acc = (id: string) => d.accounts.find((a) => a.id === id)?.name ?? "";
  const escape = (s: string) => `"${(s ?? "").replace(/"/g, '""')}"`;
  const header = ["Tanggal", "Judul", "Tipe", "Kategori", "Akun", "Jumlah", "Catatan"];
  const rows = d.transactions
    .slice()
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .map((t) => [
      new Date(t.date).toISOString().slice(0, 10),
      escape(t.title),
      t.type === "income" ? "Pemasukan" : "Pengeluaran",
      escape(cat(t.categoryId)),
      escape(acc(t.accountId)),
      String(t.amount),
      escape(t.notes ?? ""),
    ].join(","));
  const csv = "\uFEFF" + [header.join(","), ...rows].join("\n");
  trigger(new Blob([csv], { type: "text/csv;charset=utf-8;" }), `pebble-transaksi-${Date.now()}.csv`);
}

export function exportPDF(d: FinanceData) {
  const doc = new jsPDF();
  const totalIncome = d.transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = d.transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const netWorth = d.accounts.reduce((s, a) => s + a.balance, 0);

  doc.setFontSize(20); doc.text("Laporan Keuangan pebble", 14, 20);
  doc.setFontSize(10); doc.setTextColor(120);
  doc.text(`Dibuat: ${new Date().toLocaleString("id-ID")}`, 14, 27);
  doc.setTextColor(0);

  doc.setFontSize(13); doc.text("Ringkasan", 14, 40);
  autoTable(doc, {
    startY: 44,
    head: [["Metrik", "Nilai"]],
    body: [
      ["Total Kekayaan", formatIDR(netWorth)],
      ["Total Pemasukan", formatIDR(totalIncome)],
      ["Total Pengeluaran", formatIDR(totalExpense)],
      ["Net", formatIDR(totalIncome - totalExpense)],
    ],
    theme: "striped",
    headStyles: { fillColor: [37, 99, 235] },
  });

  let y = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(13); doc.text("Akun", 14, y);
  autoTable(doc, {
    startY: y + 4,
    head: [["Nama", "Tipe", "Saldo"]],
    body: d.accounts.map((a) => [a.name, a.type, formatIDR(a.balance)]),
    headStyles: { fillColor: [37, 99, 235] },
  });

  y = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(13); doc.text("Transaksi (50 terbaru)", 14, y);
  const cat = (id: string) => d.categories.find((c) => c.id === id)?.name ?? "—";
  const acc = (id: string) => d.accounts.find((a) => a.id === id)?.name ?? "—";
  autoTable(doc, {
    startY: y + 4,
    head: [["Tanggal", "Judul", "Kategori", "Akun", "Tipe", "Jumlah"]],
    body: d.transactions
      .slice()
      .sort((a, b) => +new Date(b.date) - +new Date(a.date))
      .slice(0, 50)
      .map((t) => [
        new Date(t.date).toLocaleDateString("id-ID"),
        t.title,
        cat(t.categoryId),
        acc(t.accountId),
        t.type === "income" ? "Pemasukan" : "Pengeluaran",
        (t.type === "income" ? "+" : "-") + formatIDR(t.amount),
      ]),
    headStyles: { fillColor: [37, 99, 235] },
    styles: { fontSize: 9 },
  });

  doc.save(`pebble-laporan-${Date.now()}.pdf`);
}
