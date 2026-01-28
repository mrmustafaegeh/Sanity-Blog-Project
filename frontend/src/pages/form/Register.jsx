// frontend/src/pages/form/Register.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../../store/authSlice";
import { Eye, EyeOff, Mail, Lock, User as UserIcon, Loader2, ArrowRight } from "lucide-react";
import Button from "../../components/ui/Button";
import SEO from "../../components/shared/SEO";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  useEffect(() => {
    const password = formData.password;
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 10) strength += 1;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[@$!%*?&#]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: "" });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    else if (formData.name.trim().length < 2) errors.name = "Name must be at least 2 characters";

    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email is invalid";

    if (!formData.password) errors.password = "Password is required";
    else if (formData.password.length < 6) errors.password = "Password must be at least 6 characters";

    if (!formData.confirmPassword) errors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword) errors.confirmPassword = "Passwords do not match";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const { name, email, password } = formData;
    await dispatch(registerUser({ name, email, password }));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <SEO title="Join Us | Blogify" description="Create an account to join the community." />

      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6 group">
            <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center font-serif font-bold text-2xl group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-primary/20">
              B
            </div>
          </Link>
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">Create Account</h1>
          <p className="text-secondary">Join us and start sharing your stories</p>
        </div>

        <div className="bg-surface rounded-3xl border border-border shadow-xl shadow-neutral-200/50 p-8 md:p-10 relative overflow-hidden isolate">
            {/* Subtle decorative blob */}
            <div className="absolute top-0 left-0 -ml-16 -mt-16 w-32 h-32 bg-neutral-100 rounded-full blur-3xl -z-10"></div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium animate-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-bold text-primary uppercase tracking-wider ml-1">
                Full Name
              </label>
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary group-focus-within:text-primary transition-colors duration-300" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3.5 bg-neutral-50 rounded-xl border shadow-inner focus:bg-white focus:shadow-lg focus:shadow-primary/5 outline-none transition-all duration-300 placeholder:text-tertiary font-medium text-primary ${validationErrors.name ? "border-red-300 focus:border-red-500" : "border-transparent focus:border-primary"}`}
                  placeholder="John Doe"
                />
              </div>
              {validationErrors.name && <p className="ml-1 text-xs font-medium text-red-500">{validationErrors.name}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-bold text-primary uppercase tracking-wider ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary group-focus-within:text-primary transition-colors duration-300" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3.5 bg-neutral-50 rounded-xl border shadow-inner focus:bg-white focus:shadow-lg focus:shadow-primary/5 outline-none transition-all duration-300 placeholder:text-tertiary font-medium text-primary ${validationErrors.email ? "border-red-300 focus:border-red-500" : "border-transparent focus:border-primary"}`}
                  placeholder="name@example.com"
                />
              </div>
              {validationErrors.email && <p className="ml-1 text-xs font-medium text-red-500">{validationErrors.email}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-bold text-primary uppercase tracking-wider ml-1">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary group-focus-within:text-primary transition-colors duration-300" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-3.5 bg-neutral-50 rounded-xl border shadow-inner focus:bg-white focus:shadow-lg focus:shadow-primary/5 outline-none transition-all duration-300 placeholder:text-tertiary font-medium text-primary ${validationErrors.password ? "border-red-300 focus:border-red-500" : "border-transparent focus:border-primary"}`}
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
              {validationErrors.password && <p className="ml-1 text-xs font-medium text-red-500">{validationErrors.password}</p>}
              
              {/* Strength Meter */}
              {formData.password && (
                 <div className="flex gap-1 h-1 mt-2 px-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                       <div key={s} className={`h-full flex-1 rounded-full transition-colors duration-300 ${passwordStrength >= s ? (passwordStrength < 3 ? "bg-red-400" : passwordStrength < 4 ? "bg-yellow-400" : "bg-emerald-500") : "bg-neutral-200"}`} />
                    ))}
                 </div>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-bold text-primary uppercase tracking-wider ml-1">
                Confirm Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary group-focus-within:text-primary transition-colors duration-300" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-3.5 bg-neutral-50 rounded-xl border shadow-inner focus:bg-white focus:shadow-lg focus:shadow-primary/5 outline-none transition-all duration-300 placeholder:text-tertiary font-medium text-primary ${validationErrors.confirmPassword ? "border-red-300 focus:border-red-500" : "border-transparent focus:border-primary"}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-tertiary hover:text-primary transition-colors p-1"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {validationErrors.confirmPassword && <p className="ml-1 text-xs font-medium text-red-500">{validationErrors.confirmPassword}</p>}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-base font-bold shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 rounded-xl mt-4"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" /> Creating Account...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Create Account <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-border/50">
            <p className="text-secondary text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-primary hover:underline decoration-2 underline-offset-4 transition-all"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}