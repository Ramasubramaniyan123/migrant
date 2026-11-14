import { HeroBlobs } from '../landing/HeroBlobs'
import { WelcomeSection } from '../dashboard/WelcomeSection'
import { SuggestedConnections } from '../dashboard/SuggestedConnections'
import { UpcomingEvents } from '../dashboard/UpcomingEvents'
import { RecentActivity } from '../dashboard/RecentActivity'

export const Home = () => {
  return (
    <section className="min-h-screen bg-background text-token-text-primary">
      <HeroBlobs />
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8">
        <WelcomeSection />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <SuggestedConnections />
          <UpcomingEvents />
          <RecentActivity />
        </div>
      </div>
    </section>
  )
}