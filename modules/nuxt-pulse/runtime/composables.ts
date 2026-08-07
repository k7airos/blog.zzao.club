export type PulseProps = Record<string, string | number | boolean>

function cfg() {
  const c = useRuntimeConfig().public.pulse as {
    host?: string
    websiteId?: string
    enabled?: boolean
  } | undefined
  return c
}

function ids() {
  if (!import.meta.client)
    return { visitorId: '', sessionId: '' }
  const visitorKey = 'pulse_vid'
  const sessionKey = 'pulse_sid'
  const sessionTsKey = 'pulse_sid_ts'
  const SESSION_MS = 30 * 60 * 1000
  const rid = (p: string) => `${p}_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`
  let visitorId = ''
  let sessionId = ''
  try {
    visitorId = localStorage.getItem(visitorKey) || ''
    if (!visitorId) {
      visitorId = rid('v')
      localStorage.setItem(visitorKey, visitorId)
    }
    const now = Date.now()
    sessionId = localStorage.getItem(sessionKey) || ''
    const ts = Number(localStorage.getItem(sessionTsKey) || 0)
    if (!sessionId || !ts || now - ts > SESSION_MS) {
      sessionId = rid('s')
      localStorage.setItem(sessionKey, sessionId)
    }
    localStorage.setItem(sessionTsKey, String(now))
  }
  catch { /* ignore */ }
  return { visitorId, sessionId }
}

/**
 * Send collect payload.
 * Prefer text/plain body so browsers skip CORS preflight (application/json would OPTIONS first).
 */
async function send(payload: Record<string, unknown>) {
  if (!import.meta.client)
    return
  const c = cfg()
  if (!c?.enabled || !c.host || !c.websiteId)
    return
  const { visitorId, sessionId } = ids()
  const bodyObj = {
    websiteId: c.websiteId,
    sessionId,
    visitorId,
    url: location.href,
    referrer: document.referrer || '',
    path: location.pathname + location.search,
    ts: Date.now(),
    ...payload,
  }
  // path from payload wins when trackPageview(path) sets it
  if (typeof payload.path === 'string' && payload.path)
    bodyObj.path = payload.path

  const url = `${String(c.host).replace(/\/$/, '')}/v1/collect`
  const raw = JSON.stringify(bodyObj)

  try {
    if (navigator.sendBeacon) {
      // text/plain = "simple" request, no preflight
      const ok = navigator.sendBeacon(url, new Blob([raw], { type: 'text/plain' }))
      if (ok)
        return
    }
  }
  catch { /* fall through */ }

  try {
    await fetch(url, {
      method: 'POST',
      // text/plain avoids preflight; server accepts JSON string body
      headers: { 'content-type': 'text/plain;charset=UTF-8' },
      body: raw,
      keepalive: true,
      mode: 'cors',
      credentials: 'omit',
    })
  }
  catch { /* ignore */ }
}

export function trackPulseEvent(name: string, props?: PulseProps) {
  return send({ type: 'event', name, props: props || {} })
}

export function trackPulsePageview(path?: string) {
  return send({
    type: 'pageview',
    path: path || (import.meta.client ? location.pathname + location.search : '/'),
  })
}

export function usePulse() {
  return {
    track: trackPulseEvent,
    trackPageview: trackPulsePageview,
  }
}
