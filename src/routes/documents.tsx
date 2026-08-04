import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, FileText, HardDrive, Scan, Search, Upload } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/layout/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { documentsList } from "@/data/modules";

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
  return (
    <div className="space-y-5">
      <PageHeader
        section="Documents"
        title="Document vault"
        description="14,802 files · 23 documents expiring within 30 days."
        actions={
          <Button variant="secondary">
            <Upload className="size-4" />
            <span>Upload document</span>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total files" value="14,802" delta="+312 this month" icon={FileText} tone="brand" />
        <StatCard label="Expiring in 30 days" value="23" delta="6 critical" trend="down" icon={AlertTriangle} tone="warning" />
        <StatCard label="OCR processed" value="11,940" delta="81% coverage" icon={Scan} tone="info" />
        <StatCard label="Storage used" value="248 GB" delta="of 1 TB" icon={HardDrive} tone="success" />
      </div>

      <section className="surface-card overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 border-b border-border p-4">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search files, employees or OCR text…" aria-label="Search documents" className="h-10 rounded-xl pl-9" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c, i) => (
              <Button key={c} variant={i === 0 ? "default" : "outline"} size="sm" className="rounded-lg">
                {c}
              </Button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-secondary">
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documentsList.map((d) => (
                <TableRow key={d.name}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                        <FileText className="size-4" />
                      </span>
                      <span className="text-sm font-medium">{d.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{d.employee}</TableCell>
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
