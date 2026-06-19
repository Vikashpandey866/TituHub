"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { useApp } from "@/components/providers";
import { Button } from "@/components/ui/Button";
import { money } from "@/lib/format";

function Shell({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-panel p-8" onClick={(event) => event.stopPropagation()}>
        <button onClick={onClose} className="float-right -mt-1 text-zinc-500 transition hover:text-white">
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
}

export default function Modals() {
  const router = useRouter();
  const { authModal, setAuthModal, login, signup, resetPassword, checkoutOpen, setCheckoutOpen, placeOrder, total, cart } = useApp();
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [checkout, setCheckout] = useState({ address: "", phone: "", paymentMethod: "UPI / GPay" });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const strength = getStrength(signupForm.password);

  return (
    <>
      {authModal === "login" && (
        <Shell onClose={() => setAuthModal(null)}>
          <h2 className="font-heading text-2xl font-bold">Welcome Back</h2>
          <p className="mb-6 mt-1 text-sm text-zinc-500">Login to your TituHub account</p>
          <input className="input-shell mb-3" placeholder="Email address" value={loginForm.email} onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })} />
          <PasswordInput className="mb-4" placeholder="Password" show={showLoginPassword} onToggle={() => setShowLoginPassword((value) => !value)} value={loginForm.password} onChange={(value) => setLoginForm({ ...loginForm, password: value })} />
          <Button className="w-full" onClick={() => login(loginForm)}>Login to TituHub</Button>
          <button
            className="mt-3 w-full text-center text-sm font-semibold text-orange"
            onClick={async () => {
              const data = await resetPassword(loginForm.email);
              if (data?.email) router.push(`/verify-otp?mode=reset&email=${encodeURIComponent(data.email)}`);
            }}
          >
            Forgot Password?
          </button>
          <button
            className="mt-2 w-full text-center text-xs font-semibold text-zinc-400 hover:text-orange"
            onClick={() => loginForm.email && router.push(`/verify-otp?mode=signup&email=${encodeURIComponent(loginForm.email)}`)}
          >
            Resend OTP / Verify Email
          </button>
          <div className="my-4 flex items-center gap-3 text-sm text-zinc-500"><div className="h-px flex-1 bg-white/10" />or<div className="h-px flex-1 bg-white/10" /></div>
          <Button variant="ghost" className="w-full">Continue with Google</Button>
          <div className="mt-4 text-center text-sm text-zinc-500">
            Don&apos;t have an account? <button className="font-semibold text-orange" onClick={() => setAuthModal("signup")}>Sign Up</button>
          </div>
        </Shell>
      )}

      {authModal === "signup" && (
        <Shell onClose={() => setAuthModal(null)}>
          <h2 className="font-heading text-2xl font-bold">Join TituHub</h2>
          <p className="mb-6 mt-1 text-sm text-zinc-500">Create your account and start shopping</p>
          <input className="input-shell mb-3" placeholder="Full name" value={signupForm.name} onChange={(event) => setSignupForm({ ...signupForm, name: event.target.value })} />
          <input className="input-shell mb-3" placeholder="Email address" value={signupForm.email} onChange={(event) => setSignupForm({ ...signupForm, email: event.target.value })} />
          <input className="input-shell mb-3" placeholder="Mobile number" value={signupForm.phone} onChange={(event) => setSignupForm({ ...signupForm, phone: event.target.value })} />
          <PasswordInput className="mb-3" placeholder="Password" show={showSignupPassword} onToggle={() => setShowSignupPassword((value) => !value)} value={signupForm.password} onChange={(value) => setSignupForm({ ...signupForm, password: value })} />
          <div className="mb-3">
            <div className="mb-1 flex justify-between text-xs text-zinc-500"><span>Password Strength</span><span className={strength.color}>{strength.label}</span></div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10"><div className={`h-full rounded-full ${strength.bar}`} style={{ width: `${strength.score * 25}%` }} /></div>
          </div>
          <PasswordInput className="mb-4" placeholder="Confirm password" show={showSignupPassword} onToggle={() => setShowSignupPassword((value) => !value)} value={signupForm.confirmPassword} onChange={(value) => setSignupForm({ ...signupForm, confirmPassword: value })} />
          <Button
            className="w-full"
            onClick={async () => {
              const data = await signup(signupForm);
              if (data?.email) router.push(`/verify-otp?mode=signup&email=${encodeURIComponent(data.email)}`);
            }}
          >
            Create Account
          </Button>
          <div className="mt-4 text-center text-sm text-zinc-500">
            Already have an account? <button className="font-semibold text-orange" onClick={() => setAuthModal("login")}>Login</button>
          </div>
        </Shell>
      )}

      {checkoutOpen && (
        <Shell onClose={() => setCheckoutOpen(false)}>
          <h2 className="font-heading text-2xl font-bold">Checkout</h2>
          <p className="mb-6 mt-1 text-sm text-zinc-500">Complete your order</p>
          <input className="input-shell mb-3" placeholder="Full address with pincode" value={checkout.address} onChange={(event) => setCheckout({ ...checkout, address: event.target.value })} />
          <input className="input-shell mb-4" placeholder="+91 XXXXX XXXXX" value={checkout.phone} onChange={(event) => setCheckout({ ...checkout, phone: event.target.value })} />
          <div className="mb-4 rounded-xl border border-white/10 bg-panel2 p-4 text-sm">
            <div className="mb-3 text-zinc-500">Payment Method</div>
            <div className="flex flex-wrap gap-4">
              {["UPI / GPay", "Card", "Cash on Delivery"].map((method, index) => (
                <label key={method} className="flex items-center gap-2">
                  <input
                    name="payment"
                    type="radio"
                    checked={checkout.paymentMethod === method}
                    onChange={() => setCheckout({ ...checkout, paymentMethod: method })}
                  /> {method}
                </label>
              ))}
            </div>
          </div>
          <div className="mb-4 rounded-xl border border-white/10 bg-panel2 p-4">
            <div className="mb-2 text-sm font-semibold">{cart.length} item(s) in cart</div>
            <div className="flex justify-between font-bold"><span>Total Amount</span><span className="text-orange">{money(total)}</span></div>
          </div>
          <Button
            className="w-full"
            onClick={() => {
              const orderId = placeOrder(checkout);
              if (orderId) router.push(`/orders?success=${encodeURIComponent(orderId)}`);
            }}
          >
            Pay & Place Order
          </Button>
        </Shell>
      )}
    </>
  );
}

function PasswordInput({ value, onChange, show, onToggle, placeholder, className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <input className="input-shell pr-11" placeholder={placeholder} type={show ? "text" : "password"} value={value} onChange={(event) => onChange(event.target.value)} />
      <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-orange" aria-label="Toggle password visibility">
        {show ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </div>
  );
}

function getStrength(password) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  if (score <= 1) return { score: Math.max(1, score), label: "Weak", color: "text-rose-300", bar: "bg-rose-500" };
  if (score <= 3) return { score, label: "Good", color: "text-gold", bar: "bg-gold" };
  return { score, label: "Strong", color: "text-emerald-300", bar: "bg-emerald-500" };
}
