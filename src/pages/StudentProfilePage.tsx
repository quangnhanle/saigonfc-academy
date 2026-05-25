import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Trophy } from "lucide-react";
import { useMemo } from "react";
import { useStudents } from "../hooks/useStudents";
import { useClubStandards } from "../hooks/useClubStandards";
import { useSkillTests } from "../hooks/useSkillTests";
import { useSubSkillTests } from "../hooks/useSubSkillTests";
import { useRankings } from "../hooks/useRankings";
import { useTestResults } from "../hooks/useTestResults";
import { Button } from "../components/common/Button";
import { Card, CardBody, CardHeader } from "../components/common/Card";
import { EmptyState } from "../components/common/EmptyState";
import { StudentProfileCard } from "../components/students/StudentProfileCard";
import {
  StudentSkillRadar,
  type RadarSkillData
} from "../components/students/StudentSkillRadar";
import {
  StudentSkillSummary,
  type SkillSummaryGroup
} from "../components/students/StudentSkillSummary";
import {
  calculateDifference,
  formatResultRaw
} from "../utils/score";
import { unitOf } from "../types/football";

function capScore(score: number) {
  return Math.min(100, score);
}

function average(scores: number[]) {
  if (scores.length === 0) return 0;
  return scores.reduce((acc, score) => acc + score, 0) / scores.length;
}

export function StudentProfilePage() {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();

  const { data: students } = useStudents();
  const { data: standards } = useClubStandards();
  const { data: tests } = useSkillTests();
  const { data: subs } = useSubSkillTests();
  const { data: results } = useTestResults();
  const { overall, rankBySubTest, studentRadarBuilder } = useRankings();

  const student = students.find((s) => s.id === studentId);

  const radarData: RadarSkillData[] = useMemo(() => {
    if (!student) return [];
    return studentRadarBuilder(student.id).map((row) => ({
      skill: row.standard_name,
      studentScore: row.average_score,
      clubStandard: 100
    }));
  }, [student, studentRadarBuilder]);

  const groups: SkillSummaryGroup[] = useMemo(() => {
    if (!student) return [];
    const subById = new Map(subs.map((s) => [s.id, s]));
    const testById = new Map(tests.map((t) => [t.id, t]));

    return standards.map((cs) => {
        const standardTests = tests.filter(
          (t) => t.club_standard_id === cs.id
        );
        const standardSubIds = new Set(
          subs
            .filter((s) =>
              standardTests.some((t) => t.id === s.skill_test_id)
            )
            .map((s) => s.id)
        );

        const studentResults = results.filter(
          (r) =>
            r.student_id === student.id &&
            standardSubIds.has(r.sub_skill_test_id)
        );

        const rows = studentResults.map((r) => {
          const sub = subById.get(r.sub_skill_test_id)!;
          const test = testById.get(sub.skill_test_id)!;
          const rank =
            rankBySubTest
              .get(sub.id)
              ?.find((rr) => rr.student_id === student.id)?.rank_position ?? 0;
          return {
            key: r.id,
            testId: test.id,
            testName: test.test_name,
            subSkillTestName: sub.sub_skill_test_name,
            unit: unitOf(test.record_type),
            standardScore: sub.standard_score,
            recordType: test.record_type,
            rawLabel: formatResultRaw(r, test.record_type),
            scorePercent: capScore(r.score_percent),
            difference: calculateDifference(
              r,
              test.record_type,
              test.higher_is_better,
              sub.standard_score
            ),
            rankPosition: rank
          };
        });

        const scoreByTest = standardTests
          .map((test) => {
            const testScores = rows
              .filter((row) => row.testId === test.id)
              .map((row) => capScore(row.scorePercent));
            if (testScores.length === 0) return null;
            return average(testScores);
          })
          .filter((score): score is number => score != null);

        const averageScore =
          scoreByTest.length === 0
            ? 0
            : Math.round(average(scoreByTest) * 10) / 10;

        return {
          standardId: cs.id,
          standardName: cs.standard_name,
          averageScore,
          rows
        };
      });
  }, [student, standards, tests, subs, results, rankBySubTest]);

  if (!student) {
    return (
      <div className="space-y-4">
        <EmptyState
          title="Không tìm thấy học viên"
          description="Có thể học viên đã bị xóa hoặc liên kết không hợp lệ."
          action={
            <Button
              variant="secondary"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              onClick={() => navigate("/")}
            >
              Quay lại bảng xếp hạng
            </Button>
          }
        />
      </div>
    );
  }

  const overallEntry = overall.find((o) => o.student_id === student.id);
  const overallScore = overallEntry?.average_score ?? 0;
  const rank = overallEntry?.rank_position ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-ink/70 hover:text-ink transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Bảng xếp hạng
        </Link>
        <span className="hidden sm:inline-flex items-center gap-2 rounded-full bg-brand/15 text-brand-300 px-3 py-1.5 text-xs font-semibold">
          <Trophy className="h-3.5 w-3.5" />
          Hồ sơ thi đấu
        </span>
      </div>

      <StudentProfileCard
        student={student}
        overallScore={overallScore}
        rank={rank}
        totalStudents={overall.length}
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1fr] gap-6">
        <Card>
          <CardHeader
            title="Tổng quan kỹ năng"
            subtitle="Kết quả từng bài test con, gom theo nhóm kỹ năng"
          />
          <CardBody>
            <StudentSkillSummary groups={groups} />
          </CardBody>
        </Card>

        <Card glow>
          <CardHeader
            title="So sánh với tiêu chuẩn CLB"
            subtitle="Vùng vàng là chuẩn CLB · Vùng sáng là điểm học viên"
          />
          <CardBody>
            <StudentSkillRadar data={radarData} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
