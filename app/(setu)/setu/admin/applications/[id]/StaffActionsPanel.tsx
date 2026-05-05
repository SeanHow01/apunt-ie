'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateStatus, addStaffNote } from '@/lib/setu/saf-actions'
import { STATUS_CONFIG } from '@/lib/setu/saf-types'
import type { SafApplication, SafStaffNote } from '@/lib/setu/saf-types'

type ActionStatus = 'awaiting_info' | 'under_review' | 'approved' | 'rejected'
const ACTION_OPTIONS: { value: ActionStatus; label: string }[] = [
  { value: 'under_review', label: 'Mark under review' },
  { value: 'awaiting_info', label: 'Request more information' },
  { value: 'approved', label: 'Approve' },
  { value: 'rejected', label: 'Mark unsuccessful' },
]

export default function StaffActionsPanel({
  applicationId,
  currentStatus,
  notes,
}: {
  applicationId: string
  currentStatus: SafApplication['status']
  notes: SafStaffNote[]
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selectedAction, setSelectedAction] = useState<ActionStatus>('under_review')
  const [infoNote, setInfoNote] = useState('')
  const [awardAmount, setAwardAmount] = useState('')
  const [actionError, setActionError] = useState('')
  const [newNote, setNewNote] = useState('')
  const [noteError, setNoteError] = useState('')
  const [localNotes, setLocalNotes] = useState<SafStaffNote[]>(notes)

  function handleApplyAction() {
    if (selectedAction === 'awaiting_info' && !infoNote.trim()) {
      setActionError('Please describe what information is needed.')
      return
    }
    if (selectedAction === 'approved' && (!awardAmount || isNaN(parseFloat(awardAmount)))) {
      setActionError('Please enter a valid award amount.')
      return
    }
    setActionError('')
    startTransition(async () => {
      const result = await updateStatus(
        applicationId,
        selectedAction,
        selectedAction === 'awaiting_info' ? infoNote : undefined,
        selectedAction === 'approved' ? parseFloat(awardAmount) : undefined
      )
      if (result && 'error' in result) {
        setActionError(result.error)
      } else {
        router.refresh()
      }
    })
  }

  function handleAddNote() {
    if (!newNote.trim()) return
    setNoteError('')
    startTransition(async () => {
      const result = await addStaffNote(applicationId, newNote.trim())
      if (result && 'error' in result) {
        setNoteError(result.error)
      } else {
        setLocalNotes(prev => [{
          id: Date.now().toString(),
          application_id: applicationId,
          staff_user_id: '',
          note: newNote.trim(),
          created_at: new Date().toISOString(),
        }, ...prev])
        setNewNote('')
      }
    })
  }

  const isFinal = currentStatus === 'approved' || currentStatus === 'rejected'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Status action */}
      <div style={{ border: '1px solid var(--rule)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--paper)', padding: '1.125rem' }}>
        <p className="font-mono uppercase" style={{ fontSize: '0.5625rem', letterSpacing: '0.15em', color: 'var(--ink-3)', margin: '0 0 0.125rem' }}>CURRENT STATUS</p>
        <p className="font-sans font-semibold" style={{ fontSize: '0.9375rem', color: 'var(--ink)', margin: '0 0 0.875rem' }}>
          {STATUS_CONFIG[currentStatus].label}
        </p>

        {!isFinal && (
          <>
            <p className="font-sans" style={{ fontSize: '0.8125rem', color: 'var(--ink-2)', margin: '0 0 0.625rem' }}>Change status</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', marginBottom: '0.875rem' }}>
              {ACTION_OPTIONS.map(opt => (
                <label key={opt.value} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="action"
                    value={opt.value}
                    checked={selectedAction === opt.value}
                    onChange={() => { setSelectedAction(opt.value); setActionError('') }}
                    style={{ accentColor: 'var(--setu-primary)' }}
                  />
                  <span className="font-sans" style={{ fontSize: '0.875rem', color: 'var(--ink)' }}>{opt.label}</span>
                </label>
              ))}
            </div>

            {selectedAction === 'awaiting_info' && (
              <textarea
                value={infoNote}
                onChange={e => setInfoNote(e.target.value)}
                rows={3}
                placeholder="What information is needed from the student?"
                style={{ width: '100%', padding: '0.5rem 0.625rem', border: '1px solid var(--rule)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg)', color: 'var(--ink)', fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', resize: 'vertical', outline: 'none', marginBottom: '0.625rem', boxSizing: 'border-box' }}
              />
            )}

            {selectedAction === 'approved' && (
              <div style={{ marginBottom: '0.625rem' }}>
                <label className="font-sans" style={{ fontSize: '0.8125rem', color: 'var(--ink-2)', display: 'block', marginBottom: '0.25rem' }}>Award amount (€)</label>
                <input
                  type="number"
                  min="0"
                  value={awardAmount}
                  onChange={e => setAwardAmount(e.target.value)}
                  placeholder="0.00"
                  style={{ width: '100%', padding: '0.5rem 0.625rem', border: '1px solid var(--rule)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg)', color: 'var(--ink)', fontFamily: 'var(--font-mono)', fontSize: '0.9375rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            )}

            {actionError && <p className="font-sans" style={{ fontSize: '0.8125rem', color: 'var(--accent)', margin: '0 0 0.625rem' }}>{actionError}</p>}

            <button
              onClick={handleApplyAction}
              disabled={isPending}
              className="font-sans font-semibold"
              style={{
                width: '100%', padding: '0.625rem', fontSize: '0.875rem',
                backgroundColor: isPending ? 'var(--rule)' : 'var(--setu-primary)',
                color: isPending ? 'var(--ink-3)' : 'oklch(0.97 0.01 245)',
                border: 'none', borderRadius: 'var(--radius-sm)', cursor: isPending ? 'not-allowed' : 'pointer',
              }}
            >
              {isPending ? 'Applying…' : 'Apply action'}
            </button>
          </>
        )}

        {isFinal && (
          <p className="font-sans" style={{ fontSize: '0.8125rem', color: 'var(--ink-3)', fontStyle: 'italic' }}>
            This application has been decided. Contact SETU Student Services to reopen.
          </p>
        )}
      </div>

      {/* Staff notes */}
      <div style={{ border: '1px solid var(--rule)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--paper)', padding: '1.125rem' }}>
        <p className="font-mono uppercase" style={{ fontSize: '0.5625rem', letterSpacing: '0.15em', color: 'var(--ink-3)', margin: '0 0 0.875rem' }}>INTERNAL NOTES</p>

        {localNotes.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '0.875rem' }}>
            {localNotes.map(note => (
              <div key={note.id} style={{ padding: '0.625rem 0.75rem', backgroundColor: 'var(--bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--rule)' }}>
                <p className="font-sans" style={{ margin: '0 0 0.25rem', fontSize: '0.8125rem', color: 'var(--ink)', lineHeight: 1.5 }}>{note.note}</p>
                <p className="font-mono" style={{ margin: 0, fontSize: '0.625rem', color: 'var(--ink-3)' }}>
                  {new Date(note.created_at).toLocaleDateString('en-IE', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        )}

        <textarea
          value={newNote}
          onChange={e => setNewNote(e.target.value)}
          rows={2}
          placeholder="Add an internal note (not visible to student)…"
          style={{ width: '100%', padding: '0.5rem 0.625rem', border: '1px solid var(--rule)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg)', color: 'var(--ink)', fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', resize: 'vertical', outline: 'none', marginBottom: '0.5rem', boxSizing: 'border-box' }}
        />
        {noteError && <p className="font-sans" style={{ fontSize: '0.8125rem', color: 'var(--accent)', margin: '0 0 0.5rem' }}>{noteError}</p>}
        <button
          onClick={handleAddNote}
          disabled={!newNote.trim() || isPending}
          className="font-sans font-semibold"
          style={{
            width: '100%', padding: '0.5rem', fontSize: '0.875rem',
            backgroundColor: newNote.trim() && !isPending ? 'var(--ink)' : 'var(--rule)',
            color: newNote.trim() && !isPending ? 'var(--bg)' : 'var(--ink-3)',
            border: 'none', borderRadius: 'var(--radius-sm)', cursor: newNote.trim() && !isPending ? 'pointer' : 'not-allowed',
          }}
        >
          Save note
        </button>
      </div>
    </div>
  )
}
