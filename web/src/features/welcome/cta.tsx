import { Link } from '@tanstack/react-router'
import { REPO_URL } from '@/config/repo'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Reveal } from './reveal'
import { docsHref } from './steps'

// 珊瑚底上的主按钮反相：白底珊瑚字（4.69:1），两套主题下主色相同，所以不跟主题走。
const INVERTED_CTA =
  'group bg-primary-foreground text-primary hover:bg-primary-foreground/90 active:bg-primary-foreground/80'

export function WelcomeCta({ signedIn }: { signedIn: boolean }) {
  return (
    <section className='relative z-10 overflow-hidden px-6 py-24 md:py-32'>
      {/* Claude cta-band-coral：整块珊瑚是这页唯一的大面积彩色，里面的按钮反相成白底。 */}
      <Reveal
        animation='scale-in'
        className='mx-auto max-w-5xl rounded-lg bg-primary px-6 py-12 text-center text-primary-foreground md:p-16'
      >
        <h2 className='font-display text-[2rem] leading-[1.15] tracking-[-0.5px] md:text-[3rem] md:leading-[1.1] md:tracking-[-1px]'>
          {signedIn ? '配置完成后' : '准备好了吗'}
          <br />
          {signedIn ? '去控制台看第一条请求' : '登录开始首配'}
        </h2>
        <p className='mx-auto mt-5 max-w-md text-sm leading-relaxed md:text-base'>
          控制台里能看到每个槽位的额度、每次调度和每条请求日志。
        </p>
        <div className='mt-8 flex items-center justify-center gap-3'>
          {signedIn ? (
            <Button asChild className={INVERTED_CTA}>
              <Link to='/overview'>
                进入控制台
                <ArrowRight
                  aria-hidden
                  className='size-3.5 transition-transform group-hover:translate-x-0.5'
                />
              </Link>
            </Button>
          ) : (
            <Button asChild className={INVERTED_CTA}>
              <Link to='/login'>
                登录控制台
                <ArrowRight
                  aria-hidden
                  className='size-3.5 transition-transform group-hover:translate-x-0.5'
                />
              </Link>
            </Button>
          )}
          <Button
            asChild
            variant='ghost'
            className='border border-primary-foreground/40 hover:bg-primary-foreground/10 hover:text-primary-foreground'
          >
            <a
              href={docsHref('guide/install')}
              target='_blank'
              rel='noreferrer'
            >
              安装文档
            </a>
          </Button>
        </div>
      </Reveal>
    </section>
  )
}

export function WelcomeFooter() {
  return (
    <footer className='dark dark-surface relative z-10 bg-card px-6 py-12'>
      <div className='mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground'>
        <span className='font-display text-lg text-foreground'>vm2api</span>
        <span>
          个人学习与非商用自建 ·{' '}
          <a
            href={REPO_URL}
            target='_blank'
            rel='noreferrer'
            className='underline-offset-4 hover:text-foreground hover:underline'
          >
            GitHub
          </a>
        </span>
      </div>
    </footer>
  )
}
