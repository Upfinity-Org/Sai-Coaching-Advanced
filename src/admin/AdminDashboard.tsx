import React, { useEffect, useState } from "react";
import { LogOut, Trash2, Upload, Plus, Users, Image as ImageIcon } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import {
  fetchFaculty,
  fetchGallery,
  addFaculty,
  deleteFaculty,
  addGalleryImage,
  deleteGalleryImage,
  uploadImage,
  FacultyRow,
  GalleryRow,
} from "../lib/content";

const shell: React.CSSProperties = { background: "#0A1506", minHeight: "100vh" };
const panel: React.CSSProperties = {
  background: "rgba(245,240,228,0.05)",
  border: "1px solid rgba(245,240,228,0.15)",
};
const inputStyle: React.CSSProperties = {
  background: "rgba(245,240,228,0.08)",
  border: "1px solid rgba(245,240,228,0.18)",
  color: "rgba(245,240,228,0.95)",
  fontFamily: "var(--font-body)",
};
const label: React.CSSProperties = {
  color: "rgba(245,240,228,0.7)",
  fontFamily: "var(--font-body)",
};

export default function AdminDashboard() {
  const [tab, setTab] = useState<"faculty" | "gallery">("faculty");

  return (
    <div style={shell}>
      <div className="max-w-5xl mx-auto px-5 py-8">
        <div className="flex items-center justify-between mb-6">
          <div style={{ color: "rgba(245,240,228,0.95)", fontFamily: "var(--font-heading)" }} className="text-xl font-bold">
            Admin Dashboard
          </div>
          <button
            onClick={() => supabase?.auth.signOut()}
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded"
            style={{ ...inputStyle }}
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          {(
            [
              ["faculty", "Faculty", Users],
              ["gallery", "Gallery", ImageIcon],
            ] as const
          ).map(([key, text, Icon]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className="flex items-center gap-1.5 text-sm px-4 py-2 rounded font-semibold"
              style={{
                background: tab === key ? "rgba(245,240,228,0.18)" : "rgba(245,240,228,0.06)",
                border: "1px solid rgba(245,240,228,0.18)",
                color: "rgba(245,240,228,0.9)",
                fontFamily: "var(--font-body)",
              }}
            >
              <Icon size={14} /> {text}
            </button>
          ))}
        </div>

        {tab === "faculty" ? <FacultyManager /> : <GalleryManager />}
      </div>
    </div>
  );
}

/* =========================================================
   FACULTY MANAGER
   ========================================================= */
