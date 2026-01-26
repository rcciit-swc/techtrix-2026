export enum FestNames {
  GOT = 'Game of Thrones 2026',
  TECHTRIX = 'TechTrix 2026',
  REGALIA = 'Regalia 2026',
}

export const FEST_IDS = {
  TECHTRIX: '44bb2093-d229-4385-8f08-3fe7da3521c8',
  GOT: '5bff3a43-43b6-420a-8d42-9a96257cc351',
  REGALIA: '9b890292-2425-4c61-8753-9a1fcdd37acc',
} as const;

// Current active fest
export const CURRENT_FEST_ID = FEST_IDS.TECHTRIX;
