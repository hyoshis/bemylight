import { z } from "zod";

const publicConfigSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

export function hasSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function getSupabaseConfig() {
  const result = publicConfigSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  if (!result.success) {
    throw new Error(
      "Supabase is not configured. Copy .env.example to .env.local and provide the project URL and anonymous key.",
    );
  }

  return {
    url: result.data.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: result.data.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
}
