import { useState, useMemo } from 'react'
import { useApp } from '../hooks/useAppContext'
import { Task, TaskPriority, TaskStatus } from '../types'

type FilterType = 'all' | 'overdue' | 'today' | 'upcoming' | 'completed'

export function TasksPage() {
  const { user, tasks, contacts, addTask, toggleTaskStatus } = useApp()
  
  const [filter, setFilter] = useState<FilterType>('all')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    dueDate: '',
    priority: 'medium' as TaskPriority,
    contactId: ''
  })
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const weekFromNow = new Date(today)
  weekFromNow.setDate(weekFromNow.getDate() + 7)
  
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const dueDate = task.dueDate ? new Date(task.dueDate) : null
      if (dueDate) dueDate.setHours(0, 0, 0, 0)
      
      switch (filter) {
        case 'overdue':
          return task.status === 'open' && dueDate && dueDate < today
        case 'today':
          return dueDate && dueDate.getTime() === today.getTime()
        case 'upcoming':
          return task.status === 'open' && dueDate && dueDate > today && dueDate <= weekFromNow
        case 'completed':
          return task.status === 'completed'
        default:
          return true
      }
    }).sort((a, b) => {
      // Sort by status (open first), then by due date
      if (a.status !== b.status) return a.status === 'open' ? -1 : 1
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })
  }, [tasks, filter])
  
  const taskCounts = useMemo(() => ({
    all: tasks.length,
    overdue: tasks.filter(t => t.status === 'open' && t.dueDate && new Date(t.dueDate) < today).length,
    today: tasks.filter(t => t.dueDate && new Date(t.dueDate).toDateString() === today.toDateString()).length,
    upcoming: tasks.filter(t => {
      if (t.status !== 'open' || !t.dueDate) return false
      const d = new Date(t.dueDate)
      return d > today && d <= weekFromNow
    }).length,
    completed: tasks.filter(t => t.status === 'completed').length
  }), [tasks])
  
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.title.trim()) return
    
    const contact = contacts.find(c => c.id === newTask.contactId)
    
    addTask({
      ownerId: user.id,
      contactId: newTask.contactId || null,
      title: newTask.title.trim(),
      dueDate: newTask.dueDate || null,
      priority: newTask.priority,
      status: 'open',
      ownerName: user.fullName,
      contactName: contact?.name
    })
    
    setNewTask({ title: '', dueDate: '', priority: 'medium', contactId: '' })
    setShowCreateForm(false)
  }
  
  const getPriorityBadge = (priority: TaskPriority) => {
    const styles: Record<TaskPriority, string> = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-amber-100 text-amber-700',
      low: 'bg-slate-100 text-slate-600'
    }
    return (
      <span className={`px-2 py-0.5 text-xs rounded ${styles[priority]}`}>
        {priority}
      </span>
    )
  }
  
  const getDueDateDisplay = (dueDate: string | null, status: TaskStatus) => {
    if (!dueDate) return <span className="text-slate-400">No due date</span>
    
    const date = new Date(dueDate)
    date.setHours(0, 0, 0, 0)
    const isOverdue = date < today && status === 'open'
    const isToday = date.getTime() === today.getTime()
    
    return (
      <span className={`${isOverdue ? 'text-red-600 font-medium' : isToday ? 'text-amber-600' : 'text-slate-600'}`}>
        {isOverdue && '⚠ '}
        {isToday ? 'Today' : date.toLocaleDateString()}
      </span>
    )
  }
  
  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All Tasks' },
    { key: 'overdue', label: 'Overdue' },
    { key: 'today', label: 'Today' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'completed', label: 'Completed' }
  ]
  
  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 text-sm rounded-md transition-colors ${
              filter === f.key
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {f.label}
            <span className={`ml-2 ${filter === f.key ? 'text-primary-200' : 'text-slate-400'}`}>
              {taskCounts[f.key]}
            </span>
          </button>
        ))}
        
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="ml-auto px-4 py-2 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 transition-colors"
        >
          + New Task
        </button>
      </div>
      
      {/* Create Task Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
          <h3 className="font-medium text-slate-800 mb-4">Create New Task</h3>
          <form onSubmit={handleCreateTask} className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Task title..."
              value={newTask.title}
              onChange={e => setNewTask(prev => ({ ...prev, title: e.target.value }))}
              className="flex-1 min-w-[200px] px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
            
            <input
              type="date"
              value={newTask.dueDate}
              onChange={e => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
              className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Due date"
            />
            
            <select
              value={newTask.priority}
              onChange={e => setNewTask(prev => ({ ...prev, priority: e.target.value as TaskPriority }))}
              className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Priority"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            
            <select
              value={newTask.contactId}
              onChange={e => setNewTask(prev => ({ ...prev, contactId: e.target.value }))}
              className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Related contact"
            >
              <option value="">No Contact</option>
              {contacts.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.company})</option>
              ))}
            </select>
            
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 transition-colors"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-sm rounded-md hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </form>
        </div>
      )}
      
      {/* Task List */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No tasks found for this filter
          </div>
        ) : (
          <ul>
            {filteredTasks.map(task => (
              <li 
                key={task.id} 
                className={`flex items-center gap-4 px-4 py-3 border-b border-slate-100 last:border-0 ${
                  task.status === 'completed' ? 'bg-slate-50' : ''
                }`}
              >
                <button
                  onClick={() => toggleTaskStatus(task.id)}
                  className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                    task.status === 'completed'
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-slate-300 hover:border-primary-500'
                  }`}
                  aria-label={task.status === 'completed' ? 'Reopen task' : 'Complete task'}
                >
                  {task.status === 'completed' && '✓'}
                </button>
                
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                    {task.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    {task.ownerName}
                    {task.contactName && ` • ${task.contactName}`}
                  </p>
                </div>
                
                {getPriorityBadge(task.priority)}
                
                <div className="text-sm w-24 text-right">
                  {getDueDateDisplay(task.dueDate, task.status)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
