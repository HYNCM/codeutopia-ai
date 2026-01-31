import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ProjectProvider } from './contexts/ProjectContext'
import { WalletProvider } from './contexts/WalletContext'
import { AIProvider } from './contexts/AIContext'
import { MessageProvider } from './contexts/MessageContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { Header } from './components/Layout/Header'
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
import NotFoundPage from './pages/NotFoundPage'
import { AIAssistantPanel } from './components/AIAssistantPanel'
import { AIChatPanel, AIFloatingButton } from './components/AI'
import { ProtectedRoute } from './components/Auth/ProtectedRoute'

// Role-based Dashboard Components
const DASHBOARDS: Record<string, React.ComponentType<{ currentRole?: string }>> = {
  project_initiator: ProjectInitiatorDashboard,
  contractor: ContractorDashboard,
  webadmin: WebadminDashboard,
  regional_manager: RegionalManagerDashboard,
}

function DashboardRouter() {
  const { user } = useAuth()
  const RoleDashboard = DASHBOARDS[user?.role || ''] || ProjectInitiatorDashboard
  return <RoleDashboard currentRole={user?.role} />
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ProjectProvider>
            <WalletProvider>
              <MessageProvider>
                <NotificationProvider>
                  <AIProvider>
                    <Routes>
                      <Route path='/' element={<LandingPage />} />
                      <Route path='/login' element={<LoginPage />} />

                      {/* Unified Dashboard Route */}
                      <Route
                        path='/dashboard'
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <DashboardRouter />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />

                      {/* Redirect old dashboard routes and role-specific paths to unified route */}
                      <Route path='/dashboard/initiator' element={<Navigate to='/dashboard' replace />} />
                      <Route path='/dashboard/contractor' element={<Navigate to='/dashboard' replace />} />
                      <Route path='/dashboard/webadmin' element={<Navigate to='/dashboard' replace />} />
                      <Route path='/dashboard/regional' element={<Navigate to='/dashboard' replace />} />
                      <Route path='/dashboard/admin' element={<Navigate to='/dashboard' replace />} />

                      <Route
                        path='/projects'
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <ProjectsPage />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />
                      {/* ... other routes omitted for brevity in replacement chunk ... */}
                      {/* /projects/new must come BEFORE /projects/:id */}
                      <Route
                        path='/projects/new'
                        element={
                          <ProtectedRoute allowedRoles={['project_initiator']}>
                            <Layout>
                              <ProjectCreatePage />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path='/projects/:id'
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <ProjectManagementPage />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path='/post-project'
                        element={
                          <ProtectedRoute allowedRoles={['project_initiator']}>
                            <Layout>
                              <ProjectCreatePage />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path='/talent'
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <TalentPoolPage />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path='/transactions'
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <TransactionsPage />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path='/messages'
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <MessagesPage />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path='/profile'
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <ProfilePage />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path='/admin'
                        element={
                          <ProtectedRoute allowedRoles={['webadmin']}>
                            <Layout>
                              <AdminDashboard />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />

                      {/* Global Design House Supply Pool */}
                      <Route
                        path='/supply-pool'
                        element={
                          <ProtectedRoute>
                            <SupplyPoolPage />
                          </ProtectedRoute>
                        }
                      />
                      {/* Project Management */}
                      <Route
                        path='/projects/manage'
                        element={
                          <ProtectedRoute>
                            <ProjectManagementPage />
                          </ProtectedRoute>
                        }
                      />
                      {/* Payment & Settlement */}
                      <Route
                        path='/payments'
                        element={
                          <ProtectedRoute>
                            <PaymentSettlementPage />
                          </ProtectedRoute>
                        }
                      />
                      {/* AI Assistant Panel (standalone) */}
                      <Route
                        path='/ai-assistant'
                        element={
                          <ProtectedRoute>
                            <AIAssistantPanel currentRole='project_initiator' />
                          </ProtectedRoute>
                        }
                      />

                      {/* Redirects for demo */}
                      <Route path='/my-projects' element={<Navigate to='/projects' replace />} />
                      <Route path='/earnings' element={<Navigate to='/transactions' replace />} />
                      <Route path='/contracts' element={<Navigate to='/projects' replace />} />
                      <Route path='/reports' element={<Navigate to='/admin' replace />} />
                      <Route path='/settings' element={<Navigate to='/profile' replace />} />
                      <Route path='/analytics' element={<Navigate to='/admin' replace />} />
                      <Route path='/notifications' element={<Navigate to='/messages' replace />} />

                      {/* 404 Catch-all - must be last */}
                      <Route path='*' element={<NotFoundPage />} />
                    </Routes>

                    {/* Global AI Copilot Components */}
                    <AIChatPanel />
                    <AIFloatingButton />
                  </AIProvider>
                </NotificationProvider>
              </MessageProvider>
            </WalletProvider>
          </ProjectProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

import { Sidebar } from './components/Layout/Sidebar'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen bg-[var(--bg-primary)] transition-colors duration-150'>
      <Header />
      <Sidebar />
      <div className='pl-64 transition-all duration-300'>
        <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>{children}</main>
      </div>
    </div>
  )
}
