import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import type { Student } from "../../types/database";
import type { PreferredFoot } from "../../types/football";
import { Button } from "../common/Button";
import { FieldLabel, Select, TextInput } from "../common/FormField";
import { Avatar } from "../common/Avatar";
import {
  AVATAR_ACCEPTED_MIME,
  AVATAR_MAX_BYTES,
  uploadAvatar
} from "../../lib/storage";

type Props = {
  initial?: Student | null;
  onCancel: () => void;
  onSubmit: (data: Omit<Student, "id">) => void;
};

const POSITION_OPTIONS = [
  "Thủ môn",
  "Trung vệ",
  "Hậu vệ cánh",
  "Tiền vệ phòng ngự",
  "Tiền vệ trung tâm",
  "Tiền vệ tấn công",
  "Tiền đạo cánh",
  "Tiền đạo"
];

export function StudentForm({ initial, onCancel, onSubmit }: Props) {
  const [fullName, setFullName] = useState("");
  const [birthYear, setBirthYear] = useState(new Date().getFullYear() - 14);
  const [position, setPosition] = useState(POSITION_OPTIONS[0]!);
  const [preferredFoot, setPreferredFoot] = useState<PreferredFoot>("right");

  // URL cuối cùng sẽ lưu vào DB. Có thể là URL cũ (edit) hoặc URL mới sau upload.
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  // Preview URL cho file chưa upload (object URL).
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  // File đang chờ upload (set khi user chọn, clear sau khi upload xong).
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (initial) {
      setFullName(initial.full_name);
      setBirthYear(initial.birth_year);
      setPosition(initial.position);
      setPreferredFoot(initial.preferred_foot);
      setAvatarUrl(initial.avatar_url ?? "");
    } else {
      setFullName("");
      setBirthYear(new Date().getFullYear() - 14);
      setPosition(POSITION_OPTIONS[0]!);
      setPreferredFoot("right");
      setAvatarUrl("");
    }
    setPendingFile(null);
    setLocalPreview(null);
    setError(null);
  }, [initial]);

  // Giải phóng object URL khi đổi file hoặc unmount.
  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  const handlePickFile = (file: File | null) => {
    setError(null);
    if (!file) return;
    if (file.size > AVATAR_MAX_BYTES) {
      setError(
        `Ảnh quá lớn (${(file.size / 1024 / 1024).toFixed(1)} MB). Tối đa 5 MB.`
      );
      return;
    }
    if (file.type && !AVATAR_ACCEPTED_MIME.includes(file.type)) {
      setError("Định dạng không hỗ trợ. Dùng JPG, PNG, WEBP hoặc GIF.");
      return;
    }
    if (localPreview) URL.revokeObjectURL(localPreview);
    setPendingFile(file);
    setLocalPreview(URL.createObjectURL(file));
  };

  const handleRemoveAvatar = () => {
    if (localPreview) URL.revokeObjectURL(localPreview);
    setPendingFile(null);
    setLocalPreview(null);
    setAvatarUrl("");
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!fullName.trim()) return;
    setError(null);

    let finalAvatarUrl: string | null = avatarUrl.trim() || null;

    if (pendingFile) {
      setUploading(true);
      try {
        const result = await uploadAvatar(pendingFile);
        finalAvatarUrl = result.publicUrl;
      } catch (err) {
        setUploading(false);
        setError(
          err instanceof Error ? err.message : "Upload ảnh thất bại"
        );
        return;
      }
      setUploading(false);
    }

    setSubmitting(true);
    try {
      onSubmit({
        full_name: fullName.trim(),
        birth_year: birthYear,
        position,
        preferred_foot: preferredFoot,
        avatar_url: finalAvatarUrl
      });
    } finally {
      setSubmitting(false);
    }
  };

  const displayedAvatar = localPreview || avatarUrl || null;
  const busy = uploading || submitting;

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit();
      }}
    >
      <FieldLabel label="Ảnh đại diện" hint="JPG/PNG/WEBP/GIF, tối đa 5 MB">
        <div className="flex items-center gap-4">
          <Avatar name={fullName || "?"} src={displayedAvatar} size="lg" />
          <div className="flex flex-wrap gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept={AVATAR_ACCEPTED_MIME.join(",")}
              className="hidden"
              onChange={(e) => handlePickFile(e.target.files?.[0] ?? null)}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              leftIcon={
                displayedAvatar ? (
                  <Upload className="h-3.5 w-3.5" />
                ) : (
                  <ImagePlus className="h-3.5 w-3.5" />
                )
              }
              onClick={() => fileInputRef.current?.click()}
              disabled={busy}
            >
              {displayedAvatar ? "Đổi ảnh" : "Chọn ảnh"}
            </Button>
            {displayedAvatar ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                onClick={handleRemoveAvatar}
                disabled={busy}
              >
                Xóa ảnh
              </Button>
            ) : null}
          </div>
        </div>
      </FieldLabel>

      <FieldLabel label="Họ và tên" required>
        <TextInput
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Ví dụ: Nguyễn Văn A"
          required
        />
      </FieldLabel>
      <div className="grid sm:grid-cols-2 gap-4">
        <FieldLabel label="Năm sinh" required>
          <TextInput
            type="number"
            value={birthYear}
            onChange={(e) => setBirthYear(parseInt(e.target.value || "0", 10))}
            min={1990}
            max={new Date().getFullYear()}
          />
        </FieldLabel>
        <FieldLabel label="Chân thuận" required>
          <Select
            value={preferredFoot}
            onChange={(e) =>
              setPreferredFoot(e.target.value as PreferredFoot)
            }
          >
            <option value="right">Chân phải</option>
            <option value="left">Chân trái</option>
            <option value="both">Hai chân</option>
          </Select>
        </FieldLabel>
      </div>
      <FieldLabel label="Vị trí thi đấu" required>
        <Select
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        >
          {POSITION_OPTIONS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </Select>
      </FieldLabel>

      {error ? (
        <p className="text-xs text-red-500 -mt-1">{error}</p>
      ) : null}

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={busy}
        >
          Hủy
        </Button>
        <Button
          type="submit"
          variant="secondary"
          disabled={busy}
          leftIcon={
            busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null
          }
        >
          {uploading
            ? "Đang upload ảnh..."
            : initial
              ? "Cập nhật"
              : "Thêm học viên"}
        </Button>
      </div>
    </form>
  );
}
