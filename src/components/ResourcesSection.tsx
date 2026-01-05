import { useLanguage } from '@/contexts/LanguageContext';
import { BookOpen, Video, FileText, ExternalLink } from 'lucide-react';

const resources = [
  {
    icon: BookOpen,
    titleEn: 'Learning Paths',
    titleAr: 'مسارات التعلم',
    titleDarija: 'مسارات التعلم',
    descEn: 'Structured courses from beginner to advanced cybersecurity concepts.',
    descAr: 'دورات منظمة من المبتدئين إلى المفاهيم المتقدمة',
    descDarija: 'كورسات منظمة من البداية للمستوى المتقدم',
    links: [
      { name: 'OWASP', url: 'https://owasp.org/' },
      { name: 'SANS', url: 'https://www.sans.org/' },
      { name: 'Cybrary', url: 'https://www.cybrary.it/' },
    ],
  },
  {
    icon: Video,
    titleEn: 'CTF Platforms',
    titleAr: 'منصات CTF',
    titleDarija: 'منصات CTF',
    descEn: 'Practice your skills with Capture The Flag challenges.',
    descAr: 'تدرب على مهاراتك مع تحديات Capture The Flag',
    descDarija: 'تدرب على المهارات ديالك مع تحديات CTF',
    links: [
      { name: 'HackTheBox', url: 'https://www.hackthebox.com/' },
      { name: 'TryHackMe', url: 'https://tryhackme.com/' },
      { name: 'PicoCTF', url: 'https://picoctf.org/' },
    ],
  },
  {
    icon: FileText,
    titleEn: 'Certifications',
    titleAr: 'الشهادات',
    titleDarija: 'الشهادات',
    descEn: 'Industry-recognized certifications to boost your career.',
    descAr: 'شهادات معترف بها في الصناعة لتعزيز حياتك المهنية',
    descDarija: 'شهادات معترف بها باش تطور الكارير ديالك',
    links: [
      { name: 'CompTIA Security+', url: 'https://www.comptia.org/certifications/security' },
      { name: 'CEH', url: 'https://www.eccouncil.org/programs/certified-ethical-hacker-ceh/' },
      { name: 'OSCP', url: 'https://www.offensive-security.com/pwk-oscp/' },
    ],
  },
];

const ResourcesSection = () => {
  const { language } = useLanguage();

  const getTitle = (resource: typeof resources[0]) => {
    if (language === 'ar') return resource.titleAr;
    if (language === 'darija') return resource.titleDarija;
    return resource.titleEn;
  };

  const getDesc = (resource: typeof resources[0]) => {
    if (language === 'ar') return resource.descAr;
    if (language === 'darija') return resource.descDarija;
    return resource.descEn;
  };

  return (
    <section id="resources" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 matrix-bg opacity-30" />
      
      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gradient mb-4 animate-fade-up">
            {language === 'ar' ? 'الموارد' : language === 'darija' ? 'الريسورسيز' : 'Resources'}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.1s' }}>
            {language === 'ar' ? 'أدوات وموارد حقيقية لرحلتك في الأمن السيبراني' : 
             language === 'darija' ? 'أدوات وريسورسيز حقيقية للمسار ديالك فالسيبر سيكيوريتي' :
             'Real tools and resources for your cybersecurity journey'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {resources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <div
                key={index}
                className="terminal-border bg-card/50 backdrop-blur-sm p-8 rounded-lg hover:glow-box transition-all duration-500 animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Icon className="w-12 h-12 text-primary mb-4 animate-glow-pulse" />
                <h3 className="font-display text-xl font-bold text-primary mb-3">
                  {getTitle(resource)}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {getDesc(resource)}
                </p>
                <div className="space-y-2">
                  {resource.links.map((link, linkIndex) => (
                    <a
                      key={linkIndex}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-secondary hover:text-primary transition-colors duration-300 group"
                    >
                      <ExternalLink className="w-4 h-4 group-hover:animate-glow-pulse" />
                      <span>{link.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ResourcesSection;
