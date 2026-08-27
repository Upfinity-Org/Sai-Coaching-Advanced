import { supabase, supabaseEnabled, STORAGE_BUCKET } from "./supabaseClient";

/* =========================================================
   TYPES
   ========================================================= */
export type FacultyRow = {
  id: string;
  name: string;
  subject: string;
  classes: string;
  bio: string | null;
  pin_color: string | null;
  image_url: string | null;
  sort_order: number;
  created_at?: string;
};

export type GalleryRow = {
  id: string;
  caption: string;
  image_url: string;
  sort_order: number;
  created_at?: string;
};

/* =========================================================
   READ (public — used by the live site)
   ========================================================= */
export async function fetchFaculty(): Promise<FacultyRow[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("faculty")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) {
    console.error("fetchFaculty:", error.message);
    return null;
  }
  return data as FacultyRow[];
}

export async function fetchGallery(): Promise<GalleryRow[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) {
    console.error("fetchGallery:", error.message);
    return null;
  }
  return data as GalleryRow[];
}

/* =========================================================
   WRITE (admin only — enforced server-side by Row Level
   Security; these calls will fail for a non-authenticated
   caller regardless of what the UI does)
   ========================================================= */
export async function uploadImage(
  file: File,
  folder: "faculty" | "gallery"
): Promise<string | null> {
  if (!supabase) return null;
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) {
    console.error("uploadImage:", error.message);
    return null;
  }
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

async function deleteImageByUrl(url: string | null) {
  if (!supabase || !url) return;
  const marker = `/object/public/${STORAGE_BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return;
  const path = url.slice(idx + marker.length);
  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([path]);
  if (error) console.error("deleteImageByUrl:", error.message);
}

export async function addFaculty(rec: {
  name: string;
  subject: string;
  classes: string;
  bio: string;
  pin_color: string;
  image_url: string | null;
  sort_order: number;
}): Promise<FacultyRow | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("faculty")
    .insert(rec)
    .select()
    .single();
  if (error) {
    console.error("addFaculty:", error.message);
    return null;
  }
  return data as FacultyRow;
}

export async function deleteFaculty(row: FacultyRow): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from("faculty").delete().eq("id", row.id);
  if (error) {
    console.error("deleteFaculty:", error.message);
    return false;
  }
  await deleteImageByUrl(row.image_url);
  return true;
}

export async function addGalleryImage(rec: {
  caption: string;
  image_url: string;
  sort_order: number;
}): Promise<GalleryRow | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("gallery")
    .insert(rec)
    .select()
    .single();
  if (error) {
    console.error("addGalleryImage:", error.message);
    return null;
  }
  return data as GalleryRow;
}

export async function deleteGalleryImage(row: GalleryRow): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from("gallery").delete().eq("id", row.id);
  if (error) {
    console.error("deleteGalleryImage:", error.message);
    return false;
  }
  await deleteImageByUrl(row.image_url);
  return true;
}

export { supabaseEnabled };
