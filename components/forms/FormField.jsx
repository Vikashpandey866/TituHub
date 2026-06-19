export default function FormField({ label, error, children }) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between gap-3 text-sm text-zinc-400">
        <span>{label}</span>
        {error && <span className="text-xs font-semibold text-ember">{error}</span>}
      </div>
      {children}
    </label>
  );
}
