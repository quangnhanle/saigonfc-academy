import { BrowserRouter } from "react-router-dom";
import { DataProvider } from "./data/DataProvider";
import { AppRoutes } from "./routes/AppRoutes";
import { isSupabaseConfigured } from "./lib/supabase";
import { ConfigErrorScreen } from "./components/common/ConfigErrorScreen";

export default function App() {
  if (!isSupabaseConfigured) {
    return <ConfigErrorScreen />;
  }

  return (
    <DataProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </DataProvider>
  );
}
