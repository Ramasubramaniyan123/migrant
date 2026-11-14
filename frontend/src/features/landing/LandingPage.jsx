import { HeroSection } from './HeroSection'
import { FeaturesSection } from './FeaturesSection'
import { TrustSection } from './TrustSection'
import { CallToAction } from './CallToAction'

export const LandingPage = () => {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <TrustSection />
      <CallToAction />
    </main>
  )
}