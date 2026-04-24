import { constructMetaData } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = constructMetaData({
  title: 'Our Teams',
  description:
    "Meet the dedicated teams behind Techtrix 2026 — the organizing committee, technical team, design team, and more from RCCIIT's Annual Technical Fest.",
  openGraphType: 'website',
  canonical: 'https://techtrix.rcciit.org.in/teams',
});

export default function TeamsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
