import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).optional(),
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(8),
  OPENAI_API_KEY: z.string().min(10),
  REDIS_URL: z.string().url().optional(),
  SERPAPI_KEY: z.string().optional(),
})

export const env = envSchema.safeParse(process.env)
if (!env.success) {
  const issues = env.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')
  // During tests, allow missing env but log a warning so test harness can run without real services.
  if (process.env.NODE_ENV === 'test') {
    // eslint-disable-next-line no-console
    console.warn('Environment validation issues (TEST):', issues)
  } else {
    throw new Error(`Environment validation failed: ${issues}`)
  }
}

export type Env = z.infer<typeof envSchema>

export default env.data
