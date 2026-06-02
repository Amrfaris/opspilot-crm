import { useNavigate } from 'react-router-dom'
import { useApp } from '../hooks/useAppContext'

export function DashboardPage() {
  const navigate = useNavigate()
  const { user, contacts, deals, tasks, activities } = useApp()
  
  // Calculate metrics
  const pipelineValue = deals
    .filter(d => !['won', 'lost'].includes(d.stage))
    .reduce((sum, d) => sum + d.value, 0)
  
  const activeContacts = contacts.filter(c => c.status === 'active').length
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const overdueTasks = tasks.filter(t => {
    if (t.status === 'completed' || !t.dueDate) return false
    return new Date(t.dueDate) < today
  })
  
  const recentActivities = [...activities]
    .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
    .slice(0, 5)
  
  // Weekly follow-up health (contacts contacted in last 7 days)
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  const contactedThisWeek = contacts.filter(c => 
    c.lastContactedAt && new Date(c.lastContactedAt) >= weekAgo
  ).length
  const followUpHealth = contacts.length > 0 
    ? Math.round((contactedThisWeek / contacts.length) * 100) 
    : 0
  
  // Risk summary
  const highRiskContacts = contacts.filter(c => (c.riskScore || 0) >= 50)
  const atRiskCount = contacts.filter(c => c.status === 'at_risk').length
  
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-5">
          <p className="text-sm text-slate-500 mb-1">Pipeline Value</p>
          <p className="text-2xl font-semibold text-slate-900">
            ${pipelineValue.toLocaleString()}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {deals.filter(d => !['won', 'lost'].includes(d.stage)).length} active deals
          </p>
        </div>
        
        <div className="bg-white rounded-lg border border-slate-200 p-5">
          <p className="text-sm text-slate-500 mb-1">Active Contacts</p>
          <p className="text-2xl font-semibold text-slate-900">{activeContacts}</p>
          <p className="text-xs text-slate-400 mt-1">{contacts.length} total contacts</p>
        </div>
        
        <div className="bg-white rounded-lg border border-slate-200 p-5">
          <p className="text-sm text-slate-500 mb-1">Overdue Tasks</p>
          <p className={`text-2xl font-semibold ${overdueTasks.length > 0 ? 'text-red-600' : 'text-slate-900'}`}>
            {overdueTasks.length}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {tasks.filter(t => t.status === 'open').length} open tasks
          </p>
        </div>
        
        <div className="bg-white rounded-lg border border-slate-200 p-5">
          <p className="text-sm text-slate-500 mb-1">Follow-up Health</p>
          <p className={`text-2xl font-semibold ${followUpHealth >= 50 ? 'text-green-600' : 'text-amber-600'}`}>
            {followUpHealth}%
          </p>
          <p className="text-xs text-slate-400 mt-1">contacted this week</p>
        </div>
      </div>
      
      {/* Quick Actions & Risk Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-5">
          <h3 className="text-sm font-medium text-slate-700 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button 
              onClick={() => navigate('/contacts/new')}
              className="w-full text-left px-3 py-2 text-sm bg-slate-50 hover:bg-slate-100 rounded-md transition-colors"
            >
              + Add New Contact
            </button>
            <button 
              onClick={() => navigate('/tasks')}
              className="w-full text-left px-3 py-2 text-sm bg-slate-50 hover:bg-slate-100 rounded-md transition-colors"
            >
              ☐ View All Tasks
            </button>
            <button 
              onClick={() => navigate('/pipeline')}
              className="w-full text-left px-3 py-2 text-sm bg-slate-50 hover:bg-slate-100 rounded-md transition-colors"
            >
              ◈ Open Pipeline
            </button>
            <button 
              onClick={() => navigate('/import-export')}
              className="w-full text-left px-3 py-2 text-sm bg-slate-50 hover:bg-slate-100 rounded-md transition-colors"
            >
              ⇄ Import Contacts
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-slate-200 p-5 lg:col-span-2">
          <h3 className="text-sm font-medium text-slate-700 mb-4">Customer Risk Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-red-50 rounded-md border border-red-100">
              <p className="text-2xl font-semibold text-red-700">{atRiskCount}</p>
              <p className="text-xs text-red-600">At-Risk Status</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-md border border-amber-100">
              <p className="text-2xl font-semibold text-amber-700">{highRiskContacts.length}</p>
              <p className="text-xs text-amber-600">High Risk Score (≥50)</p>
            </div>
          </div>
          {highRiskContacts.length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-slate-500 mb-2">Top at-risk contacts:</p>
              <ul className="space-y-1">
                {highRiskContacts.slice(0, 3).map(c => (
                  <li key={c.id} className="text-sm text-slate-700 flex justify-between">
                    <span>{c.name} ({c.company})</span>
                    <span className="text-red-600 font-medium">{c.riskScore}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-slate-700">Recent Activity</h3>
          <button 
            onClick={() => navigate('/activity')}
            className="text-xs text-primary-600 hover:text-primary-700"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {recentActivities.length === 0 ? (
            <p className="text-sm text-slate-500">No recent activity</p>
          ) : (
            recentActivities.map(activity => (
              <div key={activity.id} className="flex items-start gap-3 py-2 border-b border-slate-100 last:border-0">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs">
                  {activity.type === 'call' && '📞'}
                  {activity.type === 'email' && '✉️'}
                  {activity.type === 'meeting' && '📅'}
                  {activity.type === 'note' && '📝'}
                  {activity.type === 'task' && '☑️'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-800 truncate">{activity.summary}</p>
                  <p className="text-xs text-slate-500">
                    {activity.ownerName} • {activity.contactName} • {new Date(activity.occurredAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Overdue Tasks */}
      {overdueTasks.length > 0 && (
        <div className="bg-red-50 rounded-lg border border-red-200 p-5">
          <h3 className="text-sm font-medium text-red-800 mb-3">⚠️ Overdue Tasks</h3>
          <ul className="space-y-2">
            {overdueTasks.slice(0, 5).map(task => (
              <li key={task.id} className="flex items-center justify-between text-sm">
                <span className="text-red-700">{task.title}</span>
                <span className="text-red-500 text-xs">
                  Due: {new Date(task.dueDate!).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
          {overdueTasks.length > 5 && (
            <button 
              onClick={() => navigate('/tasks')}
              className="mt-3 text-xs text-red-700 hover:text-red-800"
            >
              View all {overdueTasks.length} overdue tasks →
            </button>
          )}
        </div>
      )}
    </div>
  )
}
