// Event ID to image mapping
// Key: event UUID from database
// Value: { bg: background image path, char: character image path }

export interface EventImages {
  bg: string;
  char: string;
}

export const EVENT_IMAGES: Record<string, EventImages> = {
  // Crack The Interview
  '199e5134-39c4-488f-8c10-8bc256c39f84': {
    bg: 'https://i.postimg.cc/g0LsG1gG/cti-bg.jpg',
    char: 'https://i.postimg.cc/ZRkcnjQh/cti.png',
  },

  // Tech Quiz
  '3644164f-fc1e-4f97-91a5-36ac95208bf2': {
    bg: 'https://i.postimg.cc/fyDfjyDs/tech-quiz-bg.jpg',
    char: 'https://i.postimg.cc/T1fJq1fd/tech-quiz.png',
  },

  // Startup Autopsy
  '1b0af2ef-1101-4f43-8061-3ac42db45167': {
    bg: 'https://i.postimg.cc/sDPdSSmP/autopsy-bg.jpg',
    char: 'https://i.postimg.cc/SNLF88dt/autopsy.png',
  },

  // BGMI (all variants)
  'e361ce59-680b-4d38-a185-9b069c37e1da': {
    bg: 'https://i.postimg.cc/tJLJ86wP/bgmi-bg.jpg',
    char: 'https://i.postimg.cc/L47JqdXQ/bgmi.png',
  },
  'f11f0af6-5a23-4084-9aa2-ad6d515c0ce4': {
    bg: 'https://i.postimg.cc/tJLJ86wP/bgmi-bg.jpg',
    char: 'https://i.postimg.cc/L47JqdXQ/bgmi.png',
  },
  'bcff7603-f956-4334-a072-283c13abd97e': {
    bg: 'https://i.postimg.cc/tJLJ86wP/bgmi-bg.jpg',
    char: 'https://i.postimg.cc/L47JqdXQ/bgmi.png',
  },
  // FIFA 25
  '9c0e3ad0-8401-42e8-8411-62dedb2252b5': {
    bg: 'https://i.postimg.cc/fLxv9m4Y/eafc-bg.jpg',
    char: 'https://i.postimg.cc/QtpqT1Lk/eafc.png',
  },

  // Build The Electro-Bricks
  '845719e3-959b-4f54-a451-18365ebf09f2': {
    bg: 'https://i.postimg.cc/qq9qWKSs/build-bg.jpg',
    char: 'https://i.postimg.cc/gc5xw9J5/build.png',
  },

  // Clash of Codes
  '1fc97222-a54d-4116-98be-8a3be929a83b': {
    bg: 'https://i.postimg.cc/L8bvKmB0/clashofcodes-bg.jpg',
    char: 'https://i.postimg.cc/6Q4cBFMw/clashofcodes.png',
  },

  // Codathon
  'd59115e8-7352-49e9-96c3-3078211b4866': {
    bg: 'https://i.postimg.cc/HL8zTFBP/codathon-bg.jpg',
    char: 'https://i.postimg.cc/fbSCM18T/codathon.png',
  },

  // Capture The Flag
  '6b738e60-2dcc-4ba5-883b-b82d5e98651d': {
    bg: 'https://i.postimg.cc/VsTJSy6h/ctf-bg.jpg',
    char: 'https://i.postimg.cc/RC8W3rhz/ctf.png',
  },

  // E-Football (Solo + Co-op)
  '17b81e27-e7f1-4195-8535-e3a354755e79': {
    bg: 'https://i.postimg.cc/76vVhXRz/e-football-bg.jpg',
    char: 'https://i.postimg.cc/264xZhpZ/e-football.png',
  },
  'e0dba33a-31d6-4db2-b5f0-64850dcefc48': {
    bg: 'https://i.postimg.cc/76vVhXRz/e-football-bg.jpg',
    char: 'https://i.postimg.cc/264xZhpZ/e-football.png',
  },

  // FC Mobile 25
  'cfb5a041-076b-4856-8bed-46f2a580725c': {
    bg: 'https://i.postimg.cc/y65DJqxC/fc-bg.jpg',
    char: 'https://i.postimg.cc/h4wXJFvS/fc.png',
  },

  // Clash Royale
  '5b99960f-03cf-4c59-a73e-607dc4f00bec': {
    bg: 'https://i.postimg.cc/sDGC2qGD/clashroyale-bg.jpg',
    char: 'https://i.postimg.cc/mgxf1j7g/clashroyale.png',
  },

  // Fandom Quiz
  'd204abdc-0062-43f4-9fb6-d0734613e19f': {
    bg: 'https://i.postimg.cc/3RgZvmMX/fandom-bg.jpg',
    char: 'https://i.postimg.cc/0QpCwDgn/fandom.png',
  },

  // Final Kick
  'a9b39ac7-2985-4c04-8d02-92a9ef82c41a': {
    bg: 'https://i.postimg.cc/fLxv9m45/finalkick-bg.jpg',
    char: 'https://i.postimg.cc/XJwgCdMt/finalkick.png',
  },

  // Mind's Eye
  'a8953835-cec2-49dc-bdf1-453d0a03bd20': {
    bg: 'https://i.postimg.cc/JnbQkZw2/mindseye-bg.jpg',
    char: 'https://i.postimg.cc/ZRrLdpkg/mindseye.png',
  },

  // Need For Speed
  '1995a15b-5df8-47d2-829c-43e6ee974826': {
    bg: 'https://i.postimg.cc/JnbQkZwF/nfs-bg.jpg',
    char: 'https://i.postimg.cc/FRjxL355/nfs.png',
  },

  // Pacman (Line Follower)
  '71ab50cd-7c7f-419a-b1b2-d8bb05930ded': {
    bg: 'https://i.postimg.cc/NM1xHmqw/pacman-bg.jpg',
    char: 'https://i.postimg.cc/Xq4kcq3D/pacman.png',
  },

  // Road Rash
  '4b48caae-5dc7-49c2-ae3e-b4f266c1489a': {
    bg: 'https://i.postimg.cc/qR8G3yVH/roadrash-bg.jpg',
    char: 'https://i.postimg.cc/2yr7FymM/roadrash.png',
  },

  // Robo War (8 KG)
  '24beb445-117c-40a2-bf2c-401a8ad65115': {
    bg: 'https://i.postimg.cc/sxs49xy8/robowar-bg.jpg',
    char: 'https://i.postimg.cc/SRkf7Rqw/robowar.png',
  },

  // Shutterscape
  '49c435f3-ddca-412b-bb9a-b652af49315e': {
    bg: 'https://i.postimg.cc/Zn4xFnZX/shutterscape-bg.jpg',
    char: 'https://i.postimg.cc/wMgQcMg8/shutterscape.png',
  },

  // Cumware Development (Software Dev)
  '23e45f0c-c0a7-4b72-86df-7d9bfb4882aa': {
    bg: 'https://i.postimg.cc/wMgQcMgY/software-dev-bg.jpg',
    char: 'https://i.postimg.cc/gjmHqjmm/software-dev.png',
  },

  // Valorant
  '77cfe84a-78a1-434b-95bc-d29db1ea59a7': {
    bg: 'https://i.postimg.cc/brp9Hrpq/valorant-bg.jpg',
    char: 'https://i.postimg.cc/Rh4LQh4V/valorant.png',
  },

  // Database Design (HLD)
  'ad92689b-9c96-4f1a-a81a-3e3cea31ab1d': {
    bg: 'https://i.postimg.cc/jq9DWV5p/database-bg.jpg',
    char: 'https://i.postimg.cc/bYMZGXrc/database.png',
  },

  // FC Mobile 25
  'FC Mobile 25': {
    bg: 'https://i.postimg.cc/y65DJqxC/fc-bg.jpg',
    char: 'https://i.postimg.cc/h4wXJFvS/fc.png',
  },

  // Freefire (Solo)
  'f19e70a2-3616-431d-89aa-a9493619edf4': {
    bg: 'https://i.postimg.cc/J7gsyw0m/freefire-bg.jpg',
    char: 'https://i.postimg.cc/3r6kyMNN/freefire.png',
  },
  // Freefire (Squad)
  'fcaf3774-df30-466b-be75-1f4a8931c17d': {
    bg: 'https://i.postimg.cc/J7gsyw0m/freefire-bg.jpg',
    char: 'https://i.postimg.cc/3r6kyMNN/freefire.png',
  },
  // Robo Tug
  'Robo Tug': {
    bg: 'https://i.postimg.cc/VsTJSyv6/robotug-bg.jpg',
    char: 'https://i.postimg.cc/pV7m9Nry/robotug.png',
  },

  // Treasure Hunt (Tech Based)
  '137c5b2d-2f37-4c7e-adbd-1f7852a6faba': {
    bg: 'https://i.postimg.cc/pV7m9Nrh/treasure-bg.jpg',
    char: 'https://i.postimg.cc/GhyHGMT3/treasure.png',
  },

  '41bfd746-3c24-491c-80cd-d5ede5d78d9c': {
    bg: 'https://i.postimg.cc/cLG7q9SQ/174682176e67d46e886cc42171e8591c9963386a.jpg',
    char: 'https://i.postimg.cc/SxbL0Thg/bd6588238621c1d0c7fac908d03c4e19b3871f87.png',
  },
  
  // Default fallback
  default: {
    bg: '/eventDetails/codeAndSeek/lokiBg.png',
    char: '/eventDetails/codeAndSeek/loki.png',
  },
};

export const getEventImages = (
  eventId: string,
  eventName?: string
): EventImages => {
  // First try direct match by ID or exact key
  if (EVENT_IMAGES[eventId]) return EVENT_IMAGES[eventId];
  if (eventName && EVENT_IMAGES[eventName]) return EVENT_IMAGES[eventName];

  // Try normalized name match as fallback
  if (eventName) {
    const normalizedTarget = eventName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const match = Object.keys(EVENT_IMAGES).find(
      (key) => key.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedTarget
    );
    if (match) return EVENT_IMAGES[match];
  }

  return EVENT_IMAGES['default'];
};
