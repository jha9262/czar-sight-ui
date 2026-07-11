import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search, Trash2, FileText, Image, Binary } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { DeleteDialog } from "@/components/delete-dialog";
import { useFiles, useDeleteFile } from "@/lib/queries";

export const Route = createFileRoute("/_app/files/")({
  head: () => ({ meta: [{ title: "Files — CZAR Production" }] }),
  component: FilesPage,
});

function fileIcon(type: string) {
  if (type.startsWith("image/")) return <Image className="h-4 w-4 text-blue-400" />;
  if (type.includes("pdf")) return <FileText className="h-4 w-4 text-red-400" />;
  return <Binary className="h-4 w-4 text-muted-foreground" />;
}

function FilesPage() {
  const { data: files = [] } = useFiles();
  const deleteFile = useDeleteFile();
  const [q, setQ] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const filtered = files.filter((f) => f.filename.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <PageHeader breadcrumbs={[{ label: "Home", to: "/dashboard" }, { label: "Files" }]} title="Files & Firmware" description="Attached datasheets, firmware binaries and engineering drawings."
        actions={<Button size="sm" asChild><Link to="/files/upload"><Plus className="mr-1.5 h-4 w-4" />Upload file</Link></Button>} />
      <div className="p-6">
        <div className="mb-4 relative max-w-xs"><Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" /><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search files…" className="h-9 pl-8" /></div>
        <div className="rounded-lg border bg-card"><Table><TableHeader><TableRow className="hover:bg-transparent"><TableHead className="w-10" /><TableHead>Filename</TableHead><TableHead>Type</TableHead><TableHead>Size</TableHead><TableHead>Visibility</TableHead><TableHead>Date</TableHead><TableHead className="w-10" /></TableRow></TableHeader>
          <TableBody>{filtered.map((f) => (
            <TableRow key={f.uuid}>
              <TableCell>{fileIcon(f.type)}</TableCell>
              <TableCell className="font-medium text-sm">{f.filename}</TableCell>
              <TableCell className="text-xs text-muted-foreground font-mono">{f.type}</TableCell>
              <TableCell className="text-xs font-mono">{f.size}</TableCell>
              <TableCell><StatusBadge tone={f.visibility === "PUBLIC" ? "success" : "info"}>{f.visibility}</StatusBadge></TableCell>
              <TableCell className="text-xs text-muted-foreground">{f.date}</TableCell>
              <TableCell><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteTarget(f.uuid)}><Trash2 className="h-4 w-4" /></Button></TableCell>
            </TableRow>))}</TableBody></Table></div>
      </div>
      <DeleteDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)} title="Delete file?" description="This file will be permanently removed." onConfirm={() => { if (deleteTarget) deleteFile.mutate(deleteTarget, { onSuccess: () => { toast.success("File deleted"); setDeleteTarget(null); } }); }} isPending={deleteFile.isPending} />
    </div>
  );
}
