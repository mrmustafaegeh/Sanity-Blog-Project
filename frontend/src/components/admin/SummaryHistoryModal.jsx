export default function SummaryHistoryModal({ history, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded max-w-lg w-full">
        <h3 className="font-bold mb-4">AI Summary History</h3>

        <ul className="space-y-3">
          {history.map((item, index) => (
            <li key={index} className="border p-3 rounded">
              <p className="text-sm">{item.summary}</p>
              <span className="text-xs text-gray-500">
                {new Date(item.createdAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>

        <button
          onClick={onClose}
          className="mt-4 px-3 py-1 bg-black text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}
