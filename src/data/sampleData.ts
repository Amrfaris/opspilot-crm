import { Contact, Deal, Task, Activity, User, Role } from '../types'

const generateId = () => crypto.randomUUID()

export const demoUsers: Record<Role, User> = {
  admin: {
    id: 'user-admin-001',
    fullName: 'Alex Morgan',
    role: 'admin',
    team: 'Leadership',
    email: 'alex@opspilot.com',
    avatarUrl: ''
  },
  manager: {
    id: 'user-manager-001',
    fullName: 'Jordan Chen',
    role: 'manager',
    team: 'Sales West',
    email: 'jordan@opspilot.com',
    avatarUrl: ''
  },
  rep: {
    id: 'user-rep-001',
    fullName: 'Sam Rivera',
    role: 'rep',
    team: 'Sales West',
    email: 'sam@opspilot.com',
    avatarUrl: ''
  }
}

const owners = [
  { id: 'user-rep-001', name: 'Sam Rivera', team: 'Sales West' },
  { id: 'user-rep-002', name: 'Casey Kim', team: 'Sales West' },
  { id: 'user-rep-003', name: 'Morgan Lee', team: 'Sales East' },
  { id: 'user-manager-001', name: 'Jordan Chen', team: 'Sales West' }
]

export const sampleContacts: Contact[] = [
  {
    id: generateId(),
    ownerId: 'user-rep-001',
    ownerName: 'Sam Rivera',
    team: 'Sales West',
    name: 'Sarah Mitchell',
    company: 'TechFlow Inc',
    email: 'sarah@techflow.com',
    phone: '(555) 234-5678',
    status: 'active',
    source: 'Referral',
    value: 45000,
    lastContactedAt: '2024-01-15',
    nextStep: 'Schedule product demo',
    createdAt: '2024-01-02T10:00:00Z'
  },
  {
    id: generateId(),
    ownerId: 'user-rep-001',
    ownerName: 'Sam Rivera',
    team: 'Sales West',
    name: 'Michael Torres',
    company: 'DataSync Corp',
    email: 'michael@datasync.co',
    phone: '(555) 345-6789',
    status: 'lead',
    source: 'Website',
    value: 28000,
    lastContactedAt: '2024-01-18',
    nextStep: 'Send pricing proposal',
    createdAt: '2024-01-10T14:30:00Z'
  },
  {
    id: generateId(),
    ownerId: 'user-rep-002',
    ownerName: 'Casey Kim',
    team: 'Sales West',
    name: 'Emily Watson',
    company: 'CloudBase Systems',
    email: 'emily@cloudbase.io',
    phone: '(555) 456-7890',
    status: 'at_risk',
    source: 'Conference',
    value: 72000,
    lastContactedAt: '2023-12-20',
    nextStep: 'Urgent follow-up call',
    createdAt: '2023-11-15T09:00:00Z'
  },
  {
    id: generateId(),
    ownerId: 'user-rep-003',
    ownerName: 'Morgan Lee',
    team: 'Sales East',
    name: 'David Park',
    company: 'Innovate Labs',
    email: 'david@innovatelabs.com',
    phone: '(555) 567-8901',
    status: 'active',
    source: 'Cold Outreach',
    value: 35000,
    lastContactedAt: '2024-01-17',
    nextStep: 'Contract review meeting',
    createdAt: '2023-12-01T11:00:00Z'
  },
  {
    id: generateId(),
    ownerId: 'user-manager-001',
    ownerName: 'Jordan Chen',
    team: 'Sales West',
    name: 'Lisa Anderson',
    company: 'Growth Dynamics',
    email: 'lisa@growthdynamics.com',
    phone: '(555) 678-9012',
    status: 'closed',
    source: 'Partner',
    value: 95000,
    lastContactedAt: '2024-01-10',
    nextStep: 'Onboarding complete',
    createdAt: '2023-10-05T08:00:00Z'
  },
  {
    id: generateId(),
    ownerId: 'user-rep-001',
    ownerName: 'Sam Rivera',
    team: 'Sales West',
    name: 'James Wilson',
    company: 'Apex Solutions',
    email: 'james@apexsol.com',
    phone: '(555) 789-0123',
    status: 'lead',
    source: 'LinkedIn',
    value: 18000,
    lastContactedAt: '2024-01-19',
    nextStep: 'Initial discovery call',
    createdAt: '2024-01-15T13:00:00Z'
  },
  {
    id: generateId(),
    ownerId: 'user-rep-002',
    ownerName: 'Casey Kim',
    team: 'Sales West',
    name: 'Rachel Green',
    company: 'Vertex Analytics',
    email: 'rachel@vertex.ai',
    phone: '(555) 890-1234',
    status: 'active',
    source: 'Webinar',
    value: 52000,
    lastContactedAt: '2024-01-16',
    nextStep: 'Technical requirements review',
    createdAt: '2023-12-10T10:30:00Z'
  },
  {
    id: generateId(),
    ownerId: 'user-rep-003',
    ownerName: 'Morgan Lee',
    team: 'Sales East',
    name: 'Thomas Brown',
    company: 'Streamline Pro',
    email: 'thomas@streamlinepro.com',
    phone: '(555) 901-2345',
    status: 'at_risk',
    source: 'Referral',
    value: 64000,
    lastContactedAt: '2023-12-28',
    nextStep: 'Re-engagement meeting',
    createdAt: '2023-09-20T14:00:00Z'
  }
]

