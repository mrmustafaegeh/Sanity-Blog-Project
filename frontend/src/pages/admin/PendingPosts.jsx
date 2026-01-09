// frontend/src/pages/admin/PendingPosts.jsx
import { useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetPendingSubmissionsQuery,
  useApproveSubmissionMutation,
  useRejectSubmissionMutation,
} from "../../api/submissionsAPI";
import { toast } from "react-toastify";
import { Eye, Check, X, Clock, User, Calendar, Tag } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function PendingPosts() {
  const { user } = useSelector((state) => state.auth);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  const {
    data: pendingData,
    isLoading,
    refetch,
  } = useGetPendingSubmissionsQuery();
  const [approveSubmission, { isLoading: isApproving }] =
    useApproveSubmissionMutation();
  const [rejectSubmission, { isLoading: isRejecting }] =
    useRejectSubmissionMutation();

  const handleApprove = async (submissionId) => {
    if (!window.confirm("Approve this submission and publish to Sanity?"))
      return;

    try {
      await approveSubmission(submissionId).unwrap();
      toast.success("Submission approved and published!");
      refetch();
    } catch (error) {
      console.error("Approval error:", error);
      toast.error(error?.data?.message || "Failed to approve submission");
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      await rejectSubmission({
        submissionId: selectedSubmission._id,
        reason: rejectReason,
      }).unwrap();

      toast.success("Submission rejected");
      setShowRejectModal(false);
      setRejectReason("");
      setSelectedSubmission(null);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to reject submission");
    }
  };

  // Check if user is admin
  if (!user?.isAdmin && user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">Admin permissions required.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pending submissions...</p>
        </div>
      </div>
    );
  }

  const submissions = pendingData || [];

  console.log("📦 Pending submissions data:", submissions);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pending Submissions
          </h1>
          <p className="text-gray-600">
            Review and approve user-submitted posts from MongoDB
          </p>
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg">
              <Clock className="w-5 h-5 mr-2" />
              <span className="font-medium">{submissions.length} Pending</span>
            </div>
            <div className="text-sm text-gray-600">
              These submissions are stored in MongoDB and will be published to
              Sanity upon approval
            </div>
          </div>
        </div>

        {/* Submissions List */}
        {submissions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Pending Submissions
            </h3>
            <p className="text-gray-600">All submissions have been reviewed!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div
                key={submission._id}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                {/* Submission Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {submission.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      {/* Author Info */}
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {submission.userId?.name || "Unknown User"}
                        <span className="ml-2 text-gray-400">
                          ({submission.userId?.email || "No email"})
                        </span>
                      </div>

                      {/* Submission Date */}
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDistanceToNow(new Date(submission.submittedAt), {
                          addSuffix: true,
                        })}
                      </div>

                      {/* Reading Time */}
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {submission.readingTime || 5} min read
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className="inline-flex items-center px-3 py-1.5 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                    <Clock className="w-3 h-3 mr-1" />
                    Pending Review
                  </span>
                </div>

                {/* Excerpt */}
                {submission.excerpt && (
                  <p className="text-gray-700 mb-4 line-clamp-2 italic border-l-4 border-yellow-400 pl-4 py-1">
                    "{submission.excerpt}"
                  </p>
                )}

                {/* Tags & Categories */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {submission.tags?.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}

                  {submission.categories?.length > 0 && (
                    <div className="text-xs text-gray-500">
                      Categories: {submission.categories.length}
                    </div>
                  )}
                </div>

                {/* Difficulty & Stats */}
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <span
                    className={`px-2 py-1 rounded ${
                      submission.difficulty === "beginner"
                        ? "bg-green-100 text-green-800"
                        : submission.difficulty === "intermediate"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {submission.difficulty?.charAt(0).toUpperCase() +
                      submission.difficulty?.slice(1) || "Beginner"}
                  </span>
                  <span>Content: {submission.content?.length || 0} chars</span>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3 pt-4 border-t">
                  <button
                    onClick={() => setSelectedSubmission(submission)}
                    className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Content
                  </button>

                  <button
                    onClick={() => handleApprove(submission._id)}
                    disabled={isApproving}
                    className="flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 transition-colors"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    {isApproving ? "Approving..." : "Approve & Publish"}
                  </button>

                  <button
                    onClick={() => {
                      setSelectedSubmission(submission);
                      setShowRejectModal(true);
                    }}
                    disabled={isRejecting}
                    className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {selectedSubmission && !showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedSubmission.title}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Submitted by {selectedSubmission.userId?.name || "Unknown"} •{" "}
                  {formatDistanceToNow(
                    new Date(selectedSubmission.submittedAt),
                    { addSuffix: true }
                  )}
                </p>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {selectedSubmission.excerpt && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Excerpt:</h3>
                <p className="text-blue-700 italic">
                  "{selectedSubmission.excerpt}"
                </p>
              </div>
            )}

            <div className="prose max-w-none">
              <div
                dangerouslySetInnerHTML={{ __html: selectedSubmission.content }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Reject Submission
            </h3>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Title:</span>{" "}
              {selectedSubmission?.title}
            </p>
            <p className="text-gray-600 mb-4">
              <span className="font-medium">Author:</span>{" "}
              {selectedSubmission?.userId?.name || "Unknown"}
            </p>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting this submission. The author
              will see this message.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows={4}
              placeholder="Explain why this submission is being rejected..."
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={isRejecting || !rejectReason.trim()}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
              >
                {isRejecting ? "Rejecting..." : "Reject Submission"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
