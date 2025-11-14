import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PatientsPage from './pages/patients/PatientsPage';
import DoctorsPage from './pages/doctors/DoctorsPage';
import AppointmentsPage from './pages/appointments/AppointmentsPage';
import BillingPage from './pages/billing/BillingPage';
import DepartmentsPage from './pages/departments/DepartmentsPage';

const App = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route
      element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/patients" element={<PatientsPage />} />
      <Route path="/doctors" element={<DoctorsPage />} />
      <Route path="/appointments" element={<AppointmentsPage />} />
      <Route path="/billing" element={<BillingPage />} />
      <Route path="/departments" element={<DepartmentsPage />} />
    </Route>
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default App;
