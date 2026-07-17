import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";

export function useLoginLogic() {
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

  function navigateToMfaSetup() {
    navigate({ to: "/mfa-setup" });
  }

  return {
    state: { step, email, password, otp, errors },
    handlers: {
      setEmail,
      setPassword,
      setOtp,
      setStep,
      submitCreds,
      submitOtp,
      navigateToMfaSetup,
    },
  };
}
