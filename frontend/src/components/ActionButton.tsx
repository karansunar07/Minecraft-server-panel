import { clsx } from "clsx";

type Variant = "primary" | "secondary" | "danger" | "ghost";

const variants: Record<Variant, string> = {
  primary: "bg-panel-primary text-white hover:brightness-110 focus:ring-panel-primary/50",
  secondary: "bg-slate-800 text-white hover:bg-slate-700 focus:ring-slate-500/50",
  danger: "bg-panel-danger text-white hover:brightness-110 focus:ring-red-500/50",
  ghost: "bg-transparent text-slate-200 hover:bg-white/5 focus:ring-white/20"
};

export function ActionButton({
  children,
  variant = "secondary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={clsx(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] px-5 text-sm font-bold transition focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
