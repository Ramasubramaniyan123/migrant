import { CommunityCard } from '../community/CommunityCard'

export const Communities = () => {
  return (
    <section className="py-8 bg-elevated surface rounded-2xl border border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <header className="flex flex-col items-start gap-4 mb-8">
          <h2 className="font-display text-3xl font-bold">Communities</h2>
          <p className="font-body text-token-text-secondary">
            Join communities based on shared interests and regional identity.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <CommunityCard
            id={1}
            name="Bangalore Tech Circle"
            cover="/assets/community1.jpg"
            description="A community for tech professionals in Bangalore"
            memberCount={247}
            hometown="Bangalore, India"
          />
          <CommunityCard
            id={2}
            name="Mumbai Foodies"
            cover="/assets/community2.jpg"
            description="Food lovers exploring Mumbai's culinary scene"
            memberCount={156}
            hometown="Mumbai, India"
          />
          <CommunityCard
            id={3}
            name="Chennai Culture Club"
            cover="/assets/community3.jpg"
            description="Preserving and celebrating Tamil culture"
            memberCount={89}
            hometown="Chennai, India"
          />
          <CommunityCard
            id={4}
            name="Hyderabad Hikers"
            cover="/assets/community4.jpg"
            description="Outdoor enthusiasts exploring Hyderabad"
            memberCount={63}
            hometown="Hyderabad, India"
          />
        </div>

        <div className="mt-8 text-right">
          <a href="#" className="text-token-accent font-medium hover:underline">
            Browse All Communities
          </a>
        </div>
      </div>
    </section>
  )
}