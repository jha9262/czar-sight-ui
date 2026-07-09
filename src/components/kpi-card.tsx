import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  delta,
  hint,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  value: string | number;
  delta?: { value: string; direction: "up" | "down" | "flat" };
  hint?: string;
  icon: LucideIcon;
  tone?: "primary" | "success" | "warning" | "destructive" | "info";
}) {
  const toneRing: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/12 text-success",
    warning: "bg-warning/15 text-warning-foreground",
    destructive: "bg-destructive/12 text-destructive",
    info: "bg-info/12 text-info",
  };
  return (
    <div className="rounded-lg border bg-card p-5 shadow-xs transition hover:shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 font-mono text-3xl font-semibold tabular-nums text-foreground">
            {value}
          </p>
        </div>
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-md", toneRing[tone])}>
          <Icon className="h-4.5 w-4.5" strokeWidth={2} />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs">
        {delta && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded font-medium",
              delta.direction === "up" && "text-success",
              delta.direction === "down" && "text-destructive",
              delta.direction === "flat" && "text-muted-foreground",
            )}
          >
            {delta.direction === "up" && <ArrowUpRight className="h-3 w-3" />}
            {delta.direction === "down" && <ArrowDownRight className="h-3 w-3" />}
            {delta.value}
          </span>
        )}
        {hint && <span className="text-muted-foreground">{hint}</span>}
      </div>
    </div>
  );
}
