import {
 BrowserRouter,
 Routes,
 Route
} from "react-router-dom";

function App() {
 return (
  <BrowserRouter>
   <Routes>

    <Route
      path="/"
      element={<LoginPage />}
    />

    <Route
      path="/dashboard"
      element={<DashboardPage />}
    />

    <Route
      path="/reports/:weekId"
      element={<ReportListPage />}
    />

    <Route
      path="/reports/create"
      element={<ReportCreatePage />}
    />

    <Route
      path="/reports/edit/:reportId"
      element={<ReportEditPage />}
    />

    <Route
      path="/reminders"
      element={<ReminderPage />}
    />

   </Routes>
  </BrowserRouter>
 );
}