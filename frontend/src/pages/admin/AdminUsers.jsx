import { useState } from "react";
import { 
  useGetAdminUsersQuery, 
  useUpdateUserRoleMutation, 
  useDeleteUserMutation 
} from "../../api/adminAPI";
import AdminLayout from "../../components/admin/AdminLayout";
import { 
  Users, 
  Search, 
  Trash2, 
  UserCog, 
  Shield, 
  Mail,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  UserCheck
} from "lucide-react";
import { toast } from "react-toastify";

export default function AdminUsers() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, isFetching } = useGetAdminUsersQuery({ 
    page, 
    limit: 10,
    search: searchTerm 
  });

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setPage(1);
  };
  const [updateRole] = useUpdateUserRoleMutation();
  const [deleteUser] = useDeleteUserMutation();

  const users = data?.users || [];
  const totalPages = data?.pages || 0;

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateRole({ userId, role: newRole }).unwrap();
      toast.success(`Role updated to ${newRole}`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update role");
    }
  };

  const handleDelete = async (userId, name) => {
    if (window.confirm(`Are you sure you want to delete user "${name}"? This action cannot be undone.`)) {
      try {
        await deleteUser(userId).unwrap();
        toast.success("User deleted successfully");
      } catch (err) {
        toast.error(err?.data?.message || "Failed to delete user");
      }
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="animate-in slide-in-from-left duration-700">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-2">
              Community <span className="text-emerald-600">Registry</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">
              Manage User Access & Authority
            </p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden animate-in fade-in duration-700">
          <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                  <Users size={24} />
               </div>
               <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">All Members</h3>
                  <p className="text-slate-500 font-medium text-sm">Reviewing {data?.total || 0} registered accounts</p>
               </div>
            </div>

            <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Find by name or email..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 text-left border-b border-slate-50">
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">User Details</th>
                  <th className="px-6 py-5 text-center text-xs font-black text-slate-400 uppercase tracking-widest">Access Level</th>
                  <th className="px-8 py-5 text-right text-xs font-black text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg border-2 border-white ring-1 ring-slate-100 flex-shrink-0">
                          <img 
                            src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=10b981&color=fff`} 
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-lg font-black text-slate-900 truncate leading-none mb-1">{user.name}</p>
                          <div className="flex items-center gap-2 text-slate-400">
                             <Mail size={12} />
                             <span className="text-xs font-bold">{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-6 text-center">
                       <select 
                         value={user.role}
                         onChange={(e) => handleRoleChange(user._id, e.target.value)}
                         className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all cursor-pointer focus:ring-4 focus:ring-emerald-50/50
                         ${user.role === 'admin' ? 'bg-rose-50 border-rose-100 text-rose-600' : 
                           user.role === 'author' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 
                           'bg-blue-50 border-blue-100 text-blue-600'}`}
                       >
                         <option value="user">User</option>
                         <option value="author">Author</option>
                         <option value="moderator">Moderator</option>
                         <option value="admin">Admin</option>
                       </select>
                    </td>

                    <td className="px-8 py-6">
                       <div className="flex items-center justify-end gap-2">
                          <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-emerald-600 hover:border-emerald-100 transition-all shadow-sm">
                             <UserCog size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(user._id, user.name)}
                            className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm"
                          >
                             <Trash2 size={18} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-8 bg-slate-50/30 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6">
              <p className="text-sm font-bold text-slate-500 italic">
                Registry Page <span className="text-slate-900 font-black">{page}</span> of <span className="text-slate-900 font-black">{totalPages}</span>
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1 || isFetching}
                  onClick={() => setPage(p => Math.max(p - 1, 1))}
                  className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30 transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  disabled={page === totalPages || isFetching}
                  onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                  className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30 transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
