export type Role = 'admin' | 'manager' | 'rep'
export type ContactStatus = 'lead' | 'active' | 'at_risk' | 'closed'
export type DealStage = 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'
export type TaskPriority = 'low' | 'medium' | 'high'
export type TaskStatus = 'open' | 'completed'
export type ActivityType = 'call' | 'email' | 'meeting' | 'note' | 'task'

export interface User {
  id: string
  fullName: string
  role: Role
  team: string
  avatarUrl?: string
  email: string
}

export interface Contact {
  id: string
  ownerId: string
  ownerName: string
  team: string
  name: string
  company: string
  email: string
  phone: string
  status: ContactStatus
  source: string
  value: number
  lastContactedAt: string | null
  nextStep: string
  createdAt: string
  riskScore?: number
}

export interface Deal {
  id: string
  ownerId: string
  contactId: string
  title: string
  company: string
  stage: DealStage
  value: number
  probability: number
  nextStep: string
  closeDate: string | null
  createdAt: string
  ownerName?: string
}

export interface Task {
  id: string
  ownerId: string
  contactId: string | null
  title: string
  dueDate: string | null
  priority: TaskPriority
  status: TaskStatus
  createdAt: string
  ownerName?: string
  contactName?: string
}

export interface Activity {
  id: string
  ownerId: string
  contactId: string | null
  type: ActivityType
  summary: string
  occurredAt: string
  ownerName?: string
  contactName?: string
}

export interface DemoState {
  user: User
  contacts: Contact[]
  deals: Deal[]
  tasks: Task[]
  activities: Activity[]
}
