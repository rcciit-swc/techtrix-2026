import Evangelists from '@/components/Evangelists';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Evangelists | TechTrix 2026',
  description:
    'Meet the faces spreading the word about TechTrix 2026 — the annual technical fest of RCCIIT.',
};

export default function EvangelistPage() {
  return (
    <main className="min-h-screen bg-black pt-20">
      <Evangelists />
    </main>
  );
}
