import { useDataStore } from "../data/DataProvider";

export function useTestResults() {
  const store = useDataStore();
  return {
    data: store.testResults,
    loading: false,
    error: null as string | null,
    refetch: async () => undefined,
    create: store.createTestResult,
    update: store.updateTestResult,
    remove: store.deleteTestResult
  };
}
