import { Clock, User, Calendar, CheckCircle, XCircle, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function SubmissionQueue({ 
  submissions, 
  handleApprove, 
  handleRejectTrigger, 
  isLoading 
}) {
  if (submissions.length === 0 && !isLoading) {
    return (
      <div className="bg-white p-16 rounded-[2.5rem] text-center border border-slate-100 shadow-xl max-w-2xl mx-auto">
        <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <CheckCircle size={48} />
        </div>
        <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">All Caught Up!</h3>
        <p className="text-slate-500 font-medium text-lg italic">There are no pending submissions awaiting your review right now.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-700">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Review Queue</h3>
          <p className="text-slate-500 font-medium text-sm mt-1">Found {submissions.length} new drafts submitted for your approval</p>
        </div>
        <div className="px-6 py-2 bg-rose-50 border border-rose-100 rounded-full">
           <span className="text-rose-600 font-black text-sm uppercase tracking-widest flex items-center gap-2">
             <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
             Awaiting Action
           </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 text-left">
        {submissions.map((submission) => (
          <div key={submission._id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 hover:shadow-emerald-200/40 transition-all duration-500 group overflow-hidden">
             <div className="p-8">
                <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <Clock size={20} className="text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">Submission Date</p>
                            <p className="text-sm font-black text-slate-900">
                                {formatDistanceToNow(new Date(submission.submittedAt), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-amber-100">
                        {submission.difficulty || "beginner"}
                    </div>
                </div>

                <h4 className="text-2xl font-black text-slate-900 leading-tight mb-6 group-hover:text-emerald-600 transition-colors">
                    {submission.title}
                </h4>

                <div className="flex flex-wrap items-center gap-6 mb-8 text-sm font-bold text-slate-500">
                    <div className="flex items-center gap-2">
                        <User size={16} className="text-emerald-500" />
                        <span>{submission.userId?.name || "Unknown Author"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-blue-500" />
                        <span>{submission.readingTime || 5} min read</span>
                    </div>
                </div>

                {submission.excerpt && (
                    <div className="mb-8 p-6 bg-slate-50/50 border border-slate-100 rounded-3xl italic text-slate-600 text-base leading-relaxed">
                        "{submission.excerpt}"
                    </div>
                )}

                <details className="group/details mb-10 overflow-hidden">
                    <summary className="list-none flex items-center justify-between px-6 py-4 bg-slate-900 text-white rounded-2xl cursor-pointer hover:bg-emerald-600 transition-all font-black text-sm uppercase tracking-widest shadow-lg shadow-slate-200">
                        <span>Review Full Draft</span>
                        <ChevronRight className="group-open/details:rotate-90 transition-transform" />
                    </summary>
                    <div className="mt-6 p-8 border-2 border-slate-50 rounded-3xl max-h-[500px] overflow-y-auto bg-white prose prose-slate max-w-none shadow-inner">
                        <div dangerouslySetInnerHTML={{ __html: submission.content }} />
                    </div>
                </details>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => handleApprove(submission._id)}
                        className="flex-1 px-6 py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <CheckCircle size={18} />
                        Publish Post
                    </button>
                    <button
                        onClick={() => handleRejectTrigger(submission)}
                        className="px-6 py-4 bg-white border border-rose-100 text-rose-500 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-rose-50 shadow-lg shadow-rose-100 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <XCircle size={18} />
                        Reject
                    </button>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
