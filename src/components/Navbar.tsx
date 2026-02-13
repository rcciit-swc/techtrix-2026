'use client';
import React from 'react';
import { FloatingDock } from '@/components/ui/floating-dock';
import {
  IconHome,
  IconCalendarEvent,
  IconUsers,
  IconMessageCircle,
} from '@tabler/icons-react';

export function Navbar() {
  const links = [
    {
      title: 'Home',
      icon: (
        <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: '#',
    },
    {
      title: 'Events',
      icon: (
        <IconCalendarEvent className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: '#',
    },
    {
      title: 'Teams',
      icon: (
        <IconUsers className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: '/teams',
    },
    {
      title: 'Contact',
      icon: (
        <IconMessageCircle className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: '#',
    },
    {
      title: 'User',
      icon: (
        <img
          src="/hero/dummyAvater.svg"
          width={24}
          height={24}
          alt="Avatar"
          className="rounded-full"
        />
      ),
      href: '#',
    },
  ];

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center justify-center w-full max-w-fit z-50">
      <div style={{ fontFamily: '"Exo-Black", sans-serif' }}>
        <FloatingDock mobileClassName="translate-y-20" items={links} />
      </div>
    </div>
  );
}
