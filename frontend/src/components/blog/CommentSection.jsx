// frontend/src/components/blog/CommentSection.jsx
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { 
  useGetCommentsQuery, 
  useAddCommentMutation,
  useDeleteCommentMutation,
  useLikeCommentMutation
} from "../../api/commentsAPI";
import { 
  MessageCircle, 
  Send, 
  Trash2, 
  Heart, 
  MoreVertical,
  AlertCircle,
  Loader2
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";

const CommentItem = ({ comment, user, onLike, onDelete, isLiking }) => {
  return (
    <div className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
      <img
        src={comment.author?.image?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author?.name || "User")}&background=10b981&color=fff`}
        alt={comment.author?.name}
        className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
      />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-bold text-gray-900">{comment.author?.name || "Anonymous"}</h4>
          <span className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </span>
        </div>
        <p className="text-gray-700 leading-relaxed mb-3">
          {comment.content}
        </p>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onLike(comment._id)}
            disabled={isLiking}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
              comment.likes?.includes(user?._id) 
                ? "text-red-500" 
                : "text-gray-500 hover:text-red-500"
            }`}
          >
            <Heart size={14} className={comment.likes?.includes(user?._id) ? "fill-red-500" : ""} />
            <span>{comment.likesCount || comment.likes?.length || 0}</span>
          </button>
          
          {user?._id === comment.author?._id && (
            <button 
              onClick={() => onDelete(comment._id)}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function CommentSection({ postId }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [newComment, setNewComment] = useState("");
  
  const { data: comments = [], isLoading, isError } = useGetCommentsQuery(postId);
  const [addComment, { isLoading: isSubmitting }] = useAddCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [likeComment, { isLoading: isLiking }] = useLikeCommentMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await addComment({ postId, content: newComment }).unwrap();
      setNewComment("");
      toast.success("Comment added!");
    } catch {
      toast.error("Failed to add comment");
    }
  };

  const handleLike = async (commentId) => {
    if (!isAuthenticated) {
      toast.info("Please sign in to like comments");
      return;
    }
    try {
      await likeComment(commentId).unwrap();
    } catch {
      toast.error("Error liking comment");
    }
  };

  const handleDelete = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await deleteComment(commentId).unwrap();
        toast.success("Comment deleted");
      } catch {
        toast.error("Failed to delete comment");
      }
    }
  };

  return (
    <div className="mt-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
          <MessageCircle size={24} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Comments ({comments.length})
        </h2>
      </div>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-10">
          <div className="relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="What are your thoughts on this article?"
              className="w-full p-4 pr-12 border-2 border-gray-100 rounded-2xl focus:border-emerald-500 focus:outline-none transition-colors min-h-[120px] resize-none text-gray-700"
            />
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="absolute bottom-4 right-4 p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-110 active:scale-95 shadow-lg"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-10 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl text-center">
          <p className="text-emerald-800 mb-4 font-medium">Join the discussion</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all hover:scale-105 shadow-md"
          >
            Sign In to Comment
          </Link>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      ) : isError ? (
        <div className="flex items-center gap-2 text-red-500 py-10 justify-center">
          <AlertCircle size={20} />
          <span>Error loading comments</span>
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem 
              key={comment._id} 
              comment={comment} 
              user={user} 
              onLike={handleLike}
              onDelete={handleDelete}
              isLiking={isLiking}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500">No comments yet. Be the first to start the conversation!</p>
        </div>
      )}
    </div>
  );
}
