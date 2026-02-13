import {
  Cpu,
  Gem,
  Hammer,
  Megaphone,
  PenTool,
  Share2,
  Shield,
  Star,
  Target,
  Zap,
} from 'lucide-react';

/**
 * Maps team IDs to their corresponding icons
 * This maintains the visual consistency with the existing design
 */
export const getTeamIcon = (teamId: string): React.ReactNode => {
  const iconMap: Record<string, React.ReactNode> = {
    faculty: <Shield className="text-red-500" />, // SHIELD - Leadership
    swc: <Target className="text-blue-400" />, // Hawkeye/Target - Precision
    convenors: <Star className="text-yellow-400" />, // Captain America Star - Leaders
    coordinators: <Zap className="text-yellow-400" />, // Thor/Lightning - Energy
    tech: <Cpu className="text-cyan-400" />, // Iron Man Tech
    graphics: <PenTool className="text-purple-400" />, // Creative/Art
    social_media: <Share2 className="text-green-400" />, // Connection/Hulk Green?
    pr: <Megaphone className="text-orange-400" />, // Communication
    logistics: <Hammer className="text-gray-400" />, // Thor's Hammer - Heavy Lifting
    sponsorship: <Gem className="text-yellow-200" />, // Infinity Stones - Value
  };

  // Return the icon or a default star icon
  return iconMap[teamId.toLowerCase()] || <Star className="text-white" />;
};

/**
 * Generates a URL-friendly path from team name
 */
export const getTeamPath = (teamId: string): string => {
  return `/team/${teamId.toLowerCase().replace(/\s+/g, '-')}`;
};
