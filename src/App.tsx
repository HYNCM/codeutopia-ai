import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProjectProvider } from './contexts/ProjectContext'
import { Header } from './components/Layout/Header'
import { ClientDashboard } from './pages/ClientDashboard'
import { DeveloperDashboard } from './pages/DeveloperDashboard'
import { ProjectsPage } from './pages/Projects'
import { TalentPoolPage } from './pages/TalentPool'
import { TransactionsPage } from './pages/Transactions'
import { MessagesPage } from './pages/Messages'
import { ProfilePage } from './pages/Profile'
import { AdminDashboard } from './pages/AdminDashboard'
import { LandingPage } from './pages/LandingPage'
// Multi-role dashboard pages
import LoginPage from './pages/LoginPage'
import ProjectInitiatorDashboard from './pages/ProjectInitiatorDashboard'
import ContractorDashboard from './pages/ContractorDashboard'
import WebadminDashboard from './pages/WebadminDashboard'
import RegionalManagerDashboard from './pages/RegionalManagerDashboard'
import SupplyPoolPage from './pages/SupplyPoolPage'
import ProjectManagementPage from './pages/ProjectManagementPage'
import PaymentSettlementPage from './pages/PaymentSettlementPage'
import ProjectCreatePage from './pages/ProjectCreate/ProjectCreatePage'
import { AIAssistantPanel } from './components/AIAssistantPanel'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProjectProvider>
          <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/login' element={<LoginPage />} />

            {/* Role specific dashboards */}
            <Route
              path='/dashboard/initiator'
              element={
                <Layout>
                  <ProjectInitiatorDashboard currentRole='project_initiator' />
                </Layout>
              }
            />
            <Route
              path='/dashboard/contractor'
              element={
                <Layout>
                  <ContractorDashboard currentRole='contractor' />
                </Layout>
              }
            />
            <Route
              path='/dashboard/webadmin'
              element={
                <Layout>
                  <WebadminDashboard currentRole='webadmin' />
                </Layout>
              }
            />
            <Route
              path='/dashboard/regional'
              element={
                <Layout>
                  <RegionalManagerDashboard currentRole='regional_manager' />
                </Layout>
              }
            />

            <Route
              path='/dashboard'
              element={
                <Layout>
                  <ClientDashboard />
                </Layout>
              }
            />
            <Route
              path='/developer-dashboard'
              element={
                <Layout>
                  <DeveloperDashboard />
                </Layout>
              }
            />
            <Route
              path='/projects'
              element={
                <Layout>
                  <ProjectsPage />
                </Layout>
              }
            />
            <Route
              path='/projects/:id'
              element={
                <Layout>
                  <ProjectManagementPage />
                </Layout>
              }
            />
            <Route
              path='/post-project'
              element={
                <Layout>
                  <ProjectCreatePage />
                </Layout>
              }
            />
            <Route
              path='/talent'
              element={
                <Layout>
                  <TalentPoolPage />
                </Layout>
              }
            />
            <Route
              path='/transactions'
              element={
                <Layout>
                  <TransactionsPage />
                </Layout>
              }
            />
            <Route
              path='/messages'
              element={
                <Layout>
                  <MessagesPage />
                </Layout>
              }
            />
            <Route
              path='/profile'
              element={
                <Layout>
                  <ProfilePage />
                </Layout>
              }
            />
            <Route
              path='/admin'
              element={
                <Layout>
                  <AdminDashboard />
                </Layout>
              }
            />

            {/* Global Design House Supply Pool */}
            <Route path='/supply-pool' element={<SupplyPoolPage />} />
            {/* Project Management */}
            <Route path='/projects/manage' element={<ProjectManagementPage />} />
            {/* Payment & Settlement */}
            <Route path='/payments' element={<PaymentSettlementPage />} />
            {/* AI Assistant Panel (standalone) */}
            <Route path='/ai-assistant' element={<AIAssistantPanel currentRole='project_initiator' />} />

            {/* Redirects for demo */}
            <Route path='/my-projects' element={<Navigate to='/projects' replace />} />
            <Route path='/earnings' element={<Navigate to='/transactions' replace />} />
            <Route path='/contracts' element={<Navigate to='/projects' replace />} />
            <Route path='/reports' element={<Navigate to='/admin' replace />} />
            <Route path='/settings' element={<Navigate to='/profile' replace />} />
            <Route path='/analytics' element={<Navigate to='/admin' replace />} />
            <Route path='/notifications' element={<Navigate to='/messages' replace />} />
          </Routes>
        </ProjectProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>{children}</main>
    </div>
  )
}
