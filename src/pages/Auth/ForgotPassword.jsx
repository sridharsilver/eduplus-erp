import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "../../layouts/AuthLayout";
import { FormInput } from "../../components/FormElements";
import { Mail, ArrowLeft, Send } from "lucide-react";
import { useToast } from "../../components/Toast";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast, ToastComponent } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
      showToast("Verification link sent!", "success");
    }, 1000);
  };

  return (
    <AuthLayout>
      {ToastComponent}
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 text-center mb-2 leading-none">
        Recover Password
      </h3>
      <p className="text-xs text-slate-400 dark:text-slate-500 text-center mb-6 max-w-[240px] mx-auto leading-relaxed">
        Enter your registered email and we'll send a link to reset your password.
      </p>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-all shadow-md shadow-indigo-500/10 cursor-pointer disabled:opacity-50 text-sm md:text-base mt-2"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Recovery Link
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-2xl p-4 text-center space-y-2 animate-fade-in-up">
          <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400">
            Check your Inbox!
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 leading-normal">
            We have sent a reset link to <span className="font-bold">{email}</span>. Click the link to complete the reset.
          </p>
        </div>
      )}

      <div className="mt-6 flex justify-center border-t border-slate-100 dark:border-slate-800 pt-4">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-350 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Login
        </Link>
      </div>
    </AuthLayout>
  );
};
