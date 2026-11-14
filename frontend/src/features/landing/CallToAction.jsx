export const CallToAction = () => {
  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-primary/10 to-transparent">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="relative flex flex-col items-center text-center">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Ready to Find Your Community?
          </h2>
          <p className="font-body text-token-text-secondary text-lg md:text-xl max-w-2xl mb-8">
            Join thousands of migrants who have found their people. Your journey starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary px-8 py-4 font-medium text-lg hover:opacity-90 transition-opacity">
              Create Free Account
            </button>
            <button className="btn-outline px-8 py-4 font-medium text-lg border-2 hover:bg-primary transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}