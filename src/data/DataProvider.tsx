import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from "react";
import type {
  ClubStandard,
  SkillTest,
  Student,
  SubSkillTest,
  TestResult
} from "../types/database";
import {
  clubStandards as seedClubStandards,
  skillTests as seedSkillTests,
  students as seedStudents,
  subSkillTests as seedSubSkillTests,
  testResults as seedTestResults
} from "./mockData";
import { calculateScorePercent } from "../utils/score";

type ToastKind = "success" | "error" | "info";
export type Toast = { id: string; message: string; kind: ToastKind };

type DataState = {
  students: Student[];
  clubStandards: ClubStandard[];
  skillTests: SkillTest[];
  subSkillTests: SubSkillTest[];
  testResults: TestResult[];
  toasts: Toast[];

  // Students
  createStudent: (input: Omit<Student, "id">) => Student;
  updateStudent: (id: string, input: Partial<Omit<Student, "id">>) => void;
  deleteStudent: (id: string) => void;

  // Club standards
  createClubStandard: (input: Omit<ClubStandard, "id">) => ClubStandard;
  updateClubStandard: (
    id: string,
    input: Partial<Omit<ClubStandard, "id">>
  ) => void;
  deleteClubStandard: (id: string) => void;

  // Skill tests
  createSkillTest: (input: Omit<SkillTest, "id">) => SkillTest;
  updateSkillTest: (
    id: string,
    input: Partial<Omit<SkillTest, "id">>
  ) => void;
  deleteSkillTest: (id: string) => void;

  // Sub skill tests
  createSubSkillTest: (input: Omit<SubSkillTest, "id">) => SubSkillTest;
  updateSubSkillTest: (
    id: string,
    input: Partial<Omit<SubSkillTest, "id">>
  ) => void;
  deleteSubSkillTest: (id: string) => void;

  // Test results
  createTestResult: (
    input: Omit<TestResult, "id" | "score_percent">
  ) => TestResult;
  updateTestResult: (
    id: string,
    input: Partial<Omit<TestResult, "id">>
  ) => void;
  deleteTestResult: (id: string) => void;

  pushToast: (message: string, kind?: ToastKind) => void;
  dismissToast: (id: string) => void;
};

const DataContext = createContext<DataState | null>(null);

let counter = 1000;
const nextId = (prefix: string) => `${prefix}-${(counter++).toString(36)}`;

