// types/event.ts
export type EventTab = 'description' | 'rules' | 'more';

export interface SidebarEvent {
  id: string;
  title: string;
  image: string;
}

export interface EventContent {
  title: string;
  description: string;
  rules: string;
  moreDetails: string;
  lastDate: string;
  venue: string;
  fee: string;
  characterImage: string;
  backgroundImage: string;
}
