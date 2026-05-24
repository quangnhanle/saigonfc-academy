import { useEffect, useState } from "react";
import type { ClubStandard } from "../../types/database";
import { Button } from "../common/Button";
import { FieldLabel, TextInput } from "../common/FormField";

type Props = {
  initial?: ClubStandard | null;
  onCancel: () => void;
  onSubmit: (data: Omit<ClubStandard, "id">) => void;
};

export function ClubStandardForm({ initial, onCancel, onSubmit }: Props) {
  const [standardName, setStandardName] = useState("");
  const [standardScore, setStandardScore] = useState<number>(100);

  useEffect(() => {
    if (initial) {
      setStandardName(initial.standard_name);
      setStandardScore(initial.standard_score ?? 100);
    } else {
      setStandardName("");
      setStandardScore(100);
    }
  }, [initial]);

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!standardName.trim()) return;
        const clamped = Math.max(
          0,
          Math.min(100, Number.isFinite(standardScore) ? standardScore : 100)
        );
        onSubmit({
          standard_name: standardName.trim(),
          standard_score: clamped,
        });
      }}
    >
      <FieldLabel label="Tên nhóm kỹ năng" required>
        <TextInput
          value={standardName}
          onChange={(e) => setStandardName(e.target.value)}
          placeholder="Ví dụ: Dẫn bóng, Chuyền bóng..."
          required
        />
      </FieldLabel>
      <FieldLabel
        label="Điểm tiêu chuẩn (%)"
        required
        hint="Ngưỡng đạt chuẩn của nhóm kỹ năng này, từ 0 đến 100 (mặc định 100). Các bài test cha trong nhóm sẽ dùng chung điểm tiêu chuẩn này."
      >
        <TextInput
          type="number"
          min={0}
          max={100}
          step="1"
          value={standardScore}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            setStandardScore(Number.isFinite(v) ? v : 0);
          }}
        />
      </FieldLabel>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit" variant="secondary">
          {initial ? "Cập nhật" : "Thêm nhóm kỹ năng"}
        </Button>
      </div>
    </form>
  );
}
