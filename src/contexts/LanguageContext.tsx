import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar' | 'darija' | 'fr' | 'es' | 'de';

interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

export const translations: Translations = {
  // Navigation
  'nav.home': {
    en: 'Home', ar: 'الرئيسية', darija: 'الصفحة الرئيسية', fr: 'Accueil', es: 'Inicio', de: 'Startseite',
  },
  'nav.puzzles': {
    en: 'Puzzles', ar: 'الألغاز', darija: 'الپازلز', fr: 'Puzzles', es: 'Puzzles', de: 'Rätsel',
  },
  'nav.aiChat': {
    en: 'AI Chat', ar: 'محادثة الذكاء', darija: 'الشات ديال AI', fr: 'Chat IA', es: 'Chat IA', de: 'KI-Chat',
  },
  'nav.feed': {
    en: 'Feed', ar: 'المنشورات', darija: 'الفيد', fr: 'Fil', es: 'Feed', de: 'Feed',
  },
  'nav.messages': {
    en: 'Messages', ar: 'الرسائل', darija: 'الميساجات', fr: 'Messages', es: 'Mensajes', de: 'Nachrichten',
  },
  'nav.profile': {
    en: 'Profile', ar: 'الملف الشخصي', darija: 'البروفايل', fr: 'Profil', es: 'Perfil', de: 'Profil',
  },
  'nav.community': {
    en: 'Community', ar: 'المجتمع', darija: 'الكوميونيتي', fr: 'Communauté', es: 'Comunidad', de: 'Gemeinschaft',
  },
  'nav.roles': {
    en: 'Cyber Roles', ar: 'أدوار الأمن', darija: 'الوظائف ديال السيبر', fr: 'Rôles Cyber', es: 'Roles Cyber', de: 'Cyber-Rollen',
  },
  'nav.resources': {
    en: 'Resources', ar: 'الموارد', darija: 'الريسورسيز', fr: 'Ressources', es: 'Recursos', de: 'Ressourcen',
  },
  'nav.about': {
    en: 'About', ar: 'حول', darija: 'على IWALA99', fr: 'À propos', es: 'Acerca de', de: 'Über uns',
  },

  // Hero Section
  'hero.welcome': {
    en: 'Welcome to', ar: 'مرحباً بك في', darija: 'مرحبا بيك ف', fr: 'Bienvenue à', es: 'Bienvenido a', de: 'Willkommen bei',
  },
  'hero.tagline': {
    en: 'Where Elite Hackers & Cybersecurity Professionals Unite',
    ar: 'حيث يتحد نخبة المخترقين ومحترفي الأمن السيبراني',
    darija: 'فين كيجتمعو أحسن الهاكرز و محترفين السيبر سيكيوريتي',
    fr: 'Où les hackers d\'élite et les professionnels de la cybersécurité s\'unissent',
    es: 'Donde se unen los hackers de élite y los profesionales de ciberseguridad',
    de: 'Wo sich Elite-Hacker und Cybersicherheitsexperten vereinen',
  },
  'hero.subtitle': {
    en: 'Intelligence. Precision. Excellence.',
    ar: 'ذكاء. دقة. تميز.',
    darija: 'الذكاء. الدقة. التميز.',
    fr: 'Intelligence. Précision. Excellence.',
    es: 'Inteligencia. Precisión. Excelencia.',
    de: 'Intelligenz. Präzision. Exzellenz.',
  },
  'hero.enterMaze': {
    en: 'Enter the Maze', ar: 'ادخل المتاهة', darija: 'دخل للمتاهة', fr: 'Entrer dans le labyrinthe', es: 'Entrar al laberinto', de: 'Betrete das Labyrinth',
  },
  'hero.join': {
    en: 'Join the Network', ar: 'انضم للشبكة', darija: 'دخل معانا', fr: 'Rejoindre le réseau', es: 'Únete a la red', de: 'Dem Netzwerk beitreten',
  },
  'hero.explore': {
    en: 'Explore Roles', ar: 'استكشف الأدوار', darija: 'شوف الوظائف', fr: 'Explorer les rôles', es: 'Explorar roles', de: 'Rollen erkunden',
  },

  // Index / Home
  'home.enterMaze': {
    en: 'ENTER THE MAZE', ar: 'ادخل المتاهة', darija: 'دخل للمتاهة', fr: 'ENTRER DANS LE LABYRINTHE', es: 'ENTRAR AL LABERINTO', de: 'BETRETE DAS LABYRINTH',
  },
  'home.mazeDesc': {
    en: 'Solve puzzles. Prove your worth. Only the exceptional will find what lies at the end.',
    ar: 'حل الألغاز. أثبت قدرتك. فقط المتميزون سيجدون ما ينتظرهم في النهاية.',
    darija: 'حل الپازلز. ثبت راسك. غير اللي عندهم المستوى غادي يلقاو شنو كاين فالآخر.',
    fr: 'Résolvez les puzzles. Prouvez votre valeur. Seuls les exceptionnels trouveront ce qui attend.',
    es: 'Resuelve puzzles. Demuestra tu valía. Solo los excepcionales encontrarán lo que hay al final.',
    de: 'Löse Rätsel. Beweise deinen Wert. Nur die Außergewöhnlichen finden, was am Ende wartet.',
  },
  'home.startChallenge': {
    en: 'Start the Challenge', ar: 'ابدأ التحدي', darija: 'بدا التحدي', fr: 'Commencer le défi', es: 'Iniciar el desafío', de: 'Challenge starten',
  },
  'home.networkFeed': {
    en: 'NETWORK FEED', ar: 'منشورات الشبكة', darija: 'الفيد ديال الشبكة', fr: 'FIL DU RÉSEAU', es: 'FEED DE LA RED', de: 'NETZWERK-FEED',
  },
  'home.feedDesc': {
    en: 'Connect with the community. Share knowledge. Stay informed.',
    ar: 'تواصل مع المجتمع. شارك المعرفة. ابق مطلعاً.',
    darija: 'تواصل مع الكوميونيتي. شارك المعرفة ديالك. بقا فالصورة.',
    fr: 'Connectez-vous à la communauté. Partagez vos connaissances. Restez informé.',
    es: 'Conéctate con la comunidad. Comparte conocimiento. Mantente informado.',
    de: 'Verbinde dich mit der Community. Teile Wissen. Bleibe informiert.',
  },
  'home.joinNetwork': {
    en: 'Join the network to access the feed',
    ar: 'انضم للشبكة للوصول إلى المنشورات',
    darija: 'دخل للشبكة باش تشوف الفيد',
    fr: 'Rejoignez le réseau pour accéder au fil',
    es: 'Únete a la red para acceder al feed',
    de: 'Tritt dem Netzwerk bei, um den Feed zu sehen',
  },
  'home.joinNow': {
    en: 'JOIN NOW', ar: 'انضم الآن', darija: 'سجل دابا', fr: 'REJOINDRE', es: 'UNIRSE AHORA', de: 'JETZT BEITRETEN',
  },

  // Feed page
  'feed.title': {
    en: 'Cyber Feed', ar: 'منشورات السيبر', darija: 'الفيد ديال السيبر', fr: 'Fil Cyber', es: 'Feed Cyber', de: 'Cyber-Feed',
  },
  'feed.subtitle': {
    en: 'Share intel, tools, and connect with the network',
    ar: 'شارك المعلومات والأدوات وتواصل مع الشبكة',
    darija: 'شارك المعلومات و الأدوات و تواصل مع الشبكة',
    fr: 'Partagez des infos, des outils et connectez-vous au réseau',
    es: 'Comparte inteligencia, herramientas y conéctate con la red',
    de: 'Teile Infos, Tools und verbinde dich mit dem Netzwerk',
  },

  // Messages page
  'messages.title': {
    en: 'Messages', ar: 'الرسائل', darija: 'الميساجات', fr: 'Messages', es: 'Mensajes', de: 'Nachrichten',
  },
  'messages.selectConversation': {
    en: 'Select a conversation', ar: 'اختر محادثة', darija: 'ختار شي محادثة', fr: 'Sélectionnez une conversation', es: 'Selecciona una conversación', de: 'Wähle eine Konversation',
  },
  'messages.searchUser': {
    en: 'Or search for a user to start chatting',
    ar: 'أو ابحث عن مستخدم لبدء المحادثة',
    darija: 'ولا قلب على شي واحد باش تبدا تهضر معاه',
    fr: 'Ou recherchez un utilisateur pour commencer à discuter',
    es: 'O busca un usuario para empezar a chatear',
    de: 'Oder suche nach einem Benutzer, um zu chatten',
  },
  'messages.back': {
    en: 'Back', ar: 'رجوع', darija: 'رجع', fr: 'Retour', es: 'Volver', de: 'Zurück',
  },

  // Auth page
  'auth.accessNetwork': {
    en: 'Access the network', ar: 'ادخل للشبكة', darija: 'دخل للشبكة', fr: 'Accéder au réseau', es: 'Acceder a la red', de: 'Netzwerk betreten',
  },
  'auth.joinNetwork': {
    en: 'Join the network', ar: 'انضم للشبكة', darija: 'سجل فالشبكة', fr: 'Rejoindre le réseau', es: 'Unirse a la red', de: 'Netzwerk beitreten',
  },
  'auth.email': {
    en: 'Email', ar: 'البريد الإلكتروني', darija: 'الإيميل', fr: 'Email', es: 'Correo', de: 'E-Mail',
  },
  'auth.username': {
    en: 'Username (public)', ar: 'اسم المستخدم (عام)', darija: 'اسم المستخدم (عام)', fr: 'Pseudo (public)', es: 'Usuario (público)', de: 'Benutzername (öffentlich)',
  },
  'auth.password': {
    en: 'Password', ar: 'كلمة المرور', darija: 'الباسوورد', fr: 'Mot de passe', es: 'Contraseña', de: 'Passwort',
  },
  'auth.selectRoles': {
    en: 'Select your role(s)', ar: 'اختر دورك/أدوارك', darija: 'ختار الدور ديالك', fr: 'Choisissez vos rôles', es: 'Selecciona tus roles', de: 'Wähle deine Rolle(n)',
  },
  'auth.signIn': {
    en: 'Sign In', ar: 'تسجيل الدخول', darija: 'كونيكتا', fr: 'Se connecter', es: 'Iniciar sesión', de: 'Anmelden',
  },
  'auth.signUp': {
    en: 'Create Account', ar: 'إنشاء حساب', darija: 'خلق حساب', fr: 'Créer un compte', es: 'Crear cuenta', de: 'Konto erstellen',
  },
  'auth.noAccount': {
    en: "Don't have an account? Sign up", ar: 'ليس لديك حساب؟ سجل الآن', darija: 'ما عندكش حساب؟ سجل دابا', fr: "Pas de compte ? S'inscrire", es: '¿No tienes cuenta? Regístrate', de: 'Kein Konto? Registrieren',
  },
  'auth.hasAccount': {
    en: 'Already a member? Sign in', ar: 'لديك حساب؟ سجل الدخول', darija: 'عندك حساب؟ كونيكتا', fr: 'Déjà membre ? Se connecter', es: '¿Ya tienes cuenta? Inicia sesión', de: 'Bereits Mitglied? Anmelden',
  },
  'auth.backHome': {
    en: '← Back to home', ar: '← الرجوع للرئيسية', darija: '← رجع للصفحة الرئيسية', fr: '← Retour à l\'accueil', es: '← Volver al inicio', de: '← Zurück zur Startseite',
  },

  // CyberChat
  'chat.title': {
    en: 'CyberGuard AI', ar: 'حارس السيبر AI', darija: 'CyberGuard AI', fr: 'CyberGuard IA', es: 'CyberGuard IA', de: 'CyberGuard KI',
  },
  'chat.subtitle': {
    en: 'Cybersecurity assistant & CTF mentor',
    ar: 'مساعد الأمن السيبراني ومرشد CTF',
    darija: 'المساعد ديال السيبر سيكيوريتي و مرشد CTF',
    fr: 'Assistant cybersécurité & mentor CTF',
    es: 'Asistente de ciberseguridad y mentor CTF',
    de: 'Cybersicherheitsassistent & CTF-Mentor',
  },
  'chat.welcome': {
    en: 'Welcome, Operative.', ar: 'مرحباً أيها العميل.', darija: 'مرحبا بيك يا العميل.', fr: 'Bienvenue, Opérateur.', es: 'Bienvenido, Operativo.', de: 'Willkommen, Agent.',
  },
  'chat.welcomeDesc': {
    en: 'Ask about cybersecurity, CTF hints, tools, or career guidance.',
    ar: 'اسأل عن الأمن السيبراني أو تلميحات CTF أو الأدوات أو التوجيه المهني.',
    darija: 'سول على السيبر سيكيوريتي، تلميحات CTF، الأدوات، ولا التوجيه المهني.',
    fr: 'Posez des questions sur la cybersécurité, les indices CTF, les outils ou l\'orientation professionnelle.',
    es: 'Pregunta sobre ciberseguridad, pistas CTF, herramientas u orientación profesional.',
    de: 'Frage nach Cybersicherheit, CTF-Hinweisen, Tools oder Karriereberatung.',
  },
  'chat.placeholder': {
    en: 'Ask about cybersecurity, CTF hints, tools...',
    ar: 'اسأل عن الأمن السيبراني، تلميحات CTF...',
    darija: 'سول على السيبر سيكيوريتي، CTF...',
    fr: 'Posez des questions sur la cybersécurité, CTF...',
    es: 'Pregunta sobre ciberseguridad, CTF...',
    de: 'Frage nach Cybersicherheit, CTF...',
  },
  'chat.clearChat': {
    en: 'Clear chat', ar: 'مسح المحادثة', darija: 'مسح الشات', fr: 'Effacer le chat', es: 'Borrar chat', de: 'Chat löschen',
  },

  // Puzzles page
  'puzzles.title': {
    en: 'THE MAZE', ar: 'المتاهة', darija: 'المتاهة', fr: 'LE LABYRINTHE', es: 'EL LABERINTO', de: 'DAS LABYRINTH',
  },
  'puzzles.recruitmentActive': {
    en: 'RECRUITMENT ACTIVE', ar: 'التوظيف نشط', darija: 'التوظيف خدام', fr: 'RECRUTEMENT ACTIF', es: 'RECLUTAMIENTO ACTIVO', de: 'REKRUTIERUNG AKTIV',
  },
  'puzzles.seekIntelligent': {
    en: 'We seek highly intelligent individuals.',
    ar: 'نبحث عن أفراد ذوي ذكاء استثنائي.',
    darija: 'كنقلبو على ناس ذكية بزاف.',
    fr: 'Nous recherchons des individus très intelligents.',
    es: 'Buscamos individuos altamente inteligentes.',
    de: 'Wir suchen hochintelligente Individuen.',
  },
  'puzzles.followPaths': {
    en: 'Follow the paths. Decode the puzzles. Prove your worth.',
    ar: 'اتبع المسارات. فك الألغاز. أثبت جدارتك.',
    darija: 'تبع المسارات. حل الپازلز. ثبت راسك.',
    fr: 'Suivez les chemins. Décodez les puzzles. Prouvez votre valeur.',
    es: 'Sigue los caminos. Descifra los puzzles. Demuestra tu valía.',
    de: 'Folge den Pfaden. Entschlüssle die Rätsel. Beweise deinen Wert.',
  },
  'puzzles.multiplePathsConverge': {
    en: 'Multiple paths converge', ar: 'مسارات متعددة تتقاطع', darija: 'بزاف ديال المسارات كيتلاقاو', fr: 'Les chemins convergent', es: 'Los caminos convergen', de: 'Mehrere Pfade konvergieren',
  },
  'puzzles.onlyWorthy': {
    en: 'Only the worthy proceed', ar: 'فقط المستحقون يتقدمون', darija: 'غير اللي يستاهل كيكمل', fr: 'Seuls les dignes avancent', es: 'Solo los dignos avanzan', de: 'Nur die Würdigen kommen weiter',
  },
  'puzzles.filter': {
    en: 'FILTER', ar: 'تصفية', darija: 'الفيلتر', fr: 'FILTRE', es: 'FILTRO', de: 'FILTER',
  },
  'puzzles.allPaths': {
    en: 'ALL PATHS', ar: 'كل المسارات', darija: 'كاع المسارات', fr: 'TOUS LES CHEMINS', es: 'TODOS LOS CAMINOS', de: 'ALLE PFADE',
  },
  'puzzles.allLevels': {
    en: 'ALL LEVELS', ar: 'كل المستويات', darija: 'كاع المستويات', fr: 'TOUS LES NIVEAUX', es: 'TODOS LOS NIVELES', de: 'ALLE STUFEN',
  },
  'puzzles.mazeAwaits': {
    en: 'The maze awaits its first puzzles.',
    ar: 'المتاهة تنتظر ألغازها الأولى.',
    darija: 'المتاهة كتسنا الپازلز الأولى.',
    fr: 'Le labyrinthe attend ses premiers puzzles.',
    es: 'El laberinto espera sus primeros puzzles.',
    de: 'Das Labyrinth wartet auf seine ersten Rätsel.',
  },
  'puzzles.comingSoon': {
    en: '// COMING SOON', ar: '// قريباً', darija: '// جاي قريب', fr: '// BIENTÔT', es: '// PRÓXIMAMENTE', de: '// KOMMT BALD',
  },
  'puzzles.allPathsConverge': {
    en: 'ALL PATHS CONVERGE', ar: 'كل المسارات تتقاطع', darija: 'كاع المسارات كيتلاقاو', fr: 'TOUS LES CHEMINS CONVERGENT', es: 'TODOS LOS CAMINOS CONVERGEN', de: 'ALLE PFADE KONVERGIEREN',
  },
  'puzzles.finalChallenge': {
    en: 'FINAL CHALLENGE', ar: 'التحدي الأخير', darija: 'التحدي الأخير', fr: 'DÉFI FINAL', es: 'DESAFÍO FINAL', de: 'FINALE HERAUSFORDERUNG',
  },
  'puzzles.insanePuzzles': {
    en: 'INSANE PUZZLES', ar: 'ألغاز مجنونة', darija: 'پازلز مجنونة', fr: 'PUZZLES FOUS', es: 'PUZZLES INSANOS', de: 'WAHNSINN-RÄTSEL',
  },
  'puzzles.omegaClearance': {
    en: '⚠ OMEGA CLEARANCE UNLOCKED', ar: '⚠ تم فتح تصريح أوميغا', darija: '⚠ تصريح أوميغا تحل', fr: '⚠ ACCÈS OMEGA DÉVERROUILLÉ', es: '⚠ ACCESO OMEGA DESBLOQUEADO', de: '⚠ OMEGA-FREIGABE FREIGESCHALTET',
  },
  'puzzles.completeInsane': {
    en: 'Complete all INSANE puzzles\nto unlock the final challenge',
    ar: 'أكمل جميع الألغاز المجنونة\nلفتح التحدي الأخير',
    darija: 'كمل كاع الپازلز المجنونة\nباش تحل التحدي الأخير',
    fr: 'Complétez tous les puzzles FOUS\npour débloquer le défi final',
    es: 'Completa todos los puzzles INSANOS\npara desbloquear el desafío final',
    de: 'Löse alle WAHNSINN-Rätsel\num die finale Herausforderung freizuschalten',
  },
  'puzzles.accessGranted': {
    en: 'ACCESS GRANTED', ar: 'تم منح الوصول', darija: 'الدخول مسموح', fr: 'ACCÈS ACCORDÉ', es: 'ACCESO CONCEDIDO', de: 'ZUGANG GEWÄHRT',
  },
  'puzzles.clearanceGranted': {
    en: 'CLEARANCE GRANTED', ar: 'تم منح التصريح', darija: 'التصريح تعطا', fr: 'AUTORISATION ACCORDÉE', es: 'AUTORIZACIÓN CONCEDIDA', de: 'FREIGABE ERTEILT',
  },
  'puzzles.path': {
    en: 'PATH', ar: 'مسار', darija: 'المسار', fr: 'CHEMIN', es: 'CAMINO', de: 'PFAD',
  },
  'puzzles.solved': {
    en: 'solved', ar: 'محلول', darija: 'محلول', fr: 'résolu', es: 'resuelto', de: 'gelöst',
  },
  'puzzles.puzzle': {
    en: 'puzzle', ar: 'لغز', darija: 'پازل', fr: 'puzzle', es: 'puzzle', de: 'Rätsel',
  },
  'puzzles.puzzles': {
    en: 'puzzles', ar: 'ألغاز', darija: 'پازلز', fr: 'puzzles', es: 'puzzles', de: 'Rätsel',
  },

  // Profile page
  'profile.points': {
    en: 'POINTS', ar: 'نقاط', darija: 'النقاط', fr: 'POINTS', es: 'PUNTOS', de: 'PUNKTE',
  },
  'profile.solved': {
    en: 'SOLVED', ar: 'محلول', darija: 'محلولين', fr: 'RÉSOLUS', es: 'RESUELTOS', de: 'GELÖST',
  },
  'profile.rank': {
    en: 'RANK', ar: 'المرتبة', darija: 'الرانك', fr: 'RANG', es: 'RANGO', de: 'RANG',
  },
  'profile.badges': {
    en: 'Badges', ar: 'الشارات', darija: 'الشارات', fr: 'Badges', es: 'Insignias', de: 'Abzeichen',
  },
  'profile.noBadges': {
    en: 'No badges earned yet', ar: 'لم تحصل على شارات بعد', darija: 'مازال ما ربحتي حتى شارة', fr: 'Aucun badge gagné', es: 'Sin insignias aún', de: 'Noch keine Abzeichen',
  },
  'profile.solvePuzzles': {
    en: 'Solve puzzles to earn badges', ar: 'حل الألغاز للحصول على شارات', darija: 'حل الپازلز باش تربح الشارات', fr: 'Résolvez des puzzles pour gagner des badges', es: 'Resuelve puzzles para ganar insignias', de: 'Löse Rätsel, um Abzeichen zu verdienen',
  },
  'profile.editBio': {
    en: 'Click edit to add a bio...', ar: 'انقر تعديل لإضافة نبذة...', darija: 'كليكي على تعديل باش تزيد البيو...', fr: 'Cliquez modifier pour ajouter une bio...', es: 'Haz clic en editar para añadir una bio...', de: 'Klicke bearbeiten, um eine Bio hinzuzufügen...',
  },
  'profile.noBio': {
    en: 'No bio yet', ar: 'لا توجد نبذة بعد', darija: 'مازال ما كاين بيو', fr: 'Pas de bio', es: 'Sin bio aún', de: 'Noch keine Bio',
  },
  'profile.edit': {
    en: 'Edit', ar: 'تعديل', darija: 'تعديل', fr: 'Modifier', es: 'Editar', de: 'Bearbeiten',
  },
  'profile.save': {
    en: 'Save', ar: 'حفظ', darija: 'حفظ', fr: 'Enregistrer', es: 'Guardar', de: 'Speichern',
  },
  'profile.cancel': {
    en: 'Cancel', ar: 'إلغاء', darija: 'إلغاء', fr: 'Annuler', es: 'Cancelar', de: 'Abbrechen',
  },
  'profile.message': {
    en: 'Message', ar: 'رسالة', darija: 'راسل', fr: 'Message', es: 'Mensaje', de: 'Nachricht',
  },
  'profile.joined': {
    en: 'Joined', ar: 'انضم', darija: 'دخل', fr: 'Inscrit', es: 'Se unió', de: 'Beigetreten',
  },
  'profile.writeBio': {
    en: 'Write something about yourself...', ar: 'اكتب شيئاً عن نفسك...', darija: 'كتب شي حاجة عليك...', fr: 'Écrivez quelque chose sur vous...', es: 'Escribe algo sobre ti...', de: 'Schreibe etwas über dich...',
  },

  // Roles Section
  'roles.title': {
    en: 'Cybersecurity Roles', ar: 'أدوار الأمن السيبراني', darija: 'الوظائف ديال السيبر سيكيوريتي', fr: 'Rôles en Cybersécurité', es: 'Roles de Ciberseguridad', de: 'Cybersicherheitsrollen',
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
    en: 'Join Our Elite Network', ar: 'انضم لشبكتنا النخبوية', darija: 'دخل معانا فالنتوورك', fr: 'Rejoignez notre réseau d\'élite', es: 'Únete a nuestra red de élite', de: 'Treten Sie unserem Elite-Netzwerk bei',
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
    en: 'All rights reserved', ar: 'جميع الحقوق محفوظة', darija: 'كاع الحقوق محفوظة', fr: 'Tous droits réservés', es: 'Todos los derechos reservados', de: 'Alle Rechte vorbehalten',
  },
  'footer.tagline': {
    en: 'Securing the digital world, one hack at a time',
    ar: 'نؤمن العالم الرقمي، اختراق تلو الآخر',
    darija: 'كنأمنو العالم الرقمي، هاك بهاك',
    fr: 'Sécuriser le monde numérique, un hack à la fois',
    es: 'Asegurando el mundo digital, un hack a la vez',
    de: 'Die digitale Welt sichern, ein Hack nach dem anderen',
  },
  'footer.joinDiscord': {
    en: 'Join Discord', ar: 'انضم لديسكورد', darija: 'دخل لديسكورد', fr: 'Rejoindre Discord', es: 'Unirse a Discord', de: 'Discord beitreten',
  },

  // Time
  'time.morocco': {
    en: 'Morocco Time', ar: 'توقيت المغرب', darija: 'الوقت ديال المغرب', fr: 'Heure du Maroc', es: 'Hora de Marruecos', de: 'Marokko Zeit',
  },

  // Common
  'common.loading': {
    en: 'Loading...', ar: 'جاري التحميل...', darija: 'كيتشارجا...', fr: 'Chargement...', es: 'Cargando...', de: 'Laden...',
  },
  'common.error': {
    en: 'An error occurred', ar: 'حدث خطأ', darija: 'وقع مشكل', fr: 'Une erreur est survenue', es: 'Ocurrió un error', de: 'Ein Fehler ist aufgetreten',
  },

  // Security Banner
  'security.secured': {
    en: 'SECURED', ar: 'مؤمّن', darija: 'مأمّن', fr: 'SÉCURISÉ', es: 'SEGURO', de: 'GESICHERT',
  },
  'security.enabled': {
    en: 'ENABLED', ar: 'مفعّل', darija: 'خدّام', fr: 'ACTIVÉ', es: 'ACTIVADO', de: 'AKTIVIERT',
  },
  'security.protected': {
    en: 'PROTECTED', ar: 'محمي', darija: 'محمي', fr: 'PROTÉGÉ', es: 'PROTEGIDO', de: 'GESCHÜTZT',
  },
  'security.realtime': {
    en: 'REALTIME', ar: 'مباشر', darija: 'مباشر', fr: 'TEMPS RÉEL', es: 'TIEMPO REAL', de: 'ECHTZEIT',
  },

  // Suggested chat prompts
  'chat.prompt1': {
    en: 'How do I start with CTF?', ar: 'كيف أبدأ مع CTF؟', darija: 'كيفاش نبدا مع CTF؟', fr: 'Comment commencer avec les CTF ?', es: '¿Cómo empiezo con CTF?', de: 'Wie fange ich mit CTF an?',
  },
  'chat.prompt2': {
    en: 'Explain SQL injection', ar: 'اشرح هجوم حقن SQL', darija: 'شرح SQL injection', fr: 'Expliquer l\'injection SQL', es: 'Explicar inyección SQL', de: 'SQL-Injection erklären',
  },
  'chat.prompt3': {
    en: 'nmap scanning tips', ar: 'نصائح فحص nmap', darija: 'نصائح ديال nmap scanning', fr: 'Conseils de scan nmap', es: 'Consejos de escaneo nmap', de: 'nmap Scan-Tipps',
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
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('iwala99-lang');
    return (stored as Language) || 'en';
  });

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const isRTL = language === 'ar' || language === 'darija';

  useEffect(() => {
    localStorage.setItem('iwala99-lang', language);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language === 'darija' ? 'ar-MA' : language;
  }, [language, isRTL]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'font-sans' : ''}>
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
