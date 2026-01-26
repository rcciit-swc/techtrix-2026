import {
  getEventByID,
  getEventCategories,
  getEventsData,
} from '@/lib/services';
import { events } from '../types/events';

export const populateEventDetails = async (set: any) => {
  set({ eventsLoading: true });
  const data = await getEventsData();
  set({ eventsData: data ?? [], eventsLoading: false });
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
    set({ eventsLoading: true });
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
