import { getSupabase } from "./supabase";

export const AVATAR_BUCKET = "avatars";
export const AVATAR_MAX_BYTES = 5 * 1024 * 1024; // 5 MB
export const AVATAR_ACCEPTED_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif"
];

function extFromFile(file: File): string {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]{1,5}$/.test(fromName)) return fromName;
  // Fallback dựa trên mime
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif"
  };
  return map[file.type] ?? "bin";
}

function randomToken(): string {
  return (
    Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8)
  );
}

export type UploadAvatarResult = {
  path: string;     // đường dẫn trong bucket, dùng để xóa sau này
  publicUrl: string;
};

export async function uploadAvatar(file: File): Promise<UploadAvatarResult> {
  if (file.size > AVATAR_MAX_BYTES) {
    throw new Error(
      `Ảnh quá lớn (${(file.size / 1024 / 1024).toFixed(1)} MB). Tối đa 5 MB.`
    );
  }
  if (file.type && !AVATAR_ACCEPTED_MIME.includes(file.type)) {
    throw new Error("Định dạng không hỗ trợ. Dùng JPG, PNG, WEBP hoặc GIF.");
  }

  const sb = getSupabase();
  const path = `${randomToken()}.${extFromFile(file)}`;
  const { error } = await sb.storage.from(AVATAR_BUCKET).upload(path, file, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
    cacheControl: "3600"
  });
  if (error) throw error;

  const { data } = sb.storage.from(AVATAR_BUCKET).getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}

// Lấy lại path trong bucket từ public URL đã lưu trong DB.
// Trả về null nếu URL không phải avatar của bucket này.
export function avatarPathFromUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${AVATAR_BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length);
}

export async function removeAvatarByUrl(
  url: string | null | undefined
): Promise<void> {
  const path = avatarPathFromUrl(url);
  if (!path) return;
  const sb = getSupabase();
  // Bỏ qua lỗi - xóa file là best-effort, không nên chặn flow cập nhật DB.
  await sb.storage.from(AVATAR_BUCKET).remove([path]);
}
