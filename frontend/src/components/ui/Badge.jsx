import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export default function Badge({
  children,
  variant = "neutral",
  size = "md",
  className,
}) {
  const variants = {
    neutral: "bg-neutral-100 text-neutral-600",
    primary: "bg-primary text-white",
    outline: "bg-transparent border border-border text-neutral-600",
    success: "bg-green-50 text-green-700",
    warning: "bg-amber-50 text-amber-700",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-0.5 text-xs",
  };

  const classes = twMerge(
    clsx(
      "inline-flex items-center font-medium rounded-full uppercase tracking-wider",
      variants[variant],
      sizes[size],
      className
    )
  );

  return <span className={classes}>{children}</span>;
}
