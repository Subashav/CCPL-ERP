import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Inventory from './pages/Inventory';
import Monitoring from './pages/Monitoring';
import Assets from './pages/Assets';
import Placeholder from './pages/Placeholder';

import EngineerLayout from './components/EngineerLayout';
import EngineerDashboard from './pages/engineer/Dashboard';
import AssetsProvided from './pages/engineer/AssetsProvided';
import Attendance from './pages/engineer/Attendance';

import AdminAssetRequests from './pages/AdminAssetRequests';
import AdminAttendanceRecords from './pages/AdminAttendanceRecords';
import AttendanceDetails from './pages/AttendanceDetails';
import ManpowerSummary from './pages/ManpowerSummary';

import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/assets" element={<Assets />} />
<<<<<<< HEAD
          <Route path="/admin/asset-requests" element={<AdminAssetRequests />} />
          <Route path="/admin/manpower-summary" element={<ManpowerSummary />} />
          <Route path="/admin/attendance-records" element={<AdminAttendanceRecords />} />
          <Route path="/admin/attendance/:id" element={<AttendanceDetails />} />
=======
          <Route path="/site-assets" element={<SiteAssets />} />
>>>>>>> e7316f40832e1fcd89bbb1f113014bd4d7c08574

  {/* New Routes Mapped to Placeholder */ }
          <Route path="/labour" element={<Placeholder title="Labour Management" icon="fas fa-users" />} />
          <Route path="/procurement" element={<Placeholder title="Procurement" icon="fas fa-shopping-cart" />} />
          <Route path="/vendors" element={<Placeholder title="Vendors" icon="fas fa-handshake" />} />
          <Route path="/billing" element={<Placeholder title="Billing" icon="fas fa-file-invoice-dollar" />} />
          <Route path="/expenses" element={<Placeholder title="Expenses" icon="fas fa-receipt" />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/reports" element={<Placeholder title="Reports" icon="fas fa-chart-bar" />} />
          <Route path="/documents" element={<Placeholder title="Documents" icon="fas fa-folder" />} />
          <Route path="/users" element={<Placeholder title="User Management" icon="fas fa-users-cog" />} />
          <Route path="/notifications" element={<Placeholder title="Notifications" icon="fas fa-bell" />} />
          <Route path="/settings" element={<Placeholder title="Settings" icon="fas fa-cog" />} />
        </Route >

    {/* Site Engineer / Execution Routes */ }
    < Route path = "/engineer" element = {< EngineerLayout />}>
          <Route path="dashboard" element={<EngineerDashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="tasks" element={<Tasks />} />
<<<<<<< HEAD
          <Route path="assets-provided" element={<AssetsProvided />} />
          <Route path="updates" element={<Placeholder title="Daily Progress Update" icon="fas fa-edit" />} />
          <Route path="attendance-log" element={<Attendance />} />
          <Route path="photos" element={<Placeholder title="Upload Site Photos" icon="fas fa-camera" />} />
          <Route path="assets" element={<Assets />} />
=======
          <Route path="updates" element={<Monitoring />} />
          <Route path="photos" element={<Placeholder title="Upload Site Photos" icon="fas fa-camera" />} />
          <Route path="attendance" element={<Placeholder title="Labour Attendance" icon="fas fa-user-clock" />} />
          <Route path="assets" element={<SiteAssets />} />
>>>>>>> e7316f40832e1fcd89bbb1f113014bd4d7c08574
          <Route path="stock" element={<Inventory />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="documents" element={<Placeholder title="Site Documents" icon="fas fa-file-alt" />} />
          <Route path="notifications" element={<Placeholder title="Notifications" icon="fas fa-bell" />} />
        </Route >

  <Route path="*" element={<Navigate to="/" replace />} />
      </Routes >
    </BrowserRouter >
  );
}

export default App;
