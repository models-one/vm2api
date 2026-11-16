import { describe, expect, it } from 'vitest'
import {
  compareVersions,
  hasNewerRelease,
  pickLatestRelease,
} from './release-check'

describe('release-check', () => {
  it('compares numeric segments, not strings', () => {
    expect(compareVersions('1.4.110', '1.4.109')).toBeGreaterThan(0)
    expect(compareVersions('v1.4.9', '1.4.10')).toBeLessThan(0)
    expect(compareVersions('1.4.109-rc.1', '1.4.109')).toBe(0)
  })

  it('reports newer release unless that version was dismissed', () => {
    const latest = { version: '1.4.110', url: 'u' }
    expect(hasNewerRelease('1.4.109', latest, null)).toBe(true)
    expect(hasNewerRelease('1.4.110', latest, null)).toBe(false)
    expect(hasNewerRelease('1.4.109', latest, '1.4.110')).toBe(false)
    // 关闭的是旧版本提示，再出更新的版本仍要提示
    expect(hasNewerRelease('1.4.109', latest, '1.4.109')).toBe(true)
    expect(hasNewerRelease(undefined, latest, null)).toBe(false)
  })

  it('picks the highest published vX.Y.Z and ignores payload and prerelease tags', () => {
    const repo = 'https://github.com/models-one/vm2api'
    expect(
      pickLatestRelease(
        [
          { tag_name: 'payload-2026.11.16-crag-3.1.2' },
          { tag_name: 'v1.4.130', prerelease: true },
          { tag_name: 'v1.4.120', draft: true },
          { tag_name: 'v1.4.116' },
          { tag_name: 'v1.4.117', html_url: `${repo}/releases/tag/v1.4.117` },
        ],
        repo
      )
    ).toEqual({ version: '1.4.117', url: `${repo}/releases/tag/v1.4.117` })
    expect(
      pickLatestRelease([{ tag_name: 'payload-2026.11.01-codex' }], repo)
    ).toBeNull()
    expect(hasNewerRelease('1.4.115', null, null)).toBe(false)
  })
})
