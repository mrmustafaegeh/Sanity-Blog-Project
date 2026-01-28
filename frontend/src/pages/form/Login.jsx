// frontend/src/pages/form/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../../store/authSlice";
import { Eye, EyeOff, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import Button from "../../components/ui/Button";
import SEO from "../../components/shared/SEO";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.role === "admin" || user?.isAdmin) {
        navigate("/admin", { replace: true });
      } else {
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      }
    }
  }, [isAuthenticated, navigate, location]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <SEO title="Sign In | Blogify" description="Access your account to manage posts." />
      
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6 group">
            <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center font-serif font-bold text-2xl group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-primary/20">
              B
            </div>
          </Link>
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">Welcome Back</h1>
          <p className="text-secondary">Sign in to continue to Blogify</p>
        </div>

        <div className="bg-surface rounded-3xl border border-border shadow-xl shadow-neutral-200/50 p-8 md:p-10 relative overflow-hidden isolate">
           {/* Subtle decorative blob */}
           <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-neutral-100 rounded-full blur-3xl -z-10"></div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium animate-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label 
                htmlFor="email" 
                className="text-sm font-bold text-primary uppercase tracking-wider ml-1"
              >
                Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary group-focus-within:text-primary transition-colors duration-300" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 rounded-xl border border-transparent shadow-inner focus:bg-white focus:border-primary focus:shadow-lg focus:shadow-primary/5 outline-none transition-all duration-300 placeholder:text-tertiary font-medium text-primary"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
               <div className="flex items-center justify-between ml-1">
                 <label 
                    htmlFor="password" 
                    className="text-sm font-bold text-primary uppercase tracking-wider"
                 >
                   Password
                 </label>
                 <Link 
                    to="#" 
                    className="text-xs font-semibold text-secondary hover:text-primary transition-colors"
                 >
                    Forgot password?
                 </Link>
               </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary group-focus-within:text-primary transition-colors duration-300" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-12 py-3.5 bg-neutral-50 rounded-xl border border-transparent shadow-inner focus:bg-white focus:border-primary focus:shadow-lg focus:shadow-primary/5 outline-none transition-all duration-300 placeholder:text-tertiary font-medium text-primary"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-tertiary hover:text-primary transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-base font-bold shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 rounded-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" /> Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-border/50">
            <p className="text-secondary text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-bold text-primary hover:underline decoration-2 underline-offset-4 transition-all"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}