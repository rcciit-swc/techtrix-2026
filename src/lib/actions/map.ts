'use server';

const MAP_FULL_URL = 'https://files.catbox.moe/kouum9.jpeg';
const MAP_HALF_URL = 'https://files.catbox.moe/70vtjb.jpeg';

// May 16 2026 00:00 IST == May 15 2026 18:30 UTC
const FULL_UNLOCK_UTC_MS = Date.UTC(2026, 4, 15, 18, 30, 0);

export async function getMapMode(): Promise<{
  mode: 'full' | 'half';
  url: string;
}> {
  const isFull = Date.now() >= FULL_UNLOCK_UTC_MS;
  return {
    mode: isFull ? 'full' : 'half',
    url: isFull ? MAP_FULL_URL : MAP_HALF_URL,
  };
}
