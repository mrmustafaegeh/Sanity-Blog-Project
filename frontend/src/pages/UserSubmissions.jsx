import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  useGetUserSubmissionsQuery,
  useDeleteSubmissionMutation,
} from "../api/submissionsAPI";
import { toast } from "react-toastify";
import {
  Trash2,
  Eye,
  Edit,
  AlertCircle,
  Clock,
  Check,
  X,
  PlusCircle,
  RefreshCw,
} from "lucide-react";

// Status configuration constants
const STATUS_CONFIG = {
  approved: {
    color: "bg-green-100 text-green-800 border-green-300",
    icon: <Check className="w-3 h-3 mr-1" />,
    label: "Approved",
  },
  pending: {
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
    icon: <Clock className="w-3 h-3 mr-1" />,
    label: "Pending Review",
  },
  rejected: {
    color: "bg-red-100 text-red-800 border-red-300",
    icon: <X className="w-3 h-3 mr-1" />,
    label: "Rejected",
  },
};

const LoadingState = () => (
  <div className="p-8 text-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
    <p className="text-gray-600">Loading your submissions...</p>
  </div>
);

const ErrorState = ({ error, onRetry }) => (
  <div className="p-8 text-center">
    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
    <p className="text-red-600 mb-4">
      Error loading submissions:{" "}
      {error?.data?.message || error?.message || "Unknown error"}
    </p>
    <button
      onClick={onRetry}
      className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 flex items-center mx-auto"
    >
      <RefreshCw className="w-4 h-4 mr-2" />
      Retry
    </button>
  </div>
);

const EmptyState = ({ onNavigate }) => (
  <div className="p-12 text-center">
    <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      No Submissions Yet
    </h3>
    <p className="text-gray-600 mb-6">You haven't submitted any posts yet.</p>
    <button
      onClick={onNavigate}
      className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center mx-auto"
    >
      <PlusCircle className="w-5 h-5 mr-2" />
      Submit Your First Post
    </button>
  </div>
);

const AuthRequiredState = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600 mb-4">
          Please login to view your submissions
        </p>
        <button
          onClick={() => navigate("/login")}
          className="text-emerald-500 hover:underline"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

const UserIdMissingState = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 mb-4">
          User ID not found. Please log in again.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="text-emerald-500 hover:underline"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

// ✅ Extract slug from whatever shape you store it in
const getSubmissionSlug = (submission) => {
  // Most common shapes:
  // - sanitySlug: "my-post"
  // - sanitySlug: { current: "my-post" }
  // - slug: { current: "my-post" }
  // - slug: "my-post"
  return (
    submission?.sanitySlug?.current ||
    submission?.sanitySlug ||
    submission?.slug?.current ||
    submission?.slug ||
    null
  );
};

