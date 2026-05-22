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

  useEffect(() => {
    if (initial) {
      setStandardName(initial.standard_name);
    } else {
      setStandardName("");
    }
  }, [initial]);

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!standardName.trim()) return;
        onSubmit({
          standard_name: standardName.trim(),
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
