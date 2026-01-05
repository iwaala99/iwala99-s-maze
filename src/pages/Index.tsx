import { LanguageProvider } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import MatrixRain from '@/components/MatrixRain';
import HeroSection from '@/components/HeroSection';
import CyberRoles from '@/components/CyberRoles';
import CommunitySection from '@/components/CommunitySection';
import ResourcesSection from '@/components/ResourcesSection';
import Footer from '@/components/Footer';
import { useEffect } from 'react';

const Index = () => {
  useEffect(() => {
    // Update document title
    document.title = 'IWALA99 | Cybersecurity Community Hub';
    
    // Add meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'IWALA99 - The ultimate hub for ethical hackers, SOC analysts, penetration testers, and cybersecurity professionals worldwide.');
    }
  }, []);

  return (
    <LanguageProvider>
      <div className="relative min-h-screen bg-background overflow-x-hidden scanline">
        <MatrixRain />
        <Navbar />
        <main>
          <HeroSection />
          <CyberRoles />
          <CommunitySection />
          <ResourcesSection />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
};

export default Index;
