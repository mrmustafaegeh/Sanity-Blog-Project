import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "medium",
      loading = false,
      disabled = false,
      className = "",
      icon: Icon,
      iconPosition = "left",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-primary text-white hover:bg-neutral-800 focus:ring-neutral-500",
      secondary:
        "bg-white text-secondary border border-border hover:bg-neutral-50 hover:border-neutral-300 focus:ring-neutral-200",
      ghost:
        "bg-transparent text-secondary hover:bg-neutral-100 hover:text-primary focus:ring-neutral-200",
      danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
      outline: "bg-transparent border border-primary text-primary hover:bg-primary hover:text-white",
    };

    const sizes = {
      small: "px-3 py-1.5 text-xs",
      medium: "px-5 py-2.5 text-sm",
      large: "px-8 py-3.5 text-base",
    };

    const classes = twMerge(
      clsx(baseStyles, variants[variant], sizes[size], className)
    );

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {!loading && Icon && iconPosition === "left" && (
          <Icon className="w-4 h-4 mr-2" />
        )}
        {children}
        {!loading && Icon && iconPosition === "right" && (
          <Icon className="w-4 h-4 ml-2" />
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
