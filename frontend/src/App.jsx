import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import Toaster from "@/components/Toaster";
import LoadingSpinner from "@/components/LoadingSpinner";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import EmployeeDashboard from "@/pages/employee/Dashboard";
import ApplyLeave from "@/pages/employee/ApplyLeave";
import LeaveHistory from "@/pages/employee/LeaveHistory";
import Attendance from "@/pages/employee/Attendance";
import AdminDashboard from "@/pages/admin/Dashboard";
import LeaveRequests from "@/pages/admin/LeaveRequests";
import AttendanceOverview from "@/pages/admin/AttendanceOverview";
import Employees from "@/pages/admin/Employees";

function HomeRedirect() {
  const { loading, isAuthenticated, isAdmin } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={isAdmin ? "/admin/dashboard" : "/dashboard"} replace />;
}

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<EmployeeDashboard />} />
          <Route path="/apply-leave" element={<ApplyLeave />} />
          <Route path="/leave-history" element={<LeaveHistory />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route element={<AdminRoute><Layout /></AdminRoute>}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/leave-requests" element={<LeaveRequests />} />
          <Route path="/admin/attendance" element={<AttendanceOverview />} />
          <Route path="/admin/employees" element={<Employees />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
