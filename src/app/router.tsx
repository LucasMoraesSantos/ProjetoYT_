import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ChannelsPage } from '../pages/ChannelsPage';
import { TrendsPage } from '../pages/TrendsPage';
import { ScriptsPage } from '../pages/ScriptsPage';
import { ProductionsPage } from '../pages/ProductionsPage';
import { PublishingPage } from '../pages/PublishingPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { SettingsPage } from '../pages/SettingsPage';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'channels', element: <ChannelsPage /> },
      { path: 'trends', element: <TrendsPage /> },
      { path: 'scripts', element: <ScriptsPage /> },
      { path: 'productions', element: <ProductionsPage /> },
      { path: 'publishing', element: <PublishingPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
]);