export function DataProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>(seedStudents);
  const [clubStandards, setClubStandards] =
    useState<ClubStandard[]>(seedClubStandards);
  const [skillTests, setSkillTests] =
    useState<SkillTest[]>(seedSkillTests);
  const [subSkillTests, setSubSkillTests] =
    useState<SubSkillTest[]>(seedSubSkillTests);
  const [testResults, setTestResults] =
    useState<TestResult[]>(seedTestResults);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const pushToast = useCallback(
    (message: string, kind: ToastKind = "success") => {
      const id = nextId("toast");
      setToasts((prev) => [...prev, { id, message, kind }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3200);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ---- Students ----
  const createStudent = useCallback(
    (input: Omit<Student, "id">) => {
      const created: Student = { ...input, id: nextId("s") };
      setStudents((prev) => [...prev, created]);
      pushToast(`Đã thêm học viên ${created.full_name}`);
      return created;
    },
    [pushToast]
  );
  const updateStudent = useCallback(
    (id: string, input: Partial<Omit<Student, "id">>) => {
      setStudents((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...input } : s))
      );
      pushToast("Đã cập nhật học viên");
    },
    [pushToast]
  );
  const deleteStudent = useCallback(
    (id: string) => {
      setStudents((prev) => prev.filter((s) => s.id !== id));
      setTestResults((prev) => prev.filter((r) => r.student_id !== id));
      pushToast("Đã xóa học viên", "info");
    },
    [pushToast]
  );

  // ---- Club standards ----
  const createClubStandard = useCallback(
    (input: Omit<ClubStandard, "id">) => {
      const created: ClubStandard = { ...input, id: nextId("cs") };
      setClubStandards((prev) => [...prev, created]);
      pushToast(`Đã thêm nhóm kỹ năng ${created.standard_name}`);
      return created;
    },
    [pushToast]
  );
  const updateClubStandard = useCallback(
    (id: string, input: Partial<Omit<ClubStandard, "id">>) => {
      setClubStandards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...input } : c))
      );
      pushToast("Đã cập nhật nhóm kỹ năng");
    },
    [pushToast]
  );
  const deleteClubStandard = useCallback(
    (id: string) => {
      const removedTestIds = skillTests
        .filter((t) => t.club_standard_id === id)
        .map((t) => t.id);
      const removedSubIds = subSkillTests
        .filter((s) => removedTestIds.includes(s.skill_test_id))
        .map((s) => s.id);
      setClubStandards((prev) => prev.filter((c) => c.id !== id));
      setSkillTests((prev) =>
        prev.filter((t) => t.club_standard_id !== id)
      );
      setSubSkillTests((prev) =>
        prev.filter((s) => !removedTestIds.includes(s.skill_test_id))
      );
      setTestResults((prev) =>
        prev.filter((r) => !removedSubIds.includes(r.sub_skill_test_id))
      );
      pushToast("Đã xóa nhóm kỹ năng (cascade)", "info");
    },
    [pushToast, skillTests, subSkillTests]
  );

  // ---- Skill tests ----
  const createSkillTest = useCallback(
    (input: Omit<SkillTest, "id">) => {
      const created: SkillTest = { ...input, id: nextId("st") };
      setSkillTests((prev) => [...prev, created]);
      pushToast(`Đã thêm bài test ${created.test_name}`);
      return created;
    },
    [pushToast]
  );
  const updateSkillTest = useCallback(
    (id: string, input: Partial<Omit<SkillTest, "id">>) => {
      setSkillTests((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...input } : t))
      );
      pushToast("Đã cập nhật bài test");
    },
    [pushToast]
  );
  const deleteSkillTest = useCallback(
    (id: string) => {
      const removedSubIds = subSkillTests
        .filter((s) => s.skill_test_id === id)
        .map((s) => s.id);
      setSkillTests((prev) => prev.filter((t) => t.id !== id));
      setSubSkillTests((prev) =>
        prev.filter((s) => s.skill_test_id !== id)
      );
      setTestResults((prev) =>
        prev.filter((r) => !removedSubIds.includes(r.sub_skill_test_id))
      );
      pushToast("Đã xóa bài test (cascade)", "info");
    },
    [pushToast, subSkillTests]
  );

  // ---- Sub skill tests ----
  const createSubSkillTest = useCallback(
    (input: Omit<SubSkillTest, "id">) => {
      const created: SubSkillTest = { ...input, id: nextId("sst") };
      setSubSkillTests((prev) => [...prev, created]);
      pushToast(`Đã thêm bài test con ${created.sub_skill_test_name}`);
      return created;
    },
    [pushToast]
  );
  const updateSubSkillTest = useCallback(
    (id: string, input: Partial<Omit<SubSkillTest, "id">>) => {
      setSubSkillTests((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...input } : s))
      );
      pushToast("Đã cập nhật bài test con");
    },
    [pushToast]
  );
  const deleteSubSkillTest = useCallback(
    (id: string) => {
      setSubSkillTests((prev) => prev.filter((s) => s.id !== id));
      setTestResults((prev) =>
        prev.filter((r) => r.sub_skill_test_id !== id)
      );
      pushToast("Đã xóa bài test con", "info");
    },
    [pushToast]
  );

  // ---- Test results ----
  const buildResult = useCallback(
    (
      payload: Omit<TestResult, "id" | "score_percent"> & { id?: string }
    ): TestResult => {
      const sub = subSkillTests.find(
        (s) => s.id === payload.sub_skill_test_id
      );
      const test = sub
        ? skillTests.find((t) => t.id === sub.skill_test_id)
        : undefined;
      const score =
        sub && test
          ? calculateScorePercent({
              recordType: test.record_type,
              higherIsBetter: test.higher_is_better,
              standardScore: sub.standard_score,
              valueNumeric: payload.value_numeric ?? null,
              successCount: payload.success_count ?? null,
              attemptCount: payload.attempt_count ?? null
            })
          : 0;
      return {
        id: payload.id ?? nextId("tr"),
        student_id: payload.student_id,
        sub_skill_test_id: payload.sub_skill_test_id,
        value_numeric: payload.value_numeric ?? null,
        success_count: payload.success_count ?? null,
        attempt_count: payload.attempt_count ?? null,
        score_percent: score,
        note: payload.note ?? null,
        tested_at: payload.tested_at
      };
    },
    [subSkillTests, skillTests]
  );

  const createTestResult = useCallback(
    (input: Omit<TestResult, "id" | "score_percent">) => {
      const created = buildResult(input);
      setTestResults((prev) => [...prev, created]);
      pushToast("Đã lưu kết quả test");
      return created;
    },
    [buildResult, pushToast]
  );
  const updateTestResult = useCallback(
    (id: string, input: Partial<Omit<TestResult, "id">>) => {
      setTestResults((prev) =>
        prev.map((r) => {
          if (r.id !== id) return r;
          const merged = { ...r, ...input };
          return buildResult({
            id,
            student_id: merged.student_id,
            sub_skill_test_id: merged.sub_skill_test_id,
            value_numeric: merged.value_numeric ?? null,
            success_count: merged.success_count ?? null,
            attempt_count: merged.attempt_count ?? null,
            note: merged.note ?? null,
            tested_at: merged.tested_at
          });
        })
      );
      pushToast("Đã cập nhật kết quả test");
    },
    [buildResult, pushToast]
  );
  const deleteTestResult = useCallback(
    (id: string) => {
      setTestResults((prev) => prev.filter((r) => r.id !== id));
      pushToast("Đã xóa kết quả test", "info");
    },
    [pushToast]
  );

  // Recompute score_percent khi standard / test config đổi
  useEffect(() => {
    setTestResults((prev) =>
      prev.map((r) =>
        buildResult({
          id: r.id,
          student_id: r.student_id,
          sub_skill_test_id: r.sub_skill_test_id,
          value_numeric: r.value_numeric ?? null,
          success_count: r.success_count ?? null,
          attempt_count: r.attempt_count ?? null,
          note: r.note ?? null,
          tested_at: r.tested_at
        })
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subSkillTests, skillTests]);

  const value: DataState = {
    students,
    clubStandards,
    skillTests,
    subSkillTests,
    testResults,
    toasts,
    createStudent,
    updateStudent,
    deleteStudent,
    createClubStandard,
    updateClubStandard,
    deleteClubStandard,
    createSkillTest,
    updateSkillTest,
    deleteSkillTest,
    createSubSkillTest,
    updateSubSkillTest,
    deleteSubSkillTest,
    createTestResult,
    updateTestResult,
    deleteTestResult,
    pushToast,
    dismissToast
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useDataStore(): DataState {
  const ctx = useContext(DataContext);
  if (!ctx)
    throw new Error("useDataStore must be used within DataProvider");
  return ctx;
}
