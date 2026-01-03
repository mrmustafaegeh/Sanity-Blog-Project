// frontend/src/components/ui/Card.jsx
export default function Card({
  children,
  className = "",
  hoverable = false,
  padding = "p-6",
}) {
  return (
    <div
      className={`
        bg-white rounded-2xl border border-gray-200
        ${hoverable ? "hover:border-emerald-300 hover:shadow-lg transition-all duration-300" : ""}
        ${padding}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
