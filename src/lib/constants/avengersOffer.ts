export const STARTUP_AUTOPSY_EVENT_ID = '1b0af2ef-1101-4f43-8061-3ac42db45167';
export const DESIGN_IT_HARD_EVENT_ID = 'ad92689b-9c96-4f1a-a81a-3e3cea31ab1d';
export const FLAGSHIP_CATEGORY_ID = 'a8609025-6132-4d69-8c61-3313ef082db4';

export const OFFER_NAME = 'Avengers Initiative';
export const OFFER_TOTAL = 50; // ₹50 for both events
export const OFFER_PER_EVENT = 25; // ₹25 per event

export const OFFER_EVENT_IDS = [
  STARTUP_AUTOPSY_EVENT_ID,
  DESIGN_IT_HARD_EVENT_ID,
];

export function getOtherOfferEvent(eventId: string): string {
  return eventId === STARTUP_AUTOPSY_EVENT_ID
    ? DESIGN_IT_HARD_EVENT_ID
    : STARTUP_AUTOPSY_EVENT_ID;
}

export function getOtherOfferEventName(eventId: string): string {
  return eventId === STARTUP_AUTOPSY_EVENT_ID
    ? 'Design It Hard'
    : 'Startup Autopsy';
}

export function getOtherOfferEventPath(eventId: string): string {
  return eventId === STARTUP_AUTOPSY_EVENT_ID
    ? `/event/${DESIGN_IT_HARD_EVENT_ID}`
    : `/event/${STARTUP_AUTOPSY_EVENT_ID}`;
}

export function isOfferEvent(eventId: string): boolean {
  return OFFER_EVENT_IDS.includes(eventId);
}
