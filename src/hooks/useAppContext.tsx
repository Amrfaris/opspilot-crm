import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react'
import { User, Contact, Deal, Task, Activity, Role } from '../types'
import { 
  demoUsers, 
  sampleContacts, 
  sampleDeals, 
  sampleTasks, 
  sampleActivities,
  filterByRole,
  calculateRiskScore
} from '../data/sampleData'
import { getDemoMode } from '../lib/supabase'

interface AppContextType {
  // User & Auth
  user: User
  isDemo: boolean
  setRole: (role: Role) => void
  
  // Contacts
  contacts: Contact[]
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'riskScore'>) => void
  updateContact: (id: string, updates: Partial<Contact>) => void
  
  // Deals
  deals: Deal[]
  addDeal: (deal: Omit<Deal, 'id' | 'createdAt'>) => void
  updateDealStage: (dealId: string, stage: Deal['stage']) => void
  
  // Tasks
  tasks: Task[]
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
  toggleTaskStatus: (taskId: string) => void
  
  // Activities
  activities: Activity[]
  addActivity: (activity: Omit<Activity, 'id' | 'occurredAt'>) => void
  
  // Import
  importContacts: (newContacts: Omit<Contact, 'id' | 'createdAt' | 'riskScore'>[]) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<Role>('admin')
  const [allContacts, setAllContacts] = useState<Contact[]>(() => 
    sampleContacts.map(c => ({ ...c, riskScore: calculateRiskScore(c) }))
  )
  const [allDeals, setAllDeals] = useState<Deal[]>(sampleDeals)
  const [allTasks, setAllTasks] = useState<Task[]>(sampleTasks)
  const [allActivities, setAllActivities] = useState<Activity[]>(sampleActivities)
  
  const isDemo = getDemoMode()
  const user = demoUsers[currentRole]
  
  // Filter data based on role
  const contacts = filterByRole(allContacts, user) as Contact[]
  const deals = filterByRole(allDeals.map(d => ({ ...d, team: allContacts.find(c => c.id === d.contactId)?.team })), user) as Deal[]
  const tasks = filterByRole(allTasks, user) as Task[]
  const activities = filterByRole(allActivities, user) as Activity[]
  
  const setRole = useCallback((role: Role) => {
    setCurrentRole(role)
  }, [])
  
  const addContact = useCallback((contact: Omit<Contact, 'id' | 'createdAt' | 'riskScore'>) => {
    const newContact: Contact = {
      ...contact,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      riskScore: 0
    }
    newContact.riskScore = calculateRiskScore(newContact)
    setAllContacts(prev => [...prev, newContact])
  }, [])
  
  const updateContact = useCallback((id: string, updates: Partial<Contact>) => {
    setAllContacts(prev => prev.map(c => {
      if (c.id === id) {
        const updated = { ...c, ...updates }
        updated.riskScore = calculateRiskScore(updated)
        return updated
      }
      return c
    }))
  }, [])
  
  const addDeal = useCallback((deal: Omit<Deal, 'id' | 'createdAt'>) => {
    const newDeal: Deal = {
      ...deal,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    }
    setAllDeals(prev => [...prev, newDeal])
  }, [])
  
  const updateDealStage = useCallback((dealId: string, stage: Deal['stage']) => {
    setAllDeals(prev => prev.map(d => 
      d.id === dealId ? { ...d, stage } : d
    ))
  }, [])
  
  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    }
    setAllTasks(prev => [...prev, newTask])
  }, [])
  
  const toggleTaskStatus = useCallback((taskId: string) => {
    setAllTasks(prev => prev.map(t => 
      t.id === taskId 
        ? { ...t, status: t.status === 'open' ? 'completed' : 'open' }
        : t
    ))
  }, [])
  
  const addActivity = useCallback((activity: Omit<Activity, 'id' | 'occurredAt'>) => {
    const newActivity: Activity = {
      ...activity,
      id: crypto.randomUUID(),
      occurredAt: new Date().toISOString()
    }
    setAllActivities(prev => [newActivity, ...prev])
  }, [])
  
  const importContacts = useCallback((newContacts: Omit<Contact, 'id' | 'createdAt' | 'riskScore'>[]) => {
    const contactsToAdd: Contact[] = newContacts.map(c => {
      const contact: Contact = {
        ...c,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        riskScore: 0
      }
      contact.riskScore = calculateRiskScore(contact)
      return contact
    })
    setAllContacts(prev => [...prev, ...contactsToAdd])
  }, [])
  
  return (
    <AppContext.Provider value={{
      user,
      isDemo,
      setRole,
      contacts,
      addContact,
      updateContact,
      deals,
      addDeal,
      updateDealStage,
      tasks,
      addTask,
      toggleTaskStatus,
      activities,
      addActivity,
      importContacts
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
