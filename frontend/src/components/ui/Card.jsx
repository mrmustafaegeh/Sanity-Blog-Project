import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export default function Card({
  children,
  className = "",
  hoverable = false,
  padding = "p-6",
}) {
  const classes = twMerge(
    clsx(
      "bg-surface rounded-xl border border-border overflow-hidden",
      hoverable && "hover:border-neutral-300 transition-colors duration-200",
      padding,
      className
    )
  );

  return <div className={classes}>{children}</div>;
}
