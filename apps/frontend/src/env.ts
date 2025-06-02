import { z } from "zod/v4";

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  NEXT_PUBLIC_SITE_URL: z.string().min(1),
  NEXT_PUBLIC_API_URL: z.string().min(1),
});

export const env = envSchema.parse(process.env);
