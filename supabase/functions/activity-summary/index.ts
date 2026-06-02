// Supabase Edge Function: activity-summary
// Returns activity summary statistics and recommended next actions

interface ActivitySummaryRequest {
  activities: Array<{
    type: 'call' | 'email' | 'meeting' | 'note' | 'task'
    occurredAt: string
  }>
  overdueTasks: number
  atRiskContacts: number
}

interface ActivitySummaryResponse {
  counts: {
    call: number
    email: number
    meeting: number
    note: number
    task: number
    total: number
  }
  overdueTaskCount: number
  recommendedAction: string
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    const body: ActivitySummaryRequest = await req.json()
    
    // Count activities by type
    const counts = {
      call: 0,
      email: 0,
      meeting: 0,
      note: 0,
      task: 0,
      total: 0
    }
    
    if (body.activities && Array.isArray(body.activities)) {
      body.activities.forEach(activity => {
        if (activity.type && counts.hasOwnProperty(activity.type)) {
          counts[activity.type]++
          counts.total++
        }
      })
    }
    
    // Determine recommended action based on data
    let recommendedAction = 'Review your dashboard for updates'
    
    if (body.overdueTasks > 0) {
      recommendedAction = `Address ${body.overdueTasks} overdue task${body.overdueTasks > 1 ? 's' : ''} immediately`
    } else if (body.atRiskContacts > 0) {
      recommendedAction = `Follow up with ${body.atRiskContacts} at-risk contact${body.atRiskContacts > 1 ? 's' : ''}`
    } else if (counts.call === 0 && counts.meeting === 0) {
      recommendedAction = 'Schedule calls or meetings to maintain engagement'
    } else if (counts.email > counts.call * 3) {
      recommendedAction = 'Consider more phone calls to balance communication'
    }
    
    const response: ActivitySummaryResponse = {
      counts,
      overdueTaskCount: body.overdueTasks || 0,
      recommendedAction
    }
    
    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Invalid request body' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
