import http from 'node:http'

const PORT = Number(process.env.PORT || 3000)
const TARGET_URL = process.env.TARGET_URL
const INTERVAL_MS = Number(process.env.PING_INTERVAL_MS || 600000)

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ ok: true, ts: Date.now(), role: 'keepalive-ping' }))
})

const pingOnce = async () => {
  if (!TARGET_URL) {
    console.warn('[ping] TARGET_URL not set, nothing to ping')
    return
  }
  const target = TARGET_URL.replace(/\/$/, '') + '/api/health'
  try {
    const res = await fetch(target, { method: 'GET' })
    console.log(`[ping] ${target} -> ${res.status}`)
  } catch (e) {
    console.warn(`[ping] failed: ${e?.message || e}`)
  }
}

server.listen(PORT, () => {
  console.log(`keepalive-ping listening on ${PORT}`)
  // bootstrap ngay khi start để đánh thức target (tránh deadlock khi deploy)
  pingOnce()
  setInterval(pingOnce, INTERVAL_MS)
})
