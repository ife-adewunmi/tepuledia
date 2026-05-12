import { defineMiddleware } from '@lumiarq/framework/http'
import { VerifyJwtTask }    from '@lumiarq/framework/auth'
import { env }              from '@/bootstrap/env'

/**
 * tepuledia.auth — named middleware registered in the global LumiARQ registry.
 *
 * Verifies the Bearer token using RS256.
 * Stores `userId` and `sessionId` on the Hono context for downstream handlers:
 *
 *   const userId = ctx.get('userId') as string
 */
export const requireAuthMiddleware = defineMiddleware({
  name:     'tepuledia.auth',
  priority: 90,
  handler:  async (c: any, next: () => Promise<Response>) => {
    const authHeader: string =
      c.req?.header?.('Authorization') ?? c.headers?.get?.('Authorization') ?? ''

    if (!authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ message: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } },
      )
    }

    const token = authHeader.slice(7).trim()

    let payload: Record<string, unknown>
    try {
      payload = await VerifyJwtTask({ token, publicKey: env.JWT_PUBLIC_KEY })
    } catch {
      return new Response(
        JSON.stringify({ message: 'Unauthorized — invalid or expired token' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } },
      )
    }

    c.set?.('userId',    String(payload['sub'] ?? ''))
    c.set?.('sessionId', String(payload['sid'] ?? ''))

    return next()
  },
})

