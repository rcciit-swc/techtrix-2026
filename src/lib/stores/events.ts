import { create } from 'zustand';
import { events, EventsActionsType, EventsStateType } from '../types/events';
import {
  populateCategories,
  populateEventDetails,
  populateEventDetailsByID,
} from '../actions';

type EventsStoreType = EventsStateType & EventsActionsType;
const eventState: EventsStateType = {
  eventCategories: [],
  eventsData: [],
  eventData: {},
  eventCategoriesLoading: false,
  eventsLoading: false,
  eventDetailsLoading: false,
  approvalDashboardData: [],
  approvalDashboardLoading: false,
};

export const useEvents = create<EventsStoreType>((set) => ({
  ...eventState,
  setEventsData: () => populateEventDetails(set),
  getEventByID: (id: string) => populateEventDetailsByID(set, id),
  getEventCategories: () => populateCategories(set),
  markEventAsRegistered: (eventId: string) =>
    set((state) => ({
      eventsData: state.eventsData.map((event) =>
        event.event_id === eventId
          ? {
              ...event,
              registered: true,
              transaction_verified: new Date().toISOString(),
            }
          : event
      ),
    })),
}));
