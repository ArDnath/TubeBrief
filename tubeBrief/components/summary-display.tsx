'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import ReactMarkdown from 'react-markdown'

interface SummaryDisplayProps {
  summary: string
  onNew: () => void
}

export default function SummaryDisplay({ summary, onNew }: SummaryDisplayProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(summary)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Summary Card */}
      <Card className="p-8 border-border/30 bg-card/50 backdrop-blur-sm">
        <div className="prose prose-invert max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => <h1 className="text-3xl font-light mb-4 mt-0" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-xl font-light mb-3 mt-6 first:mt-0" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-lg font-light mb-2 mt-4" {...props} />,
              p: ({ node, ...props }) => <p className="text-sm leading-relaxed mb-4 text-foreground/90" {...props} />,
              ul: ({ node, ...props }) => <ul className="space-y-2 mb-4 ml-4" {...props} />,
              li: ({ node, ...props }) => (
                <li className="text-sm leading-relaxed text-foreground/90 list-disc ml-4" {...props} />
              ),
              strong: ({ node, ...props }) => <strong className="font-semibold text-foreground" {...props} />,
              em: ({ node, ...props }) => <em className="italic text-foreground/80" {...props} />,
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className="border-l-2 border-border/50 pl-4 py-2 italic text-foreground/70 my-4"
                  {...props}
                />
              ),
              code: ({ node, ...props }) => (
                <code className="bg-muted/50 px-2 py-1 rounded text-xs font-mono text-foreground/90" {...props} />
              ),
            }}
          >
            {summary}
          </ReactMarkdown>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center pt-4">
        <Button
          onClick={handleCopy}
          variant="outline"
          className="border-border/30 hover:bg-muted/50 hover:border-foreground/20 transition-all duration-200"
        >
          {copied ? (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </Button>
        <Button
          onClick={onNew}
          className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Summary
        </Button>
      </div>

      {/* Info */}
      <p className="text-xs text-muted-foreground text-center">
        Summarized with AI • No data is stored
      </p>
    </div>
  )
}
