import {
  getEventByID,
  getEventCategories,
  getEventsData,
} from '@/lib/services';
import { events } from '../types/events';

export const populateEventDetails = async (
  set: any,
  get: any,
  background: boolean = false
) => {
  if (!background) set({ eventsLoading: true });
  try {
    const data = await getEventsData();
    const current: events[] = get().eventsData ?? [];

    // Preserve locally-pending team state the RPC may not surface
    const merged = (data ?? []).map((newEvent: events) => {
      const existing = current.find(
        (e) => e.id === newEvent.id || e.event_id === newEvent.id
      );
      if (existing?.registered_team_id && !newEvent.registered_team_id) {
        // RPC hasn't surfaced the team yet — keep local pending state
        return {
          ...newEvent,
          registered: existing.registered,
          registered_team_id: existing.registered_team_id,
          transaction_verified: existing.transaction_verified ?? null,
        };
      }
      if (existing?.transaction_verified && !newEvent.transaction_verified) {
        // RPC returned the team but transaction_verified hasn't propagated yet —
        // preserve the locally-known verified timestamp to avoid UI regression
        return {
          ...newEvent,
          transaction_verified: existing.transaction_verified,
        };
      }
      return newEvent;
    });

    set({ eventsData: merged, eventsLoading: false });
  } catch (error) {
    set({ eventsLoading: false });
  }
};

export const populateCategories = async (set: any) => {
  set({ eventCategoriesLoading: true });
  // logic
  const data = await getEventCategories();
  if (!data) {
    set({ eventCategories: [], eventCategoriesLoading: false });
  } else {
    set({ eventCategories: data, eventCategoriesLoading: false });
  }
};

export const populateEventDetailsByID = async (set: any, id: string) => {
  try {
    set({ eventDetailsLoading: true });
    const eventData = await getEventByID(id);
    if (!eventData) {
      set({ eventData: {}, eventDetailsLoading: false });
    } else {
      set({ eventData, eventDetailsLoading: false });
    }
  } catch (error: any) {
    set({ eventData: {}, eventDetailsLoading: false });
  }
};
