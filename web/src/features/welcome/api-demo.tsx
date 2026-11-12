import { useState } from 'react'
import { cn } from '@/lib/utils'
import { CopyButton } from '@/components/copy-chip'

type Demo = {
  id: string
  label: string
  path: string
  auth: string
  body: string[]
  response: string[]
  tone: { text: string; border: string; badge: string }
}

// Linear：截图里只留一个彩色强调。各端点标签共用薰衣草下划线，靠文字区分。
const NEUTRAL_TONE = {
  text: 'text-foreground',
  border: 'border-primary',
  badge: 'bg-secondary text-secondary-foreground',
}
const TONES = {
  violet: NEUTRAL_TONE,
  emerald: NEUTRAL_TONE,
  amber: NEUTRAL_TONE,
}

// Example payloads mirror the three entries documented on /guide/api.
const DEMOS: Demo[] = [
  {
    id: 'messages',
    label: 'Claude',
    path: '/v1/messages',
    auth: 'x-api-key: sk-vm-xxxx',
    body: [
      '"model": "claude-sonnet-5",',
      '"max_tokens": 1024,',
      '"messages": [{ "role": "user", "content": "hello" }]',
    ],
    response: [
      '{',
      '  "type": "message",',
      '  "content": [{ "type": "text", "text": "Hello!" }],',
      '  "usage": { "input_tokens": 8, "output_tokens": 5 }',
      '}',
    ],
    tone: TONES.violet,
  },
  {
    id: 'chat',
    label: 'Chat',
    path: '/v1/chat/completions',
    auth: 'Authorization: Bearer sk-vm-xxxx',
    body: [
      '"model": "gpt-5.4",',
      '"messages": [{ "role": "user", "content": "hello" }]',
    ],
    response: [
      '{',
      '  "object": "chat.completion",',
      '  "choices": [{ "message": { "content": "Hello!" } }]',
      '}',
    ],
    tone: TONES.emerald,
  },
  {
    id: 'responses',
    label: 'Responses',
    path: '/v1/responses',
    auth: 'Authorization: Bearer sk-vm-xxxx',
    body: ['"model": "gpt-5.4",', '"input": "hello"'],
    response: [
      '{',
      '  "object": "response",',
      '  "output": [{ "type": "message", "content": [ … ] }]',
      '}',
    ],
    tone: TONES.amber,
  },
]

const STRING_RE = /"[^"]*"/g

/** Colors JSON-ish lines: keys lavender, string values ink-muted, punctuation muted. */
function Json({ line }: { line: string }) {
  const parts: React.ReactNode[] = []
  let cursor = 0
  for (const m of line.matchAll(STRING_RE)) {
    const start = m.index ?? 0
    if (start > cursor)
      parts.push(
        <span key={`p${start}`} className='text-muted-foreground'>
          {line.slice(cursor, start)}
        </span>
      )
    const isKey = line
      .slice(start + m[0].length)
      .trimStart()
      .startsWith(':')
    parts.push(
      <span
        key={`s${start}`}
        className={isKey ? 'text-primary-ink' : 'text-secondary-foreground'}
      >
        {m[0]}
      </span>
    )
    cursor = start + m[0].length
  }
  if (cursor < line.length)
    parts.push(
      <span key='tail' className='text-muted-foreground'>
        {line.slice(cursor)}
      </span>
    )
  return <div className='break-words whitespace-pre-wrap'>{parts}</div>
}

/** Static request/response card: switching tabs is the only interaction. */
export function ApiDemo({ baseUrl }: { baseUrl: string }) {
  const [active, setActive] = useState(0)
  const demo = DEMOS[active]
  const curl = [
    `curl -X POST "${baseUrl}${demo.path}" \\`,
    `  -H "${demo.auth}" \\`,
    '  -H "content-type: application/json" \\',
    "  -d '{",
    ...demo.body.map((l) => `    ${l}`),
    "  }'",
  ].join('\n')

  return (
    <div className='mx-auto w-full max-w-2xl overflow-hidden rounded-xl border bg-card edge-highlight'>
      <div
        role='tablist'
        aria-label='接口示例'
        className='flex items-center gap-1 border-b px-2 sm:px-3'
      >
        {DEMOS.map((d, i) => (
          <button
            key={d.id}
            type='button'
            role='tab'
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={cn(
              '-mb-px border-b-2 px-2.5 py-2.5 text-[11px] font-medium tracking-wide transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:px-3 sm:text-xs',
              i === active
                ? `${d.tone.border} ${d.tone.text}`
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {d.label}
          </button>
        ))}
        <div className='ml-auto flex items-center gap-1'>
          <span className='inline-block size-1.5 rounded-full bg-(--welcome-success)' />
          <span className='pr-1 font-mono text-[11px] tracking-wider text-muted-foreground uppercase'>
            200 ok
          </span>
          <CopyButton text={curl} label={`复制 ${demo.label} curl`} />
        </div>
      </div>

      <div className='flex items-center gap-2.5 border-b px-5 py-3'>
        <span
          className={cn(
            'rounded-md px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wider',
            demo.tone.badge
          )}
        >
          POST
        </span>
        <code className='truncate font-mono text-[12.5px] text-secondary-foreground'>
          {demo.path}
        </code>
      </div>

      <div className='font-mono text-[12.5px] leading-[1.6]'>
        <div className='min-h-[200px] px-5 py-4'>
          <span className='text-[11px] font-medium tracking-[0.04em] text-muted-foreground uppercase'>
            Request
          </span>
          <div className='mt-2'>
            <div>
              <span className='font-medium text-(--welcome-success)'>curl</span>{' '}
              <span className='text-primary-ink'>-X POST</span>{' '}
              <span className='text-secondary-foreground'>
                "{baseUrl}
                {demo.path}"
              </span>{' '}
              <span className='text-muted-foreground'>\</span>
            </div>
            <div className='ps-[2ch]'>
              <span className='text-primary-ink'>-H</span>{' '}
              <span className='text-secondary-foreground'>"{demo.auth}"</span>{' '}
              <span className='text-muted-foreground'>\</span>
            </div>
            <div className='ps-[2ch]'>
              <span className='text-primary-ink'>-d</span>{' '}
              <span className='text-secondary-foreground'>'{'{'}</span>
            </div>
            {demo.body.map((line) => (
              <div key={line} className='ps-[4ch]'>
                <Json line={line} />
              </div>
            ))}
            <div className='ps-[2ch] text-secondary-foreground'>{'}'}'</div>
          </div>
        </div>
        <div className='min-h-[150px] border-t bg-field px-5 py-4'>
          <span className='text-[11px] font-medium tracking-[0.04em] text-muted-foreground uppercase'>
            Response
          </span>
          <div className='mt-2'>
            {demo.response.map((line, i) => (
              <Json key={i} line={line} />
            ))}
          </div>
        </div>
      </div>

      <div className='flex items-center justify-between border-t bg-secondary px-5 py-2.5'>
        <span className='text-[11px] tracking-wider text-muted-foreground uppercase'>
          sk-vm-xxxx 为占位符
        </span>
        <span className='font-mono text-[11px] tracking-wider text-muted-foreground uppercase'>
          stream · sse
        </span>
      </div>
    </div>
  )
}
