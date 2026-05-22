import { useDataStore } from "../data/DataProvider";

export function useSkillTests() {
  const store = useDataStore();
  return {
    data: store.skillTests,
    loading: false,
    error: null as string | null,
    refetch: async () => undefined,
    create: store.createSkillTest,
    update: store.updateSkillTest,
    remove: store.deleteSkillTest
  };
}
