"use client";

import { Children, useEffect, useState } from "react";
import { Clock3, ShieldCheck, UserRound } from "lucide-react";
import { AdminRouteLayout } from "@/components/features/AdminDashboard";

export default function AdminUsersPage() {
  const [data, setData] = useState({ verifiedUsers: [], pendingUsers: [], activeOtps: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/auth-users")
      .then((response) => response.json())
      .then((payload) => setData(payload))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminRouteLayout>
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-extrabold">Authentication Users</h1>
        <p className="mt-1 text-sm text-zinc-500">Verified users, pending verification users and active OTP records. Expired OTPs are cleaned automatically.</p>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => <div key={item} className="h-32 animate-pulse rounded-2xl bg-white/[.04]" />)}
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-3">
          <Panel icon={ShieldCheck} title="Verified Users" count={data.verifiedUsers.length}>
            {data.verifiedUsers.map((user) => <UserRow key={user.id} user={user} />)}
          </Panel>
          <Panel icon={UserRound} title="Pending Verification" count={data.pendingUsers.length}>
            {data.pendingUsers.map((user) => <UserRow key={user.id} user={user} pending />)}
          </Panel>
          <Panel icon={Clock3} title="Active OTP Records" count={data.activeOtps.length}>
            {data.activeOtps.map((otp) => (
              <div key={otp.id} className="rounded-xl border border-white/10 bg-white/[.035] p-3 text-sm">
                <div className="font-semibold">{otp.email}</div>
                <div className="mt-1 text-xs text-zinc-500">{otp.purpose} | attempts {otp.attempts}/5</div>
                <div className="mt-1 text-xs text-orange">Expires: {new Date(otp.expiresAt).toLocaleString("en-IN")}</div>
              </div>
            ))}
          </Panel>
        </div>
      )}
    </AdminRouteLayout>
  );
}

function Panel({ icon: Icon, title, count, children }) {
  return (
    <section className="premium-panel p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange text-white"><Icon size={20} /></span>
          <h2 className="font-heading text-xl font-bold">{title}</h2>
        </div>
        <span className="rounded-full border border-white/10 bg-white/[.04] px-3 py-1 text-xs font-bold text-orange">{count}</span>
      </div>
      <div className="space-y-3">{Children.count(children) ? children : <p className="text-sm text-zinc-500">No records found.</p>}</div>
    </section>
  );
}

function UserRow({ user, pending = false }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[.035] p-3 text-sm">
      <div className="font-semibold">{user.fullName || user.name}</div>
      <div className="mt-1 text-xs text-zinc-500">{user.email}</div>
      <div className="mt-1 text-xs text-zinc-500">{user.mobile || user.phone}</div>
      {pending && <div className="mt-1 text-xs text-orange">Expires: {new Date(user.expiresAt).toLocaleString("en-IN")}</div>}
    </div>
  );
}
