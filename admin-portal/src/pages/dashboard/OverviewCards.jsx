import { Users, UserCheck, UserPlus, Building2, Handshake, Flag } from 'lucide-react';
import StatCard from '@/components/widgets/StatCard';

export default function OverviewCards({ statistics }) {
  if (!statistics) return null;

  const cards = [
    {
      label: 'Total Users',
      value: statistics.totalUsers,
      icon: <Users className="h-5 w-5" />,
      hint: `${statistics.activeUsers.toLocaleString()} currently active`
    },
    {
      label: 'Active Users',
      value: statistics.activeUsers,
      icon: <UserCheck className="h-5 w-5" />
    },
    {
      label: 'New Today',
      value: statistics.newRegistrationsToday,
      icon: <UserPlus className="h-5 w-5" />,
      hint: `${statistics.newRegistrationsThisWeek} this week`
    },
    {
      label: 'Communities',
      value: statistics.totalCommunities,
      icon: <Building2 className="h-5 w-5" />,
      hint: `${statistics.activeCommunities} active`
    },
    {
      label: 'Connections',
      value: statistics.totalConnections,
      icon: <Handshake className="h-5 w-5" />
    },
    {
      label: 'Pending Reports',
      value: statistics.pendingReports,
      icon: <Flag className="h-5 w-5" />,
      hint: `${statistics.pendingModeration} awaiting review`
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map(card => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}
