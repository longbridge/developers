import { afterEach, describe, expect, it, vi } from 'vitest'
import { readCookie } from './auth'
import { stripDeviceIdDomainSuffix } from './sensors'

const HOST = 'open.longbridge.com'

describe('stripDeviceIdDomainSuffix', () => {
  it('去掉主站拼接的 -longbridge.com 后缀', () => {
    expect(stripDeviceIdDomainSuffix('3f9a1c0e7b2d-longbridge.com', HOST)).toBe('3f9a1c0e7b2d')
    expect(stripDeviceIdDomainSuffix('0b7c9e2a-1d4f-4a6b-9c8e-5f3a2b1c0d9e-longbridge.com', HOST)).toBe(
      '0b7c9e2a-1d4f-4a6b-9c8e-5f3a2b1c0d9e'
    )
  })

  it('没有后缀或后缀属于别的域名时原样返回', () => {
    expect(stripDeviceIdDomainSuffix('3f9a1c0e7b2d', HOST)).toBe('3f9a1c0e7b2d')
    expect(stripDeviceIdDomainSuffix('3f9a1c0e7b2d-longbridge.xyz', HOST)).toBe('3f9a1c0e7b2d-longbridge.xyz')
  })

  it('按当前域名取后缀（canary 域名 longbridge.xyz）', () => {
    expect(stripDeviceIdDomainSuffix('3f9a1c0e7b2d-longbridge.xyz', 'open.longbridge.xyz')).toBe('3f9a1c0e7b2d')
  })

  it('空值、空 hostname 不出错', () => {
    expect(stripDeviceIdDomainSuffix('', HOST)).toBe('')
    expect(stripDeviceIdDomainSuffix('-longbridge.com', HOST)).toBe('')
    expect(stripDeviceIdDomainSuffix('3f9a1c0e7b2d-longbridge.com', '')).toBe('3f9a1c0e7b2d-longbridge.com')
  })
})

describe('readCookie + stripDeviceIdDomainSuffix', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('URL 编码的 cookie 值先解码再去后缀', () => {
    vi.stubGlobal('document', {
      cookie: 'foo=1; device_id=3f9a1c0e7b2d%2Dlongbridge.com; bar=2',
    })
    const raw = readCookie('device_id')
    expect(raw).toBe('3f9a1c0e7b2d-longbridge.com')
    expect(stripDeviceIdDomainSuffix(raw ?? '', HOST)).toBe('3f9a1c0e7b2d')
  })

  it('cookie 不存在时返回 undefined', () => {
    vi.stubGlobal('document', { cookie: 'foo=1' })
    expect(readCookie('device_id')).toBeUndefined()
  })
})
