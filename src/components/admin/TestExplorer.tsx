import { useMemo, useState } from "react";
import {
  ChevronRight,
  Dumbbell,
  Layers,
  Pencil,
  Plus,
  Trash2
} from "lucide-react";
import type {
  ClubStandard,
  SkillTest,
  Student,
  SubSkillTest,
  TestResult
} from "../../types/database";
import { Button } from "../common/Button";
import { Card, CardBody } from "../common/Card";
import { EmptyState } from "../common/EmptyState";
import { Pill } from "../common/Badge";
import { Modal } from "../common/Modal";
import { SkillTestForm } from "./SkillTestForm";
import { ResultMatrix } from "./ResultMatrix";
import { RECORD_TYPE_LABEL } from "../../types/football";

type Props = {
  standards: ClubStandard[];
  tests: SkillTest[];
  subTests: SubSkillTest[];
  students: Student[];
  results: TestResult[];

  onCreateTest: (data: Omit<SkillTest, "id">) => SkillTest;
  onUpdateTest: (id: string, data: Partial<Omit<SkillTest, "id">>) => void;
  onDeleteTest: (id: string) => void;

  onCreateSub: (data: Omit<SubSkillTest, "id">) => SubSkillTest;
  onUpdateSub: (id: string, data: Partial<Omit<SubSkillTest, "id">>) => void;
  onDeleteSub: (id: string) => void;

  onCreateResult: (
    data: Omit<TestResult, "id" | "score_percent">
  ) => TestResult;
  onUpdateResult: (
    id: string,
    data: Partial<Omit<TestResult, "id">>
  ) => void;
  onDeleteResult: (id: string) => void;
};

