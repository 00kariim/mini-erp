import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from '../pages/auth/Login';
import RootRedirector from '../components/RootRedirector';
import ProtectedRoute from '../components/ProtectedRoute';
import MainLayout from '../components/Layout';

/* ---------------------- ADMIN PAGES ---------------------- */
import AdminDashboard from '../pages/admin/Dashboard';

import AdminUsers from '../pages/admin/users/List';
import AdminUserCreate from '../pages/admin/users/Create';
import AdminUserEdit from '../pages/admin/users/Edit';
import AdminAssignOperators from '../pages/admin/users/AssignOperators';

import AdminLeads from '../pages/admin/leads/List';
import AdminLeadCreate from '../pages/admin/leads/Create';
import AdminLeadDetails from '../pages/admin/leads/Details'; // comments, convert

import AdminClients from '../pages/admin/clients/List';
import AdminClientProfile from '../pages/admin/clients/Profile'; // products, income, comments
import AdminClientProducts from '../pages/admin/clients/Products';

import AdminProducts from '../pages/admin/products/List';
import AdminProductCreate from '../pages/admin/products/Create';

import AdminClaims from '../pages/admin/claims/List';
import AdminClaimDetails from '../pages/admin/claims/Details'; // assign ops/supervisors, comments

import AdminAnalytics from '../pages/admin/analytics/Dashboard';

/* -------------------- SUPERVISOR PAGES -------------------- */
import SupervisorDashboard from '../pages/supervisor/Dashboard';
import SupervisorOperators from '../pages/supervisor/Operators';
import SupervisorClients from '../pages/supervisor/Clients';
import SupervisorClaims from '../pages/supervisor/claims/List';
import SupervisorClaimDetails from '../pages/supervisor/claims/Details';
import SupervisorLeads from '../pages/supervisor/leads/List';
import SupervisorLeadDetails from '../pages/supervisor/leads/Details';
import SupervisorProducts from '../pages/supervisor/products/List';

/* ---------------------- OPERATOR PAGES ---------------------- */
import OperatorDashboard from '../pages/operator/Dashboard';

import OperatorLeads from '../pages/operator/leads/List';
import OperatorLeadDetails from '../pages/operator/leads/Details'; // update/create/comment/convert

import OperatorClients from '../pages/operator/clients/List';
import OperatorClientProfile from '../pages/operator/clients/Profile';

import OperatorClaims from '../pages/operator/claims/List';
import OperatorClaimDetails from '../pages/operator/claims/Details';

/* ----------------------- CLIENT PAGES ----------------------- */
import ClientDashboard from '../pages/client/Dashboard';
import ClientProfile from '../pages/client/Profile';
import ClientProducts from '../pages/client/Products';

import ClientClaims from '../pages/client/claims/List';
import ClientClaimCreate from '../pages/client/claims/Create';
import ClientClaimDetails from '../pages/client/claims/Details';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>

        {/* ---------------- ROOT + AUTH ---------------- */}
        <Route path="/" element={<RootRedirector />} />
        <Route path="/login" element={<Login />} />

        {/* ---------------- ADMIN ROUTES ---------------- */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute roles={['Admin']}>
              <MainLayout>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />

                  {/* Users */}
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="users/create" element={<AdminUserCreate />} />
                  <Route path="users/:id/edit" element={<AdminUserEdit />} />
                  <Route path="users/assign-operators" element={<AdminAssignOperators />} />

                  {/* Leads */}
                  <Route path="leads" element={<AdminLeads />} />
                  <Route path="leads/create" element={<AdminLeadCreate />} />
                  <Route path="leads/:id" element={<AdminLeadDetails />} />

                  {/* Clients */}
                  <Route path="clients" element={<AdminClients />} />
                  <Route path="clients/:id" element={<AdminClientProfile />} />
                  <Route path="clients/:id/products" element={<AdminClientProducts />} />

                  {/* Products */}
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="products/create" element={<AdminProductCreate />} />

                  {/* Claims */}
                  <Route path="claims" element={<AdminClaims />} />
                  <Route path="claims/:id" element={<AdminClaimDetails />} />

                  {/* Analytics */}
                  <Route path="analytics" element={<AdminAnalytics />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* ---------------- SUPERVISOR ROUTES ---------------- */}
        <Route
          path="/supervisor/*"
          element={
            <ProtectedRoute roles={['Supervisor']}>
              <MainLayout>
                <Routes>
                  <Route path="dashboard" element={<SupervisorDashboard />} />

                  {/* Operators supervised */}
                  <Route path="operators" element={<SupervisorOperators />} />
                  
                  {/* Clients */}
                  <Route path="clients" element={<SupervisorClients />} />

                  {/* Leads */}
                  <Route path="leads" element={<SupervisorLeads />} />
                  <Route path="leads/:id" element={<SupervisorLeadDetails />} />

                  {/* Products */}
                  <Route path="products" element={<SupervisorProducts />} />

                  {/* Claims */}
                  <Route path="claims" element={<SupervisorClaims />} />
                  <Route path="claims/:id" element={<SupervisorClaimDetails />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* ---------------- OPERATOR ROUTES ---------------- */}
        <Route
          path="/operator/*"
          element={
            <ProtectedRoute roles={['Operator']}>
              <MainLayout>
                <Routes>
                  <Route path="dashboard" element={<OperatorDashboard />} />

                  {/* Leads */}
                  <Route path="leads" element={<OperatorLeads />} />
                  <Route path="leads/:id" element={<OperatorLeadDetails />} />

                  {/* Clients */}
                  <Route path="clients" element={<OperatorClients />} />
                  <Route path="clients/:id" element={<OperatorClientProfile />} />

                  {/* Claims */}
                  <Route path="claims" element={<OperatorClaims />} />
                  <Route path="claims/:id" element={<OperatorClaimDetails />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* ---------------- CLIENT ROUTES ---------------- */}
        <Route
          path="/client/*"
          element={
            <ProtectedRoute roles={['Client']}>
              <MainLayout>
                <Routes>
                  <Route path="dashboard" element={<ClientDashboard />} />
                  <Route path="profile" element={<ClientProfile />} />
                  <Route path="products" element={<ClientProducts />} />

                  {/* Claims */}
                  <Route path="claims" element={<ClientClaims />} />
                  <Route path="claims/create" element={<ClientClaimCreate />} />
                  <Route path="claims/:id" element={<ClientClaimDetails />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
};

export default AppRoutes;

