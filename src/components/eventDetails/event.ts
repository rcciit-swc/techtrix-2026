// types/event.ts
export type EventTab = 'info' | 'map' | 'description' | 'rules';

export const MAP_EVENT_ID = '71ab50cd-7c7f-419a-b1b2-d8bb05930ded';

export interface SidebarEvent {
  id: string;
  title: string;
  image: string;
}
