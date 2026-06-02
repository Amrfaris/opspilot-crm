import { useState, useMemo } from 'react'
import { useApp } from '../hooks/useAppContext'
import { ActivityType } from '../types'

export function ActivityPage() {
  const { activities } = useApp()
  const [typeFilter, setTypeFilter] = useState<ActivityType | 'all'>('all')
  
  const filteredActivities = useMemo(() => {
    const sorted = [...activities].sort((a, b) => 
      new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
    )
    if (typeFilter === 'all') return sorted
    return sorted.filter(a => a.type === typeFilter)
  }, [activities, typeFilter])
  
  const typeCounts = useMemo(() => ({
    all: activities.length,
    call: activities.filter(a => a.type === 'call').length,
    email: activities.filter(a => a.type === 'email').length,
    meeting: activities.filter(a => a.type === 'meeting').length,
    note: activities.filter(a => a.type === 'note').length,
    task: activities.filter(a => a.type === 'task').length
  }), [activities])
  
  const getTypeIcon = (type: ActivityType) => {
    switch (type) {
      case 'call': return '📞'
      case 'email': return '✉️'
      case 'meeting': return '📅'
      case 'note': return '📝'
      case 'task': return '☑️'
    }
  }
  
  const getTypeBadge = (type: ActivityType) => {
    const styles: Record<ActivityType, string> = {
      call: 'bg-green-100 text-green-700',
      email: 'bg-blue-100 text-blue-700',
      meeting: 'bg-purple-100 text-purple-700',
      note: 'bg-amber-100 text-amber-700',
      task: 'bg-slate-100 text-slate-700'
    }
    return (
      <span className={`px-2 py-0.5 text-xs rounded-full ${styles[type]}`}>
        {type}
      </span>
    )
  }
  
  const filters: { key: ActivityType | 'all'; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'call', label: 'Calls' },
    { key: 'email', label: 'Emails' },
    { key: 'meeting', label: 'Meetings' },
    { key: 'note', label: 'Notes' },
    { key: 'task', label: 'Tasks' }
  ]
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    }
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setTypeFilter(f.key)}
            className={`px-4 py-2 text-sm rounded-md transition-colors ${
              typeFilter === f.key
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {f.label}
            <span className={`ml-2 ${typeFilter === f.key ? 'text-primary-200' : 'text-slate-400'}`}>
              {typeCounts[f.key]}
            </span>
          </button>
        ))}
      </div>
      
      {/* Activity Feed */}
      <div className="bg-white rounded-lg border border-slate-200">
        {filteredActivities.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No activities found
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredActivities.map(activity => (
              <div key={activity.id} className="p-4 flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg flex-shrink-0">
                  {getTypeIcon(activity.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {getTypeBadge(activity.type)}
                    <span className="text-xs text-slate-500">
                      {formatDate(activity.occurredAt)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-slate-800 mb-1">{activity.summary}</p>
                  
                  <p className="text-xs text-slate-500">
                    {activity.ownerName}
                    {activity.contactName && (
                      <> • <span className="text-primary-600">{activity.contactName}</span></>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
