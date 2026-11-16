import { type SVGProps } from 'react'
import { cn } from '@/lib/utils'

/**
 * cc2api 标志：两道同心 C（Claude Code）开口朝右，圆点从开口出去（→ API）。
 * 单色，跟 currentColor 走：侧栏与登录页把它放在珊瑚色方块上用奶油白。
 */
export function Logo({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      id='cc2api-brand-logo'
      viewBox='0 0 48 48'
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      stroke='currentColor'
      strokeWidth='4.5'
      strokeLinecap='round'
      className={cn('size-6', className)}
      {...props}
    >
      <title>cc2api</title>
      <path d='M32.9 12.5A15.5 15.5 0 1 0 32.9 35.5' />
      <path d='M26.5 18.3A7 7 0 1 0 26.5 29.7' />
      <circle cx='41' cy='24' r='3.5' fill='currentColor' stroke='none' />
    </svg>
  )
}