const SubmissionRow = ({ submission, onDelete, onNavigate, isDeleting }) => {
  const statusConfig = STATUS_CONFIG[submission.status] || {
    color: "bg-gray-100 text-gray-800 border-gray-300",
    icon: null,
    label: submission.status,
  };

  const slug = getSubmissionSlug(submission);
  const blogLink = slug ? `/blog/${encodeURIComponent(slug)}` : null;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-gray-900">
          {submission.title}
        </div>

        {submission.excerpt && (
          <div className="text-xs text-gray-500 mt-1 line-clamp-2">
            {submission.excerpt}
          </div>
        )}

        {submission.rejectionReason && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
            <p className="text-xs font-medium text-red-800 mb-1">
              Rejection Reason:
            </p>
            <p className="text-xs text-red-700">{submission.rejectionReason}</p>
          </div>
        )}

        {/* Debug helper (optional) */}
        {/* <div className="mt-2 text-[11px] text-gray-400">slug: {String(slug)}</div> */}
      </td>

      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}
        >
          {statusConfig.icon}
          {statusConfig.label}
        </span>
      </td>

      <td className="px-6 py-4 text-sm text-gray-500">
        {formatDate(submission.submittedAt)}
      </td>

      <td className="px-6 py-4 text-sm text-gray-500">
        {submission.readingTime || 5} min
      </td>

      <td className="px-6 py-4 text-sm">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate(`/submissions/${submission._id}`)}
            className="text-emerald-600 hover:text-emerald-800 flex items-center"
            title="View submission details"
          >
            <Eye className="w-4 h-4" />
          </button>

          {submission.status === "rejected" && (
            <button
              onClick={() => onNavigate(`/submit?edit=${submission._id}`)}
              className="text-blue-600 hover:text-blue-800 flex items-center"
              title="Edit & Resubmit"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}

          {(submission.status === "pending" ||
            submission.status === "rejected") && (
            <button
              onClick={() => onDelete(submission._id)}
              disabled={isDeleting}
              className="text-red-600 hover:text-red-800 flex items-center disabled:opacity-50"
              title="Delete submission"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          {/* ✅ FIX: Only route you have is /blog/:slug */}
          {submission.status === "approved" && blogLink ? (
            <Link
              to={blogLink}
              className="text-emerald-600 hover:text-emerald-800 text-xs px-2 py-1 border border-emerald-200 rounded hover:bg-emerald-50"
              title="View published post"
            >
              View Post →
            </Link>
          ) : null}

          {/* ✅ If approved but no slug, show why */}
          {submission.status === "approved" && !blogLink ? (
            <span className="text-xs text-red-500 border border-red-200 rounded px-2 py-1">
              Missing slug (fix admin publish)
            </span>
          ) : null}
        </div>
      </td>
    </tr>
  );
};

const SummaryStats = ({ submissions }) => {
  const stats = useMemo(
    () => ({
      pending: submissions.filter((s) => s.status === "pending").length,
      approved: submissions.filter((s) => s.status === "approved").length,
      rejected: submissions.filter((s) => s.status === "rejected").length,
    }),
    [submissions]
  );

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
        <div className="text-2xl font-bold text-yellow-800">
          {stats.pending}
        </div>
        <div className="text-sm text-yellow-700">Pending Review</div>
      </div>
      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
        <div className="text-2xl font-bold text-green-800">
          {stats.approved}
        </div>
        <div className="text-sm text-green-700">Approved</div>
      </div>
      <div className="bg-red-50 rounded-lg p-4 border border-red-200">
        <div className="text-2xl font-bold text-red-800">{stats.rejected}</div>
        <div className="text-sm text-red-700">Rejected</div>
      </div>
    </div>
  );
};

export default function UserSubmissions() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const userId = user?._id || user?.id;

  const {
    data: submissions = [],
    isLoading,
    error,
    refetch,
  } = useGetUserSubmissionsQuery(undefined, {
    skip: !userId,
  });

  const [deleteSubmission, { isLoading: isDeleting }] =
    useDeleteSubmissionMutation();

  useEffect(() => {
    console.log("🔍 UserSubmissions userId:", userId);
    console.log("📦 Submissions:", submissions);

    // Helpful debug: see what slugs you have for approved posts
    const arr = Array.isArray(submissions) ? submissions : [];
    console.log(
      "🧾 Approved slugs:",
      arr
        .filter((s) => s.status === "approved")
        .map((s) => ({
          id: s._id,
          sanityPostId: s.sanityPostId,
          sanitySlug: s.sanitySlug,
          slug: s.slug,
        }))
    );
  }, [userId, submissions]);

  const handleDelete = async (submissionId) => {
    if (!window.confirm("Are you sure you want to delete this submission?"))
      return;

    try {
      await deleteSubmission(submissionId).unwrap();
      toast.success("Submission deleted successfully");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete submission");
    }
  };

  const submissionsArray = Array.isArray(submissions) ? submissions : [];

  if (!isAuthenticated) return <AuthRequiredState />;
  if (!userId) return <UserIdMissingState />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                My Submissions
              </h1>
              <p className="text-gray-600">Track your submitted posts</p>
            </div>
            <button
              onClick={() => navigate("/submit")}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Submit New Post
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState error={error} onRetry={refetch} />
          ) : submissionsArray.length === 0 ? (
            <EmptyState onNavigate={() => navigate("/submit")} />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reading Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submissionsArray.map((submission) => (
                    <SubmissionRow
                      key={submission._id}
                      submission={submission}
                      onDelete={handleDelete}
                      onNavigate={navigate}
                      isDeleting={isDeleting}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {submissionsArray.length > 0 && (
          <SummaryStats submissions={submissionsArray} />
        )}
      </div>
    </div>
  );
}
