import { useLocation } from 'react-router-dom'
import { useApp } from '../hooks/useAppContext'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/contacts': 'Contacts',
  '/contacts/new': 'New Contact',
  '/pipeline': 'Pipeline',
  '/tasks': 'Tasks',
  '/activity': 'Activity',
  '/analytics': 'Analytics',
  '/import-export': 'Import/Export',
  '/settings': 'Settings'
}

export function Header() {
  const location = useLocation()
  const { user } = useApp()
  const title = pageTitles[location.pathname] || 'OpsPilot CRM'
  const firstName = user.fullName.split(' ')[0]
  
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }
  
  return (
    <div>
      <div className="h-12 bg-gradient-to-r from-primary-50 to-primary-100 border-b border-primary-200 flex items-center px-6">
        <p className="text-sm font-medium text-primary-700">
          {getGreeting()}, {firstName}! 👋 Let's make some sales happen today.
        </p>
      </div>
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6">
        <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600">{user.email}</span>
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-sm font-medium text-primary-700">
            {user.fullName.split(' ').map(n => n[0]).join('')}
          </div>
        </div>
      </header>
    </div>
  )
}
