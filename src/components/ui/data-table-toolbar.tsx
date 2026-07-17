import { Search, CalendarDays, ChevronDown, Columns, Filter, MoreVertical } from "lucide-react";
import { Input } from "./input";
import { Button } from "./button";

export function DataTableToolbar({
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
}: {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="h-9 pl-9 w-full bg-background/50"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">


        <Button variant="outline" size="icon" className="h-9 w-9">
          <Filter className="h-4 w-4 text-muted-foreground" />
        </Button>

        <Button variant="outline" size="icon" className="h-9 w-9">
          <MoreVertical className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}
