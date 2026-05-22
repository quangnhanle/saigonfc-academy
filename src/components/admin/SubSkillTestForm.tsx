import { useEffect, useState } from "react";
import type { SkillTest, SubSkillTest } from "../../types/database";
import { Button } from "../common/Button";
import { FieldLabel, TextInput } from "../common/FormField";

type Props = {
  tests: SkillTest[];
  initial?: SubSkillTest | null;
  onCancel: () => void;
  onSubmit: (data: Omit<SubSkillTest, "id">) => void;
};

export function SubSkillTestForm({
  tests,
  initial,
  onCancel,
  onSubmit
}: Props) {
  const [skillTestId, setSkillTestId] = useState(tests[0]?.id ?? "");
  const [subName, setSubName] = useState("");
  const [standardScore, setStandardScore] = useState(0);

  useEffect(() => {
    if (initial) {
      setSkillTestId(initial.skill_test_id);
      setSubName(initial.sub_skill_test_name);
      setStandardScore(initial.standard_score);
    } else {
      setSkillTestId(tests[0]?.id ?? "");
      setSubName("");
      setStandardScore(0);
    }
  }, [initial, tests]);

  const selectedTest = tests.find((t) => t.id === skillTestId);

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!subName.trim() || !skillTestId) return;
        onSubmit({
          skill_test_id: skillTestId,
          sub_skill_test_name: subName.trim(),
          standard_score: Number(standardScore)
        });
      }}
    >
      <FieldLabel label="Thuộc bài test" required>
        <TextInput value={selectedTest?.test_name ?? ""} readOnly />
      </FieldLabel>
      <FieldLabel label="Tên bài test con" required>
        <TextInput
          value={subName}
          onChange={(e) => setSubName(e.target.value)}
          placeholder="Ví dụ: Chân trái, Chân phải, Hai chân..."
          required
        />
      </FieldLabel>
      <div className="grid sm:grid-cols-2 gap-4">
        <FieldLabel
          label={`Điểm chuẩn (${selectedTest?.standard_unit ?? ""})`}
          required
          hint={
            selectedTest
              ? selectedTest.higher_is_better
                ? "Càng cao càng tốt"
                : "Càng thấp càng tốt"
              : undefined
          }
        >
          <TextInput
            type="number"
            step="0.01"
            value={standardScore}
            onChange={(e) =>
              setStandardScore(parseFloat(e.target.value || "0"))
            }
          />
        </FieldLabel>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit" variant="secondary">
          {initial ? "Cập nhật" : "Thêm bài test con"}
        </Button>
      </div>
    </form>
  );
}
