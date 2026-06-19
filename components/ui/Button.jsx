import { cloneElement } from "react";
import { cn } from "@/lib/format";

export function Button({ children, className, variant = "primary", asChild = false, ...props }) {
  const variants = {
    primary: "bg-gradient-to-br from-orange to-ember text-white hover:-translate-y-0.5 hover:shadow-orange",
    ghost: "border border-white/15 bg-white/[.04] text-white hover:border-orange hover:bg-white/[.08]",
    subtle: "border border-white/10 bg-panel2 text-white hover:border-orange"
  };

  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50",
    variants[variant],
    className
  );

  if (asChild) {
    return cloneElement(children, {
      className: cn(children.props.className, classes),
      ...props
    });
  }

  return <button className={classes} {...props}>{children}</button>;
}
