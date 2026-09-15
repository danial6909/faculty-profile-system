const VARIANTS = {
  primary:
    "bg-brand text-brand-foreground hover:opacity-90 shadow-card",
  secondary:
    "bg-secondary-50 text-secondary-700 hover:bg-secondary-100",
  inverted:
    "bg-white text-brand hover:bg-neutral-50 shadow-card",
  outlined:
    "bg-transparent text-neutral-700 border border-neutral-300 hover:bg-neutral-50",
  ghost: "bg-transparent text-neutral-600 hover:bg-neutral-100",
};

const SIZES = {
  sm: "text-xs px-3 py-1.5 gap-1.5",
  md: "text-sm px-4 py-2 gap-2",
  lg: "text-sm px-5 py-2.5 gap-2",
};

/**
 * Design-system button.
 * variant: "primary" | "secondary" | "inverted" | "outlined" | "ghost"
 * All variants key off the --color-brand / --color-secondary-* tokens,
 * so per-professor theming (see globals.css) flows through automatically.
 */
export default function Button({
  as: Component = "button",
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  return (
    <Component
      className={`inline-flex items-center justify-center rounded-full font-medium transition-colors duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
