import { useMemo } from "react";
import { useDataStore } from "../data/DataProvider";
import {
  computeOverallRanking,
  computeStandardRanking,
  computeStudentAveragesByStandard,
  computeSubTestRanking,
  type OverallRanking,
  type StandardRanking,
  type SubTestRanking
} from "../utils/ranking";

export function useRankings() {
  const {
    testResults,
    subSkillTests,
    skillTests,
    clubStandards
  } = useDataStore();

  const overall = useMemo<OverallRanking[]>(
    () =>
      computeOverallRanking({
        testResults,
        subSkillTests,
        skillTests,
        clubStandards
      }),
    [testResults, subSkillTests, skillTests, clubStandards]
  );

  const rankByStandard = useMemo(() => {
    const map = new Map<string, StandardRanking[]>();
    for (const cs of clubStandards) {
      map.set(
        cs.id,
        computeStandardRanking(cs.id, {
          testResults,
          subSkillTests,
          skillTests,
          clubStandards
        })
      );
    }
    return map;
  }, [testResults, subSkillTests, skillTests, clubStandards]);

  const rankBySubTest = useMemo(() => {
    const map = new Map<string, SubTestRanking[]>();
    for (const sst of subSkillTests) {
      map.set(sst.id, computeSubTestRanking(sst.id, testResults));
    }
    return map;
  }, [testResults, subSkillTests]);

  const studentRadarBuilder = useMemo(
    () => (studentId: string) =>
      computeStudentAveragesByStandard(studentId, {
        testResults,
        subSkillTests,
        skillTests,
        clubStandards
      }),
    [testResults, subSkillTests, skillTests, clubStandards]
  );

  return {
    overall,
    rankByStandard,
    rankBySubTest,
    studentRadarBuilder,
    loading: false,
    error: null as string | null,
    refetch: async () => undefined
  };
}
