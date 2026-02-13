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
  setEventsData: (background?: boolean) =>
    populateEventDetails(set, background),
  getEventByID: (id: string) => populateEventDetailsByID(set, id),
  getEventCategories: () => populateCategories(set),
  markEventAsRegistered: (eventId: string) =>
    set((state) => ({
      eventsData: state.eventsData.map((event) =>
        event.id === eventId || event.event_id === eventId
          ? {
              ...event,
              registered: true,
              transaction_verified: new Date().toISOString(),
            }
          : event
      ),
    })),
  markEventAsPending: (eventId: string, teamId: string) =>
    set((state) => ({
      eventsData: state.eventsData.map((event) =>
        event.id === eventId || event.event_id === eventId
          ? {
              ...event,
              registered: true,
              registered_team_id: teamId,
              transaction_verified: null,
            }
          : event
      ),
    })),
}));
