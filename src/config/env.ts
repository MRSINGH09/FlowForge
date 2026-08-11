/**
 * Central env config. Change NEXT_PUBLIC_API_URL in `.env` when hosting the backend.
 * Restart the Next.js dev server after changing env values.
 */
export const env = {
  apiUrl: (
    process.env.NEXT_PUBLIC_API_URL ?? "https://flowforge-server-uu9g.onrender.com"
  ).replace(/\/$/, ""),
} as const;
