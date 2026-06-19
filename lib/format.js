export function money(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function makeOrderId() {
  return `#TH-${Math.floor(Math.random() * 90000 + 10000)}`;
}
