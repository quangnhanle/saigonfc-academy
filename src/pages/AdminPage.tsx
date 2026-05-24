import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { AdminAuthGate } from "../components/admin/AdminAuthGate";
import { AdminTabs, type AdminTabKey } from "../components/admin/AdminTabs";
import { StudentForm } from "../components/admin/StudentForm";
import { ClubStandardForm } from "../components/admin/ClubStandardForm";
import { TestExplorer } from "../components/admin/TestExplorer";
import { Modal } from "../components/common/Modal";
import { Button } from "../components/common/Button";
import { Card, CardBody, CardHeader } from "../components/common/Card";
import { Avatar } from "../components/common/Avatar";
import { Pill, RatingBadge } from "../components/common/Badge";
import { EmptyState } from "../components/common/EmptyState";
import { useStudents } from "../hooks/useStudents";
import { useClubStandards } from "../hooks/useClubStandards";
import { useSkillTests } from "../hooks/useSkillTests";
import { useSubSkillTests } from "../hooks/useSubSkillTests";
import { useTestResults } from "../hooks/useTestResults";
import { useRankings } from "../hooks/useRankings";
import { PREFERRED_FOOT_LABEL } from "../types/football";
import type {
  ClubStandard,
  Student
} from "../types/database";

function ActionButtons({
  onEdit,
  onDelete
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={onEdit}
        className="h-8 w-8 rounded-lg flex items-center justify-center bg-ink/10 text-ink hover:bg-ink/20 transition"
        aria-label="Chỉnh sửa"
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="h-8 w-8 rounded-lg flex items-center justify-center bg-red-500/15 text-red-300 hover:bg-red-500/25 transition"
        aria-label="Xóa"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function AdminContent() {
  const [tab, setTab] = useState<AdminTabKey>("students");

  const students = useStudents();
  const standards = useClubStandards();
  const tests = useSkillTests();
  const subs = useSubSkillTests();
  const results = useTestResults();
  const { overall } = useRankings();

  const [studentModal, setStudentModal] = useState<{
    open: boolean;
    editing: Student | null;
  }>({ open: false, editing: null });
  const [standardModal, setStandardModal] = useState<{
    open: boolean;
    editing: ClubStandard | null;
  }>({ open: false, editing: null });

  const overallMap = useMemo(
    () => new Map(overall.map((o) => [o.student_id, o])),
    [overall]
  );

  const headerAction =
    tab === "students" ? (
      <Button
        variant="secondary"
        leftIcon={<Plus className="h-4 w-4" />}
        onClick={() => setStudentModal({ open: true, editing: null })}
      >
        Thêm học viên
      </Button>
    ) : tab === "standards" ? (
      <Button
        variant="secondary"
        leftIcon={<Plus className="h-4 w-4" />}
        onClick={() => setStandardModal({ open: true, editing: null })}
      >
        Thêm nhóm kỹ năng
      </Button>
    ) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="display-font text-2xl text-ink">Trung tâm quản trị</h2>
        </div>
        {headerAction}
      </div>

      <AdminTabs value={tab} onChange={setTab} />

      {/* ========== STUDENTS ========== */}
      {tab === "students" && (
        <Card>
          <CardHeader
            title="Học viên"
            subtitle={`${students.data.length} học viên trong hệ thống`}
          />
          <CardBody>
            {students.data.length === 0 ? (
              <EmptyState title="Chưa có học viên" />
            ) : (
              <div className="overflow-x-auto -mx-5 px-5">
                <table className="w-full text-sm min-w-[640px]">
                  <thead className="text-xs uppercase tracking-wider text-muted">
                    <tr className="border-b border-border">
                      <th className="text-left py-2.5">Học viên</th>
                      <th className="text-left py-2.5">Vị trí</th>
                      <th className="text-left py-2.5">Năm sinh</th>
                      <th className="text-left py-2.5">Chân thuận</th>
                      <th className="text-left py-2.5">Đánh giá</th>
                      <th className="text-right py-2.5">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/70">
                    {students.data.map((s) => {
                      const o = overallMap.get(s.id);
                      return (
                        <tr key={s.id}>
                          <td className="py-3">
                            <div className="flex items-center gap-3">
                              <Avatar name={s.full_name} src={s.avatar_url} />
                              <div>
                                <p className="font-semibold text-ink">
                                  {s.full_name}
                                </p>
                                <p className="text-xs text-muted">{s.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 text-ink/80">{s.position}</td>
                          <td className="py-3 text-ink/80">{s.birth_year}</td>
                          <td className="py-3">
                            <Pill>{PREFERRED_FOOT_LABEL[s.preferred_foot]}</Pill>
                          </td>
                          <td className="py-3">
                            {o ? (
                              <RatingBadge rating={o.rating} />
                            ) : (
                              <span className="text-xs text-muted">—</span>
                            )}
                          </td>
                          <td className="py-3 text-right">
                            <div className="flex justify-end">
                              <ActionButtons
                                onEdit={() =>
                                  setStudentModal({ open: true, editing: s })
                                }
                                onDelete={() => {
                                  if (
                                    confirm(
                                      `Xóa học viên "${s.full_name}"? Toàn bộ kết quả test cũng sẽ bị xóa.`
                                    )
                                  ) {
                                    students.remove(s.id);
                                  }
                                }}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardBody>
        </Card>
      )}

      {/* ========== CLUB STANDARDS ========== */}
      {tab === "standards" && (
        <Card>
          <CardHeader
            title="Nhóm kỹ năng"
            subtitle={`${standards.data.length} nhóm kỹ năng cấp cao`}
          />
          <CardBody>
            {standards.data.length === 0 ? (
              <EmptyState title="Chưa có nhóm kỹ năng nào" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {standards.data.map((cs) => {
                  const testCount = tests.data.filter(
                    (t) => t.club_standard_id === cs.id
                  ).length;
                  return (
                    <div
                      key={cs.id}
                      className="rounded-2xl border border-border p-4 hover:border-brand/50 transition"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-brand-300 uppercase tracking-wider">
                            {cs.standard_name}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            <Pill>{testCount} bài test</Pill>
                            <Pill tone="brand">
                              Chuẩn {cs.standard_score ?? 100}%
                            </Pill>
                          </div>
                        </div>
                        <ActionButtons
                          onEdit={() =>
                            setStandardModal({ open: true, editing: cs })
                          }
                          onDelete={() => {
                            if (
                              confirm(
                                `Xóa nhóm "${cs.standard_name}"? Mọi bài test, bài test con và kết quả thuộc nhóm này sẽ bị xóa.`
                              )
                            ) {
                              standards.remove(cs.id);
                            }
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardBody>
        </Card>
      )}

      {/* ========== TESTS (nested: standards -> tests -> matrix) ========== */}
      {tab === "tests" && (
        <TestExplorer
          standards={standards.data}
          tests={tests.data}
          subTests={subs.data}
          students={students.data}
          results={results.data}
          onCreateTest={tests.create}
          onUpdateTest={tests.update}
          onDeleteTest={tests.remove}
          onCreateSub={subs.create}
          onUpdateSub={subs.update}
          onDeleteSub={subs.remove}
          onCreateResult={results.create}
          onUpdateResult={results.update}
          onDeleteResult={results.remove}
        />
      )}

      {/* ========== MODALS ========== */}
      <Modal
        open={studentModal.open}
        onClose={() => setStudentModal({ open: false, editing: null })}
        title={studentModal.editing ? "Cập nhật học viên" : "Thêm học viên mới"}
      >
        <StudentForm
          initial={studentModal.editing}
          onCancel={() => setStudentModal({ open: false, editing: null })}
          onSubmit={(data) => {
            if (studentModal.editing) {
              students.update(studentModal.editing.id, data);
            } else {
              students.create(data);
            }
            setStudentModal({ open: false, editing: null });
          }}
        />
      </Modal>

      <Modal
        open={standardModal.open}
        onClose={() => setStandardModal({ open: false, editing: null })}
        title={
          standardModal.editing
            ? "Cập nhật nhóm kỹ năng"
            : "Thêm nhóm kỹ năng"
        }
      >
        <ClubStandardForm
          initial={standardModal.editing}
          onCancel={() => setStandardModal({ open: false, editing: null })}
          onSubmit={(data) => {
            if (standardModal.editing) {
              standards.update(standardModal.editing.id, data);
            } else {
              standards.create(data);
            }
            setStandardModal({ open: false, editing: null });
          }}
        />
      </Modal>
    </div>
  );
}

export function AdminPage() {
  return (
    <AdminAuthGate>
      <AdminContent />
    </AdminAuthGate>
  );
}
