import z from "zod/v4";

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.coerce.date<string>(),
  updatedAt: z.coerce.date<string>(),
  email: z.string(),
  image: z.url().nullable(),
  verified: z.boolean().optional(),
});

export type User = ReturnType<typeof userSchema.parse>;
