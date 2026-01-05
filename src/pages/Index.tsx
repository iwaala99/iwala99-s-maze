import Navbar from '@/components/Navbar';
import MatrixRain from '@/components/MatrixRain';
import HeroSection from '@/components/HeroSection';
import SecurityBanner from '@/components/SecurityBanner';
import CyberRoles from '@/components/CyberRoles';
import CommunitySection from '@/components/CommunitySection';
import ResourcesSection from '@/components/ResourcesSection';
import Footer from '@/components/Footer';
import { useEffect } from 'react';

const Index = () => {
  useEffect(() => {
    document.title = 'IWALA99 | Cybersecurity Community Hub';
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'IWALA99 - The ultimate hub for ethical hackers, SOC analysts, penetration testers, and cybersecurity professionals worldwide.');
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden scanline">
      <MatrixRain />
      <Navbar />
      <main>
        <HeroSection />
        <SecurityBanner />
        <CyberRoles />
        <CommunitySection />
        <ResourcesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
