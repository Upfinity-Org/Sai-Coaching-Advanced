import React, { useState } from "react";
import { Lock, Mail, KeyRound } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (error) {
      // Deliberately generic — never reveal whether the email exists.
      setError("Invalid email or password.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#0A1506" }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg p-8"
        style={{
          background: "rgba(245,240,228,0.05)",
          border: "1px solid rgba(245,240,228,0.15)",
        }}
      >
        <div className="flex items-center gap-2 mb-1" style={{ color: "rgba(245,240,228,0.9)" }}>
          <Lock size={20} />
          <span className="text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>
            Admin Login
          </span>
        </div>
        <p className="text-xs opacity-50 mb-6" style={{ color: "rgba(245,240,228,0.8)", fontFamily: "var(--font-body)" }}>
          Sai Coaching Center — content management
        </p>

        <label className="block text-xs mb-1 opacity-70" style={{ color: "rgba(245,240,228,0.9)", fontFamily: "var(--font-body)" }}>
          Email
        </label>
        <div className="flex items-center gap-2 mb-4 px-3 py-2.5 rounded" style={{ background: "rgba(245,240,228,0.08)", border: "1px solid rgba(245,240,228,0.18)" }}>
          <Mail size={15} style={{ color: "rgba(245,240,228,0.5)" }} />
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-transparent outline-none text-sm w-full"
            style={{ color: "rgba(245,240,228,0.95)", fontFamily: "var(--font-body)" }}
            placeholder="you@example.com"
          />
        </div>

        <label className="block text-xs mb-1 opacity-70" style={{ color: "rgba(245,240,228,0.9)", fontFamily: "var(--font-body)" }}>
          Password
        </label>
        <div className="flex items-center gap-2 mb-2 px-3 py-2.5 rounded" style={{ background: "rgba(245,240,228,0.08)", border: "1px solid rgba(245,240,228,0.18)" }}>
          <KeyRound size={15} style={{ color: "rgba(245,240,228,0.5)" }} />
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-transparent outline-none text-sm w-full"
            style={{ color: "rgba(245,240,228,0.95)", fontFamily: "var(--font-body)" }}
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div className="mt-3 text-xs px-3 py-2 rounded" style={{ background: "rgba(212,24,61,0.1)", color: "#FF9DAA", border: "1px solid rgba(212,24,61,0.3)", fontFamily: "var(--font-body)" }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full py-2.5 rounded font-semibold text-sm transition-opacity disabled:opacity-50"
          style={{ background: "rgba(245,240,228,0.12)", border: "1px solid rgba(245,240,228,0.3)", color: "rgba(245,240,228,0.95)", fontFamily: "var(--font-body)" }}
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}
