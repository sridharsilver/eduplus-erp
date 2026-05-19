import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthLayout } from "../../layouts/AuthLayout";
import { FormInput, FormSelect } from "../../components/FormElements";
import { Mail, Lock, LogIn, ArrowRight, Shield, CreditCard, GraduationCap, UserCheck, Users } from "lucide-react";
import { useToast } from "../../components/Toast";

export const Login = () => {
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("admin@school.com");
  const [password, setPassword] = useState("password");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { showToast, ToastComponent } = useToast();

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    // Autofill mock details for easy testing
    if (selectedRole === "admin") {
      setEmail("admin@school.com");
    } else if (selectedRole === "accounts") {
      setEmail("accounts@school.com");
    } else if (selectedRole === "teacher") {
      setEmail("meenakshi@school.com");
    } else if (selectedRole === "student") {
      setEmail("aarav.sharma@school.com");
    } else if (selectedRole === "parent") {
      setEmail("rajesh.sharma@gmail.com");
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    setTimeout(() => {
      setIsLoading(false);
      if (!email || !password) {
        setError("Please enter all fields.");
        return;
      }
      
      // Store mock user state
      localStorage.setItem("ep_role", role);
      localStorage.setItem("ep_user", JSON.stringify({ email, role }));

      showToast(`Welcome back! Logged in as ${role.toUpperCase()}`, "success");

      // Redirect depending on role
      setTimeout(() => {
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else if (role === "accounts") {
          navigate("/accounts/dashboard");
        } else if (role === "teacher") {
          navigate("/teacher/dashboard");
        } else if (role === "student") {
          navigate("/student/dashboard");
        } else if (role === "parent") {
          navigate("/parent/dashboard");
        }
      }, 800);

    }, 1000);
  };

  return (
    <AuthLayout>
      {ToastComponent}
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 text-center mb-6 leading-none">
        Sign In to Portal
      </h3>

      <form onSubmit={handleLogin} className="space-y-4">
        {/* Role Picker Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">
            Select Your Role
          </label>
          <div className="grid grid-cols-5 gap-2">
            {[
              { id: "admin", label: "Admin", icon: Shield },
              { id: "accounts", label: "Accounts", icon: CreditCard },
              { id: "teacher", label: "Teacher", icon: GraduationCap },
              { id: "student", label: "Student", icon: UserCheck },
              { id: "parent", label: "Parent", icon: Users }
            ].map((item) => {
              const IconComponent = item.icon;
              const isActive = role === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleRoleChange(item.id)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all duration-300 cursor-pointer
                    ${isActive 
                      ? "bg-indigo-50 border-indigo-250 text-indigo-600 dark:bg-indigo-950/40 dark:border-indigo-800/80 dark:text-indigo-400 shadow-sm" 
                      : "bg-slate-50/50 border-slate-100 text-slate-500 hover:bg-slate-100/50 dark:bg-slate-900/50 dark:border-slate-800/80 dark:text-slate-400 dark:hover:bg-slate-850"}`}
                >
                  <div className={`p-2 rounded-xl transition-all duration-300 mb-1.5
                    ${isActive 
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25 rotate-6 scale-110" 
                      : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold tracking-wide">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Demo Credentials Tip */}
        <div className="flex items-center gap-1.5 justify-center py-2 bg-amber-500/5 dark:bg-amber-500/10 rounded-xl text-[10px] font-bold text-amber-700 dark:text-amber-400 border border-amber-500/10">
          <span>💡</span>
          <span>Demo credentials loaded. Ready to Sign In!</span>
        </div>

        {/* Input Fields */}
        <FormInput
          label="Email Address"
          name="email"
          type="email"
          placeholder="name@school.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          icon={Mail}
        />

        <FormInput
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          icon={Lock}
        />

        {/* Forgot password trigger */}
        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            Forgot Password?
          </Link>
        </div>

        {error && <p className="text-xs font-semibold text-rose-500 text-center">{error}</p>}

        {/* Action button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-all shadow-md shadow-indigo-500/10 cursor-pointer disabled:opacity-50 text-sm md:text-base mt-2"
        >
          {isLoading ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              Sign In
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
};
