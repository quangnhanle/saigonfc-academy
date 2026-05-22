import { Link } from "react-router-dom";
import { useStudents } from "../hooks/useStudents";
import { useRankings } from "../hooks/useRankings";
import { Avatar } from "../components/common/Avatar";
import { Pill, RatingBadge } from "../components/common/Badge";
import { PREFERRED_FOOT_LABEL } from "../types/football";
import { Card, CardBody, CardHeader } from "../components/common/Card";

export function StudentsIndexPage() {
  const { data: students } = useStudents();
  const { overall } = useRankings();
  const overallMap = new Map(overall.map((o) => [o.student_id, o]));

  return (
    <Card>
      <CardHeader
        title="Danh sách học viên"
        subtitle={`${students.length} học viên đang được hệ thống theo dõi`}
      />
      <CardBody>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {students.map((student) => {
            const overallEntry = overallMap.get(student.id);
            return (
              <Link
                key={student.id}
                to={`/students/${student.id}`}
                className="group rounded-2xl border border-border bg-card p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-glow hover:border-brand/60"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    name={student.full_name}
                    src={student.avatar_url}
                    size="lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink truncate">
                      {student.full_name}
                    </p>
                    <p className="text-xs text-muted truncate">
                      {student.position} · {student.birth_year}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      <Pill>
                        {PREFERRED_FOOT_LABEL[student.preferred_foot]}
                      </Pill>
                      {overallEntry ? (
                        <RatingBadge rating={overallEntry.rating} />
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-border/70 flex items-center justify-between">
                  <span className="text-xs text-muted">Điểm tổng hợp</span>
                  <span className="display-font text-xl text-ink">
                    {overallEntry?.average_score.toFixed(1) ?? "—"}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}
