import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, "Project name is required").max(100),
  identifier: z
    .string()
    .trim()
    .min(2, "Identifier must be at least 2 characters")
    .max(10, "Identifier must be at most 10 characters")
    .toUpperCase(),
  description: z.string().trim().optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;