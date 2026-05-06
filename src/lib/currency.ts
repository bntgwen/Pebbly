// IDR currency helpers — Indonesian Rupiah (id-ID locale)
// Format: "Rp 1.234.567,00"

export function formatIDR(value: number, opts: { withSymbol?: boolean; decimals?: 0 | 2 } = {}) {
  const { withSymbol = true, decimals = 0 } = opts;
  const safe = Number.isFinite(value) ? value : 0;
  const formatted = new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Math.abs(safe));
  const sign = safe < 0 ? "-" : "";
  return withSymbol ? `${sign}Rp ${formatted}` : `${sign}${formatted}`;
}

export function formatIDRCompact(value: number) {
  const safe = Number.isFinite(value) ? value : 0;
  const abs = Math.abs(safe);
  const sign = safe < 0 ? "-" : "";
  if (abs >= 1_000_000_000) return `${sign}Rp ${(abs / 1_000_000_000).toFixed(1).replace(".", ",")} M`;
  if (abs >= 1_000_000) return `${sign}Rp ${(abs / 1_000_000).toFixed(1).replace(".", ",")} jt`;
  if (abs >= 1_000) return `${sign}Rp ${(abs / 1_000).toFixed(0)} rb`;
  return `${sign}Rp ${abs}`;
}

// Parse user input like "1.234.567" or "1234567" into a number
export function parseIDRInput(input: string): number {
  if (!input) return 0;
  const cleaned = input.replace(/[^\d]/g, "");
  if (!cleaned) return 0;
  return parseInt(cleaned, 10);
}

// Format raw digits as user types: 1234567 -> "1.234.567"
export function formatIDRTyping(input: string): string {
  const digits = input.replace(/[^\d]/g, "");
  if (!digits) return "";
  return new Intl.NumberFormat("id-ID").format(parseInt(digits, 10));
}
