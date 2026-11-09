import { useEffect, useState } from 'react';
import { Users, UsersRound, Calendar, Flag, TrendingUp, Activity } from 'lucide-react';
import Card from '../../../components/common/Card';
import Loading from '../../../components/common/Loading';
import adminService from '../../../services/adminService';
import { formatNumber } from '../../../utils/formatters';

const AdminDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [overviewData, statsData] = await Promise.all([
        adminService.getDashboardOverview(),
        adminService.getDashboardStatistics(),
      ]);

      setOverview(overviewData);
      setStatistics(statsData);
    } catch (error) {
      console.error('Failed to load admin dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading text="Loading admin dashboard..." />;
  }

  const stats = [
    {
      title: 'Total Users',
      value: formatNumber(overview?.totalUsers || 0),
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
      change: '+12% from last month',
    },
    {
      title: 'Active Users',
      value: formatNumber(overview?.activeUsers || 0),
      icon: Activity,
      color: 'bg-green-100 text-green-600',
      change: '+8% from last week',
    },
    {
      title: 'Communities',
      value: formatNumber(overview?.totalCommunities || 0),
      icon: UsersRound,
      color: 'bg-purple-100 text-purple-600',
      change: '+5 new this month',
    },
    {
      title: 'Events',
      value: formatNumber(overview?.totalEvents || 0),
      icon: Calendar,
      color: 'bg-orange-100 text-orange-600',
      change: '+15 upcoming',
    },
    {
      title: 'Pending Reports',
      value: formatNumber(overview?.pendingReports || 0),
      icon: Flag,
      color: 'bg-red-100 text-red-600',
      change: 'Requires attention',
    },
    {
      title: 'Connections Made',
      value: formatNumber(overview?.totalConnections || 0),
      icon: TrendingUp,
      color: 'bg-teal-100 text-teal-600',
      change: '+45 this week',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy mb-2">Admin Dashboard</h1>
        <p className="text-grey">Overview of platform activity and metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-grey mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-navy mb-2">{stat.value}</p>
                <p className="text-xs text-grey">{stat.change}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-semibold text-navy mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-offwhite rounded-lg">
                <div className="w-2 h-2 bg-terracotta rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-navy font-medium">Activity #{i}</p>
                  <p className="text-xs text-grey">2 minutes ago</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-navy mb-4">Pending Tasks</h2>
          <div className="space-y-3">
            {overview?.pendingReports > 0 && (
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-sm font-medium text-red-900">
                  {overview.pendingReports} reports need review
                </p>
                <p className="text-xs text-red-700 mt-1">Review and take action</p>
              </div>
            )}
            {overview?.pendingVerifications > 0 && (
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm font-medium text-yellow-900">
                  {overview.pendingVerifications} users pending verification
                </p>
                <p className="text-xs text-yellow-700 mt-1">Verify user profiles</p>
              </div>
            )}
            {(!overview?.pendingReports && !overview?.pendingVerifications) && (
              <p className="text-grey text-center py-4">No pending tasks</p>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h2 className="text-xl font-semibold text-navy mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-offwhite rounded-lg hover:bg-lavender transition-colors text-center">
            <Users className="w-8 h-8 text-terracotta mx-auto mb-2" />
            <p className="text-sm font-medium text-navy">Manage Users</p>
          </button>
          <button className="p-4 bg-offwhite rounded-lg hover:bg-lavender transition-colors text-center">
            <Flag className="w-8 h-8 text-terracotta mx-auto mb-2" />
            <p className="text-sm font-medium text-navy">Review Reports</p>
          </button>
          <button className="p-4 bg-offwhite rounded-lg hover:bg-lavender transition-colors text-center">
            <UsersRound className="w-8 h-8 text-terracotta mx-auto mb-2" />
            <p className="text-sm font-medium text-navy">Communities</p>
          </button>
          <button className="p-4 bg-offwhite rounded-lg hover:bg-lavender transition-colors text-center">
            <Calendar className="w-8 h-8 text-terracotta mx-auto mb-2" />
            <p className="text-sm font-medium text-navy">Events</p>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
