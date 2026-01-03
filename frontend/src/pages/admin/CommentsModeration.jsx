import {
  useGetAdminCommentsQuery,
  useApproveCommentMutation,
} from "@/api/commentsAPI";

export default function CommentsModeration() {
  const { data: comments } = useGetAdminCommentsQuery();
  const [approve] = useApproveCommentMutation();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Moderate Comments</h1>

      {comments?.map((c) => (
        <div key={c._id} className="border p-4 mb-4 rounded">
          <p className="font-medium">{c.user?.name}</p>
          <p className="text-gray-600">{c.content}</p>

          {!c.isApproved && (
            <button
              onClick={() => approve(c._id)}
              className="mt-2 px-4 py-1 bg-emerald-600 text-white rounded"
            >
              Approve
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
