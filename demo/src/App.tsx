import { useMemo } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import Onboarding from './pages/Onboarding';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import HackathonsPage from './pages/HackathonsPage';
import HackathonDetailPage from './pages/HackathonDetailPage';
import ParticipantsPage from './pages/ParticipantsPage';
import MyTeamsPage from './pages/MyTeamsPage';
import TeamDashboardPage from './pages/TeamDashboardPage';
import FindTeammatesPage from './pages/FindTeammatesPage';
import PerformancePage from './pages/PerformancePage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import AdminPanelPage from './pages/AdminPanelPage';
import { DemoDataProvider } from './contexts/DemoDataContext';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/" replace />;
  }
  if (!user.onboarded) {
    return <Navigate to="/onboarding" replace />;
  }
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();
  const isAdmin = useMemo(() => Boolean(user?.isAdmin), [user]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/onboarding"
        element={user ? (user.onboarded ? <Navigate to="/dashboard" replace /> : <Onboarding />) : <Navigate to="/" replace />}
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="hackathons" element={<HackathonsPage />} />
        <Route path="hackathons/:id" element={<HackathonDetailPage />} />
        <Route path="participants" element={<ParticipantsPage />} />
        <Route path="teams" element={<MyTeamsPage />} />
        <Route path="teams/:id" element={<TeamDashboardPage />} />
        <Route path="find-teammates" element={<FindTeammatesPage />} />
        <Route path="performance" element={<PerformancePage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="profile/:id" element={<ProfilePage />} />
        {isAdmin && <Route path="admin" element={<AdminPanelPage />} />}
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <DemoDataProvider>
        <AppRoutes />
      </DemoDataProvider>
    </AuthProvider>
  );
}

export default App;
