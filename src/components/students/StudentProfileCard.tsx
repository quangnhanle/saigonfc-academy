import { Calendar, Footprints, MapPin } from "lucide-react";
import type { Student } from "../../types/database";
import { PREFERRED_FOOT_LABEL } from "../../types/football";
import { Avatar } from "../common/Avatar";
import { Pill } from "../common/Badge";

type Props = {
  student: Student;
  overallScore: number;
  rank: number;
  totalStudents: number;
};

export function StudentProfileCard({
  student,
  overallScore,
  rank,
  totalStudents
}: Props) {
  return (
    <div className="rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-soft">
      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        <div className="relative">
          <Avatar
            name={student.full_name}
            src={student.avatar_url}
            size="xl"
          />
          <span className="absolute -bottom-1 -right-1 inline-flex h-9 min-w-9 px-2 items-center justify-center rounded-full bg-brand text-background font-bold text-sm shadow-soft ring-2 ring-card">
            #{rank}
          </span>
        </div>

        <div className="flex-1 text-center sm:text-left">
          <p className="text-xs text-brand-300 font-semibold uppercase tracking-wider">
            Hồ sơ học viên · Saigon FC
          </p>
          <h1 className="display-font text-3xl sm:text-4xl mt-1 leading-tight text-ink">
            {student.full_name}
          </h1>

          <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
            <Pill>
              <Calendar className="h-3 w-3" />
              Năm sinh {student.birth_year}
            </Pill>
            <Pill>
              <MapPin className="h-3 w-3" />
              {student.position}
            </Pill>
            <Pill>
              <Footprints className="h-3 w-3" />
              {PREFERRED_FOOT_LABEL[student.preferred_foot]}
            </Pill>
          </div>
        </div>

        <div className="hidden sm:block w-px self-stretch bg-border" />

        <div className="text-center sm:text-right">
          <p className="text-xs text-muted uppercase tracking-wider">
            Điểm tổng hợp
          </p>
          <p className="display-font text-5xl text-ink leading-none mt-2">
            {overallScore.toFixed(1)}
          </p>
          <p className="text-xs text-muted mt-2">
            Hạng <span className="text-ink font-semibold">{rank}</span> / {totalStudents}
          </p>
        </div>
      </div>
    </div>
  );
}
