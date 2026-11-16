import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { DOCS_URL } from '@/config/repo'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { Logo } from '@/assets/logo'
import { useAuthStore } from '@/stores/auth-store'
import { loginRequest } from '@/lib/api'
import { apiBase, sameOriginPanel, setApiBase } from '@/lib/session'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ThemeSwitch } from '@/components/theme-switch'
import { onboardingQueryOptions } from '@/features/welcome/queries'
import { meQueryOptions } from './queries'

/** Standalone sign-in page; layout follows the newapi /sign-in screen. */
export function LoginPage() {
  const search = useSearch({ from: '/login' })
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const signIn = useAuthStore((s) => s.signIn)
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [base, setBase] = useState(apiBase())
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const hideBase = sameOriginPanel()

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    setPending(true)
    try {
      if (hideBase) setApiBase('')
      else setApiBase(base)
      const result = await loginRequest({
        username: username.trim(),
        password,
        base: hideBase ? '' : base.trim().replace(/\/$/, '') || apiBase(),
      })
      signIn(result.token, result.user)
      // The route guard reads this cache; drop the previous account's views.
      queryClient.removeQueries({ queryKey: meQueryOptions().queryKey })
      let needsWelcome = false
      try {
        const onboarding = await queryClient.fetchQuery(
          onboardingQueryOptions(true)
        )
        needsWelcome = Boolean(onboarding.needs_welcome)
      } catch {
        needsWelcome = false
      }
      toast.success('登录成功')
      if (needsWelcome) {
        await navigate({ to: '/welcome', search: { setup: true } })
        return
      }
      // `redirect` is a router href (`/vm/x?tab=y`); never bounce back into the public pages.
      const next = search.redirect
      if (
        next &&
        next.startsWith('/') &&
        !next.startsWith('//') &&
        !/^\/(welcome|login)\b/.test(next)
      ) {
        await navigate({ href: next })
        return
      }
      await navigate({ to: '/overview' })
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className='welcome-theme relative flex min-h-svh flex-col overflow-hidden bg-background text-foreground'>
      <header className='relative flex h-14 items-center justify-between px-6'>
        <Link
          to='/welcome'
          className='group flex items-center gap-2.5 rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none'
        >
          <span className='grid size-7 place-items-center rounded-md bg-primary text-primary-foreground'>
            <Logo aria-hidden className='size-4' />
          </span>
          <span className='font-display text-[1.0625rem]'>cc2api</span>
        </Link>
        <ThemeSwitch />
      </header>

      <main className='relative flex flex-1 items-center justify-center px-6 pb-20'>
        <div className='welcome-fade-up w-full max-w-[24rem] rounded-lg border bg-card p-8'>
          <h1 className='font-display text-[2rem] leading-[1.15] tracking-[-0.5px]'>
            登录控制台
          </h1>
          <p className='mt-2 text-sm text-muted-foreground'>
            第一次使用？看
            <a
              href={`${DOCS_URL}guide/install`}
              target='_blank'
              rel='noreferrer'
              className='text-primary-ink underline-offset-4 hover:underline'
            >
              安装文档
            </a>
            ，或回到
            <Link
              to='/welcome'
              className='text-primary-ink underline-offset-4 hover:underline'
            >
              欢迎页
            </Link>
            。
          </p>

          <form className='mt-8 space-y-4' onSubmit={onSubmit}>
            <div className='space-y-2'>
              <Label htmlFor='login-username'>用户名</Label>
              <Input
                id='login-username'
                className='h-10'
                autoComplete='username'
                placeholder='输入面板用户名'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='login-password'>密码</Label>
              <div className='relative'>
                <Input
                  id='login-password'
                  type={showPassword ? 'text' : 'password'}
                  className='h-10 pe-10'
                  autoComplete='current-password'
                  placeholder='输入密码'
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type='button'
                  aria-label={showPassword ? '隐藏密码' : '显示密码'}
                  onClick={() => setShowPassword((v) => !v)}
                  className='absolute inset-y-0 end-0 flex w-10 items-center justify-center rounded-e-md text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none'
                >
                  {showPassword ? (
                    <EyeOff aria-hidden className='size-4' />
                  ) : (
                    <Eye aria-hidden className='size-4' />
                  )}
                </button>
              </div>
            </div>
            {hideBase ? null : (
              <div className='space-y-2'>
                <Label htmlFor='login-api-base'>API Base</Label>
                <Input
                  id='login-api-base'
                  placeholder='http://127.0.0.1:8787'
                  className='h-10'
                  value={base}
                  onChange={(e) => setBase(e.target.value)}
                />
              </div>
            )}
            {error ? (
              <p className='text-sm text-destructive' role='alert'>
                {error}
              </p>
            ) : null}
            <Button
              className='mt-2 h-10 w-full'
              type='submit'
              disabled={pending}
            >
              <LogIn aria-hidden className='size-4' />
              {pending ? '登录中…' : '登录'}
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
