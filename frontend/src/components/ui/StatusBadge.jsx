// frontend/src/components/StatusBadge.jsx
export default function StatusBadge({ status, size = "md" }) {
  const statusConfig = {
    draft: {
      label: "Draft",
      color: "bg-gray-100 text-gray-800 border-gray-300",
      dot: "bg-gray-400",
    },
    pending: {
      label: "Pending Review",
      color: "bg-yellow-100 text-yellow-800 border-yellow-300",
      dot: "bg-yellow-400",
    },
    published: {
      label: "Published",
      color: "bg-green-100 text-green-800 border-green-300",
      dot: "bg-green-400",
    },
    rejected: {
      label: "Rejected",
      color: "bg-red-100 text-red-800 border-red-300",
      dot: "bg-red-400",
    },
  };

  const config = statusConfig[status] || statusConfig.draft;

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.color} ${sizes[size]} font-medium`}
    >
      <span className={`w-2 h-2 rounded-full mr-2 ${config.dot}`}></span>
      {config.label}
    </span>
  );
}
