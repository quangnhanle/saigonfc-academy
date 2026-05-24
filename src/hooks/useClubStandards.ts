import { useDataStore } from "../data/DataProvider";

export function useClubStandards() {
  const store = useDataStore();
  return {
    data: store.clubStandards,
    loading: store.loading,
    error: store.error,
    refetch: store.refetch,
    create: store.createClubStandard,
    update: store.updateClubStandard,
    remove: store.deleteClubStandard
  };
}