export const sampleDeals: Deal[] = [
  {
    id: generateId(),
    ownerId: 'user-rep-001',
    contactId: sampleContacts[0].id,
    title: 'TechFlow Enterprise License',
    company: 'TechFlow Inc',
    stage: 'proposal',
    value: 45000,
    probability: 60,
    nextStep: 'Present pricing options',
    closeDate: '2024-02-15',
    createdAt: '2024-01-05T10:00:00Z',
    ownerName: 'Sam Rivera'
  },
  {
    id: generateId(),
    ownerId: 'user-rep-001',
    contactId: sampleContacts[1].id,
    title: 'DataSync Annual Contract',
    company: 'DataSync Corp',
    stage: 'qualified',
    value: 28000,
    probability: 30,
    nextStep: 'Schedule demo',
    closeDate: '2024-03-01',
    createdAt: '2024-01-12T14:00:00Z',
    ownerName: 'Sam Rivera'
  },
  {
    id: generateId(),
    ownerId: 'user-rep-002',
    contactId: sampleContacts[2].id,
    title: 'CloudBase Migration Project',
    company: 'CloudBase Systems',
    stage: 'negotiation',
    value: 72000,
    probability: 75,
    nextStep: 'Final contract review',
    closeDate: '2024-01-30',
    createdAt: '2023-11-20T09:00:00Z',
    ownerName: 'Casey Kim'
  },
  {
    id: generateId(),
    ownerId: 'user-rep-003',
    contactId: sampleContacts[3].id,
    title: 'Innovate Labs Pilot',
    company: 'Innovate Labs',
    stage: 'proposal',
    value: 35000,
    probability: 50,
    nextStep: 'Technical validation',
    closeDate: '2024-02-20',
    createdAt: '2023-12-05T11:00:00Z',
    ownerName: 'Morgan Lee'
  },
  {
    id: generateId(),
    ownerId: 'user-manager-001',
    contactId: sampleContacts[4].id,
    title: 'Growth Dynamics Full Suite',
    company: 'Growth Dynamics',
    stage: 'won',
    value: 95000,
    probability: 100,
    nextStep: 'Completed',
    closeDate: '2024-01-10',
    createdAt: '2023-10-10T08:00:00Z',
    ownerName: 'Jordan Chen'
  },
  {
    id: generateId(),
    ownerId: 'user-rep-002',
    contactId: sampleContacts[6].id,
    title: 'Vertex AI Integration',
    company: 'Vertex Analytics',
    stage: 'qualified',
    value: 52000,
    probability: 40,
    nextStep: 'Requirements gathering',
    closeDate: '2024-03-15',
    createdAt: '2023-12-15T10:30:00Z',
    ownerName: 'Casey Kim'
  },
  {
    id: generateId(),
    ownerId: 'user-rep-003',
    contactId: sampleContacts[7].id,
    title: 'Streamline Pro Expansion',
    company: 'Streamline Pro',
    stage: 'lost',
    value: 64000,
    probability: 0,
    nextStep: 'N/A',
    closeDate: '2024-01-05',
    createdAt: '2023-09-25T14:00:00Z',
    ownerName: 'Morgan Lee'
  }
]

