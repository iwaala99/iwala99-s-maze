import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Shield, 
  Eye, 
  Bug, 
  Lock, 
  Server, 
  Code, 
  Search, 
  AlertTriangle,
  Network,
  Fingerprint
} from 'lucide-react';
import { useState } from 'react';

const roles = [
  {
    icon: Shield,
    titleKey: 'Ethical Hacker',
    titleAr: 'هاكر أخلاقي',
    titleDarija: 'الهاكر الأخلاقي',
    descKey: 'Penetrates systems legally to find vulnerabilities before malicious hackers do. Uses same techniques as attackers but for defense.',
    descAr: 'يخترق الأنظمة قانونياً للعثور على الثغرات قبل المخترقين الخبيثين',
    descDarija: 'كيخترق السيستيمات بطريقة قانونية باش يلقى الثغرات قبل الهاكرز الخايبين',
    color: 'primary',
  },
  {
    icon: Eye,
    titleKey: 'SOC Analyst',
    titleAr: 'محلل SOC',
    titleDarija: 'محلل SOC',
    descKey: 'Monitors security systems 24/7, detects threats, and responds to security incidents in real-time from the Security Operations Center.',
    descAr: 'يراقب أنظمة الأمان على مدار الساعة ويكشف التهديدات',
    descDarija: 'كيراقب الأنظمة الأمنية 24/7 وكيكشف التهديدات فالوقت الحقيقي',
    color: 'secondary',
  },
  {
    icon: Bug,
    titleKey: 'Penetration Tester',
    titleAr: 'مختبر الاختراق',
    titleDarija: 'مختبر الاختراق',
    descKey: 'Simulates cyber attacks to test system defenses. Creates detailed reports on vulnerabilities and remediation steps.',
    descAr: 'يحاكي الهجمات السيبرانية لاختبار دفاعات النظام',
    descDarija: 'كيدير محاكاة للهجمات السيبرانية باش يختبر الدفاعات ديال النظام',
    color: 'primary',
  },
  {
    icon: Lock,
    titleKey: 'Security Engineer',
    titleAr: 'مهندس أمني',
    titleDarija: 'مهندس السيكيوريتي',
    descKey: 'Designs and implements security infrastructure, firewalls, and intrusion detection systems to protect networks.',
    descAr: 'يصمم وينفذ البنية التحتية الأمنية والجدران النارية',
    descDarija: 'كيصمم وكينفذ البنية التحتية الأمنية والفايروولز',
    color: 'secondary',
  },
  {
    icon: Search,
    titleKey: 'Threat Hunter',
    titleAr: 'صياد التهديدات',
    titleDarija: 'صياد التهديدات',
    descKey: 'Proactively searches for hidden threats that evade automated security solutions using advanced analysis techniques.',
    descAr: 'يبحث بشكل استباقي عن التهديدات المخفية',
    descDarija: 'كيقلب على التهديدات المخبية لي كتهرب من الحلول الآلية',
    color: 'primary',
  },
  {
    icon: AlertTriangle,
    titleKey: 'Incident Responder',
    titleAr: 'مستجيب الحوادث',
    titleDarija: 'مستجيب الحوادث',
    descKey: 'First responder to security breaches. Contains threats, investigates root causes, and implements recovery procedures.',
    descAr: 'المستجيب الأول للاختراقات الأمنية',
    descDarija: 'أول واحد كيتدخل فحالة الاختراق الأمني',
    color: 'secondary',
  },
  {
    icon: Server,
    titleKey: 'Security Architect',
    titleAr: 'مهندس معماري أمني',
    titleDarija: 'أركيتكت السيكيوريتي',
    descKey: 'Designs enterprise-level security frameworks and ensures all systems follow security best practices.',
    descAr: 'يصمم أطر الأمان على مستوى المؤسسة',
    descDarija: 'كيصمم الإطارات الأمنية على مستوى المؤسسة',
    color: 'primary',
  },
  {
    icon: Code,
    titleKey: 'Malware Analyst',
    titleAr: 'محلل البرمجيات الخبيثة',
    titleDarija: 'محلل المالوير',
    descKey: 'Reverse engineers malicious software to understand attack methods and develop countermeasures.',
    descAr: 'يحلل البرمجيات الخبيثة لفهم طرق الهجوم',
    descDarija: 'كيحلل المالوير باش يفهم كيفاش كيهاجمو وكيطور الحماية',
    color: 'secondary',
  },
  {
    icon: Network,
    titleKey: 'Network Security',
    titleAr: 'أمن الشبكات',
    titleDarija: 'أمن الشبكات',
    descKey: 'Secures network infrastructure, configures VPNs, and monitors network traffic for suspicious activities.',
    descAr: 'يؤمن البنية التحتية للشبكة ويراقب حركة المرور',
    descDarija: 'كيأمن الشبكات وكيراقب الترافيك باش يلقى أي نشاط مشبوه',
    color: 'primary',
  },
  {
    icon: Fingerprint,
    titleKey: 'Digital Forensics',
    titleAr: 'الطب الشرعي الرقمي',
    titleDarija: 'التحقيق الرقمي',
    descKey: 'Investigates cyber crimes by recovering and analyzing digital evidence from computers and devices.',
    descAr: 'يحقق في الجرائم السيبرانية من خلال تحليل الأدلة الرقمية',
    descDarija: 'كيحقق فالجرائم السيبرانية وكيحلل الأدلة الرقمية',
    color: 'secondary',
  },
];

const CyberRoles = () => {
  const { t, language } = useLanguage();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getTitle = (role: typeof roles[0]) => {
    if (language === 'ar') return role.titleAr;
    if (language === 'darija') return role.titleDarija;
    return role.titleKey;
  };

  const getDesc = (role: typeof roles[0]) => {
    if (language === 'ar') return role.descAr;
    if (language === 'darija') return role.descDarija;
    return role.descKey;
  };

  return (
    <section id="roles" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 matrix-bg opacity-50" />
      
      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gradient mb-4 animate-fade-up">
            {t('roles.title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.1s' }}>
            {t('roles.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {roles.map((role, index) => {
            const Icon = role.icon;
            const isHovered = hoveredIndex === index;
            const colorClass = role.color === 'primary' ? 'text-primary' : 'text-secondary';
            const glowClass = role.color === 'primary' ? 'glow-box' : 'glow-cyan';
            
            return (
              <div
                key={index}
                className={`
                  terminal-border bg-card/50 backdrop-blur-sm p-6 rounded-lg
                  transition-all duration-500 cursor-pointer
                  hover:scale-105 hover:-translate-y-2
                  ${isHovered ? glowClass : ''}
                  animate-fade-up
                `}
                style={{ animationDelay: `${index * 0.05}s` }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className={`mb-4 ${colorClass}`}>
                  <Icon className={`w-10 h-10 ${isHovered ? 'animate-glow-pulse' : ''}`} />
                </div>
                
                <h3 className={`font-display font-bold text-lg mb-2 ${colorClass}`}>
                  {getTitle(role)}
                </h3>
                
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {getDesc(role)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CyberRoles;
