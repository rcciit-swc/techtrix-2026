// components/events/EventSidebar.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';

interface SidebarEvent {
  id: string;
  title: string;
  image: string;
}

interface Props {
  items: SidebarEvent[];
  activeId?: string;
}

export default function EventSidebar({ items, activeId }: Props) {
  return (
    <>
      {/* Mobile Top Navigation */}
      <div className="fixed top-0 left-0 right-0 z-[200] flex justify-start gap-3 py-4 bg-gradient-to-b from-black/80 to-transparent lg:hidden px-4 md:px-6 overflow-x-auto no-scrollbar">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/event/${item.id}`}
            className={`
              relative flex-shrink-0 w-16 h-16 rounded-full border-[2px] overflow-hidden
              transition-all duration-300
              ${
                activeId === item.id
                  ? 'border-[#00f7ff] shadow-[0_0_10px_#00f7ff] scale-110'
                  : 'border-white/40 opacity-80'
              }
            `}
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
            />
            {/* Overlay for text readability */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span
                className="text-[0.5rem] text-white text-center font-bold leading-tight px-1 drop-shadow-md"
                style={{ fontFamily: "'Metal Mania'" }}
              >
                {item.title}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex absolute left-0 top-24 z-[200] flex-col gap-2 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/event/${item.id}`}
            className={`
              relative w-[180px] xl:w-[200px] h-[130px] xl:h-[140px] rounded-r-[30px] overflow-hidden
              transition-all duration-300 group border-[3px]
              ${
                activeId === item.id
                  ? 'border-[#00f7ff] shadow-[0_0_20px_#00f7ff] z-20 scale-105'
                  : 'border-white/40 hover:border-white hover:scale-105 hover:z-10'
              }
            `}
          >
            {/* Background Image */}
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

            {/* Title */}
            <div className="absolute inset-x-0 bottom-0 pb-3 pt-2 flex justify-center bg-gradient-to-t from-black/80 to-transparent">
              <span
                className="text-white text-base xl:text-lg font-bold uppercase tracking-wider text-center leading-tight drop-shadow-lg px-2"
                style={{ fontFamily: "'Metal Mania'" }}
              >
                {item.title}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
