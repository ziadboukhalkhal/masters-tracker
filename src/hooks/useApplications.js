import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'

// Map DB row (snake_case) → app object (camelCase)
function toApp(row) {
  return {
    id: row.id,
    uni: row.uni ?? '',
    formation: row.formation ?? '',
    ville: row.ville ?? '',
    campus: row.campus ?? '',
    mail: row.mail ?? '',
    etat: row.etat ?? 'En attente',
    site: row.site ?? '',
    dateApplied: row.date_applied ?? '',
    notes: row.notes ?? '',
    createdAt: row.created_at,
  }
}

// Map app object → DB insert/update payload
function toRow(app) {
  return {
    uni: app.uni || null,
    formation: app.formation || null,
    ville: app.ville || null,
    campus: app.campus || null,
    mail: app.mail || null,
    etat: app.etat || 'En attente',
    site: app.site || null,
    date_applied: app.dateApplied || null,
    notes: app.notes || null,
  }
}

export function useApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      setError(error.message)
    } else {
      setApplications(data.map(toApp))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  async function addApplication(app) {
    const { data, error } = await supabase
      .from('applications')
      .insert([toRow(app)])
      .select()
      .single()
    if (error) {
      console.error('addApplication:', error.message)
      return
    }
    setApplications(prev => [toApp(data), ...prev])
  }

  async function updateApplication(id, updates) {
    const current = applications.find(a => a.id === id)
    const merged = { ...current, ...updates }
    const { data, error } = await supabase
      .from('applications')
      .update(toRow(merged))
      .eq('id', id)
      .select()
      .single()
    if (error) {
      console.error('updateApplication:', error.message)
      return
    }
    setApplications(prev => prev.map(a => a.id === id ? toApp(data) : a))
  }

  async function deleteApplication(id) {
    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', id)
    if (error) {
      console.error('deleteApplication:', error.message)
      return
    }
    setApplications(prev => prev.filter(a => a.id !== id))
  }

  return { applications, loading, error, addApplication, updateApplication, deleteApplication }
}
