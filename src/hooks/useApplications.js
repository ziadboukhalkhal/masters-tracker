import { useState, useEffect } from 'react'

const STORAGE_KEY = 'masters_applications'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveToStorage(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function useApplications() {
  const [applications, setApplications] = useState(loadFromStorage)

  useEffect(() => {
    saveToStorage(applications)
  }, [applications])

  function addApplication(app) {
    const newApp = {
      ...app,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    setApplications(prev => [newApp, ...prev])
    return newApp
  }

  function updateApplication(id, updates) {
    setApplications(prev =>
      prev.map(app => (app.id === id ? { ...app, ...updates } : app))
    )
  }

  function deleteApplication(id) {
    setApplications(prev => prev.filter(app => app.id !== id))
  }

  return { applications, addApplication, updateApplication, deleteApplication }
}
