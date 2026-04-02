const BACKEND_URL = String(process.env.BACKEND_URL || 'http://localhost:4000').replace(/\/$/, '')
const AUTH_TOKEN = String(process.env.HEALTH_AUTH_TOKEN || '').trim()

const endpointSpecs = [
  { path: '/api/health', auth: false },
  { path: '/api/templates', auth: false },
  { path: '/api/health/metrics', auth: true },
]

const requestEndpoint = async ({ path, auth }) => {
  const started = performance.now()
  const headers = {}
  if (auth && AUTH_TOKEN) {
    headers.Authorization = `Bearer ${AUTH_TOKEN}`
  }

  const response = await fetch(`${BACKEND_URL}${path}`, { headers })
  const elapsedMs = Number((performance.now() - started).toFixed(2))
  const bodyText = await response.text().catch(() => '')

  let body = null
  if (bodyText) {
    try {
      body = JSON.parse(bodyText)
    } catch {
      body = bodyText
    }
  }

  return {
    path,
    status: response.status,
    ok: response.ok,
    elapsedMs,
    body,
  }
}

const run = async () => {
  console.log(`[health-check] Backend: ${BACKEND_URL}`)
  if (!AUTH_TOKEN) {
    console.log('[health-check] HEALTH_AUTH_TOKEN is not set, protected endpoints may return 401.')
  }

  for (const endpoint of endpointSpecs) {
    try {
      const result = await requestEndpoint(endpoint)
      console.log(`\n${result.path}`)
      console.log(`  status: ${result.status}`)
      console.log(`  latencyMs: ${result.elapsedMs}`)
      console.log(`  ok: ${result.ok}`)

      if (result.path === '/api/health' && result.body && typeof result.body === 'object') {
        const dbLatency = result.body?.storage?.dbLatencyMs
        const heap = result.body?.process?.memoryHeapUsedBytes
        const rss = result.body?.process?.memoryRssBytes
        console.log(`  dbLatencyMs: ${dbLatency == null ? 'n/a' : dbLatency}`)
        console.log(`  heapUsedMB: ${heap ? (heap / (1024 * 1024)).toFixed(2) : 'n/a'}`)
        console.log(`  rssMB: ${rss ? (rss / (1024 * 1024)).toFixed(2) : 'n/a'}`)
      }
    } catch (error) {
      console.log(`\n${endpoint.path}`)
      console.log(`  status: request_failed`)
      console.log(`  error: ${error?.message || error}`)
    }
  }
}

run().catch((error) => {
  console.error('[health-check] fatal:', error)
  process.exit(1)
})
