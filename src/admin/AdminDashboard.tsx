import React, { useEffect, useState } from "react";
import { LogOut, Trash2, Upload, Plus, Users, Image as ImageIcon, Pencil, X } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import {
  fetchFaculty,
  fetchGallery,
  addFaculty,
  updateFaculty,
  deleteFaculty,
  addGalleryImage,
  updateGalleryCaption,
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
const errorBox: React.CSSProperties = {
  background: "rgba(212,24,61,0.1)",
  color: "#FF9DAA",
  border: "1px solid rgba(212,24,61,0.3)",
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
const emptyFacultyForm = { name: "", subject: "", classes: "", bio: "", pin_color: "#4A90D9" };

function FacultyManager() {
  const [rows, setRows] = useState<FacultyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState(emptyFacultyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const data = await fetchFaculty();
    setRows(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (row: FacultyRow) => {
    setEditingId(row.id);
    setForm({ name: row.name, subject: row.subject, classes: row.classes, bio: row.bio ?? "", pin_color: row.pin_color || "#4A90D9" });
    setFile(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyFacultyForm);
    setFile(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.subject.trim()) return;
    setSaving(true);
    setError(null);

    let imageUrl: string | null | undefined = undefined;
    if (file) {
      imageUrl = await uploadImage(file, "faculty");
      if (!imageUrl) {
        setError("Image upload failed — check that the site-images bucket and its policies are set up (see supabase/SETUP.md). Saving the rest of the details without a new photo.");
      }
    }

    if (editingId) {
      const patch: Record<string, unknown> = {
        name: form.name.trim(),
        subject: form.subject.trim(),
        classes: form.classes.trim(),
        bio: form.bio.trim(),
        pin_color: form.pin_color,
      };
      if (imageUrl) patch.image_url = imageUrl;
      const updated = await updateFaculty(editingId, patch);
      if (updated) {
        setRows((r) => r.map((x) => (x.id === editingId ? updated : x)));
        cancelEdit();
      } else if (!error) {
        setError("Couldn't save changes. Check that you're still logged in and the write policy on 'faculty' allows authenticated updates.");
      }
    } else {
      const created = await addFaculty({
        name: form.name.trim(),
        subject: form.subject.trim(),
        classes: form.classes.trim(),
        bio: form.bio.trim(),
        pin_color: form.pin_color,
        image_url: imageUrl ?? null,
        sort_order: rows.length,
      });
      if (created) {
        setRows((r) => [...r, created]);
        cancelEdit();
      } else if (!error) {
        setError("Couldn't add faculty. Check that you're still logged in and the write policy on 'faculty' allows authenticated inserts.");
      }
    }
    setSaving(false);
  };

  const handleDelete = async (row: FacultyRow) => {
    if (!window.confirm(`Remove ${row.name}?`)) return;
    const ok = await deleteFaculty(row);
    if (ok) setRows((r) => r.filter((x) => x.id !== row.id));
    else setError("Couldn't delete — check you're still logged in.");
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="rounded-lg p-5" style={panel}>
        <div className="text-sm font-bold mb-4 flex items-center justify-between" style={{ color: "rgba(245,240,228,0.9)" }}>
          <span className="flex items-center gap-1.5">
            {editingId ? <Pencil size={15} /> : <Plus size={15} />} {editingId ? "Edit Faculty" : "Add Faculty"}
          </span>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="flex items-center gap-1 text-xs opacity-70">
              <X size={13} /> Cancel
            </button>
          )}
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
            <div className="text-xs mb-1" style={label}>{editingId ? "Replace photo (optional)" : "Photo"}</div>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="text-xs" style={{ color: "rgba(245,240,228,0.8)" }} />
          </div>
        </div>

        {error && <div className="mt-3 text-xs px-3 py-2 rounded" style={errorBox}>{error}</div>}

        <button type="submit" disabled={saving} className="mt-4 flex items-center gap-1.5 px-4 py-2 rounded text-sm font-semibold disabled:opacity-50" style={{ background: "rgba(245,240,228,0.16)", border: "1px solid rgba(245,240,228,0.3)", color: "rgba(245,240,228,0.95)" }}>
          <Upload size={14} /> {saving ? "Saving…" : editingId ? "Save Changes" : "Add Faculty"}
        </button>
      </form>

      <div className="rounded-lg overflow-hidden" style={panel}>
        {loading ? (
          <div className="p-5 text-sm opacity-60" style={{ color: "rgba(245,240,228,0.8)" }}>Loading…</div>
        ) : rows.length === 0 ? (
          <div className="p-5 text-sm opacity-60" style={{ color: "rgba(245,240,228,0.8)" }}>No faculty added yet.</div>
        ) : (
          rows.map((row) => (
            <div key={row.id} className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: "1px solid rgba(245,240,228,0.08)", background: editingId === row.id ? "rgba(245,240,228,0.05)" : "transparent" }}>
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0" style={{ background: row.pin_color || "#4A90D9" }}>
                {row.image_url && <img src={row.image_url} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate" style={{ color: "rgba(245,240,228,0.95)" }}>{row.name}</div>
                <div className="text-xs opacity-60" style={{ color: "rgba(245,240,228,0.8)" }}>{row.subject}{row.classes ? ` · Classes ${row.classes}` : ""}</div>
              </div>
              <button onClick={() => startEdit(row)} className="p-2 rounded" style={{ color: "rgba(245,240,228,0.7)" }}>
                <Pencil size={16} />
              </button>
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const data = await fetchGallery();
    setRows(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (row: GalleryRow) => {
    setEditingId(row.id);
    setCaption(row.caption);
    setFile(null);
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setCaption("");
    setFile(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    if (editingId) {
      const updated = await updateGalleryCaption(editingId, caption.trim() || "Untitled");
      if (updated) {
        setRows((r) => r.map((x) => (x.id === editingId ? updated : x)));
        cancelEdit();
      } else {
        setError("Couldn't save the caption. Check that you're still logged in.");
      }
      setSaving(false);
      return;
    }

    if (!file) {
      setSaving(false);
      return;
    }
    const imageUrl = await uploadImage(file, "gallery");
    if (!imageUrl) {
      setError("Image upload failed — check that the site-images bucket exists and its policies allow authenticated uploads (see supabase/SETUP.md).");
      setSaving(false);
      return;
    }
    const created = await addGalleryImage({ caption: caption.trim() || "Untitled", image_url: imageUrl, sort_order: rows.length });
    if (created) {
      setRows((r) => [...r, created]);
      cancelEdit();
    } else {
      setError("Photo uploaded, but saving it to the gallery list failed. Check the write policy on 'gallery'.");
    }
    setSaving(false);
  };

  const handleDelete = async (row: GalleryRow) => {
    if (!window.confirm("Remove this photo?")) return;
    const ok = await deleteGalleryImage(row);
    if (ok) setRows((r) => r.filter((x) => x.id !== row.id));
    else setError("Couldn't delete — check you're still logged in.");
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="rounded-lg p-5" style={panel}>
        <div className="text-sm font-bold mb-4 flex items-center justify-between" style={{ color: "rgba(245,240,228,0.9)" }}>
          <span className="flex items-center gap-1.5">
            {editingId ? <Pencil size={15} /> : <Plus size={15} />} {editingId ? "Edit Caption" : "Add Photo"}
          </span>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="flex items-center gap-1 text-xs opacity-70">
              <X size={13} /> Cancel
            </button>
          )}
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <div className="text-xs mb-1" style={label}>Caption</div>
            <input value={caption} onChange={(e) => setCaption(e.target.value)} className="w-full px-3 py-2 rounded text-sm outline-none" style={inputStyle} placeholder="e.g. Revision Class" />
          </div>
          {!editingId && (
            <div>
              <div className="text-xs mb-1" style={label}>Photo</div>
              <input type="file" accept="image/*" required onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="text-xs" style={{ color: "rgba(245,240,228,0.8)" }} />
            </div>
          )}
        </div>

        {error && <div className="mt-3 text-xs px-3 py-2 rounded" style={errorBox}>{error}</div>}

        <button type="submit" disabled={saving} className="mt-4 flex items-center gap-1.5 px-4 py-2 rounded text-sm font-semibold disabled:opacity-50" style={{ background: "rgba(245,240,228,0.16)", border: "1px solid rgba(245,240,228,0.3)", color: "rgba(245,240,228,0.95)" }}>
          <Upload size={14} /> {saving ? (editingId ? "Saving…" : "Uploading…") : editingId ? "Save Caption" : "Add Photo"}
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
              <div key={row.id} className="relative rounded overflow-hidden group" style={{ aspectRatio: "1/1", outline: editingId === row.id ? "2px solid rgba(245,240,228,0.6)" : "none" }}>
                <img src={row.image_url} className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex flex-col justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(0,0,0,0.55)" }}>
                  <div className="flex justify-end gap-1.5">
                    <button onClick={() => startEdit(row)} className="p-1.5 rounded" style={{ background: "rgba(245,240,228,0.85)", color: "#1a1a1a" }}>
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(row)} className="p-1.5 rounded" style={{ background: "rgba(212,24,61,0.85)", color: "white" }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
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
