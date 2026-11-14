import { EventCard } from '../event/EventCard'

export const Events = () => {
  return (
    <section className="py-8 bg-elevated surface rounded-2xl border border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <header className="flex flex-col items-start gap-4 mb-8">
          <h2 className="font-display text-3xl font-bold">Events</h2>
          <p className="font-body text-token-text-secondary">
            Upcoming community activities and gatherings.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <EventCard
            id={1}
            title="Diwali Celebration"
            organization="Chennai Culture Club"
            date="November 1, 2024"
            time="6:00 PM - 9:00 PM"
            location="Chennai Community Center"
            capacity={50}
            registered={34}
            image="/assets/events/diwali.jpg"
          />
          <EventCard
            id={2}
            title="Tech Networking Mixer"
            organization="Bangalore Tech Circle"
            date="November 8, 2024"
            time="7:00 PM - 9:30 PM"
            location="Innovation Hub, Bangalore"
            capacity={100}
            registered={78}
            image="/assets/events/tech-mixer.jpg"
          />
          <EventCard
            id={3}
            title="Mumbai Food Walk"
            organization="Mumbai Foodies"
            date="November 15, 2024"
            time="4:00 PM - 7:00 PM"
            location="Gateway of India, Mumbai"
            capacity={20}
            registered={18}
            image="/assets/events/food-walk.jpg"
          />
        </div>

        <div className="mt-8 text-right">
          <a href="#" className="text-token-accent font-medium hover:underline">
            View All Events
          </a>
        </div>
      </div>
    </section>
  )
}