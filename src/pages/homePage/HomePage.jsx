import React from 'react';
import HomeHero from '../../components/homePage/HomeHero';
import HomeFeaturesSection from '../../components/homePage/HomeFeaturesSection';
import HomeHowItWorks from '../../components/homePage/HomeHowItWorks';
import HomeUpcomingEvents from '../../components/homePage/HomeUpcomingEvents';
import HomeTestimonials from '../../components/homePage/HomeTestimonials';
// import HomePartners from '../../components/homePage/HomePartners';
import HomeCTA from '../../components/homePage/HomeCTA';
import HomeNavbar from '../../components/homePage/HomeNavbar';
import HomeFooter from '../../components/homePage/HomeFooter';
import useScrollToTop from '@/hooks/useScrollToTop';

const HomePage = () => {
  useScrollToTop();
  return (
    <div className="min-h-screen bg-white">
      <HomeNavbar />
      <HomeHero />
      <HomeFeaturesSection />
      <HomeHowItWorks />
      <HomeUpcomingEvents />
      <HomeTestimonials />
      <HomeCTA />
      <HomeFooter />
    </div>
  );
};

export default HomePage;
