export const InterestDiscovery = () => {
  return (
    <section className="py-8 bg-elevated surface rounded-2xl border border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <header className="flex flex-col items-start gap-4 mb-8">
          <h2 className="font-display text-3xl font-bold">Interest Discovery</h2>
          <p className="font-body text-token-text-secondary">
            Find people who share your hobbies and passions.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Interest chips */}
          <div className="grid grid-cols-2 gap-2">
            <span className="px-3 py-1.5 rounded-full border text-xs hover:bg-primary hover:text-white transition-colors">Travel</span>
            <span className="px-3 py-1.5 rounded-full border text-xs hover:bg-primary hover:text-white transition-colors">Food</span>
            <span className="px-3 py-1.5 rounded-full border text-xs hover:bg-primary hover:text-white transition-colors">Music</span>
            <span className="px-3 py-1.5 rounded-full border text-xs hover:bg-primary hover:text-white transition-colors">Sports</span>
            <span className="px-3 py-1.5 rounded-full border text-xs hover:bg-primary hover:text-white transition-colors">Art</span>
            <span className="px-3 py-1.5 rounded-full border text-xs hover:bg-primary hover:text-white transition-colors">Photography</span>
            <span className="px-3 py-1.5 rounded-full border text-xs hover:bg-primary hover:text-white transition-colors">Cooking</span>
            <span className="px-3 py-1.5 rounded-full border text-xs hover:bg-primary hover:text-white transition-colors">Fitness</span>
            <span className="px-3 py-1.5 rounded-full border text-xs hover:bg-primary hover:text-white transition-colors">Reading</span>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <a href="#" className="text-token-accent font-medium hover:underline">
            View Interest-Based Communities
          </a>
        </div>
      </div>
    </section>
  )
}