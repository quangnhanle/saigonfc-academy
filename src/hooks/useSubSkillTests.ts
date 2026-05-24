import { useDataStore } from "../data/DataProvider";

export function useSubSkillTests() {
  const store = useDataStore();
  return {
    data: store.subSkillTests,
    loading: store.loading,
    error: store.error,
    refetch: store.refetch,
    create: store.createSubSkillTest,
    update: store.updateSubSkillTest,
    remove: store.deleteSubSkillTest
  };
}
