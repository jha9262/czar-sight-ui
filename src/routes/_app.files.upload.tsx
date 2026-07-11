import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type FileRecord } from "@/lib/mock/data3";
import { useCreateFile } from "@/lib/queries";

export const Route = createFileRoute("/_app/files/upload")({ head: () => ({ meta: [{ title: "Upload File — CZAR Production" }] }), component: FileUploadPage });

function FileUploadPage() {
  const navigate = useNavigate();
  const create = useCreateFile();
  const [form, setForm] = useState<FileRecord>({ uuid: `F-${crypto.randomUUID().slice(0, 8)}`, filename: "", type: "application/pdf", size: "0 KB", visibility: "PUBLIC", date: new Date().toISOString().slice(0, 10) });
  const [errors, setErrors] = useState<Record<string, string>>({});
  function set<K extends keyof FileRecord>(k: K, v: FileRecord[K]) { setForm((f) => ({ ...f, [k]: v })); }
  function submit() {
    const e: Record<string, string> = {};
    if (!form.filename.trim()) e.filename = "Required";
    setErrors(e); if (Object.keys(e).length) return;
    create.mutate(form, { onSuccess: () => { toast.success("File uploaded"); navigate({ to: "/files" }); } });
  }
  return (
    <div>
      <PageHeader breadcrumbs={[{ label: "Home", to: "/dashboard" }, { label: "Files", to: "/files" }, { label: "Upload" }]} title="Upload File" description="Attach a datasheet, firmware binary or engineering drawing." />
      <div className="mx-auto max-w-3xl p-6">
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-3 text-muted-foreground"><Link to="/files"><ArrowLeft className="mr-2 h-4 w-4" />Back</Link></Button>
        <div className="rounded-xl border bg-card p-6 shadow-sm"><div className="space-y-6">
          <Field label="Filename" error={errors.filename}><Input value={form.filename} onChange={(e) => set("filename", e.target.value)} placeholder="firmware_v2.5.bin" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="MIME Type"><Input value={form.type} onChange={(e) => set("type", e.target.value)} placeholder="application/pdf" /></Field>
            <Field label="Size"><Input value={form.size} onChange={(e) => set("size", e.target.value)} placeholder="1.2 MB" /></Field>
          </div>
          <Field label="Visibility">
            <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" value={form.visibility} onChange={(e) => set("visibility", e.target.value as FileRecord["visibility"])}>
              <option value="PUBLIC">Public</option><option value="PRIVATE">Private</option>
            </select>
          </Field>
          <div className="rounded-lg border-2 border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">Drag & drop files here or click to browse</p>
            <p className="mt-1 text-xs text-muted-foreground">(Simulated — fill in the fields above)</p>
          </div>
        </div><div className="mt-8 flex justify-end gap-3 border-t pt-6"><Button variant="outline" asChild><Link to="/files">Cancel</Link></Button><Button onClick={submit}>Upload file</Button></div></div>
      </div>
    </div>
  );
}
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) { return (<div className="space-y-1.5"><Label className="text-xs font-medium text-muted-foreground">{label}</Label>{children}{error && <p className="text-xs text-destructive">{error}</p>}</div>); }
