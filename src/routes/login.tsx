import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Factory, Lock, Mail, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — CZAR Production" },
      { name: "description", content: "Sign in to the CZAR Production operations console." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  function submitCreds(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!email) errs.email = "Email required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = "Invalid email";
    if (!password) errs.password = "Password required";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setStep("otp");
  }

  function submitOtp() {
    if (otp.length !== 6) {
      setErrors({ otp: "Enter the 6-digit code from your authenticator" });
      return;
    }
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="grid min-h-screen grid-cols-1 bg-background lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Factory className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">CZAR Production</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Operations Console
              </p>
            </div>
          </div>

          {step === "credentials" ? (
            <>
              <h1 className="text-2xl font-semibold tracking-tight">Sign in to your account</h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Use your CZAR credentials. MFA may be required based on your role.
              </p>
              <form className="mt-8 space-y-4" onSubmit={submitCreds}>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Work email</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      className="pl-8"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@czar.io"
                      autoComplete="email"
                    />
                  </div>
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a href="#" className="text-xs text-primary hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      className="pl-8"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                  </div>
                  {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="text-xs font-normal text-muted-foreground">
                    Trust this device for 30 days
                  </Label>
                </div>
                <Button type="submit" className="w-full">
                  Continue <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </form>
              <p className="mt-6 text-center text-xs text-muted-foreground">
                Need MFA?{" "}
                <button
                  onClick={() => navigate({ to: "/mfa-setup" })}
                  className="text-primary hover:underline"
                >
                  Set up authenticator
                </button>
              </p>
            </>
          ) : (
            <>
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-md bg-info/12 px-2 py-1 text-xs font-medium text-info ring-1 ring-inset ring-info/25">
                <ShieldCheck className="h-3 w-3" /> Multi-factor authentication
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">Enter your 6-digit code</h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Open your authenticator app and enter the code for{" "}
                <span className="font-medium text-foreground">{email}</span>.
              </p>
              <div className="mt-8 space-y-4">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot key={i} index={i} className="h-11 w-11 font-mono text-base" />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
                {errors.otp && <p className="text-xs text-destructive">{errors.otp}</p>}
                <Button onClick={submitOtp} className="w-full">
                  Verify and continue
                </Button>
                <div className="flex items-center justify-between text-xs">
                  <button onClick={() => setStep("credentials")} className="text-muted-foreground hover:text-foreground">
                    ← Use a different account
                  </button>
                  <button className="text-primary hover:underline">Use recovery code</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-sidebar text-sidebar-foreground lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(var(--sidebar-border)_1px,transparent_1px),linear-gradient(90deg,var(--sidebar-border)_1px,transparent_1px)] [background-size:40px_40px]" />
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-sidebar-border bg-sidebar-accent px-3 py-1 text-[11px] font-medium uppercase tracking-wider">
            Uptime 99.98%
          </div>
        </div>
        <div className="relative max-w-md">
          <p className="text-3xl font-semibold leading-tight tracking-tight">
            Every part, batch and dispenser — accounted for, from factory floor to field.
          </p>
          <p className="mt-4 text-sm text-sidebar-foreground/70">
            CZAR Production unifies manufacturing, inventory and IoT operations across your global
            network of warehouses.
          </p>
        </div>
        <div className="relative grid grid-cols-3 gap-4 text-sm">
          <Stat n="184k" l="Units tracked" />
          <Stat n="7" l="Warehouses" />
          <Stat n="42" l="Active operators" />
        </div>
      </div>
    </div>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="rounded-lg border border-sidebar-border bg-sidebar-accent/40 p-3">
      <p className="font-mono text-xl font-semibold">{n}</p>
      <p className="mt-0.5 text-[10px] uppercase tracking-wider text-sidebar-foreground/60">{l}</p>
    </div>
  );
}
