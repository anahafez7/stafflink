import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Download, FileText, HardDrive, RefreshCw, Scan, Search, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/layout/stat-card";
import { BulkBar } from "@/components/data/bulk-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSelection } from "@/hooks/use-selection";
import { documentsList } from "@/data/modules";
import { useAuth } from "@/lib/auth";
import { useBadges } from "@/lib/badges";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "Documents — StaffLink" },
      {
        name: "description",
        content: "Employee files, contracts, certificates, visas and automated expiry tracking with approvals.",
      },
      { property: "og:title", content: "Documents — StaffLink" },
      { property: "og:description", content: "Employee files, contracts and expiry tracking." },
    ],
  }),
  component: DocumentsPage,
});

const docStatus: Record<string, string> = {
  Valid: "border-success/40 text-success",
  Expiring: "border-warning/40 text-warning",
  Expired: "border-destructive/40 text-destructive",
};

const categories = ["All", "Contract", "Identity", "Certificate", "Licence", "Policy"];

function DocumentsPage() {
  const { user } = useAuth();
  const isEmployee = user?.role === "employee";

  const [rows, setRows] = useState(() =>
    isEmployee ? documentsList.filter((d) => d.employee === user?.name || d.employee === "Company") : documentsList
  );
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const { setUnreadDocuments } = useBadges();
  const focusedDoc = useDeepLinkTarget("doc");

  useEffect(() => {
    setUnreadDocuments(rows.filter((d) => d.status !== "Valid").length);
  }, [rows, setUnreadDocuments]);

  const filtered = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return rows.filter((d) => {
      if (category !== "All" && d.category !== category) return false;
      if (!terms.length) return true;
      const haystack = [d.name, d.employee, d.category, d.status, d.version].join(" ").toLowerCase();
      return terms.every((t) => haystack.includes(t));
    });
  }, [rows, query, category]);

  const ids = useMemo(() => filtered.map((d) => d.name), [filtered]);
  const selection = useSelection(ids);

  const bulkRenew = () => {
    const count = selection.count;
    setRows((prev) =>
      prev.map((d) =>
        selection.isSelected(d.name)
          ? { ...d, status: "Valid", version: `v${Number(d.version.replace("v", "")) + 1}` }
          : d,
      ),
    );
    selection.clear();
    toast.success(`Renewed ${count} document${count === 1 ? "" : "s"} — new version created`);
  };

  const bulkDelete = () => {
    const count = selection.count;
    setRows((prev) => prev.filter((d) => !selection.isSelected(d.name)));
    selection.clear();
    toast.success(`${count} document${count === 1 ? "" : "s"} archived`);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        section="Documents"
        title={isEmployee ? "My Documents" : "Document vault"}
        description={isEmployee ? "View your personal and employment related files." : "14,802 files · 23 documents expiring within 30 days."}
        actions={
          !isEmployee && (
            <Button variant="secondary" onClick={() => toast.info("Drop files here to upload — OCR runs automatically.")}>
              <Upload className="size-4" />
              <span>Upload document</span>
            </Button>
          )
        }
      />

      {!isEmployee && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total files" value="14,802" delta="+312 this month" icon={FileText} tone="brand" />
          <StatCard label="Expiring in 30 days" value="23" delta="6 critical" trend="down" icon={AlertTriangle} tone="warning" />
          <StatCard label="OCR processed" value="11,940" delta="81% coverage" icon={Scan} tone="info" />
          <StatCard label="Storage used" value="248 GB" delta="of 1 TB" icon={HardDrive} tone="success" />
        </div>
      )}

      <section className="surface-card overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 border-b border-border p-4">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value.slice(0, 100))}
              placeholder="Search files, employees or OCR text…"
              aria-label="Search documents"
              className="h-10 rounded-xl pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <Button
                key={c}
                variant={c === category ? "default" : "outline"}
                size="sm"
                className="rounded-lg"
                onClick={() => setCategory(c)}
              >
                {c}
              </Button>
            ))}
          </div>
        </div>

        <BulkBar count={selection.count} noun="document" onClear={selection.clear}>
          {!isEmployee && (
            <Button size="sm" variant="outline" className="rounded-lg" onClick={bulkRenew}>
              <RefreshCw className="size-4" />
              <span>Renew / new version</span>
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            className="rounded-lg"
            onClick={() => toast.success(`Downloading ${selection.count} file(s) as ZIP`)}
          >
            <Download className="size-4" />
            <span>Download</span>
          </Button>
          {!isEmployee && (
            <Button size="sm" variant="destructive" className="rounded-lg" onClick={bulkDelete}>
              <Trash2 className="size-4" />
              <span>Archive</span>
            </Button>
          )}
        </BulkBar>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-secondary">
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    aria-label="Select all documents"
                    checked={selection.allSelected}
                    onCheckedChange={selection.toggleAll}
                  />
                </TableHead>
                <TableHead>Document</TableHead>
                {!isEmployee && <TableHead>Owner</TableHead>}
                <TableHead>Category</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                    No documents match this search.
                  </TableCell>
                </TableRow>
              ) : null}
              {filtered.map((d) => (
                <TableRow
                  key={d.name}
                  data-deep-link={d.name}
                  data-state={selection.isSelected(d.name) ? "selected" : undefined}
                  className={focusedDoc === d.name ? "bg-brand/5 outline outline-2 -outline-offset-2 outline-brand/50" : undefined}
                >
                  <TableCell>
                    <Checkbox
                      aria-label={`Select ${d.name}`}
                      checked={selection.isSelected(d.name)}
                      onCheckedChange={() => selection.toggle(d.name)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                        <FileText className="size-4" />
                      </span>
                      <span className="text-sm font-medium">{d.name}</span>
                    </div>
                  </TableCell>
                  {!isEmployee && <TableCell className="text-sm">{d.employee}</TableCell>}
                  <TableCell className="text-sm text-muted-foreground">{d.category}</TableCell>
                  <TableCell className="text-sm tabular-nums">{d.version}</TableCell>
                  <TableCell className="text-sm tabular-nums text-muted-foreground">{d.size}</TableCell>
                  <TableCell className="text-sm tabular-nums">{d.expires}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={docStatus[d.status]}>
                      {d.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
