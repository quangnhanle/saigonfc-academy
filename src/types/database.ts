import type { PreferredFoot, RecordType } from "./football";

export type Student = {
  id: string;
  full_name: string;
  birth_year: number;
  position: string;
  preferred_foot: PreferredFoot;
  avatar_url?: string | null;
};

export type ClubStandard = {
  id: string;
  standard_name: string;
};

export type SkillTest = {
  id: string;
  club_standard_id: string;
  test_name: string;
  description?: string | null;
  record_type: RecordType;
  higher_is_better: boolean;
};

export type SubSkillTest = {
  id: string;
  skill_test_id: string;
  sub_skill_test_name: string;
  standard_score: number;
};

export type TestResult = {
  id: string;
  student_id: string;
  sub_skill_test_id: string;
  value_numeric?: number | null;
  success_count?: number | null;
  attempt_count?: number | null;
  score_percent: number;
  note?: string | null;
  tested_at: string;
};
