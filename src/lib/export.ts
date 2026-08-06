export function downloadCsv(filename: string, rows: (string | number)[][]) {
  const escape = (v: string | number) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = rows.map((r) => r.map(escape).join(",")).join("\r\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Opens a print-ready window (Save as PDF) with a simple branded table. */
export function printTableAsPdf(title: string, subtitle: string, head: string[], rows: (string | number)[][]) {
  const esc = (v: string | number) =>
    String(v ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c] as string);
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${esc(title)}</title>
<style>
 body{font-family:Inter,Arial,sans-serif;color:#101828;margin:32px}
 h1{font-size:20px;margin:0 0 4px}
 p{margin:0 0 20px;color:#667085;font-size:12px}
 table{width:100%;border-collapse:collapse;font-size:12px}
 th{background:#112E81;color:#fff;text-align:left;padding:8px 10px}
 td{padding:8px 10px;border-bottom:1px solid #E4E7EC}
 tr:nth-child(even) td{background:#F9FAFB}
</style></head><body>
<h1>${esc(title)}</h1><p>${esc(subtitle)}</p>
<table><thead><tr>${head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead>
<tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>
<script>window.onload=function(){window.print()}</script>
</body></html>`;
  const w = window.open("", "_blank", "width=900,height=700");
  if (!w) return false;
  w.document.write(html);
  w.document.close();
  return true;
}