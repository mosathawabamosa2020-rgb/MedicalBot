import type { NextApiRequest, NextApiResponse } from 'next'
import Redis from 'ioredis'

// Initialize Redis client
// Note: Ensure REDIS_URL is set in your environment variables, or it defaults to localhost:6379
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

type RateBucket = { count: number; resetAt: number }

// Deprecated: In-memory buckets are no longer used in favor of Redis
// const inMemoryBuckets = new Map<string, RateBucket>()

function getClientIp(req: NextApiRequest): string {
  const xff = req.headers['x-forwarded-for']
  if (typeof xff === 'string' && xff.length > 0) {
    // WARNING: X-Forwarded-For can be spoofed. 
    // Only trust this if behind a trusted reverse proxy (Nginx, Cloudflare, etc.)
    return xff.split(',')[0]?.trim() || 'unknown'
  }
  // Fallback to direct connection IP
  return req.socket.remoteAddress || 'unknown'
}

export function setSecurityHeaders(res: NextApiResponse): void {
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Referrer-Policy', 'no-referrer')
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  res.setHeader('Content-Security-Policy', "default-src 'self'; frame-ancestors 'none'; base-uri 'self'")
}

export async function enforceCsrfForMutation(req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method || '')) return true
  if (process.env.NODE_ENV === 'test') return true

  const origin = req.headers.origin
  const referer = req.headers.referer
  const host = req.headers.host

  if (!host) {
    res.status(403).json({ error: 'csrf validation failed: missing host' })
    return false
  }

  // CRITICAL CHANGE: We no longer allow requests without Origin/Referer to pass blindly.
  // We require either Origin or Referer to match the Host.
  
  let requestHost = ''
  
  // 1. Check Origin header first (standard for modern browsers)
  if (origin) {
    try {
      const originUrl = new URL(origin)
      requestHost = originUrl.host
    } catch (e) {
      res.status(403).json({ error: 'csrf validation failed: invalid origin' })
      return false
    }
  } 
  // 2. Fallback to Referer header if Origin is missing (e.g., same-origin navigations)
  else if (referer) {
    try {
      const refererUrl = new URL(referer)
      requestHost = refererUrl.host
    } catch (e) {
      res.status(403).json({ error: 'csrf validation failed: invalid referer' })
      return false
    }
  } 
  // 3. Reject if both are missing (e.g., curl, non-browser tools) - defense-in-depth
  else {
    res.status(403).json({ error: 'csrf validation failed: missing origin and referer' })
    return false
  }

  // Validate that the request host matches the allowed host
  if (requestHost !== host) {
    res.status(403).json({ error: 'csrf validation failed: host mismatch' })
    return false
  }

  return true
}

export async function enforceRateLimit(
  req: NextApiRequest,
  res: NextApiResponse,
  scope: string,
  windowMs: number,
  maxRequests: number
): Promise<boolean> {
  const ip = getClientIp(req)
  const key = `ratelimit:${scope}:${ip}`
  const now = Date.now()
  const windowStart = now - windowMs

  try {
    // Use a Lua script for atomic operations (Sliding Window Log)
    // This ensures that the check and increment happen together
    const luaScript = `
      local key = KEYS[1]
      local now = tonumber(ARGV[1])
      local window = tonumber(ARGV[2])
      local limit = tonumber(ARGV[3])
      
      -- Remove entries older than the window
      redis.call('ZREMRANGEBYSCORE', key, '-inf', now - window)
      
      -- Count current requests in the window
      local count = redis.call('ZCARD', key)
      
      if count < limit then
        -- Add current request timestamp
        redis.call('ZADD', key, now, now)
        -- Set expiry on the key to prevent memory leaks
        redis.call('EXPIRE', key, math.ceil(window / 1000) + 1)
        return 1
      else
        return 0
      end
    `

    const allowed = await redis.eval(
      luaScript,
      1,
      key,
      now,
      windowMs,
      maxRequests
    )

    if (!allowed) {
      res.status(429).json({ error: 'rate limit exceeded' })
      return false
    }

    return true
  } catch (error) {
    console.error('Rate limiting error:', error)
    // FAIL-OPEN: If Redis fails, allow the request to avoid breaking the app entirely.
    // In a production environment, you might want to alert (Sentry/Datadog) when this happens.
    return true
  }
}
