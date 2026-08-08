import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const statusTabs = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Under Review', value: 'under_review' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Rejected', value: 'rejected' },
]

function formatDate(isoString) {
  return new Date(isoString).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
function extractFilePath(pdfUrl) {
  // Old rows stored a public URL like:
  // https://xxxx.supabase.co/storage/v1/object/public/papers/1234-file.pdf
  const marker = '/papers/'
  const index = pdfUrl.indexOf(marker)
  if (index === -1) return null
  return pdfUrl.slice(index + marker.length)
}

async function openSignedPdf(pdfUrl, setError) {
  const filePath = extractFilePath(pdfUrl)
  if (!filePath) {
    setError('Could not determine the file path for this PDF.')
    return
  }

  const { data, error } = await supabase
    .storage
    .from('papers')
    .createSignedUrl(filePath, 60 * 5) // valid for 5 minutes

  if (error) {
    setError(error.message)
    return
  }

  window.open(data.signedUrl, '_blank', 'noopener,noreferrer')
}

export default function Admin() {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submissions, setSubmissions] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [reviewNotes, setReviewNotes] = useState('')
  const [statusUpdate, setStatusUpdate] = useState('pending')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const initialize = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()
      setUser(currentUser)
      if (currentUser) {
        await fetchUserRole(currentUser.id)
      }
      setLoading(false)
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()
      setUser(currentUser)
      if (currentUser) {
        await fetchUserRole(currentUser.id)
      } else {
        setRole(null)
      }
    })

    initialize()
    return () => authListener?.subscription?.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user || !role) return
    if (role === 'reviewer' || role === 'admin') {
      fetchSubmissions()
    }
  }, [user, role])

  const fetchUserRole = async (userId) => {
    const { data, error: roleError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    if (roleError) {
      setError(roleError.message)
      setRole(null)
      return
    }

    setRole(data?.role ?? null)
  }

  const fetchSubmissions = async () => {
    setLoading(true)
    const { data, error: fetchError } = await supabase
      .from('submissions')
      .select('*')
      .order('submitted_at', { ascending: false })

    if (fetchError) {
      setError(fetchError.message)
    } else {
      setSubmissions(data ?? [])
      setError(null)
      if (data?.length > 0 && !selectedId) {
        setSelectedId(data[0].id)
      }
    }
    setLoading(false)
  }

  const selectedSubmission = useMemo(
    () => submissions.find((item) => item.id === selectedId) ?? null,
    [submissions, selectedId],
  )

  const filteredSubmissions = useMemo(() => {
    if (statusFilter === 'all') return submissions
    return submissions.filter((submission) => submission.status === statusFilter)
  }, [submissions, statusFilter])

  const handleUpdate = async () => {
    if (!selectedSubmission) return
    setSaving(true)
    const { error: updateError } = await supabase
      .from('submissions')
      .update({ status: statusUpdate, reviewer_notes: reviewNotes })
      .eq('id', selectedSubmission.id)

    if (updateError) {
      setError(updateError.message)
    } else {
      await fetchSubmissions()
      setError(null)
    }
    setSaving(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (loading) {
    return (
      <div className="admin-shell">
        <div className="wrap">
          <p>Loading admin dashboard…</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="admin-shell">
        <div className="wrap">
          <div className="admin-card">
            <h2>Reviewer / Admin login</h2>
            <p>Sign in with your Supabase account to review submissions.</p>
            <AuthForm onLogin={fetchSubmissions} setError={setError} />
            {error && <p className="admin-error">{error}</p>}
          </div>
        </div>
      </div>
    )
  }

  if (user && role && role !== 'reviewer' && role !== 'admin') {
    return (
      <div className="admin-shell">
        <div className="wrap">
          <div className="admin-card">
            <h2>Access denied</h2>
            <p>Your account is signed in, but you do not have reviewer or admin access.</p>
            <button type="button" className="btn ghost" onClick={handleLogout}>Sign Out</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-shell">
      <div className="wrap">
        <div className="admin-header">
          <div>
            <span className="eyebrow">Reviewer Dashboard</span>
            <h2 className="sec">Manage conference paper submissions</h2>
            <p className="sec-lead">Only authenticated reviewer or admin accounts may access this page.</p>
          </div>
          <button type="button" className="btn ghost" onClick={handleLogout}>Sign Out</button>
        </div>

        <div className="status-tabs">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              className={`tab-btn ${statusFilter === tab.value ? 'active' : ''}`}
              onClick={() => setStatusFilter(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="admin-grid">
          <div className="admin-list">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Authors</th>
                  <th>Track</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((submission) => (
                  <tr
                    key={submission.id}
                    className={submission.id === selectedId ? 'selected' : ''}
                    onClick={() => {
                      setSelectedId(submission.id)
                      setReviewNotes(submission.reviewer_notes ?? '')
                      setStatusUpdate(submission.status)
                    }}
                  >
                    <td>{submission.title}</td>
                    <td>{submission.author_names}</td>
                    <td>{submission.track}</td>
                    <td>{submission.status.replace('_', ' ')}</td>
                    <td>{formatDate(submission.submitted_at)}</td>
                  </tr>
                ))}
                {filteredSubmissions.length === 0 && (
                  <tr>
                    <td colSpan="5">No submissions found for this filter.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="admin-details">
            {selectedSubmission ? (
              <div className="admin-card">
                <h3>{selectedSubmission.title}</h3>
                <p className="admin-meta">{selectedSubmission.author_names} · {selectedSubmission.author_email}</p>
                <p className="admin-meta">Track: {selectedSubmission.track}</p>
                <p className="admin-meta">Submitted: {formatDate(selectedSubmission.submitted_at)}</p>
                <p>{selectedSubmission.abstract}</p>
                <div className="admin-file">
  <button
    type="button"
    className="btn ghost"
    onClick={() => openSignedPdf(selectedSubmission.pdf_url, setError)}
  >
    Open paper PDF
  </button>
</div>

                <div className="field">
                  <span>Status</span>
                  <select value={statusUpdate} onChange={(event) => setStatusUpdate(event.target.value)}>
                    <option value="pending">Pending</option>
                    <option value="under_review">Under Review</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div className="field field-full">
                  <span>Reviewer notes</span>
                  <textarea value={reviewNotes} onChange={(event) => setReviewNotes(event.target.value)} rows="5" />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn primary" onClick={handleUpdate} disabled={saving}>
                    {saving ? 'Saving…' : 'Save review'}
                  </button>
                </div>
                {error && <p className="admin-error">{error}</p>}
              </div>
            ) : (
              <div className="admin-card">
                <p>Select a submission to view details.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function AuthForm({ onLogin, setError }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError(null)

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError(authError.message)
    } else {
      await onLogin()
    }
    setBusy(false)
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="field">
        <span>Email</span>
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="reviewer@domain.com" />
      </div>
      <div className="field">
        <span>Password</span>
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required placeholder="••••••••" />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </div>
    </form>
  )
}
