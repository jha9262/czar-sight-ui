import { ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function PageHeader({
  breadcrumbs,
  title,
  description,
  actions,
}: {
  breadcrumbs: { label: string; to?: string }[];
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="border-b bg-card/40 px-6 py-5">
      <nav className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
        {breadcrumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-1">
            {c.to ? (
              <Link to={c.to} className="hover:text-foreground">
                {c.label}
              </Link>
            ) : (
              <span className={i === breadcrumbs.length - 1 ? "text-foreground" : ""}>{c.label}</span>
            )}
            {i < breadcrumbs.length - 1 && <ChevronRight className="h-3 w-3" />}
          </span>
        ))}
      </nav>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
