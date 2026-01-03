export default function AISummaryHistory({ history }) {
  if (!history?.length) return null;

  return (
    <div className="mt-8 space-y-3">
      <h3 className="font-semibold">AI Summary History</h3>

      {history.map((h, i) => (
        <div key={i} className="bg-gray-100 p-3 rounded text-sm">
          <p>{h.summary}</p>
          <span className="text-xs text-gray-500">
            {new Date(h.createdAt).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}
