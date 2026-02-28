
export const EVENT_WHATSAPP_LINKS: Record<string, string> = {
  // Battle of Wits
  'b9543b25-177d-4046-9635-93b015ea30eb': 
    '',

  // FC MOBILE 25
  'cfb5a041-076b-4856-8bed-46f2a580725c': 
    '',

  // Software Development
  '23e45f0c-c0a7-4b72-86df-7d9bfb4882aa': 
    '',

  // Final Kick
  'a9b39ac7-2985-4c04-8d02-92a9ef82c41a': 
    '',

  // Road Rash
  '4b48caae-5dc7-49c2-ae3e-b4f266c1489a': 
    '',

  // Fandom Quiz
  'd204abdc-0062-43f4-9fb6-d0734613e19f': 
    '',

  // Need For Speed
  '1995a15b-5df8-47d2-829c-43e6ee974826': 
    '',

  // Robo Sumo (3 KG)
  '24beb445-117c-40a2-bf2c-401a8ad65115': 
    '',

  // Pacman (Line Follower)
  '71ab50cd-7c7f-419a-b1b2-d8bb05930ded': 
    '',

  // FREEFIRE (SOLO)
  'f19e70a2-3616-431d-89aa-a9493619edf4':
    'https://chat.whatsapp.com/KVS53rIbFaN2ljVnaZJF19',

  // Robo Tug
  '16577a0f-86f0-4980-b284-1ea1afe0e126': 
    '',

  // BGMI (DUO TDM)
  'e361ce59-680b-4d38-a185-9b069c37e1da': 
    '',

  // AMONG US
  '41bfd746-3c24-491c-80cd-d5ede5d78d9c': 
    '',

  // FREEFIRE (SQUAD)
  'fcaf3774-df30-466b-be75-1f4a8931c17d':
    'https://chat.whatsapp.com/KXezJWI4aTR3RzNTGJpVdr',

  // E-FOOTBALL (SOLO)
  '17b81e27-e7f1-4195-8535-e3a354755e79': 
    '',

  // Startup Autopsy
  '1b0af2ef-1101-4f43-8061-3ac42db45167': 
    '',

  // Capture The Flag (CTF)
  '6b738e60-2dcc-4ba5-883b-b82d5e98651d':
    'https://chat.whatsapp.com/JSAXttadKtxBNOg9cF1x2B',

  // E-FOOTBALL (CO-OP)
  'e0dba33a-31d6-4db2-b5f0-64850dcefc48': 
    '',

  // Shutterscape
  '49c435f3-ddca-412b-bb9a-b652af49315e': 
    '',

  // Anime Fiesta
  'fccf6fad-0e49-4a5c-a971-3ab874dc923a': 
    '',

  // CODE N SEEK
  'edd85a2b-6521-4129-b134-f53ddd2d518d':
    'https://chat.whatsapp.com/Ep0LAxZCbLXCCIqLTs3SeC',

  // Tech Quiz
  '3644164f-fc1e-4f97-91a5-36ac95208bf2':
    'https://chat.whatsapp.com/BeVDtJMD3AL6ZrD8Vrx3iu',

  // Codathon
  'd59115e8-7352-49e9-96c3-3078211b4866':
    'https://chat.whatsapp.com/B9wzqb6OL3tEfrDi2cLoIN',

  // Valorant
  '77cfe84a-78a1-434b-95bc-d29db1ea59a7': 
    '',

  // Clash of Codes
  '1fc97222-a54d-4116-98be-8a3be929a83b': 
    'https://chat.whatsapp.com/BejBQvHycCSKE2CyupWMHx',

  // Build The Electro-Bricks & Digital Circuits
  '845719e3-959b-4f54-a451-18365ebf09f2':
    'https://chat.whatsapp.com/JBCogQ7vWjL0NIvO2q5clR',

  // FIFA 25
  '9c0e3ad0-8401-42e8-8411-62dedb2252b5': 
    '',

  // Mind's Eye
  'a8953835-cec2-49dc-bdf1-453d0a03bd20': 
    '',

  // Design It Hard
  'ad92689b-9c96-4f1a-a81a-3e3cea31ab1d': 
    '',

  // BGMI (SQUAD TDM)
  'f11f0af6-5a23-4084-9aa2-ad6d515c0ce4': 
    '',

  // CLASH ROYALE
  '5b99960f-03cf-4c59-a73e-607dc4f00bec': 
    '',

  // BGMI (SQUAD)
  'bcff7603-f956-4334-a072-283c13abd97e': 
    '',

  // Treasure Hunt-Murder Mystery
  '137c5b2d-2f37-4c7e-adbd-1f7852a6faba': 
    '',

  // Crack The Interview
  '199e5134-39c4-488f-8c10-8bc256c39f84': 
    '',
};

export const getEventWhatsAppLink = (eventId: string): string | null => {
  const link = EVENT_WHATSAPP_LINKS[eventId];
  return link || null;
};