import { useEffect, useState } from "react";
import type { ClubStandard, SkillTest } from "../../types/database";
import type { RecordType } from "../../types/football";
import { RECORD_TYPE_HINT, RECORD_TYPE_LABEL } from "../../types/football";
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
  const [standardUnit, setStandardUnit] = useState("giây");
  const [higherIsBetter, setHigherIsBetter] = useState(false);

  useEffect(() => {
    if (initial) {
      setClubStandardId(initial.club_standard_id);
      setTestName(initial.test_name);
      setDescription(initial.description ?? "");
      setRecordType(initial.record_type);
      setStandardUnit(initial.standard_unit);
      setHigherIsBetter(initial.higher_is_better);
    } else {
      setClubStandardId(standards[0]?.id ?? "");
      setTestName("");
      setDescription("");
      setRecordType("time_seconds");
      setStandardUnit("giây");
      setHigherIsBetter(false);
    }
  }, [initial, standards]);

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
          standard_unit: standardUnit.trim() || "điểm",
          higher_is_better: higherIsBetter
        });
      }}
    >
      <FieldLabel label="Thuộc nhóm kỹ năng" required>
        <Select
          value={clubStandardId}
          onChange={(e) => setClubStandardId(e.target.value)}
        >
          {standards.map((s) => (
            <option key={s.id} value={s.id}>
              {s.standard_name}
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
      <div className="grid sm:grid-cols-2 gap-4">
        <FieldLabel
          label="Cách đo kết quả"
          required
          hint={RECORD_TYPE_HINT[recordType]}
        >
          <Select
            value={recordType}
            onChange={(e) => setRecordType(e.target.value as RecordType)}
          >
            {(
              [
                "time_seconds",
                "success_attempt",
                "percentage",
                "score"
              ] as RecordType[]
            ).map((rt) => (
              <option key={rt} value={rt}>
                {RECORD_TYPE_LABEL[rt]}
              </option>
            ))}
          </Select>
        </FieldLabel>
        <FieldLabel label="Đơn vị hiển thị" required>
          <TextInput
            value={standardUnit}
            onChange={(e) => setStandardUnit(e.target.value)}
            placeholder="giây / % / lần / điểm / mét"
          />
        </FieldLabel>
      </div>
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
