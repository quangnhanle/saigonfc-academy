import { useDataStore } from "../data/DataProvider";

export function useTestResults() {
  const store = useDataStore();
  return {
    data: store.testResults,
    loading: store.loading,
    error: store.error,
    refetch: store.refetch,
    create: store.createTestResult,
    update: store.updateTestResult,
    remove: store.deleteTestResult
  };
}
