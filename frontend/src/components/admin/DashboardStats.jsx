import { Eye, Heart, MessageSquare, FileText, Clock } from "lucide-react";

export default function DashboardStats({ analytics, totalPosts, pendingCount, isLoading }) {
  const stats = [
    {
      label: "Total Posts",
      value: totalPosts,
      icon: FileText,
      color: "emerald",
      bg: "bg-emerald-50 text-emerald-600",
      shadow: "shadow-emerald-100"
    },
    {
      label: "Pending Review",
      value: pendingCount,
      icon: Clock,
      color: "rose",
      bg: "bg-rose-50 text-rose-600",
      shadow: "shadow-rose-100"
    },
    {
      label: "Total Views",
      value: analytics?.totals?.totalViews || 0,
      icon: Eye,
      color: "blue",
      bg: "bg-blue-50 text-blue-600",
      shadow: "shadow-blue-100"
    },
    {
      label: "Total Likes",
      value: analytics?.totals?.totalLikes || 0,
      icon: Heart,
      color: "rose",
      bg: "bg-rose-50 text-rose-600",
      shadow: "shadow-rose-100"
    },
    {
      label: "Total Comments",
      value: analytics?.comments?.total || 0,
      icon: MessageSquare,
      color: "purple",
      bg: "bg-purple-50 text-purple-600",
      shadow: "shadow-purple-100"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {stats.map((stat, i) => (
        <div 
          key={i} 
          className={`bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl ${stat.shadow} hover:scale-[1.02] transition-all duration-300`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-2xl ${stat.bg}`}>
              <stat.icon size={24} />
            </div>
            {isLoading ? (
              <div className="h-4 w-12 bg-slate-100 animate-pulse rounded-full" />
            ) : (
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Live</span>
            )}
          </div>
          <div>
            {isLoading ? (
              <div className="h-8 w-24 bg-slate-100 animate-pulse rounded-xl" />
            ) : (
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                {stat.value?.toLocaleString()}
              </h3>
            )}
            <p className="text-sm font-bold text-slate-500 mt-1">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
