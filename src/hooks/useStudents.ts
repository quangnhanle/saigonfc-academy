import { useDataStore } from "../data/DataProvider";

export function useStudents() {
  const store = useDataStore();
  return {
    data: store.students,
    loading: store.loading,
    error: store.error,
    refetch: store.refetch,
    create: store.createStudent,
    update: store.updateStudent,
    remove: store.deleteStudent
  };
}
