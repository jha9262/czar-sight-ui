import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export const SECRET = "JBSW Y3DP EHPK 3PXP GEZD MNBV";

export function useMfaSetupLogic() {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  function verify() {
    if (code.length !== 6) return setErr("Enter the 6-digit code");
    setErr("");
    toast.success("MFA enabled for your account");
    navigate({ to: "/dashboard" });
  }

  function copy() {
    navigator.clipboard.writeText(SECRET.replace(/\s/g, ""));
    toast.success("Secret copied to clipboard");
  }

  return {
    state: { code, err },
    handlers: {
      setCode,
      verify,
      copy,
    },
  };
}
