import { useRegenerateSummaryMutation } from "../../api/adminAPI";
import { useState } from "react";
import SummaryHistoryModal from "./SummaryHistoryModal";

export default function AdminPostCard({ post }) {
  const [regenerateSummary, { isLoading }] = useRegenerateSummaryMutation();

  const [showHistory, setShowHistory] = useState(false);

  const handleRegenerate = async () => {
    await regenerateSummary({
      postId: post._id,
      token: localStorage.getItem("adminToken"),
      summary: "Regenerated summary will be injected here",
    });
  };

  return (
    <div className="border rounded p-4 bg-white">
      <h2 className="font-semibold">{post.title}</h2>

      <p className="text-sm text-gray-600 mt-2">
        {post.aiSummary || "No AI summary yet"}
      </p>

      <div className="flex gap-3 mt-4">
        <button
          onClick={handleRegenerate}
          disabled={isLoading}
          className="px-3 py-1 bg-black text-white rounded"
        >
          {isLoading ? "Generating..." : "Regenerate Summary"}
        </button>

        {post.aiSummaryHistory?.length > 0 && (
          <button
            onClick={() => setShowHistory(true)}
            className="text-sm underline"
          >
            View History
          </button>
        )}
      </div>

      {showHistory && (
        <SummaryHistoryModal
          history={post.aiSummaryHistory}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}
