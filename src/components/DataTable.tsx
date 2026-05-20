type Props = { title: string; rows: Record<string, unknown>[]; columns?: string[]; empty?: string };
export function DataTable({ title, rows, columns, empty = 'No rows found.' }: Props) {
  const cols = columns?.length ? columns : Object.keys(rows[0] || {}).slice(0, 9);
  return <section className="card"><div className="card-head"><div><h3>{title}</h3><p>{rows.length.toLocaleString()} rows</p></div></div><div className="table-wrap">{!rows.length ? <div className="empty">{empty}</div> : <table><thead><tr>{cols.map(c => <th key={c}>{c.replaceAll('_',' ')}</th>)}</tr></thead><tbody>{rows.slice(0,100).map((r,i)=><tr key={i}>{cols.map(c=><td key={c}>{String(r[c] ?? '—')}</td>)}</tr>)}</tbody></table>}</div></section>;
}
