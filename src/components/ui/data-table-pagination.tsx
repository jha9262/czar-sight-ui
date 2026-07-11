import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";

export function DataTablePagination({
  totalItems = 25,
  itemsPerPage = 8,
  itemName = "items",
}: {
  totalItems?: number;
  itemsPerPage?: number;
  itemName?: string;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">Showing {itemsPerPage}</span> of {totalItems} {itemName}
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" className="h-8 w-8 bg-muted/50 text-foreground border-0 font-medium text-xs">
          1
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground text-xs hover:bg-muted">
          2
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground text-xs hover:bg-muted">
          3
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground text-xs hover:bg-muted">
          4
        </Button>
        <div className="flex h-8 w-8 items-center justify-center text-muted-foreground">
          <MoreHorizontal className="h-4 w-4" />
        </div>
        <Button variant="outline" size="icon" className="h-8 w-8 text-muted-foreground">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
        <span>Go to page</span>
        <Input type="number" defaultValue={1} className="h-8 w-14 text-center" />
      </div>
    </div>
  );
}
