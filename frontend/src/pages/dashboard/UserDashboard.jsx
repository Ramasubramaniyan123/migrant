import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserPlus, Calendar, TrendingUp, MapPin, MessageCircle } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import Avatar from '../../components/common/Avatar';
import discoveryService from '../../services/discoveryService';
import connectionService from '../../services/connectionService';
import eventService from '../../services/eventService';
import { formatRelativeTime } from '../../utils/formatters';

const UserDashboard = () => {
  const { profile, loading: profileLoading } = useUser();
  const [suggestions, setSuggestions] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [connectionCount, setConnectionCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [suggestionsData, eventsData, countData] = await Promise.all([
        discoveryService.getSuggestions({ size: 6 }),
        eventService.getEvents(null, 0, 4),
        connectionService.getConnectionCount(),
      ]);

      setSuggestions(suggestionsData.content || []);
      setUpcomingEvents(eventsData.content || []);
      setConnectionCount(countData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading || loading) {
    return <Loading text="Loading your dashboard..." />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="bg-gradient-to-r from-navy to-navy-dark rounded-card p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {profile?.firstName || 'Friend'}! 👋
        </h1>
        <p className="text-gray-200">
          {profile?.hometownCity && profile?.currentCity
            ? `From ${profile.hometownCity}, now in ${profile.currentCity}`
            : 'Complete your profile to get personalized suggestions'}
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 bg-lavender rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-terracotta" />
          </div>
          <div>
            <p className="text-2xl font-bold text-navy">{connectionCount}</p>
            <p className="text-sm text-grey">Connections</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 bg-lavender rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6 text-terracotta" />
          </div>
          <div>
            <p className="text-2xl font-bold text-navy">{upcomingEvents.length}</p>
            <p className="text-sm text-grey">Upcoming Events</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 bg-lavender rounded-lg flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-terracotta" />
          </div>
          <div>
            <p className="text-2xl font-bold text-navy">0</p>
            <p className="text-sm text-grey">Unread Messages</p>
          </div>
        </Card>
      </div>

      {/* Suggested connections */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-terracotta" />
            <h2 className="text-xl font-semibold text-navy">People You May Know</h2>
          </div>
          <Link to="/app/discover">
            <Button variant="ghost" size="sm">View All</Button>
          </Link>
        </div>

        {suggestions.length === 0 ? (
          <p className="text-grey text-center py-8">No suggestions available. Try updating your profile!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestions.map((user) => (
              <Card key={user.userId} className="bg-offwhite" hover>
                <div className="flex items-start gap-3">
                  <Avatar src={user.avatarUrl} alt={user.displayName} size="lg" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-navy truncate">{user.displayName}</h3>
                    <p className="text-sm text-grey truncate">{user.currentCity}</p>
                    {user.hometownCity && (
                      <p className="text-xs text-terracotta mt-1">From {user.hometownCity}</p>
                    )}
                  </div>
                </div>
                <Button size="sm" fullWidth className="mt-4">
                  Connect
                </Button>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {/* Upcoming events */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-terracotta" />
            <h2 className="text-xl font-semibold text-navy">Upcoming Events</h2>
          </div>
          <Link to="/app/events">
            <Button variant="ghost" size="sm">View All</Button>
          </Link>
        </div>

        {upcomingEvents.length === 0 ? (
          <p className="text-grey text-center py-8">No upcoming events. Check back soon!</p>
        ) : (
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <Link key={event.id} to={`/app/events/${event.id}`}>
                <Card className="bg-offwhite" hover>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-lavender rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-xs text-grey">MAR</span>
                      <span className="text-xl font-bold text-navy">15</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-navy">{event.title}</h3>
                      <p className="text-sm text-grey mt-1">{event.location}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-grey">
                        <span>🕒 {formatRelativeTime(event.startTime)}</span>
                        <span>👥 {event.participantCount || 0} attending</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </Card>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/app/discover">
          <Card hover className="text-center">
            <MapPin className="w-12 h-12 text-terracotta mx-auto mb-3" />
            <h3 className="font-semibold text-navy mb-2">Discover People Nearby</h3>
            <p className="text-sm text-grey">Find people from your hometown in your city</p>
          </Card>
        </Link>

        <Link to="/app/communities">
          <Card hover className="text-center">
            <Users className="w-12 h-12 text-terracotta mx-auto mb-3" />
            <h3 className="font-semibold text-navy mb-2">Join Communities</h3>
            <p className="text-sm text-grey">Connect with language and cultural groups</p>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default UserDashboard;
