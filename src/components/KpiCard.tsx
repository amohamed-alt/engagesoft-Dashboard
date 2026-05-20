type Props = { title: string; value: string | number; subtitle?: string; tone?: string; onClick?: () => void };
export function KpiCard({ title, value, subtitle, tone = 'green', onClick }: Props) {
  return <button className={`kpi tone-${tone}`} onClick={onClick} type="button"><div className="kpi-value">{value}</div><div className="kpi-title">{title}</div>{subtitle ? <div className="kpi-subtitle">{subtitle}</div> : null}</button>;
}
