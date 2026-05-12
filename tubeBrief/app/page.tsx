'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import UrlInput from '@/components/url-input'
import SummaryDisplay from '@/components/summary-display'

export default function Page() {
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 mb-6 rounded-lg border border-border/50">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-light tracking-tight mb-2">summarize</h1>
          <p className="text-muted-foreground text-sm font-light">Transform YouTube videos into readable summaries</p>
        </div>

        {/* Main Content */}
        {!summary ? (
          <UrlInput onSummary={setSummary} onLoading={setLoading} onError={setError} />
        ) : (
          <SummaryDisplay
            summary={summary}
            onNew={() => {
              setSummary('')
              setError('')
            }}
          />
        )}

        {/* Error State */}
        {error && !summary && (
          <Card className="mt-6 p-4 border-destructive/50 bg-destructive/5">
            <p className="text-sm text-destructive">{error}</p>
          </Card>
        )}
      </div>
    </main>
  )
}
