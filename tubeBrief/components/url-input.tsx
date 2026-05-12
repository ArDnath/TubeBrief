'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'

interface UrlInputProps {
  onSummary: (summary: string) => void
  onLoading: (loading: boolean) => void
  onError: (error: string) => void
}

export default function UrlInput({ onSummary, onLoading, onError }: UrlInputProps) {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) {
      onError('Please enter a YouTube URL')
      return
    }

    setIsLoading(true)
    setStatus('Fetching transcript...')
    onLoading(true)
    onError('')

    try {
      // Replace with your API endpoint
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'}/?url=${encodeURIComponent(url)}`
      
      const response = await fetch(apiUrl)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to summarize video')
      }

      if (!response.body) {
        throw new Error('No response body')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      setStatus('Generating summary...')

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        fullText += chunk
        setStatus(`Processing: ${fullText.split('\n').length} lines...`)
      }

      onSummary(fullText)
      setStatus('')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      onError(message)
      setStatus('')
    } finally {
      setIsLoading(false)
      onLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="Paste a YouTube URL..."
            value={url}
            onChange={(e) => {
              setUrl(e.target.value)
              onError('')
            }}
            disabled={isLoading}
            className="bg-card border-border/30 h-12 text-sm placeholder:text-muted-foreground/50 transition-all duration-300 focus:border-foreground/30"
          />
          <Button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Spinner className="w-4 h-4" />
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
          </Button>
        </div>

        {status && (
          <p className="text-xs text-muted-foreground animate-pulse">{status}</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 pt-4">
        <ExampleButton label="TED Talk" />
        <ExampleButton label="Tutorial" />
        <ExampleButton label="News" />
      </div>
    </form>
  )
}

function ExampleButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      disabled
      className="px-3 py-2 text-xs border border-border/30 rounded-lg text-muted-foreground hover:border-foreground/20 transition-colors duration-200 disabled:opacity-50"
    >
      {label}
    </button>
  )
}
