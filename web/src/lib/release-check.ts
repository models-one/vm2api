export const RELEASE_CHECK_INTERVAL_MS = 3 * 60 * 60 * 1000
export const LS_DISMISSED_RELEASE = 'vm2api:dismissed-release'

export interface LatestRelease {
  version: string
  url: string
}

/** 取主版本号段比较；预发布/构建后缀不参与，避免把 1.4.9-rc 误判为新版。 */
export function compareVersions(a: string, b: string): number {
  const parts = (v: string) =>
    v
      .replace(/^v/i, '')
      .split(/[-+]/)[0]
      .split('.')
      .map((n) => Number.parseInt(n, 10) || 0)
  const pa = parts(a)
  const pb = parts(b)
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0)
    if (d !== 0) return d
  }
  return 0
}

export function hasNewerRelease(
  current: string | undefined,
  latest: LatestRelease | null | undefined,
  dismissed: string | null
): boolean {
  if (!current || !latest?.version) return false
  if (dismissed && compareVersions(dismissed, latest.version) >= 0) return false
  return compareVersions(latest.version, current) > 0
}

type GithubRelease = {
  tag_name?: string
  html_url?: string
  draft?: boolean
  prerelease?: boolean
}

/** 已发布的最高 vX.Y.Z；仓库里的 payload-* 资产 release 和预发布不算。没有则为 null。 */
export function pickLatestRelease(
  releases: GithubRelease[],
  repoUrl: string
): LatestRelease | null {
  let best: LatestRelease | null = null
  for (const item of releases) {
    const tag = String(item?.tag_name || '')
    if (item?.draft || item?.prerelease || !/^v\d+\.\d+\.\d+$/.test(tag)) {
      continue
    }
    const version = tag.slice(1)
    if (!best || compareVersions(version, best.version) > 0) {
      best = {
        version,
        url: String(item.html_url || `${repoUrl}/releases/tag/${tag}`),
      }
    }
  }
  return best
}

export async function fetchLatestRelease(
  repoUrl: string
): Promise<LatestRelease | null> {
  const repo = repoUrl.replace(/^https:\/\/github\.com\//, '')
  const res = await fetch(
    `https://api.github.com/repos/${repo}/releases?per_page=100`,
    { headers: { Accept: 'application/vnd.github+json' } }
  )
  if (!res.ok) throw new Error(`GitHub releases ${res.status}`)
  const body: unknown = await res.json()
  if (!Array.isArray(body)) throw new Error('GitHub releases: invalid list')
  return pickLatestRelease(body as GithubRelease[], repoUrl)
}

export function readDismissedRelease(): string | null {
  try {
    return localStorage.getItem(LS_DISMISSED_RELEASE)
  } catch {
    return null
  }
}

export function writeDismissedRelease(version: string): void {
  try {
    localStorage.setItem(LS_DISMISSED_RELEASE, version)
  } catch {
    /* localStorage 不可用时只在本次会话内隐藏 */
  }
}
