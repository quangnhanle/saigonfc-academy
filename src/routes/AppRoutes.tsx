import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { HomePage } from "../pages/HomePage";
import { StudentProfilePage } from "../pages/StudentProfilePage";
import { StudentsIndexPage } from "../pages/StudentsIndexPage";
import { AdminPage } from "../pages/AdminPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="students" element={<StudentsIndexPage />} />
        <Route path="students/:studentId" element={<StudentProfilePage />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
