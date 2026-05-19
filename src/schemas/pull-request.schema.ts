import * as z from "zod";

export const repoPermissionsSchema = z.object({
  admin: z.boolean(),
  maintain: z.boolean(),
  push: z.boolean(),
  triage: z.boolean(),
  pull: z.boolean(),
});

export const repositorySchema = z.object({
  permissions: repoPermissionsSchema,
  id: z.number(),
  name: z.string(),
  full_name: z.string(),
  private: z.boolean(),
});

export const fileSchema = z.object({
  name: z.string(),
  type: z.string(),
  sha: z.string(),
  path: z.string(),
  size: z.number(),
});
