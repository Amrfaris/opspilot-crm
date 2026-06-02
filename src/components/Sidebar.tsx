import { NavLink, useLocation } from 'react-router-dom'
import { useApp } from '../hooks/useAppContext'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '◉' },
  { path: '/contacts', label: 'Contacts', icon: '◎' },
  { path: '/pipeline', label: 'Pipeline', icon: '◈' },
  { path: '/tasks', label: 'Tasks', icon: '☐' },
  { path: '/activity', label: 'Activity', icon: '◷' },
  { path: '/analytics', label: 'Analytics', icon: '◫' },
  { path: '/import-export', label: 'Import/Export', icon: '⇄' },
  { path: '/settings', label: 'Settings', icon: '⚙' }
]

export function Sidebar() {
  const { user, isDemo } = useApp()
  const location = useLocation()
  
  return (
    <aside className="fixed left-0 top-0 h-full w-56 bg-slate-900 text-white flex flex-col z-50">
      <div className="p-4 border-b border-slate-700">
        <h1 className="text-lg font-semibold text-white">OpsPilot</h1>
        <span className="text-xs text-slate-400">CRM</span>
      </div>
      
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map(item => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive 
                      ? 'bg-primary-600 text-white' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <span className="w-5 text-center">{item.icon}</span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-sm font-medium">
            {user.fullName.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.fullName}</p>
            <p className="text-xs text-slate-400 capitalize">{user.role}</p>
          </div>
        </div>
        {isDemo && (
          <div className="mt-3 px-2 py-1 bg-amber-900/50 rounded text-xs text-amber-300 text-center">
            Demo Mode
          </div>
        )}
      </div>
    </aside>
  )
}
