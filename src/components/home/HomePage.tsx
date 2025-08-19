import React from 'react'
import HeroSection from './HeroSection'
import FeaturesSection from './FeaturesSection'
import BenefitsSection from './BenefitsSection'
import OurServices from './OurServices'
import FrameworkSection from './FramworkSpp'
import APIDesign from './APIDesign'

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <FeaturesSection/>
      <OurServices/>
      <FrameworkSection/>
      <APIDesign/>
      {/* <BenefitsSection/> */}
    </div>
  )
}
