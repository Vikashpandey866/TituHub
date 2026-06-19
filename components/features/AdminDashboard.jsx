"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Box, CheckCircle2, Clock3, CreditCard, LineChart, MapPin, Package, Phone, Plus, Printer, Search, ShoppingBag, Store, Truck, Users, Utensils, X } from "lucide-react";
import MetricCard from "@/components/admin/MetricCard";
import StatusBadge from "@/components/ui/StatusBadge";
import ProductCard from "@/components/cards/ProductCard";
import FoodCard from "@/components/cards/FoodCard";
import FoodForm from "@/components/features/FoodForm";
import ProductForm from "@/components/features/ProductForm";
import { useApp } from "@/context/AppContext";
import { recentOrders, sellers } from "@/data/admin";
import { money } from "@/lib/format";
import { readStorage, writeStorage } from "@/utils/localStorage";

const nav = [
  ["/admin", "Dashboard", BarChart3],
  ["/admin/orders", "Orders", Package],
  ["/admin/products", "Products", Box],
  ["/admin/menu", "Menu", Utensils],
  ["/admin/users", "Users", Users],
  ["/admin", "Sellers", Store],
  ["/admin", "Analytics", LineChart]
];

export function AdminGuard({ children }) {
  const { user } = useApp();

  if (user?.role !== "admin") {
    return (
      <section className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-10">
        <div className="max-w-md rounded-2xl border border-white/10 bg-charcoal p-6 text-center shadow-luxury">
          <h1 className="font-heading text-3xl font-extrabold">Protected Dashboard</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-500">Admin access requires a verified admin role. Use the separate admin login route to continue.</p>
          <a href="/admin-login" className="mt-6 inline-flex rounded-xl bg-gradient-to-br from-orange to-ember px-5 py-3 text-sm font-bold text-white">Admin Login</a>
        </div>
      </section>
    );
  }

  return children;
}

function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden border-r border-white/10 bg-panel py-6 lg:block">
      <div className="mb-4 px-5 text-xs font-semibold uppercase tracking-widest text-zinc-500">Admin Panel</div>
      {nav.map(([href, label, Icon]) => (
        <Link
          key={`${href}-${label}`}
          href={href}
          className={`flex w-full items-center gap-2 border-l-2 px-5 py-3 text-sm transition ${pathname === href ? "border-orange bg-orange/5 text-orange" : "border-transparent text-zinc-500 hover:text-orange"}`}
        >
          <Icon size={16} /> {label}
        </Link>
      ))}
    </aside>
  );
}

export function AdminRouteLayout({ children }) {
  return (
    <AdminGuard>
      <div className="grid min-h-[calc(100vh-64px)] lg:grid-cols-[220px_1fr]">
        <AdminSidebar />
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </AdminGuard>
  );
}

export default function AdminDashboard() {
  return (
    <AdminGuard>
      <div className="grid min-h-[calc(100vh-64px)] lg:grid-cols-[220px_1fr]">
        <AdminSidebar />
        <main className="p-4 sm:p-6">
          <Dashboard />
        </main>
    </div>
    </AdminGuard>
  );
}

function Dashboard() {
  return (
    <>
      <h2 className="mb-5 font-heading text-2xl font-bold">Dashboard Overview</h2>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Revenue" value="₹4.2L" change="↑ 23% this month" />
        <MetricCard label="Total Orders" value="1,284" change="↑ 156 this week" />
        <MetricCard label="Active Users" value="8,472" change="↑ 12%" />
        <MetricCard label="Avg Order Value" value="₹327" change="↑ ₹42" />
      </div>
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {[
          ["/admin/products", "Manage Products", "Add, edit, delete, search and update stock.", Box],
          ["/admin/menu", "Manage Restaurant Menu", "Maintain food items, categories and pricing.", Utensils],
          ["/admin/orders", "Manage Orders", "View orders, update statuses and inspect details.", Package],
          ["/admin/users", "Manage Users", "Review verified and pending OTP users.", Users],
          ["/printhub", "Manage Printing Services", "Preview PrintHub services, calculator and uploads.", Printer],
          ["/admin", "Analytics Dashboard", "Track sales, food orders, print jobs and conversions.", LineChart]
        ].map(([href, title, desc, Icon]) => (
          <Link key={href} href={href} className="premium-card block p-5">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-orange text-white">
              <Icon size={21} />
            </div>
            <h3 className="mb-2 font-heading text-lg font-bold">{title}</h3>
            <p className="mb-4 text-sm leading-6 text-zinc-500">{desc}</p>
            <span className="inline-flex rounded-xl bg-gradient-to-br from-orange to-ember px-4 py-2.5 text-sm font-bold text-white">Open</span>
          </Link>
        ))}
      </div>
      <Orders compact />
    </>
  );
}

