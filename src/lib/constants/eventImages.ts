// Event ID to image mapping
// Key: event UUID from database
// Value: { bg: background image path, char: character image path }

export interface EventImages {
  bg: string;
  char: string;
}

// Event ID to image mapping
export const EVENT_IMAGES: Record<string, EventImages> = {
  // CTI Event
  '199e5134-39c4-488f-8c10-8bc256c39f84': {
    bg: 'https://i.postimg.cc/X7Tkt0md/cti_bg.jpg',
    char: 'https://i.postimg.cc/htT1B5Rb/cti.png',
  },
  // Tech Quiz Event
  '3644164f-fc1e-4f97-91a5-36ac95208bf2': {
    bg: 'https://i.postimg.cc/HkX9ghCm/tech_quiz_bg.jpg',
    char: 'https://i.postimg.cc/MpVmSF8z/tech_quiz.png',
  },
  // Default fallback
  default: {
    bg: '/eventDetails/codeAndSeek/lokiBg.png',
    char: '/eventDetails/codeAndSeek/loki.png',
  },
};

export const getEventImages = (eventId: string): EventImages => {
  return EVENT_IMAGES[eventId] || EVENT_IMAGES['default'];
};
