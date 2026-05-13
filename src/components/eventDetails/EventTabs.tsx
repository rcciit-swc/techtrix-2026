// components/events/EventTabs.tsx
import { EventTab } from './event';

interface Props {
  activeTab: EventTab;
  setActiveTab: (tab: EventTab) => void;
  showMap?: boolean;
}

export default function EventTabs({ activeTab, setActiveTab, showMap }: Props) {
  const tabs: { id: EventTab; label: string; shining?: boolean }[] = [
    { id: 'info', label: 'Basic Info' },
    ...(showMap
      ? [{ id: 'map' as EventTab, label: 'Track Map', shining: true }]
      : []),
    { id: 'description', label: 'Description' },
    { id: 'rules', label: 'Rules' },
  ];

  return (
    <div className="flex gap-4 lg:gap-10 justify-center">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const base = `relative pb-2 text-lg tracking-wider transition-all duration-200`;
        const colorClasses = isActive
          ? 'text-white border-b-[3px] border-[#8B0000]'
          : 'text-white/60 border-b-[3px] border-transparent hover:text-white/80';
        const shineClasses = tab.shining ? ' map-tab-shine' : '';
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`${base} ${colorClasses}${shineClasses}`}
            style={{ fontFamily: "'Metal Mania'" }}
          >
            {tab.shining && (
              <>
                <span aria-hidden className="map-tab-halo" />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 overflow-hidden rounded-sm"
                >
                  <span className="absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-[#EDF526]/50 to-transparent blur-[2px] animate-[map-tab-sweep_2.4s_linear_infinite]" />
                </span>
              </>
            )}
            <span className="relative">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
