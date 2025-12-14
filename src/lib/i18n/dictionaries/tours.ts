import type { Locale } from "../config"

export interface ToursDictionary {
  hero: {
    location: string
    title: string
    subtitle: string
  }
  intro: {
    badge: string
    title: string
    titleItalic: string
    description: string
  }
  search: {
    placeholder: string
    filters: {
      all: string
      adventure: string
      cultural: string
      nature: string
    }
  }
  card: {
    featured: string
    perPerson: string
    day: string
    days: string
    hour: string
    hours: string
    book: string
    viewDetails: string
  }
  empty: {
    noResults: string
    error: string
    retry: string
  }
  cta: {
    title: string
    description: string
    button: string
  }
}

const toursDictionaries: Record<Locale, ToursDictionary> = {
  es: {
    hero: {
      location: "Perú, Sudamérica",
      title: "Descubre Experiencias Únicas",
      subtitle: "Tours diseñados para crear recuerdos inolvidables",
    },
    intro: {
      badge: "Nuestros Tours",
      title: "Aventuras",
      titleItalic: "Extraordinarias",
      description:
        "Explora los destinos más impresionantes de Perú con nuestros tours cuidadosamente diseñados para brindarte experiencias auténticas.",
    },
    search: {
      placeholder: "Buscar tours...",
      filters: {
        all: "Todos",
        adventure: "Aventura",
        cultural: "Cultural",
        nature: "Naturaleza",
      },
    },
    card: {
      featured: "Destacado",
      perPerson: "por persona",
      day: "día",
      days: "días",
      hour: "hora",
      hours: "horas",
      book: "Reservar",
      viewDetails: "Ver Detalles",
    },
    empty: {
      noResults: "No se encontraron tours",
      error: "Error al cargar los tours",
      retry: "Reintentar",
    },
    cta: {
      title: "¿Listo para tu próxima aventura?",
      description: "Contáctanos hoy y comienza a planificar el viaje de tus sueños.",
      button: "Contáctanos",
    },
  },
  en: {
    hero: {
      location: "Peru, South America",
      title: "Discover Unique Experiences",
      subtitle: "Tours designed to create unforgettable memories",
    },
    intro: {
      badge: "Our Tours",
      title: "Extraordinary",
      titleItalic: "Adventures",
      description:
        "Explore Peru's most impressive destinations with our carefully designed tours to provide you with authentic experiences.",
    },
    search: {
      placeholder: "Search tours...",
      filters: {
        all: "All",
        adventure: "Adventure",
        cultural: "Cultural",
        nature: "Nature",
      },
    },
    card: {
      featured: "Featured",
      perPerson: "per person",
      day: "day",
      days: "days",
      hour: "hour",
      hours: "hours",
      book: "Book Now",
      viewDetails: "View Details",
    },
    empty: {
      noResults: "No tours found",
      error: "Error loading tours",
      retry: "Retry",
    },
    cta: {
      title: "Ready for your next adventure?",
      description: "Contact us today and start planning your dream trip.",
      button: "Contact Us",
    },
  },
  fr: {
    hero: {
      location: "Pérou, Amérique du Sud",
      title: "Découvrez des Expériences Uniques",
      subtitle: "Des tours conçus pour créer des souvenirs inoubliables",
    },
    intro: {
      badge: "Nos Tours",
      title: "Aventures",
      titleItalic: "Extraordinaires",
      description: "Explorez les destinations les plus impressionnantes du Pérou avec nos tours soigneusement conçus.",
    },
    search: {
      placeholder: "Rechercher des tours...",
      filters: {
        all: "Tous",
        adventure: "Aventure",
        cultural: "Culturel",
        nature: "Nature",
      },
    },
    card: {
      featured: "En Vedette",
      perPerson: "par personne",
      day: "jour",
      days: "jours",
      hour: "heure",
      hours: "heures",
      book: "Réserver",
      viewDetails: "Voir Détails",
    },
    empty: {
      noResults: "Aucun tour trouvé",
      error: "Erreur lors du chargement",
      retry: "Réessayer",
    },
    cta: {
      title: "Prêt pour votre prochaine aventure?",
      description: "Contactez-nous aujourd'hui et commencez à planifier votre voyage de rêve.",
      button: "Contactez-nous",
    },
  },
  it: {
    hero: {
      location: "Perù, Sud America",
      title: "Scopri Esperienze Uniche",
      subtitle: "Tour progettati per creare ricordi indimenticabili",
    },
    intro: {
      badge: "I Nostri Tour",
      title: "Avventure",
      titleItalic: "Straordinarie",
      description: "Esplora le destinazioni più impressionanti del Perù con i nostri tour accuratamente progettati.",
    },
    search: {
      placeholder: "Cerca tour...",
      filters: {
        all: "Tutti",
        adventure: "Avventura",
        cultural: "Culturale",
        nature: "Natura",
      },
    },
    card: {
      featured: "In Evidenza",
      perPerson: "a persona",
      day: "giorno",
      days: "giorni",
      hour: "ora",
      hours: "ore",
      book: "Prenota",
      viewDetails: "Vedi Dettagli",
    },
    empty: {
      noResults: "Nessun tour trovato",
      error: "Errore nel caricamento",
      retry: "Riprova",
    },
    cta: {
      title: "Pronto per la tua prossima avventura?",
      description: "Contattaci oggi e inizia a pianificare il viaggio dei tuoi sogni.",
      button: "Contattaci",
    },
  },
  de: {
    hero: {
      location: "Peru, Südamerika",
      title: "Entdecken Sie Einzigartige Erlebnisse",
      subtitle: "Touren, die unvergessliche Erinnerungen schaffen",
    },
    intro: {
      badge: "Unsere Touren",
      title: "Außergewöhnliche",
      titleItalic: "Abenteuer",
      description: "Erkunden Sie die beeindruckendsten Reiseziele Perus mit unseren sorgfältig gestalteten Touren.",
    },
    search: {
      placeholder: "Touren suchen...",
      filters: {
        all: "Alle",
        adventure: "Abenteuer",
        cultural: "Kulturell",
        nature: "Natur",
      },
    },
    card: {
      featured: "Empfohlen",
      perPerson: "pro Person",
      day: "Tag",
      days: "Tage",
      hour: "Stunde",
      hours: "Stunden",
      book: "Buchen",
      viewDetails: "Details Ansehen",
    },
    empty: {
      noResults: "Keine Touren gefunden",
      error: "Fehler beim Laden",
      retry: "Erneut Versuchen",
    },
    cta: {
      title: "Bereit für Ihr nächstes Abenteuer?",
      description: "Kontaktieren Sie uns heute und beginnen Sie mit der Planung Ihrer Traumreise.",
      button: "Kontaktieren Sie Uns",
    },
  },
  pt: {
    hero: {
      location: "Peru, América do Sul",
      title: "Descubra Experiências Únicas",
      subtitle: "Tours projetados para criar memórias inesquecíveis",
    },
    intro: {
      badge: "Nossos Tours",
      title: "Aventuras",
      titleItalic: "Extraordinárias",
      description: "Explore os destinos mais impressionantes do Peru com nossos tours cuidadosamente projetados.",
    },
    search: {
      placeholder: "Buscar tours...",
      filters: {
        all: "Todos",
        adventure: "Aventura",
        cultural: "Cultural",
        nature: "Natureza",
      },
    },
    card: {
      featured: "Destaque",
      perPerson: "por pessoa",
      day: "dia",
      days: "dias",
      hour: "hora",
      hours: "horas",
      book: "Reservar",
      viewDetails: "Ver Detalhes",
    },
    empty: {
      noResults: "Nenhum tour encontrado",
      error: "Erro ao carregar",
      retry: "Tentar Novamente",
    },
    cta: {
      title: "Pronto para sua próxima aventura?",
      description: "Entre em contato hoje e comece a planejar a viagem dos seus sonhos.",
      button: "Entre em Contato",
    },
  },
  zh: {
    hero: {
      location: "秘鲁，南美洲",
      title: "探索独特体验",
      subtitle: "精心设计的旅游，创造难忘的回忆",
    },
    intro: {
      badge: "我们的旅游",
      title: "非凡",
      titleItalic: "冒险",
      description: "通过我们精心设计的旅游探索秘鲁最令人印象深刻的目的地。",
    },
    search: {
      placeholder: "搜索旅游...",
      filters: {
        all: "全部",
        adventure: "冒险",
        cultural: "文化",
        nature: "自然",
      },
    },
    card: {
      featured: "精选",
      perPerson: "每人",
      day: "天",
      days: "天",
      hour: "小时",
      hours: "小时",
      book: "预订",
      viewDetails: "查看详情",
    },
    empty: {
      noResults: "未找到旅游",
      error: "加载错误",
      retry: "重试",
    },
    cta: {
      title: "准备好下一次冒险了吗？",
      description: "今天就联系我们，开始规划您的梦想之旅。",
      button: "联系我们",
    },
  },
  ja: {
    hero: {
      location: "ペルー、南米",
      title: "ユニークな体験を発見",
      subtitle: "忘れられない思い出を作るツアー",
    },
    intro: {
      badge: "私たちのツアー",
      title: "特別な",
      titleItalic: "冒険",
      description: "丁寧に設計されたツアーでペルーの最も印象的な目的地を探索してください。",
    },
    search: {
      placeholder: "ツアーを検索...",
      filters: {
        all: "すべて",
        adventure: "アドベンチャー",
        cultural: "文化",
        nature: "自然",
      },
    },
    card: {
      featured: "おすすめ",
      perPerson: "一人あたり",
      day: "日",
      days: "日間",
      hour: "時間",
      hours: "時間",
      book: "予約",
      viewDetails: "詳細を見る",
    },
    empty: {
      noResults: "ツアーが見つかりません",
      error: "読み込みエラー",
      retry: "再試行",
    },
    cta: {
      title: "次の冒険の準備はできていますか？",
      description: "今日お問い合わせいただき、夢の旅行の計画を始めましょう。",
      button: "お問い合わせ",
    },
  },
  ru: {
    hero: {
      location: "Перу, Южная Америка",
      title: "Откройте Уникальный Опыт",
      subtitle: "Туры, созданные для незабываемых воспоминаний",
    },
    intro: {
      badge: "Наши Туры",
      title: "Необыкновенные",
      titleItalic: "Приключения",
      description: "Исследуйте самые впечатляющие направления Перу с нашими тщательно разработанными турами.",
    },
    search: {
      placeholder: "Поиск туров...",
      filters: {
        all: "Все",
        adventure: "Приключения",
        cultural: "Культурные",
        nature: "Природа",
      },
    },
    card: {
      featured: "Рекомендуем",
      perPerson: "с человека",
      day: "день",
      days: "дней",
      hour: "час",
      hours: "часов",
      book: "Забронировать",
      viewDetails: "Подробнее",
    },
    empty: {
      noResults: "Туры не найдены",
      error: "Ошибка загрузки",
      retry: "Повторить",
    },
    cta: {
      title: "Готовы к следующему приключению?",
      description: "Свяжитесь с нами сегодня и начните планировать путешествие своей мечты.",
      button: "Связаться с Нами",
    },
  },
}

export function getToursDictionary(locale: Locale): ToursDictionary {
  return toursDictionaries[locale] || toursDictionaries.es
}
