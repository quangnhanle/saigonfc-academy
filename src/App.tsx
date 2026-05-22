import { BrowserRouter } from "react-router-dom";
import { DataProvider } from "./data/DataProvider";
import { AppRoutes } from "./routes/AppRoutes";

export default function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </DataProvider>
  );
}
