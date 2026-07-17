import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Factory, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export const Route = createFileRoute("/mfa-setup")({
  head: () => ({
    meta: [
      { title: "Set up MFA — CZAR Production" },
      { name: "description", content: "Enable two-factor authentication for your account." },
    ],
  }),
  component: MfaSetupPage,
});



// Visual QR placeholder — decorative only
function QrPlaceholder() {
  return (
    <div
      className="h-48 w-48 overflow-hidden rounded-md bg-foreground p-2"
      style={{ display: "grid", gridTemplateColumns: "repeat(21, 1fr)", gap: 1 }}
    >
      {Array.from({ length: 441 }).map((_, i) => {
        const on = Math.random() > 0.45 || [0, 6, 14, 20, 420, 426, 434, 440].includes(i);
        return <div key={i} className={on ? "bg-background" : "bg-foreground"} />;
      })}
    </div>
  );
}

import { useMfaSetupLogic, SECRET } from "@/hooks/features/auth/useMfaSetupLogic";

function MfaSetupPage() {
  const { state, handlers } = useMfaSetupLogic();
  const { code, err } = state;
  const { setCode, verify, copy } = handlers;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
      <div className="w-full max-w-2xl overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b bg-card px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Factory className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold">CZAR Production</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Two-factor authentication
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-info/12 px-2 py-1 text-xs font-medium text-info ring-1 ring-inset ring-info/25">
            <ShieldCheck className="h-3 w-3" /> Required for admins
          </span>
        </div>

        <div className="grid gap-8 p-6 md:grid-cols-2">
          <div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Step 1</p>
              <h2 className="text-lg font-semibold">Scan the QR code</h2>
              <p className="text-sm text-muted-foreground">
                Use Google Authenticator, 1Password or any TOTP app to scan this code.
              </p>
            </div>
            <div className="mt-4 flex justify-center rounded-lg border bg-muted/40 p-4">
              <QrPlaceholder />
            </div>
            <div className="mt-4">
              <p className="text-xs font-medium text-muted-foreground">Or enter this key manually</p>
              <div className="mt-1.5 flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2">
                <code className="flex-1 font-mono text-xs tracking-wider">{SECRET}</code>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={copy}>
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>

          <div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Step 2</p>
              <h2 className="text-lg font-semibold">Enter your first code</h2>
              <p className="text-sm text-muted-foreground">
                Once scanned, enter the 6-digit code your app generates to confirm.
              </p>
            </div>
            <div className="mt-6 space-y-3">
              <InputOTP maxLength={6} value={code} onChange={setCode}>
                <InputOTPGroup>
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <InputOTPSlot key={i} index={i} className="h-12 w-12 font-mono text-lg" />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              {err && <p className="text-xs text-destructive">{err}</p>}
              <Button onClick={verify} className="w-full">
                Verify and enable MFA
              </Button>
              <p className="text-xs text-muted-foreground">
                Save your recovery codes after enabling MFA. You'll need them if you lose access to
                your authenticator app.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
