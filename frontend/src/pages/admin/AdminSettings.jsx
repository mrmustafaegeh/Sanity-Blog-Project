import { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { 
  Settings, 
  Globe, 
  ShieldCheck, 
  Database, 
  Zap, 
  Save, 
  RefreshCcw,
  Layout,
  Palette,
  Server,
  Trash2,
  Sparkles
} from "lucide-react";
import { toast } from "react-toastify";
import { useSeedDataMutation } from "../../api/adminAPI";

export default function AdminSettings() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedData] = useSeedDataMutation();

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  const handleMaintenance = () => {
    toast.info("System maintenance started...");
  };

  const handleSeed = async (count, clean = false) => {
    if (isSeeding) return;
    setIsSeeding(true);
    const loadingToast = toast.loading(clean ? "Cleaning and seeding data..." : `Seeding ${count} items...`);
    
    try {
      await seedData({ count, clean }).unwrap();
      toast.update(loadingToast, { 
        render: "Data synchronized successfully!", 
        type: "success", 
        isLoading: false, 
        autoClose: 3000 
      });
    } catch (err) {
      toast.update(loadingToast, { 
        render: err?.data?.message || "Bulk operation failed", 
        type: "error", 
        isLoading: false, 
        autoClose: 3000 
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-12 pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="animate-in slide-in-from-left duration-700">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-2">
              System <span className="text-emerald-600">Core</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">
              Global Platform Configuration & Maintenance
            </p>
          </div>
          <button 
            onClick={handleSave}
            className="px-10 py-4 bg-emerald-600 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-200 transition-all active:scale-95 flex items-center gap-3"
          >
            <Save size={20} />
            Commit Changes
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
           {/* General Settings */}
           <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl flex flex-col animate-in fade-in duration-700">
              <div className="flex items-center gap-4 mb-10">
                 <div className="p-3 bg-slate-900 text-white rounded-2xl">
                    <Layout size={24} />
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight">Blog Configuration</h3>
              </div>

              <div className="space-y-8">
                 <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Platform Title</label>
                    <input 
                      type="text" 
                      defaultValue="Blogify Premium"
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-slate-900 shadow-inner"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Meta Description</label>
                    <textarea 
                      rows={4}
                      defaultValue="The next generation blog platform for creative minds."
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-slate-900 shadow-inner"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Primary Accent</label>
                       <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl shadow-inner cursor-pointer hover:bg-slate-100 transition-colors">
                          <div className="w-8 h-8 bg-emerald-600 rounded-lg shadow-sm" />
                          <span className="text-sm font-black text-slate-900 uppercase tracking-widest">#10B981</span>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Secondary Accent</label>
                       <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl shadow-inner cursor-pointer hover:bg-slate-100 transition-colors">
                          <div className="w-8 h-8 bg-slate-900 rounded-lg shadow-sm" />
                          <span className="text-sm font-black text-slate-900 uppercase tracking-widest">#0F172A</span>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="mt-12 h-px bg-slate-50"></div>

              {/* Seeding Controls */}
              <div className="mt-8">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                       <Sparkles size={24} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Rapid Development</h3>
                 </div>
                 <p className="text-slate-500 font-medium text-sm mb-8 leading-relaxed">
                    Bulk generate high-quality test data to stress-test your platform and preview layout with scale.
                 </p>
                 <div className="grid grid-cols-2 gap-4">
                    <button 
                      disabled={isSeeding}
                      onClick={() => handleSeed(100)}
                      className="px-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95 disabled:opacity-50"
                    >
                       Seed 100 Items
                    </button>
                    <button 
                      disabled={isSeeding}
                      onClick={() => handleSeed(1000, true)}
                      className="px-6 py-4 bg-white border border-rose-100 text-rose-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                    >
                       Fresh 1000 Seed
                    </button>
                 </div>
              </div>
           </div>

           {/* Advanced & Infrastructure */}
           <div className="space-y-8 animate-in fade-in duration-1000">
              <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-1000 rotate-12">
                    <Zap size={140} />
                 </div>
                 <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-white/10 text-emerald-400 rounded-2xl border border-white/10">
                       <Database size={24} />
                    </div>
                    <h3 className="text-2xl font-black tracking-tight">Infrastructure Hub</h3>
                 </div>
                 
                 <div className="space-y-6 relative z-10">
                    <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors group/item cursor-help">
                       <div className="flex items-center gap-3">
                          <ShieldCheck size={18} className="text-emerald-400" />
                          <span className="text-sm font-bold text-slate-400">Security Layers</span>
                       </div>
                       <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-widest">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors group/item">
                       <div className="flex items-center gap-3">
                          <Globe size={18} className="text-blue-400" />
                          <span className="text-sm font-bold text-slate-400">CDN Propagation</span>
                       </div>
                       <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-[10px] font-black uppercase tracking-widest">Optimized</span>
                    </div>
                    <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors group/item">
                       <div className="flex items-center gap-3">
                          <RefreshCcw size={18} className="text-amber-400" />
                          <span className="text-sm font-bold text-slate-400">Cache Strategy</span>
                       </div>
                       <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-lg text-[10px] font-black uppercase tracking-widest">Intelligent</span>
                    </div>
                 </div>
              </div>

              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-slate-50 text-slate-900 rounded-2xl">
                       <Zap size={24} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Maintenance Controls</h3>
                 </div>
                 <p className="text-slate-500 font-medium text-sm mb-8 leading-relaxed">
                    Perform system-wide tasks like index regeneration, cache clearing, and database optimization.
                 </p>
                 <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={handleMaintenance}
                      className="px-6 py-4 bg-slate-50 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm active:scale-95"
                    >
                       Purge Assets
                    </button>
                    <button 
                      onClick={handleMaintenance}
                      className="px-6 py-4 bg-slate-50 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm active:scale-95"
                    >
                       Rebuild Index
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </AdminLayout>
  );
}
