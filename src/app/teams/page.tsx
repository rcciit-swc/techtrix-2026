'use client';

import TeamLoader from '@/components/Teams/TeamLoader';
import TeamMemberCard from '@/components/Teams/TeamMemberCard';
import { useTeams } from '@/lib/stores/teams';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

export default function TeamsPage() {
  const { teams, teamsLoading, fetchTeams } = useTeams();
  const [selectedTab, setSelectedTab] = useState<string>('');

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  useEffect(() => {
    if (teams.length > 0 && !selectedTab) {
      setSelectedTab(teams[0].id);
    }
  }, [teams, selectedTab]);

  const selectedTeam = useMemo(
    () => teams.find((team) => team.id === selectedTab),
    [selectedTab, teams]
  );

  const isMobile = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  }, []);

  if (teamsLoading || teams.length === 0) {
    return <TeamLoader />;
  }

  return (
    <div
      className="min-h-screen w-full relative overflow-x-hidden bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/profile/profilebg.jpeg')" }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Animated Background Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(250, 204, 21, 0.1) 0%, transparent 70%)',
          animation: 'pulse 8s infinite',
        }}
      />

      {/* Simplified Content Container */}
      <div className="relative z-10 container mx-auto px-4 pt-10 md:pt-10 pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className="text-5xl md:text-7xl font-bold mb-4 tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-400 to-red-500"
            style={{
              textShadow: '0 0 30px rgba(239,68,68,0.6)',
              fontFamily: 'Metal Mania',
              letterSpacing: '0.05em',
            }}
          >
            OUR TEAMS
          </h1>
          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-80" />
        </div>

        {/* Optimized Tabs - S.H.I.E.L.D Interface Style */}
        <div className="mb-12 overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex justify-start md:justify-center gap-4 min-w-max px-4">
            {teams.map((team) => (
              <button
                key={team.id}
                onClick={() => setSelectedTab(team.id)}
                className={`
                  relative px-6 py-4 font-bold uppercase tracking-widest transition-all duration-300 flex flex-col items-center gap-2
                  clip-path-slant group min-w-[100px]
                  ${
                    selectedTab === team.id
                      ? 'bg-gradient-to-b from-red-900/80 to-black text-white shadow-[0_0_20px_rgba(239,68,68,0.6)] border-b-4 border-yellow-500'
                      : 'bg-gray-900/80 text-gray-400 hover:bg-gray-800 hover:text-white border-b-4 border-transparent hover:border-red-500'
                  }
                `}
                style={{
                  fontFamily: 'Agency FB, sans-serif',
                  clipPath:
                    'polygon(10% 0, 100% 0, 100% 85%, 90% 100%, 0 100%, 0 15%)',
                }}
              >
                <span
                  className={`text-2xl transition-transform duration-300 ${selectedTab === team.id ? 'scale-110 text-yellow-400' : 'group-hover:text-red-400'}`}
                >
                  {team.icon}
                </span>
                <span className="text-[10px] md:text-xs font-bold tracking-[0.2em]">
                  {team.category}
                </span>

                {/* Active Indicator Scanline */}
                {selectedTab === team.id && (
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/10 to-transparent opacity-50 animate-scanline pointer-events-none" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Team Grid - Using CSS Grid instead of Masonry for performance */}
        <div className="min-h-[50vh]">
          {selectedTeam && (
            <motion.div
              key={selectedTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
            >
              {selectedTeam.members.map((member, index) => (
                <div key={`${selectedTab}-${index}-${member.name}`}>
                  <TeamMemberCard member={member} index={index} />
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
