"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, KeyRound, Mail, RefreshCw, ShieldCheck } from "lucide-react";
import { useApp } from "@/components/providers";
import { Button } from "@/components/ui/Button";

function maskEmail(email = "") {
  const [name, domain] = email.split("@");
  if (!name || !domain) return email;
  return `${name.slice(0, 2)}${"*".repeat(Math.max(2, name.length - 2))}@${domain}`;
}

function VerifyOtpInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { showToast, setUser } = useApp();
  const email = params.get("email") || "";
  const mode = params.get("mode") || "signup";
  const purpose = mode === "reset" ? "password_reset" : "signup";
  const inputs = useRef([]);
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [secondsLeft, setSecondsLeft] = useState(300);
  const [resendLeft, setResendLeft] = useState(30);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [errorShake, setErrorShake] = useState(false);
  const [passwords, setPasswords] = useState({ password: "", confirmPassword: "" });

  const otp = useMemo(() => digits.join(""), [digits]);

  useEffect(() => {
    inputs.current[0]?.focus();
    const timer = setInterval(() => {
      setSecondsLeft((value) => Math.max(0, value - 1));
      setResendLeft((value) => Math.max(0, value - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!email) router.replace("/");
  }, [email, router]);

  const timeLabel = `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(secondsLeft % 60).padStart(2, "0")}`;

  const setDigit = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setDigits((current) => current.map((item, itemIndex) => (itemIndex === index ? digit : item)));
    if (digit && index < 5) inputs.current[index + 1]?.focus();
  };

  const pasteOtp = (value) => {
    const next = value.replace(/\D/g, "").slice(0, 6).split("");
    if (!next.length) return;
    setDigits(Array.from({ length: 6 }, (_, index) => next[index] || ""));
    inputs.current[Math.min(next.length, 6) - 1]?.focus();
  };

  const resend = async () => {
    setLoading(true);
    const response = await fetch("/api/auth/resend-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, purpose })
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok || !data.ok) {
      showToast(data.error || "Unable to resend OTP");
      return;
    }
    setDigits(["", "", "", "", "", ""]);
    setSecondsLeft(data.expiresIn || 300);
    setResendLeft(data.resendAfter || 30);
    inputs.current[0]?.focus();
    showToast("OTP resent to email");
  };

  const verifySignup = async () => {
    const response = await fetch("/api/auth/signup/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp })
    });
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.error || "OTP verification failed");
    return data;
  };

  const resetPassword = async () => {
    const response = await fetch("/api/auth/forgot-password/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, ...passwords })
    });
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.error || "Password reset failed");
    return data;
  };

  const submit = async () => {
    if (otp.length !== 6) {
      setErrorShake(true);
      setTimeout(() => setErrorShake(false), 450);
      showToast("Enter the 6-digit OTP");
      return;
    }
    if (mode === "reset" && (!passwords.password || !passwords.confirmPassword)) {
      showToast("Enter new password details");
      return;
    }
    setLoading(true);
    try {
      if (mode === "reset") {
        await resetPassword();
        showToast("Password reset successful. Please login.");
        setVerified(true);
        setTimeout(() => router.push("/"), 1200);
      } else {
        const data = await verifySignup();
        if (data.user) setUser(data.user);
        showToast("Email verified. Account created.");
        setVerified(true);
        setTimeout(() => router.push("/"), 1200);
      }
    } catch (error) {
      setErrorShake(true);
      setTimeout(() => setErrorShake(false), 450);
      showToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden px-3 py-8 pb-28 sm:px-4 sm:py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(255,107,0,.18),transparent_28rem)]" />
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0, x: errorShake ? [0, -8, 8, -6, 6, 0] : 0, scale: verified ? 1.015 : 1 }}
        transition={{ duration: errorShake ? 0.38 : 0.5 }}
        className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-charcoal/80 p-5 shadow-luxury backdrop-blur-2xl sm:p-6"
      >
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-orange/70 to-transparent" />
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange text-white shadow-orange">{verified ? <CheckCircle2 size={24} /> : <KeyRound size={24} />}</span>
          <div>
            <h1 className="font-heading text-2xl font-extrabold sm:text-3xl">{mode === "reset" ? "Reset Password" : "Verify Email"}</h1>
            <p className="text-sm text-zinc-500">OTP sent to {maskEmail(email)}</p>
          </div>
        </div>

        <div className="mb-5 rounded-xl border border-white/10 bg-white/[.05] p-4 text-sm text-zinc-400">
          <div className="mb-2 flex items-center gap-2 text-white"><ShieldCheck size={16} className="text-orange" /> Secure OTP Verification</div>
          Enter the 6-digit OTP within <span className="font-bold text-orange">{timeLabel}</span>.
        </div>

        <div className="mb-5 grid grid-cols-6 gap-1.5 sm:gap-2">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(node) => { inputs.current[index] = node; }}
              className="h-12 min-w-0 rounded-xl border border-white/10 bg-panel2 text-center font-heading text-lg font-bold text-white outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/25 sm:h-14 sm:text-xl"
              aria-label={`OTP digit ${index + 1}`}
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={1}
              value={digit}
              onChange={(event) => setDigit(index, event.target.value)}
              onPaste={(event) => {
                event.preventDefault();
                pasteOtp(event.clipboardData.getData("text"));
              }}
              onKeyDown={(event) => {
                if (event.key === "Backspace" && !digits[index] && index > 0) inputs.current[index - 1]?.focus();
                if (event.key === "ArrowLeft" && index > 0) inputs.current[index - 1]?.focus();
                if (event.key === "ArrowRight" && index < 5) inputs.current[index + 1]?.focus();
              }}
            />
          ))}
        </div>

        {mode === "reset" && (
          <div className="mb-5 grid gap-3">
            <input className="input-shell" type="password" placeholder="New password" value={passwords.password} onChange={(event) => setPasswords({ ...passwords, password: event.target.value })} />
            <input className="input-shell" type="password" placeholder="Confirm new password" value={passwords.confirmPassword} onChange={(event) => setPasswords({ ...passwords, confirmPassword: event.target.value })} />
          </div>
        )}

        <Button className="w-full min-h-12" disabled={loading || secondsLeft === 0 || verified} onClick={submit}>
          {loading ? "Verifying..." : verified ? "Verified" : mode === "reset" ? "Verify OTP & Reset Password" : "Verify OTP"}
        </Button>

        <button disabled={resendLeft > 0 || loading} onClick={resend} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 text-center text-sm font-semibold text-orange transition hover:text-gold disabled:text-zinc-600">
          {loading ? <RefreshCw size={16} className="animate-spin" /> : <Mail size={16} />}
          {resendLeft > 0 ? `Resend OTP in ${resendLeft}s` : "Resend OTP"}
        </button>
      </motion.div>
    </section>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="section-shell text-center text-zinc-500">Loading verification...</div>}>
      <VerifyOtpInner />
    </Suspense>
  );
}
