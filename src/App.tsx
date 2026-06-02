import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './hooks/useAppContext'
import { Layout } from './components/Layout'
import { DashboardPage } from './pages/DashboardPage'
import { ContactsPage } from './pages/ContactsPage'
import { NewContactPage } from './pages/NewContactPage'
import { PipelinePage } from './pages/PipelinePage'
import { TasksPage } from './pages/TasksPage'
import { ActivityPage } from './pages/ActivityPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { ImportExportPage } from './pages/ImportExportPage'
import { SettingsPage } from './pages/SettingsPage'

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="contacts" element={<ContactsPage />} />
            <Route path="contacts/new" element={<NewContactPage />} />
            <Route path="pipeline" element={<PipelinePage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="activity" element={<ActivityPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="import-export" element={<ImportExportPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
