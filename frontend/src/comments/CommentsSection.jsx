import { useState } from "react";
import {
  useGetCommentsQuery,
  useAddCommentMutation,
  useDeleteCommentMutation,
} from "@/api/commentsAPI";
import { useSelector } from "react-redux";

export default function CommentsSection({ postId }) {
  const { user } = useSelector((state) => state.auth);
  const [text, setText] = useState("");

  const { data: comments = [] } = useGetCommentsQuery(postId);
  const [addComment] = useAddCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const submit = async () => {
    if (!text.trim()) return;
    await addComment({ postId, content: text });
    setText("");
  };

  return (
    <section className="mt-16">
      <h2 className="text-xl font-semibold mb-4">
        Comments ({comments.length})
      </h2>

      {/* Add comment */}
      {user ? (
        <div className="mb-6">
          <textarea
            className="w-full border rounded-lg p-3"
            rows="3"
            placeholder="Write a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            onClick={submit}
            className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-lg"
          >
            Post comment
          </button>
        </div>
      ) : (
        <p className="text-gray-500">Log in to comment.</p>
      )}

      {/* Comment list */}
      <ul className="space-y-4">
        {comments.map((c) => (
          <li key={c._id} className="border rounded-lg p-4">
            <div className="flex justify-between">
              <strong>{c.user?.name || "User"}</strong>
              {user?.id === c.user?._id && (
                <button
                  onClick={() => deleteComment(c._id)}
                  className="text-sm text-red-500"
                >
                  Delete
                </button>
              )}
            </div>
            <p className="mt-2 text-gray-700">{c.content}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
