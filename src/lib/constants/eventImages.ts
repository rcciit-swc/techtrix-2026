// Event ID to image mapping
// Key: event UUID from database
// Value: { bg: background image path, char: character image path }

export interface EventImages {
  bg: string;
  char: string;
}

// Dummy mapping - replace with actual event IDs and images
export const EVENT_IMAGES: Record<string, EventImages> = {
  // Example entries - update with actual event UUIDs
  default: {
    bg: '/eventDetails/codeAndSeek/lokiBg.png',
    char: '/eventDetails/codeAndSeek/loki.png',
  },
  // Add more event-specific images here
  // 'event-uuid-1': {
  //   bg: '/eventDetails/event1/bg.png',
  //   char: '/eventDetails/event1/char.png',
  // },
};

export const getEventImages = (eventId: string): EventImages => {
  return EVENT_IMAGES[eventId] || EVENT_IMAGES['default'];
};
