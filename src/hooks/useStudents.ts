import { useDataStore } from "../data/DataProvider";

export function useStudents() {
  const store = useDataStore();
  return {
    data: store.students,
    loading: false,
    error: null as string | null,
    refetch: async () => undefined,
    create: store.createStudent,
    update: store.updateStudent,
    remove: store.deleteStudent
  };
}
