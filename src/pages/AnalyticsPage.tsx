import { useMemo } from 'react'
import { useApp } from '../hooks/useAppContext'

export function AnalyticsPage() {
  const { contacts, deals, tasks } = useApp()
  
  // Pipeline conversion rate by stage
  const stageConversion = useMemo(() => {
    const stages = ['qualified', 'proposal', 'negotiation', 'won']
    const counts = stages.map(stage => deals.filter(d => d.stage === stage).length)
    const total = deals.length || 1
    
    return stages.map((stage, i) => ({
      stage: stage.charAt(0).toUpperCase() + stage.slice(1),
      count: counts[i],
      percentage: Math.round((counts[i] / total) * 100)
    }))
  }, [deals])
  
  // Overdue task rate
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const openTasks = tasks.filter(t => t.status === 'open')
  const overdueTasks = openTasks.filter(t => t.dueDate && new Date(t.dueDate) < today)
  const overdueRate = openTasks.length > 0 
    ? Math.round((overdueTasks.length / openTasks.length) * 100) 
    : 0
  
  // Average days since last contact
  const avgDaysSinceContact = useMemo(() => {
    const contactsWithDates = contacts.filter(c => c.lastContactedAt)
    if (contactsWithDates.length === 0) return 0
    
    const totalDays = contactsWithDates.reduce((sum, c) => {
      const days = Math.floor((Date.now() - new Date(c.lastContactedAt!).getTime()) / (1000 * 60 * 60 * 24))
      return sum + days
    }, 0)
    
    return Math.round(totalDays / contactsWithDates.length)
  }, [contacts])
  
  // Customer risk distribution
  const riskDistribution = useMemo(() => {
    const high = contacts.filter(c => (c.riskScore || 0) >= 50).length
    const medium = contacts.filter(c => (c.riskScore || 0) >= 25 && (c.riskScore || 0) < 50).length
    const low = contacts.filter(c => (c.riskScore || 0) < 25).length
    const total = contacts.length || 1
    
    return [
      { label: 'High Risk', count: high, percentage: Math.round((high / total) * 100), color: 'bg-red-500' },
      { label: 'Medium Risk', count: medium, percentage: Math.round((medium / total) * 100), color: 'bg-amber-500' },
      { label: 'Low Risk', count: low, percentage: Math.round((low / total) * 100), color: 'bg-green-500' }
    ]
  }, [contacts])
  
  // Deal value by stage
  const dealValueByStage = useMemo(() => {
    const stages = ['qualified', 'proposal', 'negotiation', 'won', 'lost']
    const maxValue = Math.max(...stages.map(s => 
      deals.filter(d => d.stage === s).reduce((sum, d) => sum + d.value, 0)
    ), 1)
    
    return stages.map(stage => {
      const value = deals.filter(d => d.stage === stage).reduce((sum, d) => sum + d.value, 0)
      return {
        stage: stage.charAt(0).toUpperCase() + stage.slice(1),
        value,
        percentage: Math.round((value / maxValue) * 100)
      }
    })
  }, [deals])
  
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-5">
          <p className="text-sm text-slate-500 mb-1">Overdue Task Rate</p>
          <p className={`text-3xl font-semibold ${overdueRate > 30 ? 'text-red-600' : overdueRate > 15 ? 'text-amber-600' : 'text-green-600'}`}>
            {overdueRate}%
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {overdueTasks.length} of {openTasks.length} open tasks
          </p>
        </div>
        
        <div className="bg-white rounded-lg border border-slate-200 p-5">
          <p className="text-sm text-slate-500 mb-1">Avg Days Since Contact</p>
          <p className={`text-3xl font-semibold ${avgDaysSinceContact > 14 ? 'text-red-600' : avgDaysSinceContact > 7 ? 'text-amber-600' : 'text-green-600'}`}>
            {avgDaysSinceContact}
          </p>
          <p className="text-xs text-slate-400 mt-1">across {contacts.length} contacts</p>
        </div>
        
        <div className="bg-white rounded-lg border border-slate-200 p-5">
          <p className="text-sm text-slate-500 mb-1">Win Rate</p>
          <p className="text-3xl font-semibold text-primary-600">
            {deals.length > 0 ? Math.round((deals.filter(d => d.stage === 'won').length / deals.length) * 100) : 0}%
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {deals.filter(d => d.stage === 'won').length} won of {deals.length} total
          </p>
        </div>
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Conversion */}
        <div className="bg-white rounded-lg border border-slate-200 p-5">
          <h3 className="text-sm font-medium text-slate-700 mb-4">Pipeline Stage Distribution</h3>
          <div className="space-y-3">
            {stageConversion.map(item => (
              <div key={item.stage}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">{item.stage}</span>
                  <span className="text-slate-800 font-medium">{item.count} ({item.percentage}%)</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-500 rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Customer Risk Distribution */}
        <div className="bg-white rounded-lg border border-slate-200 p-5">
          <h3 className="text-sm font-medium text-slate-700 mb-4">Customer Risk Distribution</h3>
          <div className="space-y-3">
            {riskDistribution.map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">{item.label}</span>
                  <span className="text-slate-800 font-medium">{item.count} ({item.percentage}%)</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* Risk Pie Visual */}
          <div className="mt-6 flex items-center justify-center gap-6">
            <div className="relative w-24 h-24">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                {riskDistribution.reduce((acc, item, i) => {
                  const offset = acc.offset
                  const circumference = 2 * Math.PI * 40
                  const strokeDasharray = (item.percentage / 100) * circumference
                  const strokeDashoffset = -offset
                  
                  acc.elements.push(
                    <circle
                      key={item.label}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      strokeWidth="20"
                      className={item.color.replace('bg-', 'stroke-')}
                      strokeDasharray={`${strokeDasharray} ${circumference}`}
                      strokeDashoffset={strokeDashoffset}
                    />
                  )
                  acc.offset += strokeDasharray
                  return acc
                }, { elements: [] as JSX.Element[], offset: 0 }).elements}
              </svg>
            </div>
            <div className="space-y-2">
              {riskDistribution.map(item => (
                <div key={item.label} className="flex items-center gap-2 text-xs">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-slate-600">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Deal Value by Stage */}
      <div className="bg-white rounded-lg border border-slate-200 p-5">
        <h3 className="text-sm font-medium text-slate-700 mb-4">Deal Value by Stage</h3>
        <div className="flex items-end gap-4 h-48">
          {dealValueByStage.map(item => (
            <div key={item.stage} className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col items-center justify-end h-36">
                <span className="text-xs text-slate-600 mb-1">${(item.value / 1000).toFixed(0)}k</span>
                <div 
                  className={`w-full max-w-16 rounded-t transition-all duration-500 ${
                    item.stage === 'Won' ? 'bg-green-500' : 
                    item.stage === 'Lost' ? 'bg-slate-300' : 'bg-primary-500'
                  }`}
                  style={{ height: `${Math.max(item.percentage, 5)}%` }}
                />
              </div>
              <span className="text-xs text-slate-600 mt-2">{item.stage}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Status Distribution */}
      <div className="bg-white rounded-lg border border-slate-200 p-5">
        <h3 className="text-sm font-medium text-slate-700 mb-4">Contact Status Overview</h3>
        <div className="grid grid-cols-4 gap-4">
          {['lead', 'active', 'at_risk', 'closed'].map(status => {
            const count = contacts.filter(c => c.status === status).length
            const percentage = contacts.length > 0 ? Math.round((count / contacts.length) * 100) : 0
            const colors: Record<string, string> = {
              lead: 'bg-blue-100 text-blue-700 border-blue-200',
              active: 'bg-green-100 text-green-700 border-green-200',
              at_risk: 'bg-red-100 text-red-700 border-red-200',
              closed: 'bg-slate-100 text-slate-700 border-slate-200'
            }
            
            return (
              <div key={status} className={`p-4 rounded-lg border ${colors[status]}`}>
                <p className="text-2xl font-semibold">{count}</p>
                <p className="text-xs capitalize">{status.replace('_', ' ')}</p>
                <p className="text-xs opacity-75">{percentage}%</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
