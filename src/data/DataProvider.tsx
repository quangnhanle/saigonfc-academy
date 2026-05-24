import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
import { calculateScorePercent } from "../utils/score";
import { getSupabase, TABLES } from "../lib/supabase";

type ToastKind = "success" | "error" | "info";
export type Toast = { id: string; message: string; kind: ToastKind };

type DataState = {
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;

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

function toMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return "Lỗi không xác định";
  }
}

// Map giữa row Supabase và type domain.
// Hầu hết các trường khớp 1-1 nên dùng trực tiếp, chỉ chuẩn hóa null/undefined.
function mapStudent(row: Record<string, unknown>): Student {
  return {
    id: row.id as string,
    full_name: row.full_name as string,
    birth_year: row.birth_year as number,
    position: row.position as string,
    preferred_foot: row.preferred_foot as Student["preferred_foot"],
    avatar_url: (row.avatar_url as string | null) ?? null
  };
}
function mapClubStandard(row: Record<string, unknown>): ClubStandard {
  return {
    id: row.id as string,
    standard_name: row.standard_name as string,
    standard_score: Number(row.standard_score)
  };
}
function mapSkillTest(row: Record<string, unknown>): SkillTest {
  return {
    id: row.id as string,
    club_standard_id: row.club_standard_id as string,
    test_name: row.test_name as string,
    description: (row.description as string | null) ?? null,
    record_type: row.record_type as SkillTest["record_type"],
    higher_is_better: Boolean(row.higher_is_better)
  };
}
function mapSubSkillTest(row: Record<string, unknown>): SubSkillTest {
  return {
    id: row.id as string,
    skill_test_id: row.skill_test_id as string,
    sub_skill_test_name: row.sub_skill_test_name as string,
    standard_score: Number(row.standard_score)
  };
}
function mapTestResult(row: Record<string, unknown>): TestResult {
  return {
    id: row.id as string,
    student_id: row.student_id as string,
    sub_skill_test_id: row.sub_skill_test_id as string,
    value_numeric:
      row.value_numeric == null ? null : Number(row.value_numeric),
    success_count:
      row.success_count == null ? null : Number(row.success_count),
    attempt_count:
      row.attempt_count == null ? null : Number(row.attempt_count),
    score_percent: Number(row.score_percent ?? 0),
    note: (row.note as string | null) ?? null,
    tested_at: row.tested_at as string
  };
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [clubStandards, setClubStandards] = useState<ClubStandard[]>([]);
  const [skillTests, setSkillTests] = useState<SkillTest[]>([]);
  const [subSkillTests, setSubSkillTests] = useState<SubSkillTest[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Refs để callbacks luôn đọc state mới nhất mà không phải re-create.
  const skillTestsRef = useRef(skillTests);
  const subSkillTestsRef = useRef(subSkillTests);
  useEffect(() => {
    skillTestsRef.current = skillTests;
  }, [skillTests]);
  useEffect(() => {
    subSkillTestsRef.current = subSkillTests;
  }, [subSkillTests]);

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

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const sb = getSupabase();
      const [s, cs, st, sst, tr] = await Promise.all([
        sb.from(TABLES.students).select("*").order("full_name"),
        sb.from(TABLES.clubStandards).select("*").order("standard_name"),
        sb.from(TABLES.skillTests).select("*"),
        sb.from(TABLES.subSkillTests).select("*"),
        sb.from(TABLES.testResults).select("*")
      ]);

      const firstErr =
        s.error || cs.error || st.error || sst.error || tr.error;
      if (firstErr) throw firstErr;

      setStudents((s.data ?? []).map(mapStudent));
      setClubStandards((cs.data ?? []).map(mapClubStandard));
      setSkillTests((st.data ?? []).map(mapSkillTest));
      setSubSkillTests((sst.data ?? []).map(mapSubSkillTest));
      setTestResults((tr.data ?? []).map(mapTestResult));
    } catch (err) {
      const msg = toMessage(err);
      setError(msg);
      pushToast(`Không tải được dữ liệu: ${msg}`, "error");
    } finally {
      setLoading(false);
    }
  }, [pushToast]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  // ---------------------------------------------------------------
  // Helper: optimistic mutate. Cập nhật state ngay, rollback nếu lỗi.
  // ---------------------------------------------------------------
  function optimisticInsert<T extends { id: string }>(
    table: string,
    row: T,
    payload: Record<string, unknown>,
    setState: React.Dispatch<React.SetStateAction<T[]>>,
    successMsg: string
  ) {
    setState((prev) => [...prev, row]);
    void (async () => {
      try {
        const sb = getSupabase();
        const { error: e } = await sb.from(table).insert(payload);
        if (e) throw e;
        pushToast(successMsg);
      } catch (err) {
        setState((prev) => prev.filter((r) => r.id !== row.id));
        pushToast(`Lưu thất bại: ${toMessage(err)}`, "error");
      }
    })();
  }

  function optimisticUpdate<T extends { id: string }>(
    table: string,
    id: string,
    patch: Partial<T>,
    payload: Record<string, unknown>,
    setState: React.Dispatch<React.SetStateAction<T[]>>,
    successMsg: string
  ) {
    let prevRow: T | undefined;
    setState((prev) => {
      prevRow = prev.find((r) => r.id === id);
      return prev.map((r) => (r.id === id ? { ...r, ...patch } : r));
    });
    void (async () => {
      try {
        const sb = getSupabase();
        const { error: e } = await sb
          .from(table)
          .update(payload)
          .eq("id", id);
        if (e) throw e;
        pushToast(successMsg);
      } catch (err) {
        if (prevRow) {
          const restored = prevRow;
          setState((prev) => prev.map((r) => (r.id === id ? restored : r)));
        }
        pushToast(`Cập nhật thất bại: ${toMessage(err)}`, "error");
      }
    })();
  }

  function optimisticDelete<T extends { id: string }>(
    table: string,
    id: string,
    setState: React.Dispatch<React.SetStateAction<T[]>>,
    successMsg: string,
    cascadeLocal?: () => void
  ) {
    let prevRow: T | undefined;
    setState((prev) => {
      prevRow = prev.find((r) => r.id === id);
      return prev.filter((r) => r.id !== id);
    });
    cascadeLocal?.();
    void (async () => {
      try {
        const sb = getSupabase();
        const { error: e } = await sb.from(table).delete().eq("id", id);
        if (e) throw e;
        pushToast(successMsg, "info");
      } catch (err) {
        if (prevRow) {
          const restored = prevRow;
          setState((prev) => [...prev, restored]);
        }
        // Cascade rollback khó tái tạo chính xác -> refetch lại từ server.
        void refetch();
        pushToast(`Xóa thất bại: ${toMessage(err)}`, "error");
      }
    })();
  }

  // ---- Students ----
  const createStudent = useCallback(
    (input: Omit<Student, "id">) => {
      const created: Student = { ...input, id: nextId("s") };
      optimisticInsert(
        TABLES.students,
        created,
        {
          id: created.id,
          full_name: created.full_name,
          birth_year: created.birth_year,
          position: created.position,
          preferred_foot: created.preferred_foot,
          avatar_url: created.avatar_url ?? null
        },
        setStudents,
        `Đã thêm học viên ${created.full_name}`
      );
      return created;
    },
    [pushToast] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const updateStudent = useCallback(
    (id: string, input: Partial<Omit<Student, "id">>) => {
      optimisticUpdate<Student>(
        TABLES.students,
        id,
        input,
        input as Record<string, unknown>,
        setStudents,
        "Đã cập nhật học viên"
      );
    },
    [pushToast] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const deleteStudent = useCallback(
    (id: string) => {
      optimisticDelete<Student>(
        TABLES.students,
        id,
        setStudents,
        "Đã xóa học viên",
        () => {
          setTestResults((prev) => prev.filter((r) => r.student_id !== id));
        }
      );
    },
    [pushToast] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // ---- Club standards ----
  const createClubStandard = useCallback(
    (input: Omit<ClubStandard, "id">) => {
      const created: ClubStandard = { ...input, id: nextId("cs") };
      optimisticInsert(
        TABLES.clubStandards,
        created,
        {
          id: created.id,
          standard_name: created.standard_name,
          standard_score: created.standard_score
        },
        setClubStandards,
        `Đã thêm nhóm kỹ năng ${created.standard_name}`
      );
      return created;
    },
    [pushToast] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const updateClubStandard = useCallback(
    (id: string, input: Partial<Omit<ClubStandard, "id">>) => {
      optimisticUpdate<ClubStandard>(
        TABLES.clubStandards,
        id,
        input,
        input as Record<string, unknown>,
        setClubStandards,
        "Đã cập nhật nhóm kỹ năng"
      );
    },
    [pushToast] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const deleteClubStandard = useCallback(
    (id: string) => {
      const removedTestIds = skillTestsRef.current
        .filter((t) => t.club_standard_id === id)
        .map((t) => t.id);
      const removedSubIds = subSkillTestsRef.current
        .filter((s) => removedTestIds.includes(s.skill_test_id))
        .map((s) => s.id);
      optimisticDelete<ClubStandard>(
        TABLES.clubStandards,
        id,
        setClubStandards,
        "Đã xóa nhóm kỹ năng (cascade)",
        () => {
          setSkillTests((prev) =>
            prev.filter((t) => t.club_standard_id !== id)
          );
          setSubSkillTests((prev) =>
            prev.filter((s) => !removedTestIds.includes(s.skill_test_id))
          );
          setTestResults((prev) =>
            prev.filter((r) => !removedSubIds.includes(r.sub_skill_test_id))
          );
        }
      );
    },
    [pushToast] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // ---- Skill tests ----
  const createSkillTest = useCallback(
    (input: Omit<SkillTest, "id">) => {
      const created: SkillTest = { ...input, id: nextId("st") };
      optimisticInsert(
        TABLES.skillTests,
        created,
        {
          id: created.id,
          club_standard_id: created.club_standard_id,
          test_name: created.test_name,
          description: created.description ?? null,
          record_type: created.record_type,
          higher_is_better: created.higher_is_better
        },
        setSkillTests,
        `Đã thêm bài test ${created.test_name}`
      );
      return created;
    },
    [pushToast] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const updateSkillTest = useCallback(
    (id: string, input: Partial<Omit<SkillTest, "id">>) => {
      optimisticUpdate<SkillTest>(
        TABLES.skillTests,
        id,
        input,
        input as Record<string, unknown>,
        setSkillTests,
        "Đã cập nhật bài test"
      );
    },
    [pushToast] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const deleteSkillTest = useCallback(
    (id: string) => {
      const removedSubIds = subSkillTestsRef.current
        .filter((s) => s.skill_test_id === id)
        .map((s) => s.id);
      optimisticDelete<SkillTest>(
        TABLES.skillTests,
        id,
        setSkillTests,
        "Đã xóa bài test (cascade)",
        () => {
          setSubSkillTests((prev) =>
            prev.filter((s) => s.skill_test_id !== id)
          );
          setTestResults((prev) =>
            prev.filter((r) => !removedSubIds.includes(r.sub_skill_test_id))
          );
        }
      );
    },
    [pushToast] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // ---- Sub skill tests ----
  const createSubSkillTest = useCallback(
    (input: Omit<SubSkillTest, "id">) => {
      const created: SubSkillTest = { ...input, id: nextId("sst") };
      optimisticInsert(
        TABLES.subSkillTests,
        created,
        {
          id: created.id,
          skill_test_id: created.skill_test_id,
          sub_skill_test_name: created.sub_skill_test_name,
          standard_score: created.standard_score
        },
        setSubSkillTests,
        `Đã thêm bài test con ${created.sub_skill_test_name}`
      );
      return created;
    },
    [pushToast] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const updateSubSkillTest = useCallback(
    (id: string, input: Partial<Omit<SubSkillTest, "id">>) => {
      optimisticUpdate<SubSkillTest>(
        TABLES.subSkillTests,
        id,
        input,
        input as Record<string, unknown>,
        setSubSkillTests,
        "Đã cập nhật bài test con"
      );
    },
    [pushToast] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const deleteSubSkillTest = useCallback(
    (id: string) => {
      optimisticDelete<SubSkillTest>(
        TABLES.subSkillTests,
        id,
        setSubSkillTests,
        "Đã xóa bài test con",
        () => {
          setTestResults((prev) =>
            prev.filter((r) => r.sub_skill_test_id !== id)
          );
        }
      );
    },
    [pushToast] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // ---- Test results ----
  const buildResult = useCallback(
    (
      payload: Omit<TestResult, "id" | "score_percent"> & { id?: string }
    ): TestResult => {
      const sub = subSkillTestsRef.current.find(
        (s) => s.id === payload.sub_skill_test_id
      );
      const test = sub
        ? skillTestsRef.current.find((t) => t.id === sub.skill_test_id)
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
    []
  );

  const createTestResult = useCallback(
    (input: Omit<TestResult, "id" | "score_percent">) => {
      const created = buildResult(input);
      optimisticInsert(
        TABLES.testResults,
        created,
        {
          id: created.id,
          student_id: created.student_id,
          sub_skill_test_id: created.sub_skill_test_id,
          value_numeric: created.value_numeric,
          success_count: created.success_count,
          attempt_count: created.attempt_count,
          score_percent: created.score_percent,
          note: created.note,
          tested_at: created.tested_at
        },
        setTestResults,
        "Đã lưu kết quả test"
      );
      return created;
    },
    [buildResult] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const updateTestResult = useCallback(
    (id: string, input: Partial<Omit<TestResult, "id">>) => {
      // Tính lại score_percent dựa trên giá trị mới + state hiện tại.
      const prev = testResults.find((r) => r.id === id);
      const merged = { ...prev, ...input } as TestResult;
      const rebuilt = buildResult({
        id,
        student_id: merged.student_id,
        sub_skill_test_id: merged.sub_skill_test_id,
        value_numeric: merged.value_numeric ?? null,
        success_count: merged.success_count ?? null,
        attempt_count: merged.attempt_count ?? null,
        note: merged.note ?? null,
        tested_at: merged.tested_at
      });

      optimisticUpdate<TestResult>(
        TABLES.testResults,
        id,
        rebuilt,
        {
          student_id: rebuilt.student_id,
          sub_skill_test_id: rebuilt.sub_skill_test_id,
          value_numeric: rebuilt.value_numeric,
          success_count: rebuilt.success_count,
          attempt_count: rebuilt.attempt_count,
          score_percent: rebuilt.score_percent,
          note: rebuilt.note,
          tested_at: rebuilt.tested_at
        },
        setTestResults,
        "Đã cập nhật kết quả test"
      );
    },
    [buildResult, testResults] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const deleteTestResult = useCallback(
    (id: string) => {
      optimisticDelete<TestResult>(
        TABLES.testResults,
        id,
        setTestResults,
        "Đã xóa kết quả test"
      );
    },
    [pushToast] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Recompute score_percent khi standard / test config đổi (local-only,
  // không sync ngược lên Supabase để tránh vòng lặp - Supabase đã giữ giá
  // trị tại thời điểm lưu, sẽ được cập nhật khi user sửa kết quả).
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

  const value = useMemo<DataState>(
    () => ({
      loading,
      error,
      refetch,
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
    }),
    [
      loading,
      error,
      refetch,
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
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useDataStore(): DataState {
  const ctx = useContext(DataContext);
  if (!ctx)
    throw new Error("useDataStore must be used within DataProvider");
  return ctx;
}
