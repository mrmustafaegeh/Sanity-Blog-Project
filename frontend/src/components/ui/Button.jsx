// frontend/src/components/ui/Button.jsx
import { forwardRef } from "react";
import { Loader2 } from "lucide-react";

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
      "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-gradient-to-r from-emerald-500 to-teal-400 text-white hover:shadow-lg hover:scale-105 focus:ring-emerald-500",
      secondary:
        "bg-white text-gray-700 border border-gray-300 hover:border-emerald-300 hover:bg-emerald-50 focus:ring-emerald-300",
      ghost:
        "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-300",
      danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    };

    const sizes = {
      small: "px-3 py-1.5 text-sm",
      medium: "px-5 py-2.5 text-sm",
      large: "px-6 py-3 text-base",
    };

    return (
      <button
        ref={ref}
        className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
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
