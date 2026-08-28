import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Sparkles, ArrowRight, Lock, Mail, AlertCircle } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.detail || "Invalid email address or password.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex items-center justify-center p-6 selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-indigo-600/20 via-purple-600/10 to-transparent blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Brand */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="size-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl grid place-items-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <Sparkles className="size-6 text-white" />
            </div>
            <div className="text-left">
              <span className="font-extrabold text-2xl tracking-tight text-white block leading-none">JobTrack</span>
              <span className="text-[11px] font-bold tracking-widest text-indigo-400 uppercase mt-1 block">Career Compass</span>
            </div>
          </Link>
          <h1 className="text-2xl font-extrabold text-white tracking-tight pt-2">Sign in to your account</h1>
          <p className="text-sm text-slate-400 font-medium">Enter your email and password to access your application pipeline.</p>
        </div>

        {/* Login Card */}
        <div className="panel-glass p-8 space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm font-medium flex items-center gap-3">
              <AlertCircle className="size-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="field-label">Email Address</label>
              <div className="relative">
                <Mail className="size-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="field pl-11 py-3 text-base"
                />
              </div>
            </div>

            <div>
              <label className="field-label">Password</label>
              <div className="relative">
                <Lock className="size-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="field pl-11 py-3 text-base"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base shadow-xl shadow-indigo-500/25">
              <span>{loading ? "Authenticating..." : "Sign In"}</span>
              <ArrowRight className="size-5" />
            </button>
          </form>
        </div>

        <p className="text-center text-sm font-medium text-slate-400">
          Don't have an account yet?{" "}
          <Link to="/register" className="font-bold text-indigo-400 hover:text-indigo-300">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}
