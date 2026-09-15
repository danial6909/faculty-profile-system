const TONES = {
  primary: "bg-primary-50 text-primary-700",
  secondary: "bg-secondary-50 text-secondary-700",
  tertiary: "bg-tertiary-50 text-tertiary-800",
  neutral: "bg-neutral-100 text-neutral-600",
};

export default function Badge({ tone = "neutral", className = "", children }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