export const sampleTasks: Task[] = [
  {
    id: generateId(),
    ownerId: 'user-rep-001',
    contactId: sampleContacts[0].id,
    title: 'Send follow-up email to Sarah',
    dueDate: '2024-01-20',
    priority: 'high',
    status: 'open',
    createdAt: '2024-01-15T10:00:00Z',
    ownerName: 'Sam Rivera',
    contactName: 'Sarah Mitchell'
  },
  {
    id: generateId(),
    ownerId: 'user-rep-001',
    contactId: sampleContacts[1].id,
    title: 'Prepare pricing proposal for DataSync',
    dueDate: '2024-01-18',
    priority: 'high',
    status: 'open',
    createdAt: '2024-01-14T14:00:00Z',
    ownerName: 'Sam Rivera',
    contactName: 'Michael Torres'
  },
  {
    id: generateId(),
    ownerId: 'user-rep-002',
    contactId: sampleContacts[2].id,
    title: 'Urgent: Call Emily about contract concerns',
    dueDate: '2024-01-15',
    priority: 'high',
    status: 'open',
    createdAt: '2024-01-13T09:00:00Z',
    ownerName: 'Casey Kim',
    contactName: 'Emily Watson'
  },
  {
    id: generateId(),
    ownerId: 'user-rep-003',
    contactId: sampleContacts[3].id,
    title: 'Schedule technical review with Innovate Labs',
    dueDate: '2024-01-22',
    priority: 'medium',
    status: 'open',
    createdAt: '2024-01-17T11:00:00Z',
    ownerName: 'Morgan Lee',
    contactName: 'David Park'
  },
  {
    id: generateId(),
    ownerId: 'user-manager-001',
    contactId: sampleContacts[4].id,
    title: 'Complete onboarding checklist for Growth Dynamics',
    dueDate: '2024-01-25',
    priority: 'medium',
    status: 'completed',
    createdAt: '2024-01-10T08:00:00Z',
    ownerName: 'Jordan Chen',
    contactName: 'Lisa Anderson'
  },
  {
    id: generateId(),
    ownerId: 'user-rep-001',
    contactId: sampleContacts[5].id,
    title: 'Initial outreach to James',
    dueDate: '2024-01-21',
    priority: 'low',
    status: 'open',
    createdAt: '2024-01-19T13:00:00Z',
    ownerName: 'Sam Rivera',
    contactName: 'James Wilson'
  },
  {
    id: generateId(),
    ownerId: 'user-rep-002',
    contactId: sampleContacts[6].id,
    title: 'Review Vertex technical requirements doc',
    dueDate: '2024-01-23',
    priority: 'medium',
    status: 'open',
    createdAt: '2024-01-16T10:30:00Z',
    ownerName: 'Casey Kim',
    contactName: 'Rachel Green'
  },
  {
    id: generateId(),
    ownerId: 'user-rep-003',
    contactId: sampleContacts[7].id,
    title: 'Re-engagement strategy for Streamline Pro',
    dueDate: '2024-01-19',
    priority: 'high',
    status: 'open',
    createdAt: '2023-12-28T14:00:00Z',
    ownerName: 'Morgan Lee',
    contactName: 'Thomas Brown'
  }
]