const timelineSteps = ["Pending", "Accepted", "Preparing", "Shipped", "Delivered"];
const statusFilters = ["All", "Pending", "Accepted", "Preparing", "Shipped", "Delivered", "Cancelled"];
const statusRank = { Pending: 0, Accepted: 1, Preparing: 2, Shipped: 3, Delivered: 4, Cancelled: -1 };
const seedImages = [
  "https://images.unsplash.com/photo-1594938298603-c8148f4994d5?w=300&q=80",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&q=80",
  "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&q=80"
];

function formatDateTime(value, fallback = "Today") {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

function getEta(order) {
  if (order.eta) return formatDateTime(order.eta);
  if (order.dateTime) {
    return formatDateTime(new Date(new Date(order.dateTime).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString());
  }
  return order.module === "Food" ? "25-35 minutes" : "2-4 business days";
}

function normalizeLiveOrder(order) {
  return {
    ...order,
    source: "live",
    customer: order.customer || "TituHub Customer",
    phone: order.phone || "+91 98765 43210",
    address: order.address || "Saved customer address",
    amount: order.total || order.amount || 0,
    module: order.items?.[0]?.type === "food" ? "Food" : order.items?.[0]?.type === "print" ? "Print" : "Fashion",
    paymentMethod: order.paymentMethod || "UPI / GPay",
    paymentStatus: order.paymentStatus || "Paid",
    dateTime: order.dateTime || order.date,
    eta: order.eta,
    isNew: Boolean(order.isNew)
  };
}

function normalizeSeedOrder(order, index, update) {
  const date = new Date(Date.now() - (index + 1) * 60 * 60 * 1000);
  const productName = order.module === "Food" ? "Chef Special Combo" : order.module === "Print" ? "Custom Print Pack" : "Premium Fashion Item";
  return {
    ...order,
    source: "seed",
    status: update?.status || order.status,
    customer: order.customer,
    phone: ["+91 98123 45670", "+91 98234 56781", "+91 98345 67892", "+91 98456 78903", "+91 98567 89014"][index] || "+91 98765 43210",
    address: ["Banjara Hills, Hyderabad", "Indiranagar, Bengaluru", "Civil Lines, Delhi", "Park Street, Kolkata", "Sector 62, Noida"][index] || "Customer delivery address",
    amount: order.amount,
    total: order.amount,
    dateTime: date.toISOString(),
    eta: new Date(date.getTime() + (order.module === "Food" ? 45 * 60 * 1000 : 3 * 24 * 60 * 60 * 1000)).toISOString(),
    paymentMethod: index % 3 === 1 ? "Cash on Delivery" : "UPI / GPay",
    paymentStatus: index % 3 === 1 ? "Pending" : "Paid",
    isNew: index === 0,
    items: [
      {
        id: `${order.id}-item`,
        name: productName,
        price: order.amount,
        qty: order.module === "Food" ? 2 : 1,
        img: seedImages[index % seedImages.length],
        type: order.module.toLowerCase()
      }
    ]
  };
}

export function Orders({ compact = false }) {
  const { orders, updateOrderStatus, showToast } = useApp();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedId, setSelectedId] = useState(null);
  const [seedUpdates, setSeedUpdates] = useState({});

  useEffect(() => {
    setSeedUpdates(readStorage("titu_admin_order_updates", {}));
  }, []);

  useEffect(() => {
    writeStorage("titu_admin_order_updates", seedUpdates);
  }, [seedUpdates]);

  const adminOrders = [
    ...orders.map(normalizeLiveOrder),
    ...recentOrders.map((order, index) => normalizeSeedOrder(order, index, seedUpdates[order.id]))
  ];

  const filteredOrders = adminOrders.filter((order) => {
    const search = query.toLowerCase();
    const matchesSearch =
      order.id.toLowerCase().includes(search) ||
      order.customer.toLowerCase().includes(search) ||
      order.phone.toLowerCase().includes(search);
    const matchesFilter = filter === "All" || order.status === filter;
    return matchesSearch && matchesFilter;
  });
  const visibleOrders = compact ? filteredOrders.slice(0, 5) : filteredOrders;
  const selectedOrder = adminOrders.find((order) => order.id === selectedId);
  const liveCount = adminOrders.length;
  const newCount = adminOrders.filter((order) => order.isNew && order.status === "Pending").length;
  const pendingCount = adminOrders.filter((order) => order.status === "Pending").length;
  const processingCount = adminOrders.filter((order) => ["Accepted", "Preparing", "Shipped"].includes(order.status)).length;
  const deliveredCount = adminOrders.filter((order) => order.status === "Delivered").length;

  const setStatus = (order, status) => {
    if (order.source === "live") {
      updateOrderStatus(order.id, status);
    } else {
      setSeedUpdates((current) => ({
        ...current,
        [order.id]: { ...(current[order.id] || {}), status, updatedAt: new Date().toISOString() }
      }));
      showToast(`${order.id} updated to ${status}`);
    }
  };

  return (
    <>
      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h3 className="font-heading text-xl font-semibold">{compact ? "Recent Orders" : "Order Management"}</h3>
          <p className="mt-1 text-sm text-zinc-500">Live ecommerce tracking, fulfillment actions and delivery timelines.</p>
        </div>
        {!compact && (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-lg border border-orange/30 bg-orange/10 px-4 py-3"><div className="text-xs text-orange">New Orders</div><div className="font-heading text-2xl font-bold">{newCount}</div></div>
            <div className="rounded-lg border border-white/10 bg-panel2 px-4 py-3"><div className="text-xs text-zinc-500">Pending Orders</div><div className="font-heading text-2xl font-bold">{pendingCount}</div></div>
            <div className="rounded-lg border border-white/10 bg-panel2 px-4 py-3"><div className="text-xs text-zinc-500">Processing Orders</div><div className="font-heading text-2xl font-bold">{processingCount}</div></div>
            <div className="rounded-lg border border-white/10 bg-panel2 px-4 py-3"><div className="text-xs text-zinc-500">Delivered Orders</div><div className="font-heading text-2xl font-bold">{deliveredCount}</div></div>
          </div>
        )}
      </div>

      {!compact && (
        <div className="mb-5 flex flex-col gap-3 rounded-xl border border-white/10 bg-panel p-4 lg:flex-row lg:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-white/10 bg-panel2 px-3">
            <Search size={16} className="text-zinc-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-zinc-600"
              placeholder="Search orders, customers or phone"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${filter === status ? "border-transparent bg-gradient-to-br from-orange to-ember text-white" : "border-white/10 bg-white/[.04] text-zinc-500 hover:text-white"}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-white/10 bg-panel">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="text-zinc-500">
              <tr>{["Order ID", "Customer", "Module", "Amount", "Status", "ETA", "Action"].map((head) => <th key={head} className="border-b border-white/10 px-4 py-3 font-medium">{head}</th>)}</tr>
            </thead>
            <tbody>
              {visibleOrders.map((order) => (
                <tr
                  key={order.id}
                  tabIndex={0}
                  onClick={() => setSelectedId(order.id)}
                  onKeyDown={(event) => event.key === "Enter" && setSelectedId(order.id)}
                  className={`cursor-pointer transition hover:bg-white/[.05] ${order.isNew && order.status === "Pending" ? "bg-orange/10" : ""}`}
                >
                  <td className="border-b border-white/10 px-4 py-3 font-semibold text-orange">{order.id}</td>
                  <td className="border-b border-white/10 px-4 py-3">
                    <div className="font-medium">{order.customer}</div>
                    {order.isNew && order.status === "Pending" && <div className="mt-1 text-xs font-semibold text-orange">New incoming order</div>}
                  </td>
                  <td className="border-b border-white/10 px-4 py-3">{order.module}</td>
                  <td className="border-b border-white/10 px-4 py-3">{money(order.amount)}</td>
                  <td className="border-b border-white/10 px-4 py-3"><StatusBadge status={order.status} /></td>
                  <td className="border-b border-white/10 px-4 py-3 text-zinc-400">{getEta(order)}</td>
                  <td className="border-b border-white/10 px-4 py-3">
                    <Link href={`/admin/orders/${encodeURIComponent(order.id)}`} onClick={(event) => event.stopPropagation()} className="rounded-lg border border-white/10 bg-white/[.05] px-3 py-2 text-xs font-semibold text-orange hover:border-orange">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedOrder && (
        <OrderDrawer
          order={selectedOrder}
          onClose={() => setSelectedId(null)}
          onStatus={(status) => setStatus(selectedOrder, status)}
        />
      )}
    </>
  );
}

export function AdminOrderDetails({ orderId }) {
  const { orders, updateOrderStatus, showToast } = useApp();
  const [seedUpdates, setSeedUpdates] = useState({});

  useEffect(() => {
    setSeedUpdates(readStorage("titu_admin_order_updates", {}));
  }, []);

  useEffect(() => {
    writeStorage("titu_admin_order_updates", seedUpdates);
  }, [seedUpdates]);

  const adminOrders = [
    ...orders.map(normalizeLiveOrder),
    ...recentOrders.map((order, index) => normalizeSeedOrder(order, index, seedUpdates[order.id]))
  ];
  const decodedId = decodeURIComponent(orderId || "");
  const order = adminOrders.find((item) => item.id === decodedId);

  const setStatus = (status) => {
    if (!order) return;
    if (order.source === "live") {
      updateOrderStatus(order.id, status);
    } else {
      setSeedUpdates((current) => ({
        ...current,
        [order.id]: { ...(current[order.id] || {}), status, updatedAt: new Date().toISOString() }
      }));
      showToast(`${order.id} updated to ${status}`);
    }
  };

  if (!order) {
    return (
      <div className="premium-panel p-8 text-center">
        <h1 className="font-heading text-2xl font-bold">Order Not Found</h1>
        <p className="mt-2 text-sm text-zinc-500">The requested order could not be found in the current admin order list.</p>
        <Link href="/admin/orders" className="mt-5 inline-flex rounded-xl bg-gradient-to-br from-orange to-ember px-5 py-3 text-sm font-bold text-white">Back to Orders</Link>
      </div>
    );
  }

  const actionButtons = [
    ["Accept Order", "Accepted"],
    ["Mark Preparing", "Preparing"],
    ["Mark Shipped", "Shipped"],
    ["Mark Delivered", "Delivered"],
    ["Cancel Order", "Cancelled"]
  ];

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/admin/orders" className="text-sm font-semibold text-orange">Back to Orders</Link>
          <h1 className="mt-2 font-heading text-3xl font-extrabold">{order.id}</h1>
          <p className="mt-1 text-sm text-zinc-500">Order Date: {formatDateTime(order.dateTime, order.date)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <section className="premium-panel p-5">
            <h2 className="mb-4 font-heading text-xl font-bold">Customer Details</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoTile icon={ShoppingBag} label="Customer Name" value={order.customer} />
              <InfoTile icon={Phone} label="Phone Number" value={order.phone} />
              <InfoTile icon={MapPin} label="Address" value={order.address} />
              <InfoTile icon={CreditCard} label="Payment Method" value={order.paymentMethod} />
            </div>
          </section>

          <section className="premium-panel p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-heading text-xl font-bold">Ordered Products</h2>
              <span className="font-heading text-xl font-bold text-orange">{money(order.amount)}</span>
            </div>
            <div className="space-y-3">
              {(order.items || []).map((item) => (
                <div key={`${item.id}-${item.name}`} className="flex gap-3 rounded-xl border border-white/10 bg-white/[.035] p-3">
                  <Image src={item.img || seedImages[0]} alt={item.name} width={64} height={64} className="h-16 w-16 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold">{item.name}</div>
                    <div className="mt-1 text-xs uppercase tracking-wide text-zinc-500">{item.type || order.module}</div>
                    <div className="mt-2 text-sm text-zinc-400">Quantity: {item.qty}</div>
                  </div>
                  <div className="font-bold">{money((item.price || 0) * (item.qty || 1))}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="premium-panel h-fit p-5">
          <h2 className="mb-4 font-heading text-xl font-bold">Current Status</h2>
          <StatusBadge status={order.status} />
          <div className="mt-5 space-y-2">
            {actionButtons.map(([label, status]) => (
              <button
                key={status}
                onClick={() => setStatus(status)}
                disabled={order.status === status}
                className={`w-full rounded-lg border px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${status === "Cancelled" ? "border-rose-500/30 bg-rose-500/10 text-rose-200 hover:bg-rose-500/15" : "border-white/10 bg-white/[.05] text-white hover:border-orange hover:bg-orange/10"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

function OrderDrawer({ order, onClose, onStatus }) {
  const actionButtons = [
    ["Accept Order", "Accepted"],
    ["Mark as Preparing", "Preparing"],
    ["Mark as Shipped", "Shipped"],
    ["Mark as Delivered", "Delivered"],
    ["Cancel Order", "Cancelled"]
  ];
  const currentRank = statusRank[order.status] ?? 0;

  return (
    <div className="fixed inset-0 z-[3500] bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <aside
        className="ml-auto flex h-full w-full max-w-2xl animate-slideIn flex-col border-l border-white/10 bg-panel shadow-glow"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <StatusBadge status={order.status} />
              <StatusBadge status={order.paymentStatus}>{order.paymentStatus}</StatusBadge>
            </div>
            <h3 className="font-heading text-2xl font-bold">{order.id}</h3>
            <p className="mt-1 text-sm text-zinc-500">{formatDateTime(order.dateTime, order.date)}</p>
          </div>
          <button onClick={onClose} className="rounded-lg border border-white/10 bg-panel2 p-2 text-zinc-400 transition hover:text-white" aria-label="Close order details">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="mb-5 grid gap-3 sm:grid-cols-2">
            <InfoTile icon={ShoppingBag} label="Customer" value={order.customer} />
            <InfoTile icon={Phone} label="Phone Number" value={order.phone} />
            <InfoTile icon={CreditCard} label="Payment Method" value={order.paymentMethod} />
            <InfoTile icon={Clock3} label="Delivery ETA" value={getEta(order)} />
          </div>

          <div className="mb-5 rounded-xl border border-white/10 bg-panel2 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><MapPin size={16} className="text-orange" /> Delivery Address</div>
            <p className="text-sm text-zinc-400">{order.address}</p>
          </div>

          <div className="mb-5 rounded-xl border border-white/10 bg-panel2 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="text-sm font-semibold">Ordered Products</div>
              <div className="text-sm font-bold text-orange">{money(order.amount)}</div>
            </div>
            <div className="space-y-3">
              {(order.items || []).map((item) => (
                <div key={`${item.id}-${item.name}`} className="flex gap-3 rounded-lg border border-white/10 bg-panel p-3">
                  <Image src={item.img || seedImages[0]} alt={item.name} width={64} height={64} className="h-16 w-16 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold">{item.name}</div>
                    <div className="mt-1 text-xs uppercase tracking-wide text-zinc-500">{item.type || order.module}</div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-zinc-400">Qty {item.qty}</span>
                      <span className="font-semibold">{money((item.price || 0) * (item.qty || 1))}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-panel2 p-4">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold"><Truck size={16} className="text-orange" /> Order Timeline</div>
            <div className="space-y-4">
              {timelineSteps.map((step, index) => {
                const complete = order.status !== "Cancelled" && index <= currentRank;
                return (
                  <div key={step} className="flex gap-3">
                    <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${complete ? "border-emerald-400 bg-emerald-500/15 text-emerald-300" : "border-white/10 bg-panel text-zinc-500"}`}>
                      {complete ? <CheckCircle2 size={15} /> : <Package size={14} />}
                    </div>
                    <div>
                      <div className={complete ? "font-semibold text-white" : "font-semibold text-zinc-500"}>{step}</div>
                      <div className="text-xs text-zinc-600">{complete ? "Updated in fulfillment flow" : "Waiting for next admin action"}</div>
                    </div>
                  </div>
                );
              })}
              {order.status === "Cancelled" && <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-200">This order has been cancelled.</div>}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 p-5">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="text-zinc-500">Total Amount</span>
            <strong className="text-lg text-orange">{money(order.amount)}</strong>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {actionButtons.map(([label, status]) => (
              <button
                key={status}
                onClick={() => onStatus(status)}
                disabled={order.status === status}
                className={`rounded-lg border px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${status === "Cancelled" ? "border-rose-500/30 bg-rose-500/10 text-rose-200 hover:bg-rose-500/15" : "border-white/10 bg-white/[.05] text-white hover:border-orange hover:bg-orange/10"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

function InfoTile({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-panel2 p-4">
      <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wide text-zinc-500"><Icon size={14} /> {label}</div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}

export function Products() {
  const { products, addProduct, updateProduct, deleteProduct, showToast } = useApp();
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const filtered = products.filter((product) => {
    const value = query.toLowerCase();
    return product.name.toLowerCase().includes(value) || product.cat.toLowerCase().includes(value);
  });

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setFormOpen(true);
  };

  const saveProduct = (payload) => {
    if (editing) updateProduct(editing.id, payload);
    else addProduct(payload);
    setFormOpen(false);
    setEditing(null);
  };

  const removeProduct = (product) => {
    const confirmed = window.confirm(`Delete "${product.name}" from your catalog?`);
    if (!confirmed) return;
    deleteProduct(product.id);
    showToast("Product removed from catalog");
  };

  const activeStock = products.reduce((sum, product) => sum + Number(product.stock || 0), 0);
  const adminProducts = products.filter((product) => product.source === "admin").length;

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold">Product Management</h2>
          <p className="mt-1 text-sm text-zinc-500">Create, edit and manage fashion catalog inventory.</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-orange to-ember px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-orange">
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="premium-panel p-5">
          <div className="text-xs text-zinc-500">Total Products</div>
          <div className="mt-1 font-heading text-3xl font-extrabold">{products.length}</div>
        </div>
        <div className="premium-panel p-5">
          <div className="text-xs text-zinc-500">Available Stock</div>
          <div className="mt-1 font-heading text-3xl font-extrabold">{activeStock}</div>
        </div>
        <div className="premium-panel p-5">
          <div className="text-xs text-zinc-500">Admin Added</div>
          <div className="mt-1 font-heading text-3xl font-extrabold">{adminProducts}</div>
        </div>
      </div>

      <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-white/10 bg-panel p-4 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-panel2 px-3">
          <Search size={16} className="text-zinc-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-zinc-600"
            placeholder="Search by product name or category"
          />
        </div>
        <div className="text-sm text-zinc-500">{filtered.length} products visible</div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} admin onEdit={openEdit} onDelete={removeProduct} />
        ))}
      </div>

      <ProductForm open={formOpen} product={editing} onClose={() => setFormOpen(false)} onSubmit={saveProduct} />
    </>
  );
}

export function RestaurantProducts() {
  const { foods, addFood, updateFood, deleteFood, showToast } = useApp();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const filtered = foods.filter((food) => {
    const q = query.toLowerCase();
    const matchesSearch = food.name.toLowerCase().includes(q) || food.desc.toLowerCase().includes(q) || (food.category || "").toLowerCase().includes(q);
    const matchesFilter =
      filter === "All" ||
      (filter === "Veg" && food.tags.includes("veg")) ||
      (filter === "Non-Veg" && food.tags.includes("non-veg")) ||
      (filter === "Popular" && food.tags.includes("popular")) ||
      (filter === "Spicy" && food.tags.includes("spicy"));
    return matchesSearch && matchesFilter;
  });

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (food) => {
    setEditing(food);
    setFormOpen(true);
  };

  const saveFood = (payload) => {
    if (editing) updateFood(editing.id, payload);
    else addFood(payload);
    setFormOpen(false);
    setEditing(null);
  };

  const removeFood = (food) => {
    const confirmed = window.confirm(`Delete "${food.name}" from your restaurant menu?`);
    if (!confirmed) return;
    deleteFood(food.id);
    showToast("Dish removed from menu");
  };

  const vegCount = foods.filter((food) => food.tags.includes("veg")).length;
  const nonVegCount = foods.filter((food) => food.tags.includes("non-veg")).length;
  const popularCount = foods.filter((food) => food.tags.includes("popular")).length;

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold">Restaurant Products</h2>
          <p className="mt-1 text-sm text-zinc-500">Manage dishes, tags, menu pricing and delivery promises.</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-orange to-ember px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-orange">
          <Plus size={18} /> Add Food Item
        </button>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Dishes" value={foods.length} change="Live restaurant catalog" />
        <MetricCard label="Veg Items" value={vegCount} change="Available for veg filters" />
        <MetricCard label="Non-Veg Items" value={nonVegCount} change="Available for non-veg filters" />
        <MetricCard label="Popular Items" value={popularCount} change="Highlighted on storefront" />
      </div>

      <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-white/10 bg-panel p-4 lg:flex-row lg:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-panel2 px-3">
          <Search size={16} className="text-zinc-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-zinc-600"
            placeholder="Search dishes, category or description"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {["All", "Veg", "Non-Veg", "Popular", "Spicy"].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${filter === item ? "border-transparent bg-gradient-to-br from-orange to-ember text-white" : "border-white/10 bg-white/[.04] text-zinc-500 hover:text-white"}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {filtered.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((food) => (
            <FoodCard key={food.id} food={food} admin onEdit={openEdit} onDelete={removeFood} />
          ))}
        </div>
      ) : (
        <div className="premium-panel py-14 text-center">
          <div className="font-heading text-lg font-bold">No dishes found</div>
          <p className="mt-1 text-sm text-zinc-500">Try a different filter or add a new food item.</p>
        </div>
      )}

      <FoodForm open={formOpen} food={editing} onClose={() => setFormOpen(false)} onSubmit={saveFood} />
    </>
  );
}

function Sellers() {
  return (
    <>
      <h2 className="mb-5 font-heading text-2xl font-bold">Seller Management</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sellers.map((seller) => (
          <div key={seller.name} className="premium-panel p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange to-ember font-bold">{seller.name[0]}</div>
              <div><div className="font-semibold">{seller.name}</div><div className="text-xs text-zinc-500">{seller.category}</div></div>
            </div>
            <div className="flex justify-between text-sm text-zinc-500"><span>Revenue</span><strong className="text-white">{money(seller.revenue)}</strong></div>
            <div className="mt-3 flex justify-between text-sm text-zinc-500"><span>Status</span><StatusBadge status="Delivered">Active</StatusBadge></div>
          </div>
        ))}
      </div>
    </>
  );
}

function Analytics() {
  const rows = [["Fashion", 72, 210000], ["Food", 20, 58000], ["Print", 8, 23000]];
  return (
    <>
      <h2 className="mb-5 font-heading text-2xl font-bold">Analytics</h2>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Fashion Revenue" value="₹2.1L" change="↑ 18%" />
        <MetricCard label="Food Orders" value="847" change="↑ 35%" />
        <MetricCard label="Print Jobs" value="234" change="↑ 12%" />
        <MetricCard label="Conversion Rate" value="3.8%" change="↑ 0.4%" />
      </div>
      <div className="premium-panel p-6">
        <h3 className="mb-5 font-semibold">Revenue by Module</h3>
        <div className="space-y-4">
          {rows.map(([name, percent, value]) => (
            <div key={name}>
              <div className="mb-2 flex justify-between text-sm"><span>{name}</span><span className="font-semibold text-orange">{money(value)} ({percent}%)</span></div>
              <div className="h-2 overflow-hidden rounded-full bg-panel2"><div className="h-full rounded-full bg-gradient-to-r from-orange to-ember" style={{ width: `${percent}%` }} /></div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
