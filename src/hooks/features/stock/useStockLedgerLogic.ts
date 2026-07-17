import { useState } from "react";
import { ledger } from "@/lib/mock/data2";

export function useStockLedgerLogic() {
  const [wh, setWh] = useState("all");
  const rows = ledger.filter((r) => wh === "all" || r.warehouse === wh);

  return {
    state: { wh, rows },
    handlers: { setWh },
  };
}
