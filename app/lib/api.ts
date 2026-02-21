export function getApiUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_API_SERVER;
  if (!base) throw new Error("NEXT_PUBLIC_API_SERVER is not set");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return base.replace(/\/$/, "") + normalizedPath;
};
