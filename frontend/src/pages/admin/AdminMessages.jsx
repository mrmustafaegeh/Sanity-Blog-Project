import { useState } from "react";
import { format } from "date-fns";
import { 
  useGetContactsQuery, 
  useDeleteContactMutation, 
  useMarkContactAsReadMutation 
} from "../../api/contactAPI";
import AdminLayout from "../../components/admin/AdminLayout";
import { 
  MessageSquare, 
  Trash2, 
  Check, 
  Search, 
  Mail, 
  Calendar,
  User,
  Loader2,
  X
} from "lucide-react";
import { toast } from "react-toastify";
import Button from "../../components/ui/Button";

export default function AdminMessages() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all"); // 'all', 'unread', 'read'
  const [selectedMessage, setSelectedMessage] = useState(null);

  const queryParams = { 
    page, 
    limit: 10,
    ...(filter === "unread" ? { read: false } : {}),
    ...(filter === "read" ? { read: true } : {})
  };

  const { data, isLoading, isFetching } = useGetContactsQuery(queryParams);
  const [deleteContact] = useDeleteContactMutation();
  const [markAsRead] = useMarkContactAsReadMutation();

  const contacts = data?.contacts || [];
  const totalPages = data?.pages || 1;

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await deleteContact(id).unwrap();
        toast.success("Message deleted");
        if (selectedMessage?._id === id) setSelectedMessage(null);
      } catch (error) {
        toast.error("Failed to delete message");
      }
    }
  };

  const handleMarkAsRead = async (id, e) => {
    e?.stopPropagation();
    try {
      await markAsRead(id).unwrap();
      // No toast needed, UI updates automatically 
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const openMessage = (msg) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      handleMarkAsRead(msg._id);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-20">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="animate-in slide-in-from-left duration-700">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
              Inbox
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
              User Inquiries & Feedback
            </p>
          </div>

          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
            <button
              onClick={() => { setFilter("all"); setPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === "all" ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"}`}
            >
              All
            </button>
            <button
              onClick={() => { setFilter("unread"); setPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === "unread" ? "bg-emerald-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"}`}
            >
              Unread
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 h-[calc(100vh-16rem)] min-h-[600px]">
          
          {/* Message List */}
          <div className="lg:col-span-5 flex flex-col bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
             
            {/* List Header */}
             <div className="p-6 border-b border-slate-100 bg-slate-50/50 backdrop-blur-sm sticky top-0 z-10">
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                 <input 
                   placeholder="Search messages..." 
                   className="w-full pl-10 pr-4 py-3 bg-white border-none rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-200 outline-none text-sm font-medium"
                   disabled={true} // Not implemented yet on backend
                 />
               </div>
             </div>

             <div className="flex-1 overflow-y-auto p-4 space-y-3">
               {isLoading ? (
                 <div className="flex flex-col items-center justify-center h-40 text-slate-400 gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                    <span className="text-sm font-medium">Loading messages...</span>
                 </div>
               ) : contacts.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                        <Mail className="w-8 h-8" />
                    </div>
                    <p className="font-bold text-slate-600 mb-1">No messages found</p>
                    <p className="text-xs">Your inbox is empty.</p>
                 </div>
               ) : (
                 contacts.map((contact) => (
                   <div
                     key={contact._id}
                     onClick={() => openMessage(contact)}
                     className={`p-4 rounded-2xl cursor-pointer transition-all border-2 group relative overflow-hidden
                       ${selectedMessage?._id === contact._id 
                         ? "bg-emerald-50 border-emerald-500 ring-4 ring-emerald-100/50" 
                         : contact.isRead 
                           ? "bg-white border-transparent hover:border-slate-200 hover:bg-slate-50" 
                           : "bg-white border-emerald-100 shadow-lg shadow-emerald-50/50"
                       }
                     `}
                   >
                     {/* Unread indicator */}
                     {!contact.isRead && (
                       <div className="absolute top-4 right-4 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                     )}

                     <div className="flex items-start justify-between mb-2">
                        <h4 className={`text-sm font-bold truncate pr-6 ${!contact.isRead ? "text-emerald-900" : "text-slate-700"}`}>
                          {contact.name}
                        </h4>
                        <span className="text-[10px] items-center gap-1 text-slate-400 font-bold uppercase tracking-wider hidden sm:flex shrink-0">
                           {format(new Date(contact.createdAt), "MMM d")}
                        </span>
                     </div>
                     
                     <p className={`text-sm mb-3 line-clamp-1 ${!contact.isRead ? "font-bold text-slate-900" : "font-medium text-slate-600"}`}>
                        {contact.subject || "(No Subject)"}
                     </p>
                     
                     <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {contact.message}
                     </p>

                     <div className="flex justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                           onClick={(e) => handleDelete(contact._id, e)}
                           className="p-1.5 hover:bg-rose-100 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                     </div>
                   </div>
                 ))
               )}
             </div>
             
             {/* Pagination Mini */}
             {totalPages > 1 && (
                <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-white text-xs font-bold text-slate-500">
                    <button 
                        disabled={page === 1} 
                        onClick={() => setPage(p => p - 1)}
                        className="px-3 py-1.5 hover:bg-slate-100 rounded-lg disabled:opacity-50 transition-colors"
                    >
                        Prev
                    </button>
                    <span>Page {page} of {totalPages}</span>
                    <button 
                        disabled={page === totalPages} 
                        onClick={() => setPage(p => p + 1)}
                        className="px-3 py-1.5 hover:bg-slate-100 rounded-lg disabled:opacity-50 transition-colors"
                    >
                        Next
                    </button>
                </div>
             )}
          </div>

          {/* Message Detail View */}
          <div className="lg:col-span-7 h-full">
            {selectedMessage ? (
              <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-500 overflow-hidden">
                {/* Header Actions */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                   <div className="flex items-center gap-2">
                      <button 
                         onClick={() => setSelectedMessage(null)}
                         className="p-2 hover:bg-slate-200 rounded-full lg:hidden"
                      >
                         <X className="w-5 h-5" />
                      </button>
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400 px-3 py-1 bg-slate-100 rounded-full">
                         Inquiry Details
                      </span>
                   </div>
                   <div className="flex items-center gap-2">
                      <button 
                         onClick={(e) => handleDelete(selectedMessage._id, e)}
                         className="flex items-center gap-2 px-4 py-2 text-rose-500 hover:bg-rose-50 rounded-xl font-bold text-sm transition-colors"
                      >
                         <Trash2 className="w-4 h-4" /> Delete
                      </button>
                   </div>
                </div>

                {/* Content */}
                <div className="p-8 md:p-12 overflow-y-auto flex-1">
                   <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 leading-tight">
                      {selectedMessage.subject || "No Subject"}
                   </h2>

                   <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                            <User className="w-5 h-5" />
                         </div>
                         <div>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">From</p>
                            <p className="font-bold text-slate-900">{selectedMessage.name}</p>
                         </div>
                      </div>

                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center shrink-0">
                            <Mail className="w-5 h-5" />
                         </div>
                         <div>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">Email</p>
                            <p className="font-bold text-slate-900">{selectedMessage.email}</p>
                         </div>
                      </div>

                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center shrink-0">
                            <Calendar className="w-5 h-5" />
                         </div>
                         <div>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">Received</p>
                            <p className="font-bold text-slate-900">
                               {format(new Date(selectedMessage.createdAt), "MMM d, yyyy 'at' h:mm a")}
                            </p>
                         </div>
                      </div>
                   </div>

                   <div className="prose prose-slate max-w-none">
                      <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-wrap">
                         {selectedMessage.message}
                      </p>
                   </div>
                </div>
                
                {/* Reply Mockup */}
                <div className="p-6 bg-slate-50 border-t border-slate-100 mt-auto">
                   <Button variant="primary" className="w-full sm:w-auto" onClick={() => window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      Reply via Email
                   </Button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 text-slate-300 border-2 border-dashed border-slate-200 rounded-[2.5rem]">
                 <MessageSquare className="w-20 h-20 mb-6 opacity-20" />
                 <h3 className="text-2xl font-black text-slate-400 mb-2">No Message Selected</h3>
                 <p className="max-w-xs mx-auto font-medium">Select a message from the list to view its details and manage it.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}
