import { useDataStore } from "../data/DataProvider";

export function useClubStandards() {
  const store = useDataStore();
  return {
    data: store.clubStandards,
    loading: false,
    error: null as string | null,
    refetch: async () => undefined,
    create: store.createClubStandard,
    update: store.updateClubStandard,
    remove: store.deleteClubStandard
  };
}
