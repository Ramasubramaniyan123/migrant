import { HeroBlobs } from './HeroBlobs'

export const HeroSection = () => {
  return (
    <section className="relative py-24 md:py-32 lg:py-48 overflow-hidden">
      <HeroBlobs />
      <div className="relative inset-0 max-w-7xl mx-auto px-4 md:px-8">
        <div className="relative flex flex-col items-center text-center">
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Find Your Community
          </h1>
          <p className="font-body text-token-text-secondary text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Connect with people from your hometown, speak your native language, and build meaningful relationships in your new city.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary px-8 py-4 font-medium text-lg hover:opacity-90 transition-opacity">
              Join Community
            </button>
            <button className="btn-outline px-8 py-4 font-medium text-lg border-2 hover:bg-primary transition-colors">
              Explore
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}