export const sampleActivities: Activity[] = [
  {
    id: generateId(),
    ownerId: 'user-rep-001',
    contactId: sampleContacts[0].id,
    type: 'call',
    summary: 'Discussed product requirements with Sarah. She is interested in the enterprise features.',
    occurredAt: '2024-01-19T14:30:00Z',
    ownerName: 'Sam Rivera',
    contactName: 'Sarah Mitchell'
  },
  {
    id: generateId(),
    ownerId: 'user-rep-001',
    contactId: sampleContacts[1].id,
    type: 'email',
    summary: 'Sent initial product overview and pricing information to Michael.',
    occurredAt: '2024-01-18T10:00:00Z',
    ownerName: 'Sam Rivera',
    contactName: 'Michael Torres'
  },
  {
    id: generateId(),
    ownerId: 'user-rep-002',
    contactId: sampleContacts[2].id,
    type: 'meeting',
    summary: 'In-person meeting to discuss contract terms. Emily raised concerns about timeline.',
    occurredAt: '2024-01-17T11:00:00Z',
    ownerName: 'Casey Kim',
    contactName: 'Emily Watson'
  },
  {
    id: generateId(),
    ownerId: 'user-rep-003',
    contactId: sampleContacts[3].id,
    type: 'call',
    summary: 'Quick check-in call with David. Moving forward with technical review.',
    occurredAt: '2024-01-17T15:00:00Z',
    ownerName: 'Morgan Lee',
    contactName: 'David Park'
  },
  {
    id: generateId(),
    ownerId: 'user-manager-001',
    contactId: sampleContacts[4].id,
    type: 'note',
    summary: 'Deal closed successfully. Lisa mentioned potential referrals in her network.',
    occurredAt: '2024-01-10T16:00:00Z',
    ownerName: 'Jordan Chen',
    contactName: 'Lisa Anderson'
  },
  {
    id: generateId(),
    ownerId: 'user-rep-001',
    contactId: sampleContacts[5].id,
    type: 'email',
    summary: 'Cold outreach email sent to James introducing our platform.',
    occurredAt: '2024-01-19T09:00:00Z',
    ownerName: 'Sam Rivera',
    contactName: 'James Wilson'
  },
  {
    id: generateId(),
    ownerId: 'user-rep-002',
    contactId: sampleContacts[6].id,
    type: 'meeting',
    summary: 'Virtual demo session with Rachel and her technical team.',
    occurredAt: '2024-01-16T14:00:00Z',
    ownerName: 'Casey Kim',
    contactName: 'Rachel Green'
  },
  {
    id: generateId(),
    ownerId: 'user-rep-003',
    contactId: sampleContacts[7].id,
    type: 'task',
    summary: 'Created re-engagement plan for Streamline Pro account.',
    occurredAt: '2024-01-15T10:00:00Z',
    ownerName: 'Morgan Lee',
    contactName: 'Thomas Brown'
  },
  {
    id: generateId(),
    ownerId: 'user-rep-001',
    contactId: sampleContacts[0].id,
    type: 'email',
    summary: 'Followed up with case studies and ROI documentation.',
    occurredAt: '2024-01-15T11:00:00Z',
    ownerName: 'Sam Rivera',
    contactName: 'Sarah Mitchell'
  },
  {
    id: generateId(),
    ownerId: 'user-rep-002',
    contactId: sampleContacts[2].id,
    type: 'call',
    summary: 'Left voicemail for Emily regarding contract updates.',
    occurredAt: '2024-01-14T16:30:00Z',
    ownerName: 'Casey Kim',
    contactName: 'Emily Watson'
  }
]

export function filterByRole(items: { ownerId: string; team?: string }[], user: User): typeof items {
  switch (user.role) {
    case 'admin':
      return items
    case 'manager':
      return items.filter(item => item.team === user.team || item.ownerId === user.id)
    case 'rep':
      return items.filter(item => item.ownerId === user.id)
    default:
      return items
  }
}

export function calculateRiskScore(contact: Contact): number {
  let score = 0
  
  // Status-based risk
  if (contact.status === 'at_risk') score += 40
  else if (contact.status === 'lead') score += 20
  else if (contact.status === 'active') score += 10
  
  // Days since last contact
  if (contact.lastContactedAt) {
    const daysSince = Math.floor((Date.now() - new Date(contact.lastContactedAt).getTime()) / (1000 * 60 * 60 * 24))
    if (daysSince > 30) score += 30
    else if (daysSince > 14) score += 20
    else if (daysSince > 7) score += 10
  } else {
    score += 30
  }
  
  // Value-based risk (higher value = higher impact if lost)
  if (contact.value > 50000) score += 20
  else if (contact.value > 25000) score += 10
  
  return Math.min(score, 100)
}
