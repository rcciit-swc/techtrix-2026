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
    <div className="fixed left-[-10px] top-1/2 -translate-y-1/2 z-[200] flex flex-col gap-2">
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/events/${item.id}`}
          className={`
            relative w-[240px] h-[180px] rounded-r-[40px] overflow-hidden
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
          <div className="absolute inset-x-0 bottom-0 pb-5 pt-4 flex justify-center bg-gradient-to-t from-black/80 to-transparent">
            <span
              className="text-white text-2xl font-bold uppercase tracking-wider text-center leading-none drop-shadow-lg"
              style={{ fontFamily: "'Metal Mania'" }}
            >
              {item.title}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
