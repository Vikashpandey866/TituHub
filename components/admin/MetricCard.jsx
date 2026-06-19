export default function MetricCard({ label, value, change }) {
  return (
    <div className="premium-panel p-5">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="my-1 font-heading text-3xl font-extrabold">{value}</div>
      <div className="text-xs text-emerald-400">{change}</div>
    </div>
  );
}
