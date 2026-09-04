import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { HelpTeamAuthProvider } from './context/HelpTeamAuthContext';
import { ToastContainer } from './components/common/Toast';
import ProtectedRoute from './routes/ProtectedRoute';
import HelpTeamProtectedRoute from './routes/HelpTeamProtectedRoute';
import Layout from './components/layout/Layout';

// Public pages
import HomePage from './pages/public/HomePage';
import ReportPage from './pages/public/ReportPage';
import DisastersPage from './pages/public/DisastersPage';
import DisasterDetailPage from './pages/public/DisasterDetailPage';
import MapPage from './pages/public/MapPage';
import EmergencyPage from './pages/public/EmergencyPage';
import SafetyPage from './pages/public/SafetyPage';
import AboutPage from './pages/public/AboutPage';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminReports from './pages/admin/AdminReports';
import AdminMap from './pages/admin/AdminMap';
import AdminEmergency from './pages/admin/AdminEmergency';
import AdminTeams from './pages/admin/AdminTeams';

// Help Team pages
import HelpTeamLogin from './pages/helpTeam/Login';
import HelpTeamRegister from './pages/helpTeam/Register';
import HelpTeamDashboard from './pages/helpTeam/Dashboard';
import HelpTeamTasks from './pages/helpTeam/MyTasks';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <HelpTeamAuthProvider>
          <Routes>
            {/* Public routes — with Layout (Navbar + Footer) */}
            <Route
              path="/"
              element={
                <Layout>
                  <HomePage />
                </Layout>
              }
            />
            <Route
              path="/report"
              element={
                <Layout>
                  <ReportPage />
                </Layout>
              }
            />
            <Route
              path="/disasters"
              element={
                <Layout>
                  <DisastersPage />
                </Layout>
              }
            />
            <Route
              path="/disasters/:id"
              element={
                <Layout>
                  <DisasterDetailPage />
                </Layout>
              }
            />
            <Route
              path="/map"
              element={
                <Layout>
                  <MapPage />
                </Layout>
              }
            />
            <Route
              path="/emergency"
              element={
                <Layout>
                  <EmergencyPage />
                </Layout>
              }
            />
            <Route
              path="/safety"
              element={
                <Layout>
                  <SafetyPage />
                </Layout>
              }
            />
            <Route
              path="/about"
              element={
                <Layout>
                  <AboutPage />
                </Layout>
              }
            />

            {/* Help Team Member Authentication & Portal */}
            <Route path="/help-team/login" element={<HelpTeamLogin />} />
            <Route path="/help-team/register" element={<HelpTeamRegister />} />
            <Route
              path="/help-team/dashboard"
              element={
                <HelpTeamProtectedRoute>
                  <HelpTeamDashboard />
                </HelpTeamProtectedRoute>
              }
            />
            <Route
              path="/help-team/tasks"
              element={
                <HelpTeamProtectedRoute>
                  <HelpTeamTasks />
                </HelpTeamProtectedRoute>
              }
            />
            <Route path="/help-team" element={<Navigate to="/help-team/dashboard" replace />} />

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute>
                  <AdminReports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/teams"
              element={
                <ProtectedRoute>
                  <AdminTeams />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/map"
              element={
                <ProtectedRoute>
                  <AdminMap />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/emergency"
              element={
                <ProtectedRoute>
                  <AdminEmergency />
                </ProtectedRoute>
              }
            />

            {/* Redirects */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route
              path="*"
              element={
                <Layout>
                  <div className="min-h-screen flex items-center justify-center text-center px-4">
                    <div>
                      <p className="text-6xl mb-4">🗺️</p>
                      <h1 className="text-2xl font-bold text-slate-900 mb-2">Page Not Found</h1>
                      <p className="text-slate-500 mb-6">The page you're looking for doesn't exist.</p>
                      <a href="/" className="btn-primary">← Go Home</a>
                    </div>
                  </div>
                </Layout>
              }
            />
          </Routes>

          <ToastContainer />
        </HelpTeamAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
