import Hero from '@/components/landing/Hero'
import Pillars from '@/components/landing/Pillars'
import PlannerSection from '@/components/landing/PlannerSection'
import CtaSection from '@/components/landing/CtaSection'

export default function LandingPage() {
  return (
    <main>
      <Hero />
      <Pillars />
      <PlannerSection />
      <CtaSection />
    </main>
  )
}
