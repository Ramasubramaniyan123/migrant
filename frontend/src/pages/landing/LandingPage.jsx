import { Link } from 'react-router-dom';
import { Users, MapPin, MessageCircle, Calendar, Globe, Heart, Shield, Zap } from 'lucide-react';
import Button from '../../components/common/Button';

const LandingPage = () => {
  const features = [
    {
      icon: MapPin,
      title: 'Find Your Hometown Community',
      description: 'Connect with people from your hometown living in your current city',
    },
    {
      icon: Globe,
      title: 'Language-Based Communities',
      description: 'Join communities based on your native language and regional dialects',
    },
    {
      icon: Users,
      title: 'Build Meaningful Connections',
      description: 'Make genuine friendships with people who share your background',
    },
    {
      icon: Calendar,
      title: 'Attend Local Events',
      description: 'Discover and participate in cultural and social gatherings',
    },
    {
      icon: MessageCircle,
      title: 'Stay Connected',
      description: 'Chat with your connections and community members',
    },
    {
      icon: Heart,
      title: 'Feel at Home',
      description: 'Reduce loneliness by connecting with your cultural community',
    },
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Create Your Profile',
      description: 'Tell us about your hometown, languages, and interests',
    },
    {
      step: '2',
      title: 'Discover People',
      description: 'Find people from your hometown or who speak your language',
    },
    {
      step: '3',
      title: 'Join Communities',
      description: 'Become part of communities that match your background',
    },
    {
      step: '4',
      title: 'Build Connections',
      description: 'Send connection requests and start meaningful conversations',
    },
  ];

  return (
    <div className="bg-offwhite">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-navy via-navy-dark to-navy py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-terracotta rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-lavender rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Connect With Your <span className="text-terracotta">Hometown Community</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Find people from your hometown, speak your language, and build meaningful connections in your new city
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white border-white text-navy hover:bg-gray-100 hover:text-navy">
                  Sign In
                </Button>
              </Link>
            </div>
            <p className="text-sm text-gray-300 mt-4">
              Launching in Gurugram, India • No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Why Join Migrant Community?
            </h2>
            <p className="text-lg text-grey max-w-2xl mx-auto">
              A platform designed specifically for people living away from their hometowns
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-offwhite rounded-card p-6 hover:shadow-card transition-shadow"
              >
                <div className="w-12 h-12 bg-lavender rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-terracotta" />
                </div>
                <h3 className="text-xl font-semibold text-navy mb-2">{feature.title}</h3>
                <p className="text-grey">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-offwhite">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              How It Works
            </h2>
            <p className="text-lg text-grey max-w-2xl mx-auto">
              Four simple steps to start building your community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-terracotta text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-navy mb-2">{item.title}</h3>
                <p className="text-grey">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-navy text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-terracotta mb-2">1000+</div>
              <div className="text-lg text-gray-300">Active Members</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-terracotta mb-2">50+</div>
              <div className="text-lg text-gray-300">Communities</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-terracotta mb-2">20+</div>
              <div className="text-lg text-gray-300">Languages Supported</div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Shield className="w-16 h-16 text-terracotta mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Your Safety is Our Priority
            </h2>
            <p className="text-lg text-grey mb-8">
              We have robust verification, moderation, and privacy controls to ensure a safe and respectful community for everyone.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-offwhite rounded-card p-6">
                <Shield className="w-8 h-8 text-terracotta mb-3" />
                <h3 className="font-semibold text-navy mb-2">Verified Profiles</h3>
                <p className="text-sm text-grey">Email verification and profile moderation</p>
              </div>
              <div className="bg-offwhite rounded-card p-6">
                <Zap className="w-8 h-8 text-terracotta mb-3" />
                <h3 className="font-semibold text-navy mb-2">Privacy Controls</h3>
                <p className="text-sm text-grey">You control who can see your information</p>
              </div>
              <div className="bg-offwhite rounded-card p-6">
                <Users className="w-8 h-8 text-terracotta mb-3" />
                <h3 className="font-semibold text-navy mb-2">Active Moderation</h3>
                <p className="text-sm text-grey">24/7 moderation and reporting tools</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-terracotta to-terracotta-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Community?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join thousands of people who have already found their hometown connections
          </p>
          <Link to="/register">
            <Button 
              size="lg" 
              className="bg-white text-terracotta hover:bg-gray-100"
            >
              Join Now - It's Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