function FacultyManager() {
  const [rows, setRows] = useState<FacultyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({ name: "", subject: "", classes: "", bio: "", pin_color: "#4A90D9" });

  const load = async () => {
    setLoading(true);
    const data = await fetchFaculty();
    setRows(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.subject.trim()) return;
    setSaving(true);
    let imageUrl: string | null = null;
    if (file) imageUrl = await uploadImage(file, "faculty");
    const created = await addFaculty({
      name: form.name.trim(),
      subject: form.subject.trim(),
      classes: form.classes.trim(),
      bio: form.bio.trim(),
      pin_color: form.pin_color,
      image_url: imageUrl,
      sort_order: rows.length,
    });
    if (created) setRows((r) => [...r, created]);
    setForm({ name: "", subject: "", classes: "", bio: "", pin_color: "#4A90D9" });
    setFile(null);
    setSaving(false);
  };

  const handleDelete = async (row: FacultyRow) => {
    if (!window.confirm(`Remove ${row.name}?`)) return;
    const ok = await deleteFaculty(row);
    if (ok) setRows((r) => r.filter((x) => x.id !== row.id));
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="rounded-lg p-5" style={panel}>
        <div className="text-sm font-bold mb-4 flex items-center gap-1.5" style={{ color: "rgba(245,240,228,0.9)" }}>
          <Plus size={15} /> Add Faculty
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <div className="text-xs mb-1" style={label}>Name</div>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded text-sm outline-none" style={inputStyle} />
          </div>
          <div>
            <div className="text-xs mb-1" style={label}>Subject</div>
            <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full px-3 py-2 rounded text-sm outline-none" style={inputStyle} />
          </div>
          <div>
            <div className="text-xs mb-1" style={label}>Classes taught (e.g. IX–XII)</div>
            <input value={form.classes} onChange={(e) => setForm({ ...form, classes: e.target.value })} className="w-full px-3 py-2 rounded text-sm outline-none" style={inputStyle} />
          </div>
          <div>
            <div className="text-xs mb-1" style={label}>Accent color</div>
            <input type="color" value={form.pin_color} onChange={(e) => setForm({ ...form, pin_color: e.target.value })} className="w-full h-9 rounded" style={{ background: "transparent", border: "1px solid rgba(245,240,228,0.18)" }} />
          </div>
          <div className="sm:col-span-2">
            <div className="text-xs mb-1" style={label}>Short bio</div>
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={2} className="w-full px-3 py-2 rounded text-sm outline-none" style={inputStyle} />
          </div>
          <div className="sm:col-span-2">
            <div className="text-xs mb-1" style={label}>Photo</div>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="text-xs" style={{ color: "rgba(245,240,228,0.8)" }} />
          </div>
        </div>
        <button type="submit" disabled={saving} className="mt-4 flex items-center gap-1.5 px-4 py-2 rounded text-sm font-semibold disabled:opacity-50" style={{ background: "rgba(245,240,228,0.16)", border: "1px solid rgba(245,240,228,0.3)", color: "rgba(245,240,228,0.95)" }}>
          <Upload size={14} /> {saving ? "Saving…" : "Add Faculty"}
        </button>
      </form>

      <div className="rounded-lg overflow-hidden" style={panel}>
        {loading ? (
          <div className="p-5 text-sm opacity-60" style={{ color: "rgba(245,240,228,0.8)" }}>Loading…</div>
        ) : rows.length === 0 ? (
          <div className="p-5 text-sm opacity-60" style={{ color: "rgba(245,240,228,0.8)" }}>No faculty added yet.</div>
        ) : (
          rows.map((row) => (
            <div key={row.id} className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: "1px solid rgba(245,240,228,0.08)" }}>
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0" style={{ background: row.pin_color || "#4A90D9" }}>
                {row.image_url && <img src={row.image_url} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate" style={{ color: "rgba(245,240,228,0.95)" }}>{row.name}</div>
                <div className="text-xs opacity-60" style={{ color: "rgba(245,240,228,0.8)" }}>{row.subject}{row.classes ? ` · Classes ${row.classes}` : ""}</div>
              </div>
              <button onClick={() => handleDelete(row)} className="p-2 rounded" style={{ color: "#FF9DAA" }}>
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* =========================================================
   GALLERY MANAGER
   ========================================================= */
function GalleryManager() {
  const [rows, setRows] = useState<GalleryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");

  const load = async () => {
    setLoading(true);
    const data = await fetchGallery();
    setRows(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setSaving(true);
    const imageUrl = await uploadImage(file, "gallery");
    if (imageUrl) {
      const created = await addGalleryImage({ caption: caption.trim() || "Untitled", image_url: imageUrl, sort_order: rows.length });
      if (created) setRows((r) => [...r, created]);
    }
    setCaption("");
    setFile(null);
    setSaving(false);
  };

  const handleDelete = async (row: GalleryRow) => {
    if (!window.confirm("Remove this photo?")) return;
    const ok = await deleteGalleryImage(row);
    if (ok) setRows((r) => r.filter((x) => x.id !== row.id));
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="rounded-lg p-5" style={panel}>
        <div className="text-sm font-bold mb-4 flex items-center gap-1.5" style={{ color: "rgba(245,240,228,0.9)" }}>
          <Plus size={15} /> Add Photo
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <div className="text-xs mb-1" style={label}>Caption</div>
            <input value={caption} onChange={(e) => setCaption(e.target.value)} className="w-full px-3 py-2 rounded text-sm outline-none" style={inputStyle} placeholder="e.g. Revision Class" />
          </div>
          <div>
            <div className="text-xs mb-1" style={label}>Photo</div>
            <input type="file" accept="image/*" required onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="text-xs" style={{ color: "rgba(245,240,228,0.8)" }} />
          </div>
        </div>
        <button type="submit" disabled={saving} className="mt-4 flex items-center gap-1.5 px-4 py-2 rounded text-sm font-semibold disabled:opacity-50" style={{ background: "rgba(245,240,228,0.16)", border: "1px solid rgba(245,240,228,0.3)", color: "rgba(245,240,228,0.95)" }}>
          <Upload size={14} /> {saving ? "Uploading…" : "Add Photo"}
        </button>
      </form>

      <div className="rounded-lg overflow-hidden" style={panel}>
        {loading ? (
          <div className="p-5 text-sm opacity-60" style={{ color: "rgba(245,240,228,0.8)" }}>Loading…</div>
        ) : rows.length === 0 ? (
          <div className="p-5 text-sm opacity-60" style={{ color: "rgba(245,240,228,0.8)" }}>No photos added yet.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4">
            {rows.map((row) => (
              <div key={row.id} className="relative rounded overflow-hidden group" style={{ aspectRatio: "1/1" }}>
                <img src={row.image_url} className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex flex-col justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(0,0,0,0.55)" }}>
                  <button onClick={() => handleDelete(row)} className="self-end p-1.5 rounded" style={{ background: "rgba(212,24,61,0.85)", color: "white" }}>
                    <Trash2 size={14} />
                  </button>
                  <div className="text-xs text-white truncate">{row.caption}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
