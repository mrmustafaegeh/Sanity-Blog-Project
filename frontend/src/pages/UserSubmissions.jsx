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
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import clsx from "clsx";

// Status configuration constants
const STATUS_CONFIG = {
  approved: {
    variant: "success",
    icon: <Check className="w-3 h-3 mr-1" />,
    label: "Approved",
  },
  pending: {
    variant: "warning",
    icon: <Clock className="w-3 h-3 mr-1" />,
    label: "Pending Review",
  },
  rejected: {
    variant: "destructive",
    icon: <X className="w-3 h-3 mr-1" />,
    label: "Rejected",
  },
};

const LoadingState = () => (
  <div className="p-8 text-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
    <p className="text-secondary">Loading your submissions...</p>
  </div>
);

const ErrorState = ({ error, onRetry }) => (
  <div className="p-8 text-center">
    <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
    <p className="text-destructive mb-4">
      Error loading submissions:{" "}
      {error?.data?.message || error?.message || "Unknown error"}
    </p>
    <Button onClick={onRetry} className="flex items-center mx-auto">
       <RefreshCw className="w-4 h-4 mr-2" />
       Retry
    </Button>
  </div>
);

const EmptyState = ({ onNavigate }) => (
  <div className="p-12 text-center">
    <Clock className="w-16 h-16 text-tertiary mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-primary mb-2">
      No Submissions Yet
    </h3>
    <p className="text-secondary mb-6">You haven't submitted any posts yet.</p>
    <Button onClick={onNavigate} className="flex items-center mx-auto">
       <PlusCircle className="w-5 h-5 mr-2" />
       Submit Your First Post
    </Button>
  </div>
);

const AuthRequiredState = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background py-8 flex items-center justify-center">
      <div className="text-center">
        <p className="text-secondary mb-4">
          Please login to view your submissions
        </p>
        <Button onClick={() => navigate("/login")} variant="outline">
           Go to Login
        </Button>
      </div>
    </div>
  );
};

const UserIdMissingState = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background py-8 flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <p className="text-destructive mb-4">
          User ID not found. Please log in again.
        </p>
        <Button onClick={() => navigate("/login")} variant="outline">
           Go to Login
        </Button>
      </div>
    </div>
  );
};

// ✅ Extract slug from whatever shape you store it in
const getSubmissionSlug = (submission) => {
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
    variant: "neutral",
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
    <tr className="hover:bg-neutral-50 transition-colors border-b border-border last:border-0 text-left">
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-primary">
          {submission.title}
        </div>

        {submission.excerpt && (
          <div className="text-xs text-secondary mt-1 line-clamp-2">
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
      </td>

      <td className="px-6 py-4">
        <Badge variant={statusConfig.variant} size="sm" className="inline-flex items-center">
           {statusConfig.icon}
           {statusConfig.label}
        </Badge>
      </td>

      <td className="px-6 py-4 text-sm text-secondary">
        {formatDate(submission.submittedAt)}
      </td>

      <td className="px-6 py-4 text-sm text-secondary">
        {submission.readingTime || 5} min
      </td>

      <td className="px-6 py-4 text-sm">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate(`/submissions/${submission._id}`)}
            className="text-primary hover:text-secondary flex items-center transition-colors"
            title="View submission details"
          >
            <Eye className="w-4 h-4" />
          </button>

          {submission.status === "rejected" && (
            <button
              onClick={() => onNavigate(`/submit?edit=${submission._id}`)}
              className="text-blue-600 hover:text-blue-800 flex items-center transition-colors"
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
              className="text-destructive hover:text-red-700 flex items-center disabled:opacity-50 transition-colors"
              title="Delete submission"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          {submission.status === "approved" && blogLink ? (
            <Link
              to={blogLink}
              className="text-primary hover:text-secondary text-xs px-2 py-1 border border-border rounded hover:bg-neutral-100 transition-colors"
              title="View published post"
            >
              View Post →
            </Link>
          ) : null}

          {submission.status === "approved" && !blogLink ? (
            <span className="text-xs text-destructive border border-destructive/20 rounded px-2 py-1 bg-red-50">
              Missing slug
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
      <div className="bg-surface rounded-lg p-6 border border-border">
        <div className="text-3xl font-bold text-primary mb-1">
          {stats.pending}
        </div>
        <div className="text-sm text-secondary flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            Pending Review
        </div>
      </div>
      <div className="bg-surface rounded-lg p-6 border border-border">
         <div className="text-3xl font-bold text-primary mb-1">
          {stats.approved}
        </div>
        <div className="text-sm text-secondary flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            Approved
        </div>
      </div>
      <div className="bg-surface rounded-lg p-6 border border-border">
         <div className="text-3xl font-bold text-primary mb-1">
           {stats.rejected}
         </div>
         <div className="text-sm text-secondary flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            Rejected
        </div>
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
    // Debug logging
    const arr = Array.isArray(submissions) ? submissions : [];
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
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-2">
                My Submissions
              </h1>
              <p className="text-secondary text-lg">Track and manage your submitted posts</p>
            </div>
            <Button
              onClick={() => navigate("/submit")}
              className="flex items-center"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Submit New Post
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-sm">
          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState error={error} onRetry={refetch} />
          ) : submissionsArray.length === 0 ? (
            <EmptyState onNavigate={() => navigate("/submit")} />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-neutral-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                      Read Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-surface divide-y divide-border">
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
