import { PageHeader } from '../../components/ui/PageHeader'
import { PeopleDiscovery } from './PeopleDiscovery'
import { HometownDiscovery } from './HometownDiscovery'
import { InterestDiscovery } from './InterestDiscovery'
import { LanguageDiscovery } from './LanguageDiscovery'

export const Discover = () => (
  <div className="mx-auto max-w-6xl space-y-14">
    <PageHeader title="Discover" description="Find people by location, hometown, language or shared interests." />
    <PeopleDiscovery />
    <HometownDiscovery />
    <InterestDiscovery />
    <LanguageDiscovery />
  </div>
)