export function TestExplorer({
  standards,
  tests,
  subTests,
  students,
  results,
  onCreateTest,
  onUpdateTest,
  onDeleteTest,
  onCreateSub,
  onUpdateSub,
  onDeleteSub,
  onCreateResult,
  onUpdateResult,
  onDeleteResult
}: Props) {
  const [selectedStandardId, setSelectedStandardId] = useState<string | null>(
    null
  );
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);

  const [testModal, setTestModal] = useState<{
    open: boolean;
    editing: SkillTest | null;
  }>({ open: false, editing: null });

  const selectedStandard = useMemo(
    () => standards.find((s) => s.id === selectedStandardId) ?? null,
    [standards, selectedStandardId]
  );
  const selectedTest = useMemo(
    () => tests.find((t) => t.id === selectedTestId) ?? null,
    [tests, selectedTestId]
  );

  const testsInStandard = useMemo(
    () =>
      selectedStandardId
        ? tests.filter((t) => t.club_standard_id === selectedStandardId)
        : [],
    [tests, selectedStandardId]
  );

  const subsInTest = useMemo(
    () =>
      selectedTestId
        ? subTests.filter((s) => s.skill_test_id === selectedTestId)
        : [],
    [subTests, selectedTestId]
  );

  const goToStandards = () => {
    setSelectedStandardId(null);
    setSelectedTestId(null);
  };
  const goToTests = () => setSelectedTestId(null);

  /* -------- Breadcrumb -------- */
  const breadcrumb = (
    <nav className="flex items-center gap-1.5 text-xs text-muted flex-wrap">
      <button
        onClick={goToStandards}
        className={`inline-flex items-center gap-1.5 font-semibold hover:text-ink transition ${
          !selectedStandard ? "text-ink" : ""
        }`}
      >
        <Layers className="h-3.5 w-3.5" />
        Nhóm kỹ năng
      </button>
      {selectedStandard ? (
        <>
          <ChevronRight className="h-3.5 w-3.5 text-muted/60" />
          <button
            onClick={goToTests}
            className={`inline-flex items-center gap-1.5 font-semibold hover:text-ink transition ${
              !selectedTest ? "text-ink" : ""
            }`}
          >
            <Dumbbell className="h-3.5 w-3.5" />
            {selectedStandard.standard_name}
          </button>
        </>
      ) : null}
      {selectedTest ? (
        <>
          <ChevronRight className="h-3.5 w-3.5 text-muted/60" />
          <span className="text-ink font-semibold">
            {selectedTest.test_name}
          </span>
        </>
      ) : null}
    </nav>
  );

  /* -------- Level 1: standards grid -------- */
  if (!selectedStandard) {
    return (
      <div className="space-y-4">
        {breadcrumb}
        {standards.length === 0 ? (
          <EmptyState
            title="Chưa có nhóm kỹ năng"
            description="Hãy thêm nhóm kỹ năng trong tab Nhóm kỹ năng trước."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {standards.map((cs) => {
              const csTests = tests.filter(
                (t) => t.club_standard_id === cs.id
              );
              const csSubCount = subTests.filter((s) =>
                csTests.some((t) => t.id === s.skill_test_id)
              ).length;
              return (
                <button
                  key={cs.id}
                  type="button"
                  onClick={() => setSelectedStandardId(cs.id)}
                  className="text-left rounded-2xl border border-border bg-card p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-glow hover:border-brand/60 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-brand-300 uppercase tracking-wider">
                        {cs.standard_name}
                      </p>
                      {cs.description ? (
                        <p className="text-sm text-ink/80 mt-1 line-clamp-2">
                          {cs.description}
                        </p>
                      ) : null}
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted group-hover:text-brand transition shrink-0" />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <Pill>{csTests.length} bài test</Pill>
                    <Pill>{csSubCount} bài test con</Pill>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  /* -------- Level 2: tests in standard -------- */
  if (!selectedTest) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {breadcrumb}
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Plus className="h-3.5 w-3.5" />}
            onClick={() => setTestModal({ open: true, editing: null })}
          >
            Thêm bài test
          </Button>
        </div>

        {testsInStandard.length === 0 ? (
          <EmptyState
            title={`Nhóm "${selectedStandard.standard_name}" chưa có bài test`}
            description="Thêm bài test đầu tiên cho nhóm kỹ năng này."
          />
        ) : (
          <Card>
            <CardBody className="!p-0">
              <ul className="divide-y divide-border/70">
                {testsInStandard.map((t) => {
                  const subCount = subTests.filter(
                    (s) => s.skill_test_id === t.id
                  ).length;
                  return (
                    <li
                      key={t.id}
                      className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-brand/5 transition"
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedTestId(t.id)}
                        className="flex-1 text-left min-w-0"
                      >
                        <p className="font-semibold text-ink truncate">
                          {t.test_name}
                        </p>
                        <p className="text-xs text-muted mt-0.5">
                          {RECORD_TYPE_LABEL[t.record_type]} · đơn vị{" "}
                          {t.standard_unit} ·{" "}
                          {t.higher_is_better
                            ? "Càng cao càng tốt"
                            : "Càng thấp càng tốt"}{" "}
                          · {subCount} bài test con
                        </p>
                      </button>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            setTestModal({ open: true, editing: t })
                          }
                          className="h-8 w-8 rounded-lg flex items-center justify-center bg-ink/10 text-ink hover:bg-ink/20 transition"
                          aria-label="Sửa bài test"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (
                              confirm(
                                `Xóa bài test "${t.test_name}"? Bài test con và kết quả liên quan sẽ bị xóa.`
                              )
                            ) {
                              onDeleteTest(t.id);
                            }
                          }}
                          className="h-8 w-8 rounded-lg flex items-center justify-center bg-red-500/15 text-red-300 hover:bg-red-500/25 transition"
                          aria-label="Xóa bài test"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedTestId(t.id)}
                          className="h-8 w-8 rounded-lg flex items-center justify-center bg-brand/15 text-brand-300 hover:bg-brand/25 transition"
                          aria-label="Mở bài test"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </CardBody>
          </Card>
        )}

        <Modal
          open={testModal.open}
          onClose={() => setTestModal({ open: false, editing: null })}
          title={testModal.editing ? "Cập nhật bài test" : "Thêm bài test"}
        >
          <SkillTestForm
            standards={standards}
            initial={
              testModal.editing ??
              ({
                id: "",
                club_standard_id: selectedStandard.id,
                test_name: "",
                description: null,
                record_type: "time_seconds",
                standard_unit: "giây",
                higher_is_better: false
              } as SkillTest)
            }
            onCancel={() => setTestModal({ open: false, editing: null })}
            onSubmit={(data) => {
              if (testModal.editing) {
                onUpdateTest(testModal.editing.id, data);
              } else {
                const created = onCreateTest(data);
                setSelectedTestId(created.id);
              }
              setTestModal({ open: false, editing: null });
            }}
          />
        </Modal>
      </div>
    );
  }

  /* -------- Level 3: matrix -------- */
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {breadcrumb}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTestModal({ open: true, editing: selectedTest })}
            leftIcon={<Pencil className="h-3.5 w-3.5" />}
          >
            Sửa bài test
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (
                confirm(
                  `Xóa bài test "${selectedTest.test_name}"? Bài test con và kết quả liên quan sẽ bị xóa.`
                )
              ) {
                const standardId = selectedTest.club_standard_id;
                onDeleteTest(selectedTest.id);
                setSelectedTestId(null);
                setSelectedStandardId(standardId);
              }
            }}
            leftIcon={<Trash2 className="h-3.5 w-3.5" />}
          >
            Xóa bài test
          </Button>
        </div>
      </div>

      <ResultMatrix
        test={selectedTest}
        subTests={subsInTest}
        students={students}
        results={results}
        onCreateSub={onCreateSub}
        onUpdateSub={onUpdateSub}
        onDeleteSub={onDeleteSub}
        onCreateResult={onCreateResult}
        onUpdateResult={onUpdateResult}
        onDeleteResult={onDeleteResult}
      />

      <Modal
        open={testModal.open}
        onClose={() => setTestModal({ open: false, editing: null })}
        title="Cập nhật bài test"
      >
        <SkillTestForm
          standards={standards}
          initial={testModal.editing}
          onCancel={() => setTestModal({ open: false, editing: null })}
          onSubmit={(data) => {
            if (testModal.editing) {
              onUpdateTest(testModal.editing.id, data);
            }
            setTestModal({ open: false, editing: null });
          }}
        />
      </Modal>
    </div>
  );
}
