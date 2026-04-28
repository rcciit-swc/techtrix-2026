import EvangelistLeaderboardPage from '@/components/evangelist/EvangelistLeaderboardPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Evangelist Leaderboard | TechTrix 2026',
  description: 'Evangelist referral performance leaderboard for TechTrix 2026',
};

export default function EvangelistLeaderboardRoute() {
  return <EvangelistLeaderboardPage />;
}
