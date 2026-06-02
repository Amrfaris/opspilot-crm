import { useState, useMemo } from 'react'
import { useApp } from '../hooks/useAppContext'
import { Contact, ContactStatus } from '../types'

interface CSVRow {
  rowNumber: number
  data: Record<string, string>
  errors: string[]
  isValid: boolean
}

export function ImportExportPage() {
  const { user, contacts, importContacts } = useApp()
  
  const [csvInput, setCsvInput] = useState('')
  const [parsedRows, setParsedRows] = useState<CSVRow[]>([])
  const [importStatus, setImportStatus] = useState<'idle' | 'validated' | 'imported'>('idle')
  
  const validateRow = (data: Record<string, string>, rowNumber: number): CSVRow => {
    const errors: string[] = []
    
    if (!data.name?.trim()) errors.push('Name is required')
    if (!data.company?.trim()) errors.push('Company is required')
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Invalid email format')
    }
    if (data.status && !['lead', 'active', 'at_risk', 'closed'].includes(data.status.toLowerCase())) {
      errors.push('Status must be: lead, active, at_risk, or closed')
    }
    if (data.value && isNaN(parseFloat(data.value))) {
      errors.push('Value must be a number')
    }
    
    return {
      rowNumber,
      data,
      errors,
      isValid: errors.length === 0
    }
  }
  
  const parseCSV = () => {
    const lines = csvInput.trim().split('\n')
    if (lines.length < 2) {
      setParsedRows([])
      return
    }
    
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    const rows: CSVRow[] = []
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      const data: Record<string, string> = {}
      
      headers.forEach((header, idx) => {
        data[header] = values[idx] || ''
      })
      
      rows.push(validateRow(data, i + 1))
    }
    
    setParsedRows(rows)
    setImportStatus('validated')
  }
  
  const validRows = useMemo(() => parsedRows.filter(r => r.isValid), [parsedRows])
  const invalidRows = useMemo(() => parsedRows.filter(r => !r.isValid), [parsedRows])
  
  const handleImport = () => {
    const contactsToImport = validRows.map(row => ({
      ownerId: user.id,
      ownerName: user.fullName,
      team: user.team,
      name: row.data.name,
      company: row.data.company,
      email: row.data.email || '',
      phone: row.data.phone || '',
      status: (row.data.status?.toLowerCase() as ContactStatus) || 'lead',
      source: row.data.source || 'CSV Import',
      value: parseFloat(row.data.value) || 0,
      lastContactedAt: row.data.last_contacted || null,
      nextStep: row.data.next_step || ''
    }))
    
    importContacts(contactsToImport)
    setImportStatus('imported')
    setCsvInput('')
    setParsedRows([])
  }
  
  const handleExport = () => {
    const headers = ['name', 'company', 'email', 'phone', 'status', 'source', 'value', 'last_contacted', 'next_step', 'owner']
    const csvContent = [
      headers.join(','),
      ...contacts.map(c => [
        `"${c.name}"`,
        `"${c.company}"`,
        `"${c.email}"`,
        `"${c.phone}"`,
        c.status,
        `"${c.source}"`,
        c.value,
        c.lastContactedAt || '',
        `"${c.nextStep}"`,
        `"${c.ownerName}"`
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `contacts-export-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
  
  const sampleCSV = `name,company,email,phone,status,source,value,next_step
John Doe,Acme Corp,john@acme.com,(555) 123-4567,lead,Website,25000,Schedule intro call
Jane Smith,Tech Solutions,jane@techsol.io,(555) 987-6543,active,Referral,50000,Send proposal`
  
  return (
    <div className="space-y-6">
      {/* Import Section */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-medium text-slate-800 mb-4">Import Contacts</h3>
        
        <div className="mb-4">
          <p className="text-sm text-slate-600 mb-2">
            Paste CSV data below. Required columns: <strong>name</strong>, <strong>company</strong>. 
            Optional: email, phone, status, source, value, next_step
          </p>
          <button
            onClick={() => setCsvInput(sampleCSV)}
            className="text-xs text-primary-600 hover:text-primary-700"
          >
            Load sample CSV
          </button>
        </div>
        
        <textarea
          value={csvInput}
          onChange={e => {
            setCsvInput(e.target.value)
            setImportStatus('idle')
            setParsedRows([])
          }}
          placeholder="name,company,email,phone,status,source,value,next_step&#10;John Doe,Acme Corp,john@acme.com,..."
          className="w-full h-48 px-3 py-2 border border-slate-300 rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="CSV input"
        />
        
        <div className="flex gap-3 mt-4">
          <button
            onClick={parseCSV}
            disabled={!csvInput.trim()}
            className="px-4 py-2 bg-slate-600 text-white text-sm rounded-md hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Validate CSV
          </button>
          
          {importStatus === 'validated' && validRows.length > 0 && (
            <button
              onClick={handleImport}
              className="px-4 py-2 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 transition-colors"
            >
              Import {validRows.length} Valid Rows
            </button>
          )}
        </div>
        
        {/* Validation Results */}
        {importStatus === 'validated' && (
          <div className="mt-6 space-y-4">
            <div className="flex gap-4">
              <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-md">
                <span className="text-green-700 font-medium">{validRows.length}</span>
                <span className="text-green-600 text-sm ml-1">valid rows</span>
              </div>
              <div className="px-4 py-2 bg-red-50 border border-red-200 rounded-md">
                <span className="text-red-700 font-medium">{invalidRows.length}</span>
                <span className="text-red-600 text-sm ml-1">invalid rows</span>
              </div>
            </div>
            
            {/* Invalid Rows Details */}
            {invalidRows.length > 0 && (
              <div className="border border-red-200 rounded-md overflow-hidden">
                <div className="bg-red-50 px-4 py-2 border-b border-red-200">
                  <h4 className="text-sm font-medium text-red-800">Row Errors</h4>
                </div>
                <ul className="divide-y divide-red-100">
                  {invalidRows.map(row => (
                    <li key={row.rowNumber} className="px-4 py-2">
                      <p className="text-sm text-red-700 font-medium">Row {row.rowNumber}</p>
                      <ul className="text-xs text-red-600 mt-1">
                        {row.errors.map((err, i) => (
                          <li key={i}>• {err}</li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Valid Rows Preview */}
            {validRows.length > 0 && (
              <div className="border border-green-200 rounded-md overflow-hidden">
                <div className="bg-green-50 px-4 py-2 border-b border-green-200">
                  <h4 className="text-sm font-medium text-green-800">Preview Valid Rows</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left px-3 py-2 text-slate-600">Row</th>
                        <th className="text-left px-3 py-2 text-slate-600">Name</th>
                        <th className="text-left px-3 py-2 text-slate-600">Company</th>
                        <th className="text-left px-3 py-2 text-slate-600">Email</th>
                        <th className="text-left px-3 py-2 text-slate-600">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {validRows.slice(0, 5).map(row => (
                        <tr key={row.rowNumber} className="border-t border-slate-100">
                          <td className="px-3 py-2 text-slate-500">{row.rowNumber}</td>
                          <td className="px-3 py-2 text-slate-800">{row.data.name}</td>
                          <td className="px-3 py-2 text-slate-800">{row.data.company}</td>
                          <td className="px-3 py-2 text-slate-600">{row.data.email || '-'}</td>
                          <td className="px-3 py-2 text-slate-600">{row.data.status || 'lead'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {validRows.length > 5 && (
                    <p className="px-3 py-2 text-xs text-slate-500 bg-slate-50">
                      ... and {validRows.length - 5} more rows
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        
        {importStatus === 'imported' && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-700 font-medium">✓ Import successful!</p>
            <p className="text-green-600 text-sm">Contacts have been added to your list.</p>
          </div>
        )}
      </div>
      
      {/* Export Section */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-medium text-slate-800 mb-4">Export Contacts</h3>
        
        <p className="text-sm text-slate-600 mb-4">
          Download your contacts as a CSV file. This will export {contacts.length} contacts 
          based on your current role and filters.
        </p>
        
        <button
          onClick={handleExport}
          disabled={contacts.length === 0}
          className="px-4 py-2 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Download CSV ({contacts.length} contacts)
        </button>
      </div>
    </div>
  )
}
