import { useEffect, useMemo, useState } from 'react';
import { supabase } from './lib/supabase';
import { n, money, pct } from './lib/format';
import { Sidebar } from './components/Sidebar';
import { KpiCard } from './components/KpiCard';
import { DataTable } from './components/DataTable';
import type { Row, View } from './types/dashboard';

type Store = {
  kpis: Row[]; coverage: Row[]; owners: Row[]; deals: Row[]; upsellSummary: Row[]; upsellClients: Row[];
  pnl: Row[]; marketing: Row[]; retention: Row[]; quality: Row[];
};
const empty: Store = { kpis:[], coverage:[], owners:[], deals:[], upsellSummary:[], upsellClients:[], pnl:[], marketing:[], retention:[], quality:[] };
async function view(name: string, limit = 1000): Promise<Row[]> { const { data, error } = await supabase.from(name).select('*').limit(limit); if (error) { console.warn(name, error.message); return []; } return data || []; }

export function App() {
  const [active, setActive] = useState<View>('executive');
  const [loading, setLoading] = useState(false);
  const [s, setS] = useState<Store>(empty);
  const title = useMemo(() => ({executive:'Executive Overview', acquisition:'Acquisition Intelligence', retention:'Retention / CS', upsell:'Retention Upsell', pnl:'P&L', marketing:'Marketing', quality:'Data Quality'}[active]), [active]);
  async function load(){ setLoading(true); try { const [kpis, coverage, owners, deals, upsellSummary, upsellClients, pnl, marketing, retention, quality] = await Promise.all([
    view('vw_dashboard_global_kpis',20), view('vw_acquisition_country_coverage'), view('vw_owner_activity_summary'), view('vw_deal_pipeline_summary'), view('vw_retention_upsell_summary',20), view('vw_retention_upsell_clients'), view('vw_pnl_monthly'), view('vw_marketing_campaign_funnel'), view('vw_retention_renewal_summary'), view('vw_data_quality_issues')
  ]); setS({kpis,coverage,owners,deals,upsellSummary,upsellClients,pnl,marketing,retention,quality}); } finally { setLoading(false); } }
  useEffect(()=>{ void load(); },[]);
  return <div className="app"><Sidebar active={active} onChange={setActive}/><main className="main"><header className="topbar"><div><h1>{title}</h1><p>Live data from Supabase views · n8n sync engine</p></div><button className="primary" onClick={load}>{loading?'Refreshing…':'Refresh'}</button></header><section className="content">
    {active==='executive' && <Executive s={s}/>} {active==='acquisition' && <Acquisition s={s}/>} {active==='retention' && <Simple title="Retention / Customer Success" rows={s.retention}/>} {active==='upsell' && <Upsell s={s}/>} {active==='pnl' && <Simple title="P&L Monthly" rows={s.pnl}/>} {active==='marketing' && <Simple title="Marketing Funnel" rows={s.marketing}/>} {active==='quality' && <Simple title="Data Quality Issues" rows={s.quality}/>} 
  </section></main></div>;
}
function Executive({s}:{s:Store}){ const r=s.kpis[0]||{}; return <div className="stack"><Hero title="Talentera Command Center v2" sub="One source of truth for Acquisition, Retention, Upsell, P&L, Marketing, and Data Quality."/><div className="kpis"><KpiCard title="Companies" value={n(r.total_companies ?? r.companies)} /><KpiCard title="Contacts" value={n(r.total_contacts ?? r.contacts)} tone="blue"/><KpiCard title="Deals" value={n(r.total_deals ?? r.deals)} tone="purple"/><KpiCard title="Touched" value={n(r.touched_companies)} tone="cyan"/><KpiCard title="Untouched" value={n(r.untouched_companies)} tone="red"/><KpiCard title="Coverage" value={pct(r.coverage_rate ?? r.coverage_percent)} tone="amber"/></div><div className="grid2"><DataTable title="Country Coverage" rows={s.coverage}/><DataTable title="Owner Activity" rows={s.owners}/></div></div> }
function Acquisition({s}:{s:Store}){ const totals=s.coverage.reduce((a,r)=>({total:a.total+Number(r.total_companies||0), touched:a.touched+Number(r.touched_companies||r.contacted_companies||0), meetings:a.meetings+Number(r.completed_meetings||r.meetings_completed||0)}),{total:0,touched:0,meetings:0}); return <div className="stack"><Hero title="Acquisition Intelligence" sub="Country coverage, owner performance, touched/untouched accounts, meetings, connected calls, and pipeline."/><div className="kpis"><KpiCard title="Total Companies" value={n(totals.total)}/><KpiCard title="Touched" value={n(totals.touched)} tone="cyan"/><KpiCard title="Untouched" value={n(totals.total-totals.touched)} tone="red"/><KpiCard title="Completed Meetings" value={n(totals.meetings)} tone="purple"/></div><DataTable title="Acquisition Country Coverage" rows={s.coverage}/><DataTable title="Owner Activity Summary" rows={s.owners}/><DataTable title="Deal Pipeline Summary" rows={s.deals}/></div> }
function Upsell({s}:{s:Store}){ const r=s.upsellSummary[0]||{}; return <div className="stack"><Hero title="Retention Upsell / Features Plan" sub="Proposal sent, interested, not interested, upsell value, renewal value, and account-level drilldowns."/><div className="kpis"><KpiCard title="Clients" value={n(r.clients)}/><KpiCard title="Feature Rows" value={n(r.feature_rows)} tone="blue"/><KpiCard title="Proposal Sent" value={n(r.proposal_sent)} tone="purple"/><KpiCard title="Interested" value={n(r.interested)} tone="cyan"/><KpiCard title="Not Interested" value={n(r.not_interested)} tone="red"/><KpiCard title="Upsell Value" value={money(r.upsell_value_total)} tone="amber"/></div><DataTable title="Upsell Clients" rows={s.upsellClients}/></div> }
function Simple({title,rows}:{title:string;rows:Row[]}){ return <div className="stack"><Hero title={title} sub="This module reads from its Supabase view when available."/><DataTable title={title} rows={rows}/></div> }
function Hero({title,sub}:{title:string;sub:string}){ return <div className="hero"><div><span className="eyebrow">Live Snapshot</span><h2>{title}</h2><p>{sub}</p></div><div className="pill">React + Supabase</div></div> }
