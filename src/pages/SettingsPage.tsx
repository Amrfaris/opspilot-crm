import { useApp } from '../hooks/useAppContext'
import { Role } from '../types'
import { isSupabaseConfigured } from '../lib/supabase'

export function SettingsPage() {
  const { user, isDemo, setRole } = useApp()
  
  const roles: { value: Role; label: string; description: string }[] = [
    { value: 'admin', label: 'Admin', description: 'Full access to all records and settings' },
    { value: 'manager', label: 'Manager', description: 'Access to team records and assigned contacts' },
    { value: 'rep', label: 'Rep', description: 'Access only to personally assigned records' }
  ]
  
  return (
    <div className="max-w-2xl space-y-6">
      {/* Workspace Profile */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-medium text-slate-800 mb-4">Workspace Profile</h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-xl font-semibold text-primary-700">
              {user.fullName.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="text-lg font-medium text-slate-800">{user.fullName}</p>
              <p className="text-sm text-slate-500">{user.email}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
            <div>
              <p className="text-sm text-slate-500">Role</p>
              <p className="text-sm font-medium text-slate-800 capitalize">{user.role}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Team</p>
              <p className="text-sm font-medium text-slate-800">{user.team}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Demo Role Switcher */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-medium text-slate-800 mb-2">Demo Role Switcher</h3>
        <p className="text-sm text-slate-500 mb-4">
          Switch between roles to see how data access changes. This is available in demo mode for testing.
        </p>
        
        <div className="space-y-3">
          {roles.map(role => (
            <label
              key={role.value}
              className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
                user.role === role.value 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="role"
                value={role.value}
                checked={user.role === role.value}
                onChange={() => setRole(role.value)}
                className="mt-1"
              />
              <div>
                <p className="font-medium text-slate-800">{role.label}</p>
                <p className="text-sm text-slate-500">{role.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>
      
      {/* Connection Status */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-medium text-slate-800 mb-4">Connection Status</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div>
              <p className="font-medium text-slate-800">Supabase Connection</p>
              <p className="text-sm text-slate-500">Database and authentication backend</p>
            </div>
            <div className="flex items-center gap-2">
              {isSupabaseConfigured ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm text-green-700">Connected</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-sm text-amber-700">Demo Mode</span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-slate-800">Application Mode</p>
              <p className="text-sm text-slate-500">
                {isDemo 
                  ? 'Running with local sample data' 
                  : 'Connected to live database'
                }
              </p>
            </div>
            <span className={`px-3 py-1 text-sm rounded-full ${
              isDemo 
                ? 'bg-amber-100 text-amber-700' 
                : 'bg-green-100 text-green-700'
            }`}>
              {isDemo ? 'Demo' : 'Live'}
            </span>
          </div>
        </div>
        
        {isDemo && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> To connect to a live Supabase instance, set the following environment variables:
            </p>
            <ul className="text-sm text-blue-700 mt-2 space-y-1">
              <li>• <code className="bg-blue-100 px-1 rounded">VITE_SUPABASE_URL</code></li>
              <li>• <code className="bg-blue-100 px-1 rounded">VITE_SUPABASE_PUBLISHABLE_KEY</code></li>
            </ul>
          </div>
        )}
      </div>
      
      {/* User Preferences */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-medium text-slate-800 mb-4">User Preferences</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-800">Email Notifications</p>
              <p className="text-sm text-slate-500">Receive alerts for overdue tasks</p>
            </div>
            <button 
              className="relative w-12 h-6 bg-primary-600 rounded-full transition-colors"
              onClick={() => {}}
              aria-label="Toggle email notifications"
            >
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-800">Compact View</p>
              <p className="text-sm text-slate-500">Show more items in lists</p>
            </div>
            <button 
              className="relative w-12 h-6 bg-slate-300 rounded-full transition-colors"
              onClick={() => {}}
              aria-label="Toggle compact view"
            >
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-800">Dashboard Refresh</p>
              <p className="text-sm text-slate-500">Auto-refresh interval</p>
            </div>
            <select 
              className="px-3 py-1 border border-slate-300 rounded-md text-sm"
              defaultValue="5"
              aria-label="Dashboard refresh interval"
            >
              <option value="0">Manual</option>
              <option value="1">1 minute</option>
              <option value="5">5 minutes</option>
              <option value="15">15 minutes</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
