'use client'

import { useState } from 'react'
import { uploadDocument } from '@/lib/setu/saf-actions'
import type { DocumentType } from '@/lib/setu/saf-types'

export default function SafInfoUpload({ applicationId }: { applicationId: string }) {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')

  async function handleFile(file: File) {
    setStatus('uploading')
    setError('')
    const fd = new FormData()
    fd.append('file', file)
    fd.append('document_type', 'evidence_of_difficulty' as DocumentType)
    const result = await uploadDocument(applicationId, fd)
    if ('error' in result) {
      setError(result.error)
      setStatus('error')
    } else {
      setStatus('done')
    }
  }

  if (status === 'done') {
    return <p className="font-sans" style={{ fontSize: '0.875rem', color: 'oklch(0.40 0.12 145)', margin: 0 }}>✓ Document uploaded. The committee will be notified.</p>
  }

  return (
    <div>
      <label
        className="font-sans font-semibold"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
          fontSize: '0.875rem', color: 'oklch(0.40 0.12 60)',
          border: '1px solid oklch(0.75 0.09 80)', borderRadius: 'var(--radius-sm)',
          padding: '0.5rem 1rem', cursor: status === 'uploading' ? 'not-allowed' : 'pointer',
          backgroundColor: 'oklch(0.99 0.01 80)',
        }}
      >
        {status === 'uploading' ? 'Uploading…' : 'Upload additional document'}
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          disabled={status === 'uploading'}
          style={{ display: 'none' }}
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
        />
      </label>
      {error && <p className="font-sans" style={{ fontSize: '0.8125rem', color: 'var(--accent)', marginTop: '0.375rem' }}>{error}</p>}
    </div>
  )
}
