/** Offline illustration under public/ — WebP parchment plates only. */
export function illustrationCandidates(locationId: string, explicit?: string): string[] {
  if (explicit) return [`${import.meta.env.BASE_URL}${explicit.replace(/^\//, '')}`];
  return [`${import.meta.env.BASE_URL}illustrations/${locationId}.webp`];
}
