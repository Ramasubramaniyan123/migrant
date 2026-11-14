import { DiscoverPeople } from '../discovery/PeopleDiscovery'
import { HometownConnection } from '../discovery/HometownConnection'
import { LanguageBridge } from '../discovery/LanguageBridge'
import { CommunityHub } from '../communities/CommunityPreview'

export const FeaturesSection = () => {
  return (
    <section className="py-24 md:py-32 bg-elevated surface">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Discover Your World
          </h2>
          <p className="font-body text-token-text-secondary max-w-2xl mx-auto">
            A shared digital space where migrants can find people, cultures, and communities.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <DiscoverPeople />
          <HometownConnection />
          <LanguageBridge />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 justify-center">
          <CommunityHub />
        </div>
      </div>
    </section>
  )
}