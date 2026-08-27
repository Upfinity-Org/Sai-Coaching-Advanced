import React, { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { AlertTriangle } from "lucide-react";
import { supabase, supabaseEnabled } from "../lib/supabaseClient";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

export default function AdminApp() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!supabaseEnabled) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "#0A1506" }}>
        <div className="max-w-md text-center p-8 rounded-lg" style={{ background: "rgba(245,240,228,0.05)", border: "1px solid rgba(245,240,228,0.15)", color: "rgba(245,240,228,0.9)" }}>
          <AlertTriangle className="mx-auto mb-3" size={28} />
          <div className="font-bold mb-2">Admin not configured yet</div>
          <p className="text-sm opacity-70 leading-relaxed">
            Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to a{" "}
            <code>.env</code> file (see <code>.env.example</code> and{" "}
            <code>supabase/SETUP.md</code>), then restart the dev server.
          </p>
        </div>
      </div>
    );
  }

  if (session === undefined) {
    return <div className="min-h-screen" style={{ background: "#0A1506" }} />;
  }

  return session ? <AdminDashboard /> : <AdminLogin />;
}
