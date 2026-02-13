import {
  Award,
  Code2Icon,
  HeartHandshake,
  Mic,
  Paintbrush,
  Star,
} from 'lucide-react';
import { FaMoneyCheck, FaTruck } from 'react-icons/fa';

/**
 * Maps team IDs to their corresponding icons
 * This maintains the visual consistency with the existing design
 */
export const getTeamIcon = (teamId: string): React.ReactNode => {
  const iconMap: Record<string, React.ReactNode> = {
    faculty: <HeartHandshake className="text-yellow-200" />,
    swc: <Award className="text-yellow-200" />,
    convenors: <Star className="text-yellow-200" />,
    coordinators: <Star className="text-yellow-200" />,
    tech: <Code2Icon className="text-yellow-200" />,
    graphics: <Paintbrush className="text-yellow-200" />,
    social_media: <Mic className="text-yellow-200" />,
    pr: <Mic className="text-yellow-200" />,
    logistics: <FaTruck className="text-yellow-200" />,
    sponsorship: <FaMoneyCheck className="text-yellow-200" />,
  };

  // Return the icon or a default star icon
  return iconMap[teamId.toLowerCase()] || <Star className="text-yellow-200" />;
};

/**
 * Generates a URL-friendly path from team name
 */
export const getTeamPath = (teamId: string): string => {
  return `/team/${teamId.toLowerCase().replace(/\s+/g, '-')}`;
};
