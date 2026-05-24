import { useEffect, useState } from "react";
import type { ClubStandard, SkillTest } from "../../types/database";
import type { RecordType } from "../../types/football";
import {
  RECORD_TYPES,
  RECORD_TYPE_HINT,
  RECORD_TYPE_LABEL,
  RECORD_TYPE_UNIT
} from "../../types/football";
import { Button } from "../common/Button";
import { FieldLabel, Select, TextArea, TextInput } from "../common/FormField";

type Props = {
  standards: ClubStandard[];
  initial?: SkillTest | null;
  onCancel: () => void;
  onSubmit: (data: Omit<SkillTest, "id">) => void;
};

export function SkillTestForm({
  standards,
  initial,
  onCancel,
  onSubmit
}: Props) {
  const [clubStandardId, setClubStandardId] = useState(
    standards[0]?.id ?? ""
  );
  const [testName, setTestName] = useState("");
  const [description, setDescription] = useState("");
  const [recordType, setRecordType] = useState<RecordType>("time_seconds");
  const [higherIsBetter, setHigherIsBetter] = useState(false);

  useEffect(() => {
    if (initial) {
      setClubStandardId(initial.club_standard_id);
      setTestName(initial.test_name);
      setDescription(initial.description ?? "");
      setRecordType(initial.record_type);
      setHigherIsBetter(initial.higher_is_better);
    } else {
      setClubStandardId(standards[0]?.id ?? "");
      setTestName("");
      setDescription("");
      setRecordType("time_seconds");
      setHigherIsBetter(false);
    }
  }, [initial, standards]);

  const selectedStandard = standards.find((s) => s.id === clubStandardId);

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!testName.trim() || !clubStandardId) return;
        onSubmit({
          club_standard_id: clubStandardId,
          test_name: testName.trim(),
          description: description.trim() || null,
          record_type: recordType,
          higher_is_better: higherIsBetter
        });
      }}
    >
      <FieldLabel
        label="Thuộc nhóm kỹ năng"
        required
        hint={
          selectedStandard
            ? `Bài test này dùng điểm tiêu chuẩn ${selectedStandard.standard_score}% của nhóm "${selectedStandard.standard_name}".`
            : undefined
        }
      >
        <Select
          value={clubStandardId}
          onChange={(e) => setClubStandardId(e.target.value)}
        >
          {standards.map((s) => (
            <option key={s.id} value={s.id}>
              {s.standard_name} · chuẩn {s.standard_score}%
            </option>
          ))}
        </Select>
      </FieldLabel>
      <FieldLabel label="Tên bài test" required>
        <TextInput
          value={testName}
          onChange={(e) => setTestName(e.target.value)}
          placeholder="Ví dụ: Dẫn bóng qua chướng ngại vật"
          required
        />
      </FieldLabel>
      <FieldLabel
        label="Cách đo kết quả"
        required
        hint={`${RECORD_TYPE_HINT[recordType]} · đơn vị "${RECORD_TYPE_UNIT[recordType]}"`}
      >
        <Select
          value={recordType}
          onChange={(e) => setRecordType(e.target.value as RecordType)}
        >
          {RECORD_TYPES.map((rt) => (
            <option key={rt} value={rt}>
              {RECORD_TYPE_LABEL[rt]} ({RECORD_TYPE_UNIT[rt]})
            </option>
          ))}
        </Select>
      </FieldLabel>
      <FieldLabel label="Cách tính điểm" required>
        <Select
          value={higherIsBetter ? "yes" : "no"}
          onChange={(e) => setHigherIsBetter(e.target.value === "yes")}
        >
          <option value="yes">Càng cao càng tốt</option>
          <option value="no">Càng thấp càng tốt (ví dụ giây)</option>
        </Select>
      </FieldLabel>
      <FieldLabel label="Mô tả">
        <TextArea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Mô tả ngắn về cách thực hiện bài test..."
        />
      </FieldLabel>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit" variant="secondary">
          {initial ? "Cập nhật" : "Thêm bài test"}
        </Button>
      </div>
    </form>
  );
}
