import { useEffect, useState } from "react";
import type { Student } from "../../types/database";
import type { PreferredFoot } from "../../types/football";
import { Button } from "../common/Button";
import { FieldLabel, Select, TextInput } from "../common/FormField";

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
  const [avatarUrl, setAvatarUrl] = useState("");

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
  }, [initial]);

  const handleSubmit = () => {
    if (!fullName.trim()) return;
    onSubmit({
      full_name: fullName.trim(),
      birth_year: birthYear,
      position,
      preferred_foot: preferredFoot,
      avatar_url: avatarUrl.trim() || null
    });
  };

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
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
      <FieldLabel label="Avatar URL" hint="Để trống nếu chưa có ảnh">
        <TextInput
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          placeholder="https://..."
        />
      </FieldLabel>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit" variant="secondary">
          {initial ? "Cập nhật" : "Thêm học viên"}
        </Button>
      </div>
    </form>
  );
}
