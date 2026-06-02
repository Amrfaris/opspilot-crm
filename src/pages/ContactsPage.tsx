import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../hooks/useAppContext'
import { Contact, ContactStatus } from '../types'

export function ContactsPage() {
  const navigate = useNavigate()
  const { contacts } = useApp()
  
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ContactStatus | 'all'>('all')
  const [ownerFilter, setOwnerFilter] = useState<string>('all')
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [sourceFilter, setSourceFilter] = useState<string>('all')
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  
  const owners = useMemo(() => 
    Array.from(new Set(contacts.map(c => c.ownerName))).sort(),
    [contacts]
  )
  
  const sources = useMemo(() => 
    Array.from(new Set(contacts.map(c => c.source))).sort(),
    [contacts]
  )
  
  const filteredContacts = useMemo(() => {
    return contacts.filter(c => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && 
          !c.company.toLowerCase().includes(search.toLowerCase()) &&
          !c.email.toLowerCase().includes(search.toLowerCase())) {
        return false
      }
      if (statusFilter !== 'all' && c.status !== statusFilter) return false
      if (ownerFilter !== 'all' && c.ownerName !== ownerFilter) return false
      if (sourceFilter !== 'all' && c.source !== sourceFilter) return false
      if (riskFilter !== 'all') {
        const score = c.riskScore || 0
        if (riskFilter === 'high' && score < 50) return false
        if (riskFilter === 'medium' && (score < 25 || score >= 50)) return false
        if (riskFilter === 'low' && score >= 25) return false
      }
      return true
    })
  }, [contacts, search, statusFilter, ownerFilter, riskFilter, sourceFilter])
  
  const clearFilters = () => {
    setSearch('')
    setStatusFilter('all')
    setOwnerFilter('all')
    setRiskFilter('all')
    setSourceFilter('all')
  }
  
  const hasActiveFilters = search || statusFilter !== 'all' || ownerFilter !== 'all' || riskFilter !== 'all' || sourceFilter !== 'all'
  
  const getStatusBadge = (status: ContactStatus) => {
    const styles: Record<ContactStatus, string> = {
      lead: 'bg-blue-100 text-blue-700',
      active: 'bg-green-100 text-green-700',
      at_risk: 'bg-red-100 text-red-700',
      closed: 'bg-slate-100 text-slate-700'
    }
    return (
      <span className={`px-2 py-0.5 text-xs rounded-full ${styles[status]}`}>
        {status.replace('_', ' ')}
      </span>
    )
  }
  
  const getRiskBadge = (score: number) => {
    if (score >= 50) return <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700">{score}</span>
    if (score >= 25) return <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-700">{score}</span>
    return <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">{score}</span>
  }
  
  return (
    <div className="flex gap-6">
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Search & Filters */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 mb-4">
          <div className="flex flex-wrap gap-3 items-center">
            <input
              type="text"
              placeholder="Search contacts..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-md text-sm flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              aria-label="Search contacts"
            />
            
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as ContactStatus | 'all')}
              className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Filter by status"
            >
              <option value="all">All Status</option>
              <option value="lead">Lead</option>
              <option value="active">Active</option>
              <option value="at_risk">At Risk</option>
              <option value="closed">Closed</option>
            </select>
            
            <select
              value={ownerFilter}
              onChange={e => setOwnerFilter(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Filter by owner"
            >
              <option value="all">All Owners</option>
              {owners.map(owner => (
                <option key={owner} value={owner}>{owner}</option>
              ))}
            </select>
            
            <select
              value={riskFilter}
              onChange={e => setRiskFilter(e.target.value as 'all' | 'high' | 'medium' | 'low')}
              className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Filter by risk"
            >
              <option value="all">All Risk</option>
              <option value="high">High Risk (≥50)</option>
              <option value="medium">Medium (25-49)</option>
              <option value="low">Low ({'<'}25)</option>
            </select>
            
            <select
              value={sourceFilter}
              onChange={e => setSourceFilter(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Filter by source"
            >
              <option value="all">All Sources</option>
              {sources.map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
            
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm text-slate-600 hover:text-slate-800"
              >
                Clear filters
              </button>
            )}
            
            <button
              onClick={() => navigate('/contacts/new')}
              className="ml-auto px-4 py-2 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 transition-colors"
            >
              + Add Contact
            </button>
          </div>
        </div>
        
        {/* Results count */}
        <p className="text-sm text-slate-500 mb-3">
          Showing {filteredContacts.length} of {contacts.length} contacts
        </p>
        
        {/* Table */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Company</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Owner</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Value</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Risk</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Last Contact</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    No contacts found
                  </td>
                </tr>
              ) : (
                filteredContacts.map(contact => (
                  <tr 
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={`border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors ${
                      selectedContact?.id === contact.id ? 'bg-primary-50' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-slate-800">{contact.name}</p>
                        <p className="text-xs text-slate-500">{contact.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{contact.company}</td>
                    <td className="px-4 py-3">{getStatusBadge(contact.status)}</td>
                    <td className="px-4 py-3 text-slate-600">{contact.ownerName}</td>
                    <td className="px-4 py-3 text-slate-700">${contact.value.toLocaleString()}</td>
                    <td className="px-4 py-3">{getRiskBadge(contact.riskScore || 0)}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {contact.lastContactedAt 
                        ? new Date(contact.lastContactedAt).toLocaleDateString()
                        : 'Never'
                      }
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Detail Panel */}
      {selectedContact && (
        <div className="w-80 bg-white rounded-lg border border-slate-200 p-5 h-fit sticky top-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-slate-800">Contact Details</h3>
            <button 
              onClick={() => setSelectedContact(null)}
              className="text-slate-400 hover:text-slate-600"
              aria-label="Close panel"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-lg font-medium text-slate-900">{selectedContact.name}</p>
              <p className="text-sm text-slate-600">{selectedContact.company}</p>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Email</span>
                <span className="text-slate-800">{selectedContact.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phone</span>
                <span className="text-slate-800">{selectedContact.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                {getStatusBadge(selectedContact.status)}
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Source</span>
                <span className="text-slate-800">{selectedContact.source}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Value</span>
                <span className="text-slate-800">${selectedContact.value.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Risk Score</span>
                {getRiskBadge(selectedContact.riskScore || 0)}
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Owner</span>
                <span className="text-slate-800">{selectedContact.ownerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Team</span>
                <span className="text-slate-800">{selectedContact.team}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Last Contact</span>
                <span className="text-slate-800">
                  {selectedContact.lastContactedAt 
                    ? new Date(selectedContact.lastContactedAt).toLocaleDateString()
                    : 'Never'
                  }
                </span>
              </div>
            </div>
            
            <div className="pt-3 border-t border-slate-200">
              <p className="text-xs text-slate-500 mb-1">Next Step</p>
              <p className="text-sm text-slate-800">{selectedContact.nextStep || 'No next step defined'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
