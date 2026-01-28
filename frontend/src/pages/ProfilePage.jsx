import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../store/authSlice";
import {
  User,
  Mail,
  Lock,
  Edit2,
  Save,
  X,
  Camera,
  Shield,
  Calendar,
  CheckCircle,
  Loader2,
  Sparkles,
  TrendingUp,
  MessageCircle,
  Heart,
} from "lucide-react";
import { getOptimizedUrl } from "../utils/imageOptimizer";

export default function ProfilePage() {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [previewImage, setPreviewImage] = useState(
    user?.profileImage ? getOptimizedUrl(user.profileImage, 400) : null
  );

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Please select an image file" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "Image must be less than 5MB" });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);

    setUploadingImage(true);
    setMessage({ type: "", text: "" });

    try {
      const formData = new FormData();
      formData.append("profileImage", file);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/upload-profile-image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to upload image");
      }

      dispatch(updateUser({ profileImage: data.imageUrl }));
      setMessage({ type: "success", text: "Profile picture updated!" });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
      setPreviewImage(user?.profileImage || null);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/update-profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      dispatch(updateUser(data.user));
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setIsEditing(false);
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters",
      });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/update-password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update password");
      }

      setMessage({ type: "success", text: "Password updated successfully!" });
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
    });
    setIsEditing(false);
    setMessage({ type: "", text: "" });
  };

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      {/* Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[100px] -z-10 opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[100px] -z-10 opacity-60"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-[2rem] p-8 border border-neutral-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
          
          <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar */}
            <div className="relative group/avatar">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-[2rem] rotate-3 opacity-20 blur-sm group-hover/avatar:rotate-6 transition-transform duration-500"></div>
              <div className="relative rounded-[2rem] p-1.5 bg-white shadow-xl shadow-emerald-900/5">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt={user?.name}
                    className="w-32 h-32 rounded-[1.7rem] object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gray-50 rounded-[1.7rem] flex items-center justify-center text-4xl font-bold text-gray-400">
                    {getInitials(user?.name)}
                  </div>
                )}
                
                <button
                  onClick={handleImageClick}
                  disabled={uploadingImage}
                  className="absolute -bottom-2 -right-2 w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-gray-900/20"
                >
                  {uploadingImage ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Camera className="w-5 h-5" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left pt-2">
              <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">{user?.name}</h1>
                  <p className="text-gray-500 font-medium flex items-center justify-center md:justify-start gap-2">
                    <Mail className="w-4 h-4" />
                    {user?.email}
                  </p>
                </div>
                {user?.role === "admin" && (
                  <span className="px-4 py-1.5 bg-gray-900 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg shadow-gray-900/20">
                    Admin Access
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-semibold border border-emerald-100 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Joined {new Date(user?.createdAt).toLocaleDateString("en-US", { month: 'short', year: 'numeric' })}
                </div>
                <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-semibold border border-blue-100 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Verified Account
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`p-4 rounded-xl flex items-center gap-3 shadow-sm border ${
              message.type === "success"
                ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                : "bg-red-50 border-red-100 text-red-800"
            }`}
          >
            {message.type === "success" ? <CheckCircle className="w-5 h-5" /> : <X className="w-5 h-5" />}
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Profile Details Card */}
          <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <User className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Personal Info</h2>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-gray-50 hover:bg-emerald-50 text-gray-600 hover:text-emerald-600 rounded-xl text-sm font-bold transition-all border border-transparent hover:border-emerald-100"
                >
                  Edit Details
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-6 flex-1">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white border focus:border-emerald-500 rounded-xl shadow-inner outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white border focus:border-emerald-500 rounded-xl shadow-inner outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4 mt-auto">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-200/50 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-5 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6 flex-1">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</h3>
                  <p className="text-lg font-medium text-gray-900">{user?.name}</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email Address</h3>
                  <p className="text-lg font-medium text-gray-900">{user?.email}</p>
                </div>
              </div>
            )}
          </div>

          {/* Security Card */}
          <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Security</h2>
              </div>
            </div>

            {isChangingPassword ? (
              <form onSubmit={handleUpdatePassword} className="space-y-5 flex-1">
                {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => (
                  <div key={field} className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                      {field.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <input
                      type="password"
                      name={field}
                      value={passwordData[field]}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white border focus:border-blue-500 rounded-xl shadow-inner outline-none transition-all font-medium text-gray-900"
                      required
                    />
                  </div>
                ))}
                <div className="flex gap-3 pt-4 mt-auto">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-bold shadow-lg shadow-gray-200 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                    }}
                    className="px-5 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex-1 flex flex-col justify-center">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-6 text-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-emerald-500">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">Password Protected</h3>
                  <p className="text-sm text-gray-500">Your account is secured with a strong password.</p>
                </div>
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="w-full py-3.5 bg-white border-2 border-gray-100 text-gray-700 font-bold rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all"
                >
                  Change Password
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Activity Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Total Comments", value: "0", icon: MessageCircle, color: "emerald" },
            { label: "Posts Liked", value: "0", icon: Heart, color: "red" },
            { label: "Posts Read", value: "0", icon: TrendingUp, color: "blue" }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className={`p-4 rounded-xl bg-${stat.color}-50 text-${stat.color}-500`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm font-medium text-gray-400">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}