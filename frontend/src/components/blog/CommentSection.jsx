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
  Loader2,
  CornerDownRight
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import { getOptimizedUrl } from "../../utils/imageOptimizer";

const CommentItem = ({ comment, user, onLike, onDelete, isLiking }) => {
  const isLiked = comment.likes?.includes(user?._id);

  return (
    <div className="group flex gap-4 p-6 bg-white rounded-2xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
      <div className="flex-shrink-0">
        <img
          src={
            comment.author?.image?.url 
              ? getOptimizedUrl(comment.author.image.url, 100)
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author?.name || "User")}&background=10b981&color=fff`
          }
          alt={comment.author?.name}
          className="w-12 h-12 rounded-xl border-2 border-white shadow-md group-hover:scale-105 transition-transform duration-300 object-cover"
        />
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-gray-900 text-lg">{comment.author?.name || "Anonymous"}</h4>
            <span className="text-xs text-gray-400 font-medium">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
          </div>
          
          {user?._id === comment.author?._id && (
            <button 
              onClick={() => onDelete(comment._id)}
              className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
              title="Delete comment"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
        
        <p className="text-gray-600 leading-relaxed text-base">
          {comment.content}
        </p>

        <div className="flex items-center gap-4 pt-2">
          <button 
            onClick={() => onLike(comment._id)}
            disabled={isLiking}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              isLiked
                ? "bg-red-50 text-red-500 shadow-sm" 
                : "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-red-500"
            }`}
          >
            <Heart size={16} className={`transition-transform ${isLiked ? "fill-red-500 scale-110" : "group-hover:scale-110"}`} />
            <span>{comment.likesCount || comment.likes?.length || 0}</span>
          </button>
          
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all">
            <CornerDownRight size={16} />
            Reply
          </button>
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
    <div className="mt-16 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl shadow-sm">
          <MessageCircle size={28} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">
          Discussion <span className="text-gray-400 font-normal ml-2 text-xl">{comments.length}</span>
        </h2>
      </div>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-12 relative group z-10">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl opacity-20 group-hover:opacity-30 blur transition duration-500"></div>
          <div className="relative bg-white rounded-2xl p-2 shadow-xl">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="What are your thoughts?"
              className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-0 text-gray-700 placeholder-gray-400 min-h-[120px] resize-none shadow-inner text-lg"
            />
            <div className="flex justify-between items-center px-4 pb-2 pt-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Markdown supported</span>
              <button
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 shadow-lg shadow-gray-900/20 active:translate-y-0"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <span className="font-bold">Post Comment</span>
                    <Send size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-12 p-8 bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-emerald-100 rounded-full blur-3xl opacity-50"></div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Join the conversation</h3>
          <p className="text-gray-500 mb-6">Share your thoughts and connect with other readers.</p>
          <Link
            to="/login"
            state={{ from: window.location.pathname }}
            className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all hover:-translate-y-0.5 shadow-lg shadow-emerald-600/20 font-bold"
          >
            Sign In to Comment
          </Link>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
        </div>
      ) : isError ? (
        <div className="p-6 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-center">
          <p className="font-medium">Failed to load comments. Please try again later.</p>
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-6">
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
        <div className="text-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-gray-300">
             <MessageCircle size={32} />
          </div>
          <p className="text-gray-900 font-bold text-lg">No comments yet</p>
          <p className="text-gray-500">Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  );
}
