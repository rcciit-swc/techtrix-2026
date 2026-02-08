// components/events/EventTabs.tsx
import { EventTab } from './event';

interface Props {
  activeTab: EventTab;
  setActiveTab: (tab: EventTab) => void;
}

export default function EventTabs({ activeTab, setActiveTab }: Props) {
  const tabs: { id: EventTab; label: string }[] = [
    { id: 'description', label: 'Description' },
    { id: 'rules', label: 'Rules' },
    { id: 'more', label: 'More Details' },
  ];

  return (
    <div className="flex gap-4 lg:gap-10 justify-center">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`pb-2 text-lg tracking-wider transition-all duration-200
            ${
              activeTab === tab.id
                ? 'text-white border-b-[3px] border-[#8B0000]'
                : 'text-white/60 border-b-[3px] border-transparent hover:text-white/80'
            }`}
          style={{ fontFamily: "'Metal Mania'" }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
