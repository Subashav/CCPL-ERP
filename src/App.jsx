import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Inventory from './pages/Inventory';
import Monitoring from './pages/Monitoring';
import Assets from './pages/Assets';
import Placeholder from './pages/Placeholder';
import Tickets from './pages/Tickets';
import UserManagement from './pages/UserManagement';
import Reports from './pages/Reports';
import Documents from './pages/Documents';

// New Feature Pages
import Labour from './pages/Labour';
import Procurement from './pages/Procurement';
import Billing from './pages/Billing';
import Expenses from './pages/Expenses';
import Settings from './pages/Settings';

import EngineerLayout from './components/EngineerLayout';
import EngineerDashboard from './pages/engineer/Dashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import AssetsProvided from './pages/engineer/AssetsProvided';
import Attendance from './pages/engineer/Attendance';
import DailyUpdates from './pages/engineer/DailyUpdates';
import SitePhotos from './pages/engineer/SitePhotos';

import AdminAssetRequests from './pages/AdminAssetRequests';
import AdminAttendanceRecords from './pages/AdminAttendanceRecords';
import AttendanceDetails from './pages/AttendanceDetails';
import ManpowerSummary from './pages/ManpowerSummary';
import ManpowerProjectDetails from './pages/ManpowerProjectDetails';
import EngineerManpower from './pages/engineer/ManpowerManagement';
import Vendors from './pages/Vendors';
import VendorDetails from './pages/VendorDetails';
import CreatePurchase from './pages/CreatePurchase';

import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* ADMIN / SUPER ADMIN ROUTES */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/super-admin" element={<SuperAdminDashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/tickets" element={<Tickets />} />

          {/* NEW ERP ADMIN ROUTES */}
          <Route path="/admin/asset-requests" element={<AdminAssetRequests />} />
          <Route path="/admin/manpower-summary" element={<ManpowerSummary />} />
          <Route path="/admin/manpower/project/:projectId" element={<ManpowerProjectDetails />} />
          <Route path="/admin/attendance-records" element={<AdminAttendanceRecords />} />
          <Route path="/admin/attendance/:id" element={<AttendanceDetails />} />

          {/* Vendor Management Routes */}
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/vendors/new-purchase" element={<CreatePurchase />} />
          <Route path="/vendors/:id" element={<VendorDetails />} />

          {/* New Feature Routes */}
          <Route path="/labour" element={<Labour />} />
          <Route path="/procurement" element={<Procurement />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/settings" element={<Settings />} />
          
          {/* Reports & Documents */}
          <Route path="/reports" element={<Reports />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/notifications" element={<Placeholder title="Notifications" icon="fas fa-bell" />} />
        </Route>

        {/* SITE ENGINEER ROUTES */}
        <Route path="/engineer" element={<EngineerLayout />}>
          <Route path="dashboard" element={<EngineerDashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="assets-provided" element={<AssetsProvided />} />
          <Route path="manpower" element={<EngineerManpower />} />
          <Route path="attendance-log" element={<Attendance />} />
          <Route path="updates" element={<DailyUpdates />} />
          <Route path="photos" element={<SitePhotos />} />
          <Route path="assets" element={<Assets />} />
          <Route path="stock" element={<Inventory />} />
          <Route path="documents" element={<Documents />} />
          <Route path="notifications" element={<Placeholder title="Notifications" icon="fas fa-bell" />} />
          <Route path="tickets" element={<Tickets />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
