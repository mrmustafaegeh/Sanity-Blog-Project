// frontend/src/comments/CommentsSection.jsx
import { useState } from "react";
import {
  useGetCommentsQuery,
  useAddCommentMutation,
  useDeleteCommentMutation,
} from "../api/commentsAPI";
import { useSelector } from "react-redux";
import { MessageSquare, Trash2, Send, Loader2 } from "lucide-react";

export default function CommentsSection({ postId }) {
  const { user } = useSelector((state) => state.auth);
  const [text, setText] = useState("");

  const { data: comments = [], isLoading } = useGetCommentsQuery(postId);
  const [addComment, { isLoading: isAdding }] = useAddCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await addComment({ postId, content: text }).unwrap();
      setText("");
    } catch (error) {
      console.error("Failed to add comment:", error);
      alert("Failed to post comment. Please try again.");
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      await deleteComment(commentId).unwrap();
    } catch (error) {
      console.error("Failed to delete comment:", error);
      alert("Failed to delete comment. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <section className="mt-16">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          <span className="ml-2 text-gray-600">Loading comments...</span>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-16">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-6 h-6 text-emerald-600" />
        <h2 className="text-2xl font-bold text-gray-900">
          Comments ({comments.length})
        </h2>
      </div>

      {/* Add Comment Form */}
      {user ? (
        <div className="mb-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
          <form onSubmit={handleSubmit}>
            <div className="flex items-start gap-3">
              {/* User Avatar */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
              </div>

              {/* Input Area */}
              <div className="flex-1">
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  rows="3"
                  placeholder="Share your thoughts..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  disabled={isAdding}
                />
                <div className="flex justify-between items-center mt-3">
                  <p className="text-sm text-gray-500">
                    {text.length}/2000 characters
                  </p>
                  <button
                    type="submit"
                    disabled={!text.trim() || isAdding}
                    className="flex items-center gap-2 px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAdding ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Post Comment
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="mb-8 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200 text-center">
          <MessageSquare className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
          <p className="text-gray-700 mb-4">
            Join the conversation! Log in to share your thoughts.
          </p>
          <a
            href="/login"
            className="inline-block px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Log In to Comment
          </a>
        </div>
      )}

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                {/* Author Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold">
                    {comment.author?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                </div>

                {/* Comment Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {comment.author?.name || "Anonymous User"}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>

                    {/* Delete Button (only for comment owner) */}
                    {user?.id === comment.author?._id && (
                      <button
                        onClick={() => handleDelete(comment._id)}
                        className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete comment"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    )}
                  </div>

                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 text-lg font-medium">No comments yet</p>
          <p className="text-gray-500 text-sm mt-1">
            Be the first to share your thoughts!
          </p>
        </div>
      )}
    </section>
  );
}
