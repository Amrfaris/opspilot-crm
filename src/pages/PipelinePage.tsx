import { useMemo } from 'react'
import { useApp } from '../hooks/useAppContext'
import { Deal, DealStage } from '../types'

const stages: { key: DealStage; label: string }[] = [
  { key: 'qualified', label: 'Qualified' },
  { key: 'proposal', label: 'Proposal' },
  { key: 'negotiation', label: 'Negotiation' },
  { key: 'won', label: 'Won' },
  { key: 'lost', label: 'Lost' }
]

export function PipelinePage() {
  const { deals, updateDealStage } = useApp()
  
  const dealsByStage = useMemo(() => {
    const grouped: Record<DealStage, Deal[]> = {
      qualified: [],
      proposal: [],
      negotiation: [],
      won: [],
      lost: []
    }
    deals.forEach(deal => {
      grouped[deal.stage].push(deal)
    })
    return grouped
  }, [deals])
  
  const stageStats = useMemo(() => {
    return stages.map(stage => ({
      ...stage,
      count: dealsByStage[stage.key].length,
      value: dealsByStage[stage.key].reduce((sum, d) => sum + d.value, 0)
    }))
  }, [dealsByStage])
  
  const handleMoveStage = (dealId: string, currentStage: DealStage, direction: 'prev' | 'next') => {
    const currentIndex = stages.findIndex(s => s.key === currentStage)
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1
    if (newIndex >= 0 && newIndex < stages.length) {
      updateDealStage(dealId, stages[newIndex].key)
    }
  }
  
  const getStageColor = (stage: DealStage) => {
    switch (stage) {
      case 'qualified': return 'bg-blue-500'
      case 'proposal': return 'bg-amber-500'
      case 'negotiation': return 'bg-purple-500'
      case 'won': return 'bg-green-500'
      case 'lost': return 'bg-slate-400'
    }
  }
  
  const getProbabilityColor = (prob: number) => {
    if (prob >= 75) return 'text-green-600'
    if (prob >= 50) return 'text-amber-600'
    if (prob >= 25) return 'text-orange-600'
    return 'text-red-600'
  }
  
  return (
    <div>
      {/* Stage Summary */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {stageStats.map(stage => (
          <div key={stage.key} className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${getStageColor(stage.key)}`} />
              <span className="text-sm font-medium text-slate-700">{stage.label}</span>
            </div>
            <p className="text-xl font-semibold text-slate-900">${stage.value.toLocaleString()}</p>
            <p className="text-xs text-slate-500">{stage.count} {stage.count === 1 ? 'deal' : 'deals'}</p>
          </div>
        ))}
      </div>
      
      {/* Pipeline Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage, stageIndex) => (
          <div key={stage.key} className="flex-shrink-0 w-72">
            <div className="bg-slate-100 rounded-lg p-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getStageColor(stage.key)}`} />
                  <h3 className="font-medium text-slate-800">{stage.label}</h3>
                </div>
                <span className="text-xs text-slate-500 bg-white px-2 py-0.5 rounded">
                  {dealsByStage[stage.key].length}
                </span>
              </div>
              
              <div className="space-y-3">
                {dealsByStage[stage.key].length === 0 ? (
                  <div className="text-center py-8 text-sm text-slate-400">
                    No deals
                  </div>
                ) : (
                  dealsByStage[stage.key].map(deal => (
                    <div 
                      key={deal.id} 
                      className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm"
                    >
                      <h4 className="font-medium text-slate-800 text-sm mb-1">{deal.title}</h4>
                      <p className="text-xs text-slate-500 mb-2">{deal.company}</p>
                      
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-semibold text-slate-900">${deal.value.toLocaleString()}</span>
                        <span className={`font-medium ${getProbabilityColor(deal.probability)}`}>
                          {deal.probability}% prob
                        </span>
                      </div>
                      
                      <div className="text-xs text-slate-500 mb-2">
                        <p>Owner: {deal.ownerName}</p>
                        {deal.closeDate && (
                          <p>Close: {new Date(deal.closeDate).toLocaleDateString()}</p>
                        )}
                      </div>
                      
                      {deal.nextStep && (
                        <p className="text-xs text-slate-600 bg-slate-50 rounded px-2 py-1 mb-2">
                          Next: {deal.nextStep}
                        </p>
                      )}
                      
                      {/* Stage Navigation */}
                      {stage.key !== 'won' && stage.key !== 'lost' && (
                        <div className="flex gap-2 pt-2 border-t border-slate-100">
                          {stageIndex > 0 && (
                            <button
                              onClick={() => handleMoveStage(deal.id, deal.stage, 'prev')}
                              className="flex-1 text-xs py-1 px-2 bg-slate-100 hover:bg-slate-200 rounded transition-colors text-slate-600"
                              aria-label={`Move ${deal.title} to ${stages[stageIndex - 1].label}`}
                            >
                              ← {stages[stageIndex - 1].label}
                            </button>
                          )}
                          {stageIndex < stages.length - 1 && (
                            <button
                              onClick={() => handleMoveStage(deal.id, deal.stage, 'next')}
                              className="flex-1 text-xs py-1 px-2 bg-primary-100 hover:bg-primary-200 rounded transition-colors text-primary-700"
                              aria-label={`Move ${deal.title} to ${stages[stageIndex + 1].label}`}
                            >
                              {stages[stageIndex + 1].label} →
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Total Pipeline Value */}
      <div className="mt-6 bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Active Pipeline Value</p>
            <p className="text-2xl font-semibold text-slate-900">
              ${deals.filter(d => !['won', 'lost'].includes(d.stage)).reduce((sum, d) => sum + d.value, 0).toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Weighted Pipeline</p>
            <p className="text-2xl font-semibold text-primary-600">
              ${Math.round(deals.filter(d => !['won', 'lost'].includes(d.stage)).reduce((sum, d) => sum + (d.value * d.probability / 100), 0)).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
