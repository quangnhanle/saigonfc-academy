import { useDataStore } from "../data/DataProvider";

export function useSkillTests() {
  const store = useDataStore();
  return {
    data: store.skillTests,
    loading: store.loading,
    error: store.error,
    refetch: store.refetch,
    create: store.createSkillTest,
    update: store.updateSkillTest,
    remove: store.deleteSkillTest
  };
}
