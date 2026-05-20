export function n(value: unknown): string { const x = Number(value || 0); return Number.isFinite(x) ? x.toLocaleString() : '0'; }
export function money(value: unknown): string { const x = Number(value || 0); if (!Number.isFinite(x)) return '$0'; if (Math.abs(x)>=1000000) return `$${(x/1000000).toFixed(1)}M`; if (Math.abs(x)>=1000) return `$${Math.round(x/1000)}K`; return `$${Math.round(x).toLocaleString()}`; }
export function pct(value: unknown): string { const x = Number(value || 0); return Number.isFinite(x) ? `${Math.round(x)}%` : '0%'; }
