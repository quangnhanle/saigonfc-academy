import { useDataStore } from "../data/DataProvider";

export function useSubSkillTests() {
  const store = useDataStore();
  return {
    data: store.subSkillTests,
    loading: false,
    error: null as string | null,
    refetch: async () => undefined,
    create: store.createSubSkillTest,
    update: store.updateSubSkillTest,
    remove: store.deleteSubSkillTest
  };
}
