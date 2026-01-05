import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ar' | 'darija' | 'fr' | 'es' | 'de';

interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

export const translations: Translations = {
  // Navigation
  'nav.home': {
    en: 'Home',
    ar: 'الرئيسية',
    darija: 'الصفحة الرئيسية',
    fr: 'Accueil',
    es: 'Inicio',
    de: 'Startseite',
  },
  'nav.community': {
    en: 'Community',
    ar: 'المجتمع',
    darija: 'الكوميونيتي',
    fr: 'Communauté',
    es: 'Comunidad',
    de: 'Gemeinschaft',
  },
  'nav.roles': {
    en: 'Cyber Roles',
    ar: 'أدوار الأمن',
    darija: 'الوظائف ديال السيبر',
    fr: 'Rôles Cyber',
    es: 'Roles Cyber',
    de: 'Cyber-Rollen',
  },
  'nav.resources': {
    en: 'Resources',
    ar: 'الموارد',
    darija: 'الريسورسيز',
    fr: 'Ressources',
    es: 'Recursos',
    de: 'Ressourcen',
  },
  'nav.about': {
    en: 'About',
    ar: 'حول',
    darija: 'على IWALA99',
    fr: 'À propos',
    es: 'Acerca de',
    de: 'Über uns',
  },
  // Hero Section
  'hero.welcome': {
    en: 'Welcome to',
    ar: 'مرحباً بك في',
    darija: 'مرحبا بيك ف',
    fr: 'Bienvenue à',
    es: 'Bienvenido a',
    de: 'Willkommen bei',
  },
  'hero.tagline': {
    en: 'Where Elite Hackers & Cybersecurity Professionals Unite',
    ar: 'حيث يتحد نخبة المخترقين ومحترفي الأمن السيبراني',
    darija: 'فين كيجتمعو أحسن الهاكرز و محترفين السيبر سيكيوريتي',
    fr: 'Où les hackers d\'élite et les professionnels de la cybersécurité s\'unissent',
    es: 'Donde se unen los hackers de élite y los profesionales de ciberseguridad',
    de: 'Wo sich Elite-Hacker und Cybersicherheitsexperten vereinen',
  },
  'hero.join': {
    en: 'Join the Network',
    ar: 'انضم للشبكة',
    darija: 'دخل معانا',
    fr: 'Rejoindre le réseau',
    es: 'Únete a la red',
    de: 'Dem Netzwerk beitreten',
  },
  'hero.explore': {
    en: 'Explore Roles',
    ar: 'استكشف الأدوار',
    darija: 'شوف الوظائف',
    fr: 'Explorer les rôles',
    es: 'Explorar roles',
    de: 'Rollen erkunden',
  },
  // Roles Section
  'roles.title': {
    en: 'Cybersecurity Roles',
    ar: 'أدوار الأمن السيبراني',
    darija: 'الوظائف ديال السيبر سيكيوريتي',
    fr: 'Rôles en Cybersécurité',
    es: 'Roles de Ciberseguridad',
    de: 'Cybersicherheitsrollen',
  },
  'roles.subtitle': {
    en: 'Discover the warriors protecting the digital frontier',
    ar: 'اكتشف المحاربين الذين يحمون الحدود الرقمية',
    darija: 'كتشف المحاربين لي كيحميو العالم الرقمي',
    fr: 'Découvrez les guerriers protégeant la frontière numérique',
    es: 'Descubre a los guerreros que protegen la frontera digital',
    de: 'Entdecken Sie die Krieger, die die digitale Grenze schützen',
  },
  // Community Section
  'community.title': {
    en: 'Join Our Elite Network',
    ar: 'انضم لشبكتنا النخبوية',
    darija: 'دخل معانا فالنتوورك',
    fr: 'Rejoignez notre réseau d\'élite',
    es: 'Únete a nuestra red de élite',
    de: 'Treten Sie unserem Elite-Netzwerk bei',
  },
  'community.subtitle': {
    en: 'Connect with thousands of cybersecurity professionals worldwide',
    ar: 'تواصل مع آلاف محترفي الأمن السيبراني حول العالم',
    darija: 'تواصل مع آلاف ديال المحترفين فالعالم كامل',
    fr: 'Connectez-vous avec des milliers de professionnels de la cybersécurité',
    es: 'Conéctate con miles de profesionales de ciberseguridad en todo el mundo',
    de: 'Verbinden Sie sich mit Tausenden von Cybersicherheitsexperten weltweit',
  },
  // Footer
  'footer.rights': {
    en: 'All rights reserved',
    ar: 'جميع الحقوق محفوظة',
    darija: 'كاع الحقوق محفوظة',
    fr: 'Tous droits réservés',
    es: 'Todos los derechos reservados',
    de: 'Alle Rechte vorbehalten',
  },
  'footer.tagline': {
    en: 'Securing the digital world, one hack at a time',
    ar: 'نؤمن العالم الرقمي، اختراق تلو الآخر',
    darija: 'كنأمنو العالم الرقمي، هاك بهاك',
    fr: 'Sécuriser le monde numérique, un hack à la fois',
    es: 'Asegurando el mundo digital, un hack a la vez',
    de: 'Die digitale Welt sichern, ein Hack nach dem anderen',
  },
  // Time
  'time.morocco': {
    en: 'Morocco Time',
    ar: 'توقيت المغرب',
    darija: 'الوقت ديال المغرب',
    fr: 'Heure du Maroc',
    es: 'Hora de Marruecos',
    de: 'Marokko Zeit',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const isRTL = language === 'ar' || language === 'darija';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      <div dir={isRTL ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const languageNames: Record<Language, string> = {
  en: 'English',
  ar: 'العربية',
  darija: 'الدارجة',
  fr: 'Français',
  es: 'Español',
  de: 'Deutsch',
};
