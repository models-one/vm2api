import { Link } from '@tanstack/react-router'
import CherryStudioColor from '@lobehub/icons/es/CherryStudio/components/Color'
import ClaudeCodeColor from '@lobehub/icons/es/ClaudeCode/components/Color'
import CodexColor from '@lobehub/icons/es/Codex/components/Color'
import OpenAI from '@lobehub/icons/es/OpenAI/components/Mono'
import { ArrowRight, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ApiDemo } from './api-demo'
import { scrollToSection } from './scroll'
import { docsHref } from './steps'

const CLIENTS = [
  { name: 'Claude Code', Icon: ClaudeCodeColor },
  { name: 'Codex CLI', Icon: CodexColor },
  { name: 'Cherry Studio', Icon: CherryStudioColor },
  { name: 'OpenAI SDK', Icon: OpenAI },
] as const

export function WelcomeHero({
  signedIn,
  baseUrl,
}: {
  signedIn: boolean
  baseUrl: string
}) {
  return (
    <section className='relative z-10 overflow-hidden px-6 pt-28 pb-16 md:pt-36 md:pb-24 lg:pb-28'>
      <div className='mx-auto grid max-w-6xl grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-8'>
        <div className='flex flex-col items-start lg:col-span-6'>
          <div className='welcome-fade-up mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-[13px] font-medium tracking-[0.03em] text-secondary-foreground'>
            <span className='size-1.5 rounded-full bg-(--welcome-success)' />
            虚拟化号池网关 · 自建部署
          </div>

          <h1
            className='welcome-fade-up text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.1] font-semibold tracking-[-0.028em]'
            style={{ animationDelay: '60ms' }}
          >
            把订阅号池
            <br />
            <span className='text-muted-foreground'>变成标准 API</span>
          </h1>
          <p
            className='welcome-fade-up mt-6 max-w-xl text-[17px] leading-[1.6] text-muted-foreground'
            style={{ animationDelay: '120ms' }}
          >
            每个槽位里跑官方客户端，账号与出口一一隔离。对外提供 Anthropic /
            OpenAI 兼容接口，Claude Code、Codex 和现有 SDK 改个地址就能用。
          </p>

          <div
            className='welcome-fade-up mt-8 flex flex-wrap items-center gap-3'
            style={{ animationDelay: '180ms' }}
          >
            {signedIn ? (
              <Button asChild className='group h-10 px-4'>
                <Link to='/overview'>
                  进入控制台
                  <ArrowRight
                    aria-hidden
                    className='size-4 transition-transform duration-200 group-hover:translate-x-0.5'
                  />
                </Link>
              </Button>
            ) : (
              <Button asChild className='group h-10 px-4'>
                <Link to='/login'>
                  登录控制台
                  <ArrowRight
                    aria-hidden
                    className='size-4 transition-transform duration-200 group-hover:translate-x-0.5'
                  />
                </Link>
              </Button>
            )}
            <Button
              variant='outline'
              className='h-10 px-4'
              onClick={() =>
                scrollToSection(
                  signedIn ? 'welcome-setup' : 'welcome-quick-start'
                )
              }
            >
              {signedIn ? '首配清单' : '快速开始'}
            </Button>
            <Button asChild variant='outline' className='group h-10 px-4'>
              <a
                href={docsHref('guide/quick-start')}
                target='_blank'
                rel='noreferrer'
              >
                <BookOpen
                  aria-hidden
                  className='size-4 text-muted-foreground transition-colors group-hover:text-foreground'
                />
                文档
              </a>
            </Button>
          </div>

          <div
            className='welcome-fade-up mt-10 w-full max-w-xl'
            style={{ animationDelay: '240ms' }}
          >
            <p className='text-[13px] font-medium tracking-[0.03em] text-secondary-foreground'>
              常用客户端
            </p>
            <p className='mt-1 text-xs leading-relaxed text-muted-foreground'>
              改 base URL 与密钥即可接入，不需要插件或补丁。
            </p>
            <ul className='mt-4 flex flex-wrap items-center gap-2.5'>
              {CLIENTS.map(({ name, Icon }) => (
                <li
                  key={name}
                  className='flex items-center gap-2 rounded-full border bg-card px-3.5 py-1.5 text-[13px] font-medium text-secondary-foreground'
                >
                  <Icon size={18} className='shrink-0' />
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className='welcome-fade-up flex w-full justify-center lg:col-span-6'
          style={{ animationDelay: '320ms' }}
        >
          <ApiDemo baseUrl={baseUrl} />
        </div>
      </div>
    </section>
  )
}
