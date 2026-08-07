import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { AppShell } from '../components/shell/AppShell';
import { ProtectedRoute } from '../components/shell/ProtectedRoute';

import LandingPage from '../pages/public/LandingPage';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Onboarding from '../pages/auth/Onboarding';

import Dashboard from '../pages/app/Dashboard';
import CareerExplorer from '../pages/app/CareerExplorer';
import LearningHub from '../pages/app/LearningHub';
import AIMentor from '../pages/app/AIMentor';
import Assessments from '../pages/app/Assessments';
import Scholarships from '../pages/app/Scholarships';
import Opportunities from '../pages/app/Opportunities';
import Profile from '../pages/app/Profile';
import Settings from '../pages/app/Settings';
import NotFound from '../pages/NotFound';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard"     element={<Dashboard />} />
        <Route path="/careers"       element={<CareerExplorer />} />
        <Route path="/learning"      element={<LearningHub />} />
        <Route path="/mentor"        element={<AIMentor />} />
        <Route path="/assessments"   element={<Assessments />} />
        <Route path="/scholarships"  element={<Scholarships />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/profile"       element={<Profile />} />
        <Route path="/settings"      element={<Settings />} />
      </Route>

      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default AppRoutes;
