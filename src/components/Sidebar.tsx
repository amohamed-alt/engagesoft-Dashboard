import { BarChart3, Building2, CircleDollarSign, Home, Megaphone, ShieldCheck, Sparkles, Wrench } from 'lucide-react';
import type { View } from '../types/dashboard';
const items = [
  ['executive','Executive',Home], ['acquisition','Acquisition',Building2], ['retention','Retention / CS',ShieldCheck], ['upsell','Upsell',Sparkles], ['pnl','P&L',CircleDollarSign], ['marketing','Marketing',Megaphone], ['quality','Data Quality',Wrench]
] as const;
export function Sidebar({ active, onChange }: { active: View; onChange: (v: View)=>void }) {
  return <aside className="sidebar"><div className="brand"><div className="brand-mark">T</div><div><strong>Talentera</strong><span>Command Center v2</span></div></div><nav>{items.map(([id,label,Icon])=><button key={id} className={active===id?'nav active':'nav'} onClick={()=>onChange(id)}><Icon size={17}/>{label}</button>)}</nav><div className="side-foot"><BarChart3 size={16}/> Supabase-first dashboard</div></aside>;
}
