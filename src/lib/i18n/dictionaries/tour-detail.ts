import type { Locale } from "../config"

export interface TourDetailDictionary {
  breadcrumb: {
    home: string
    tours: string
  }
  hero: {
    duration: string
    day: string
    days: string
    hour: string
    hours: string
    rating: string
    reviews: string
    location: string
  }
  booking: {
    title: string
    priceFrom: string
    perPerson: string
    originalPrice: string
    selectDate: string
    travelers: string
    adults: string
    children: string
    addToCart: string
    bookNow: string
    instantConfirmation: string
    securePayment: string
    changePolicy: string
    bestPrice: string
    availableDates: string
    bookingInfo: string
    minPeople: string
    maxPeople: string
    cutoff: string
    before: string
    alwaysAvailable: string
    noAvailableDates: string
  }
  sections: {
    overview: string
    itinerary: string
    included: string
    excluded: string
    preparation: string
    policies: string
    noInfo: string
  }
  overview: {
    highlights: string
    difficulty: string
    difficultyLevels: {
      easy: string
      medium: string
      hard: string
    }
    minAge: string
    years: string
    capacity: string
    people: string
    meetingPoint: string
    startTime: string
    languages: string
    included: string
  }
  itinerary: {
    dayLabel: string
    activities: string
    meals: {
      breakfast: string
      lunch: string
      dinner: string
    }
    hotelNight: string
  }
  policies: {
    cancellation: string
    refund: string
    changes: string
    contactUs: string
  }
  cta: {
    title: string
    description: string
    button: string
    bookNow: string
  }
  cart: {
    added: string
    viewCart: string
    continueShopping: string
  }
}

const tourDetailDictionaries: Record<Locale, TourDetailDictionary> = {
  es: {
    breadcrumb: {
      home: "Inicio",
      tours: "Tours",
    },
    hero: {
      duration: "Duración",
      day: "Día",
      days: "Días",
      hour: "Hora",
      hours: "Horas",
      rating: "Calificación",
      reviews: "reseñas",
      location: "Ubicación",
    },
    booking: {
      title: "Reserva Tu Experiencia",
      priceFrom: "Desde",
      perPerson: "por persona",
      originalPrice: "Precio original",
      selectDate: "Seleccionar fecha",
      travelers: "Viajeros",
      adults: "Adultos",
      children: "Niños",
      addToCart: "Agregar al Carrito",
      bookNow: "Reservar Ahora",
      instantConfirmation: "Confirmación instantánea",
      securePayment: "Pagos seguros encriptados",
      changePolicy: "Modificación de fechas disponible",
      bestPrice: "Mejor precio garantizado",
      availableDates: "Fechas Disponibles",
      bookingInfo: "Información de Reserva",
      minPeople: "Mínimo de personas",
      maxPeople: "Máximo de personas",
      cutoff: "Límite de reserva",
      before: "antes del inicio",
      alwaysAvailable: "Disponible todos los días",
      noAvailableDates: "No hay fechas disponibles actualmente",
    },
    sections: {
      overview: "Descripción",
      itinerary: "Itinerario",
      included: "Incluye",
      excluded: "No Incluye",
      preparation: "Qué Llevar",
      policies: "Políticas",
      noInfo: "No hay información disponible",
    },
    overview: {
      highlights: "Destacados",
      difficulty: "Dificultad",
      difficultyLevels: {
        easy: "Fácil",
        medium: "Moderado",
        hard: "Difícil",
      },
      minAge: "Edad mínima",
      years: "años",
      capacity: "Capacidad",
      people: "personas",
      meetingPoint: "Punto de encuentro",
      startTime: "Hora de inicio",
      languages: "Idiomas",
      included: "Incluido",
    },
    itinerary: {
      dayLabel: "Día",
      activities: "Actividades",
      meals: {
        breakfast: "Desayuno",
        lunch: "Almuerzo",
        dinner: "Cena",
      },
      hotelNight: "Noche en hotel",
    },
    policies: {
      cancellation: "Política de cancelación",
      refund: "Política de reembolso",
      changes: "Política de cambios",
      contactUs: "Contáctanos para más información sobre políticas",
    },
    cta: {
      title: "¿Tienes Preguntas?",
      description: "Nuestro equipo está disponible 24/7 para ayudarte a planificar tu aventura perfecta.",
      button: "Contactar Ahora",
      bookNow: "Reservar Ahora", // Added bookNow property to CTA section
    },
    cart: {
      added: "Agregado al carrito",
      viewCart: "Ver Carrito",
      continueShopping: "Continuar Comprando",
    },
  },
  en: {
    breadcrumb: {
      home: "Home",
      tours: "Tours",
    },
    hero: {
      duration: "Duration",
      day: "Day",
      days: "Days",
      hour: "Hour",
      hours: "Hours",
      rating: "Rating",
      reviews: "reviews",
      location: "Location",
    },
    booking: {
      title: "Book Your Experience",
      priceFrom: "From",
      perPerson: "per person",
      originalPrice: "Original price",
      selectDate: "Select date",
      travelers: "Travelers",
      adults: "Adults",
      children: "Children",
      addToCart: "Add to Cart",
      bookNow: "Book Now",
      instantConfirmation: "Instant confirmation",
      securePayment: "Secure encrypted payments",
      changePolicy: "Date modification available",
      bestPrice: "Best price guaranteed",
      availableDates: "Available Dates",
      bookingInfo: "Booking Information",
      minPeople: "Minimum people",
      maxPeople: "Maximum people",
      cutoff: "Booking cutoff",
      before: "before start",
      alwaysAvailable: "Available every day",
      noAvailableDates: "No dates currently available",
    },
    sections: {
      overview: "Overview",
      itinerary: "Itinerary",
      included: "Included",
      excluded: "Not Included",
      preparation: "What to Bring",
      policies: "Policies",
      noInfo: "No information available",
    },
    overview: {
      highlights: "Highlights",
      difficulty: "Difficulty",
      difficultyLevels: {
        easy: "Easy",
        medium: "Moderate",
        hard: "Challenging",
      },
      minAge: "Minimum age",
      years: "years",
      capacity: "Capacity",
      people: "people",
      meetingPoint: "Meeting point",
      startTime: "Start time",
      languages: "Languages",
      included: "Included",
    },
    itinerary: {
      dayLabel: "Day",
      activities: "Activities",
      meals: {
        breakfast: "Breakfast",
        lunch: "Lunch",
        dinner: "Dinner",
      },
      hotelNight: "Hotel night",
    },
    policies: {
      cancellation: "Cancellation policy",
      refund: "Refund policy",
      changes: "Change policy",
      contactUs: "Contact us for more information about policies",
    },
    cta: {
      title: "Have Questions?",
      description: "Our team is available 24/7 to help you plan your perfect adventure.",
      button: "Contact Now",
      bookNow: "Book Now", // Added bookNow property to CTA section
    },
    cart: {
      added: "Added to cart",
      viewCart: "View Cart",
      continueShopping: "Continue Shopping",
    },
  },
  fr: {
    breadcrumb: { home: "Accueil", tours: "Tours" },
    hero: {
      duration: "Durée",
      day: "Jour",
      days: "Jours",
      hour: "Heure",
      hours: "Heures",
      rating: "Note",
      reviews: "avis",
      location: "Lieu",
    },
    booking: {
      title: "Réservez Votre Expérience",
      priceFrom: "À partir de",
      perPerson: "par personne",
      originalPrice: "Prix original",
      selectDate: "Sélectionner la date",
      travelers: "Voyageurs",
      adults: "Adultes",
      children: "Enfants",
      addToCart: "Ajouter au Panier",
      bookNow: "Réserver Maintenant",
      instantConfirmation: "Confirmation instantanée",
      securePayment: "Paiements sécurisés cryptés",
      changePolicy: "Modification de dates disponible",
      bestPrice: "Meilleur prix garanti",
      availableDates: "Dates Disponibles",
      bookingInfo: "Informations de Réservation",
      minPeople: "Minimum de personnes",
      maxPeople: "Maximum de personnes",
      cutoff: "Limite de réservation",
      before: "avant le départ",
      alwaysAvailable: "Disponible tous les jours",
      noAvailableDates: "Aucune date disponible actuellement",
    },
    sections: {
      overview: "Aperçu",
      itinerary: "Itinéraire",
      included: "Inclus",
      excluded: "Non Inclus",
      preparation: "Quoi Apporter",
      policies: "Politiques",
      noInfo: "Aucune information disponible",
    },
    overview: {
      highlights: "Points forts",
      difficulty: "Difficulté",
      difficultyLevels: { easy: "Facile", medium: "Modéré", hard: "Difficile" },
      minAge: "Âge minimum",
      years: "ans",
      capacity: "Capacité",
      people: "personnes",
      meetingPoint: "Point de rencontre",
      startTime: "Heure de départ",
      languages: "Langues",
      included: "Inclus",
    },
    itinerary: {
      dayLabel: "Jour",
      activities: "Activités",
      meals: { breakfast: "Petit-déjeuner", lunch: "Déjeuner", dinner: "Dîner" },
      hotelNight: "Nuit à l'hôtel",
    },
    policies: {
      cancellation: "Politique d'annulation",
      refund: "Politique de remboursement",
      changes: "Politique de modification",
      contactUs: "Contactez-nous pour plus d'informations sur les politiques",
    },
    cta: {
      title: "Des Questions?",
      description: "Notre équipe est disponible 24/7 pour vous aider à planifier votre aventure parfaite.",
      button: "Contacter Maintenant",
      bookNow: "Réserver Maintenant", // Added bookNow property to CTA section
    },
    cart: { added: "Ajouté au panier", viewCart: "Voir le Panier", continueShopping: "Continuer les Achats" },
  },
  it: {
    breadcrumb: { home: "Home", tours: "Tour" },
    hero: {
      duration: "Durata",
      day: "Giorno",
      days: "Giorni",
      hour: "Ora",
      hours: "Ore",
      rating: "Valutazione",
      reviews: "recensioni",
      location: "Posizione",
    },
    booking: {
      title: "Prenota la Tua Esperienza",
      priceFrom: "Da",
      perPerson: "a persona",
      originalPrice: "Prezzo originale",
      selectDate: "Seleziona data",
      travelers: "Viaggiatori",
      adults: "Adulti",
      children: "Bambini",
      addToCart: "Aggiungi al Carrello",
      bookNow: "Prenota Ora",
      instantConfirmation: "Conferma istantanea",
      securePayment: "Pagamenti sicuri crittografati",
      changePolicy: "Modifica delle date disponibile",
      bestPrice: "Miglior prezzo garantito",
      availableDates: "Date Disponibili",
      bookingInfo: "Informazioni Prenotazione",
      minPeople: "Minimo persone",
      maxPeople: "Massimo persone",
      cutoff: "Limite prenotazione",
      before: "prima dell'inizio",
      alwaysAvailable: "Disponibile tutti i giorni",
      noAvailableDates: "Nessuna data disponibile attualmente",
    },
    sections: {
      overview: "Panoramica",
      itinerary: "Itinerario",
      included: "Incluso",
      excluded: "Non Incluso",
      preparation: "Cosa Portare",
      policies: "Politiche",
      noInfo: "Nessuna informazione disponibile",
    },
    overview: {
      highlights: "Punti salienti",
      difficulty: "Difficoltà",
      difficultyLevels: { easy: "Facile", medium: "Moderato", hard: "Impegnativo" },
      minAge: "Età minima",
      years: "anni",
      capacity: "Capacità",
      people: "persone",
      meetingPoint: "Punto d'incontro",
      startTime: "Ora di partenza",
      languages: "Lingue",
      included: "Incluso",
    },
    itinerary: {
      dayLabel: "Giorno",
      activities: "Attività",
      meals: { breakfast: "Colazione", lunch: "Pranzo", dinner: "Cena" },
      hotelNight: "Notte in hotel",
    },
    policies: {
      cancellation: "Politica di cancellazione",
      refund: "Politica di rimborso",
      changes: "Politica di modifica",
      contactUs: "Contattaci per maggiori informazioni sulle politiche",
    },
    cta: {
      title: "Hai Domande?",
      description: "Il nostro team è disponibile 24/7 per aiutarti a pianificare la tua avventura perfetta.",
      button: "Contatta Ora",
      bookNow: "Prenota Ora", // Added bookNow property to CTA section
    },
    cart: { added: "Aggiunto al carrello", viewCart: "Vedi Carrello", continueShopping: "Continua lo Shopping" },
  },
  de: {
    breadcrumb: { home: "Startseite", tours: "Touren" },
    hero: {
      duration: "Dauer",
      day: "Tag",
      days: "Tage",
      hour: "Stunde",
      hours: "Stunden",
      rating: "Bewertung",
      reviews: "Bewertungen",
      location: "Standort",
    },
    booking: {
      title: "Buchen Sie Ihr Erlebnis",
      priceFrom: "Ab",
      perPerson: "pro Person",
      originalPrice: "Originalpreis",
      selectDate: "Datum wählen",
      travelers: "Reisende",
      adults: "Erwachsene",
      children: "Kinder",
      addToCart: "In den Warenkorb",
      bookNow: "Jetzt Buchen",
      instantConfirmation: "Sofortige Bestätigung",
      securePayment: "Sichere verschlüsselte Zahlungen",
      changePolicy: "Änderung der Daten verfügbar",
      bestPrice: "Bestpreisgarantie",
      availableDates: "Verfügbare Termine",
      bookingInfo: "Buchungsinformationen",
      minPeople: "Mindestpersonen",
      maxPeople: "Maximalpersonen",
      cutoff: "Buchungsfrist",
      before: "vor Beginn",
      alwaysAvailable: "Jeden Tag verfügbar",
      noAvailableDates: "Derzeit keine Termine verfügbar",
    },
    sections: {
      overview: "Überblick",
      itinerary: "Reiseverlauf",
      included: "Inklusiv",
      excluded: "Nicht Inklusiv",
      preparation: "Was Mitbringen",
      policies: "Richtlinien",
      noInfo: "Keine Informationen verfügbar",
    },
    overview: {
      highlights: "Höhepunkte",
      difficulty: "Schwierigkeit",
      difficultyLevels: { easy: "Leicht", medium: "Mittel", hard: "Anspruchsvoll" },
      minAge: "Mindestalter",
      years: "Jahre",
      capacity: "Kapazität",
      people: "Personen",
      meetingPoint: "Treffpunkt",
      startTime: "Startzeit",
      languages: "Sprachen",
      included: "Inklusive",
    },
    itinerary: {
      dayLabel: "Tag",
      activities: "Aktivitäten",
      meals: { breakfast: "Frühstück", lunch: "Mittagessen", dinner: "Abendessen" },
      hotelNight: "Hotelnacht",
    },
    policies: {
      cancellation: "Stornierungsrichtlinie",
      refund: "Rückerstattungsrichtlinie",
      changes: "Änderungsrichtlinie",
      contactUs: "Kontaktieren Sie uns für weitere Informationen zu Richtlinien",
    },
    cta: {
      title: "Haben Sie Fragen?",
      description:
        "Unser Team ist rund um die Uhr verfügbar, um Ihnen bei der Planung Ihres perfekten Abenteuers zu helfen.",
      button: "Jetzt Kontaktieren",
      bookNow: "Jetzt Buchen", // Added bookNow property to CTA section
    },
    cart: { added: "Zum Warenkorb hinzugefügt", viewCart: "Warenkorb Anzeigen", continueShopping: "Weiter Einkaufen" },
  },
  pt: {
    breadcrumb: { home: "Início", tours: "Passeios" },
    hero: {
      duration: "Duração",
      day: "Dia",
      days: "Dias",
      hour: "Hora",
      hours: "Horas",
      rating: "Avaliação",
      reviews: "avaliações",
      location: "Localização",
    },
    booking: {
      title: "Reserve Sua Experiência",
      priceFrom: "A partir de",
      perPerson: "por pessoa",
      originalPrice: "Preço original",
      selectDate: "Selecionar data",
      travelers: "Viajantes",
      adults: "Adultos",
      children: "Crianças",
      addToCart: "Adicionar ao Carrinho",
      bookNow: "Reservar Agora",
      instantConfirmation: "Confirmação instantânea",
      securePayment: "Pagamentos seguros encriptados",
      changePolicy: "Modificação de datas disponível",
      bestPrice: "Melhor preço garantido",
      availableDates: "Datas Disponíveis",
      bookingInfo: "Informações de Reserva",
      minPeople: "Mínimo de pessoas",
      maxPeople: "Máximo de pessoas",
      cutoff: "Limite de reserva",
      before: "antes do início",
      alwaysAvailable: "Disponível todos os dias",
      noAvailableDates: "Nenhuma data disponível atualmente",
    },
    sections: {
      overview: "Visão Geral",
      itinerary: "Itinerário",
      included: "Incluído",
      excluded: "Não Incluído",
      preparation: "O Que Levar",
      policies: "Políticas",
      noInfo: "Nenhuma informação disponível",
    },
    overview: {
      highlights: "Destaques",
      difficulty: "Dificuldade",
      difficultyLevels: { easy: "Fácil", medium: "Moderado", hard: "Desafiador" },
      minAge: "Idade mínima",
      years: "anos",
      capacity: "Capacidade",
      people: "pessoas",
      meetingPoint: "Ponto de encontro",
      startTime: "Horário de início",
      languages: "Idiomas",
      included: "Incluído",
    },
    itinerary: {
      dayLabel: "Dia",
      activities: "Atividades",
      meals: { breakfast: "Café da manhã", lunch: "Almoço", dinner: "Jantar" },
      hotelNight: "Noite no hotel",
    },
    policies: {
      cancellation: "Política de cancelamento",
      refund: "Política de reembolso",
      changes: "Política de alterações",
      contactUs: "Entre em contato para mais informações sobre políticas",
    },
    cta: {
      title: "Tem Perguntas?",
      description: "Nossa equipe está disponível 24/7 para ajudá-lo a planejar sua aventura perfeita.",
      button: "Contatar Agora",
      bookNow: "Reservar Agora", // Added bookNow property to CTA section
    },
    cart: { added: "Adicionado ao carrinho", viewCart: "Ver Carrinho", continueShopping: "Continuar Comprando" },
  },
  zh: {
    breadcrumb: { home: "首页", tours: "旅游" },
    hero: {
      duration: "时长",
      day: "天",
      days: "天",
      hour: "小时",
      hours: "小时",
      rating: "评分",
      reviews: "条评价",
      location: "位置",
    },
    booking: {
      title: "预订您的体验",
      priceFrom: "起价",
      perPerson: "每人",
      originalPrice: "原价",
      selectDate: "选择日期",
      travelers: "旅行者",
      adults: "成人",
      children: "儿童",
      addToCart: "加入购物车",
      bookNow: "立即预订",
      instantConfirmation: "即时确认",
      securePayment: "安全加密支付",
      changePolicy: "日期修改可用",
      bestPrice: "最优价格保证",
      availableDates: "可选日期",
      bookingInfo: "预订信息",
      minPeople: "最少人数",
      maxPeople: "最多人数",
      cutoff: "预订截止",
      before: "开始前",
      alwaysAvailable: "每天可用",
      noAvailableDates: "目前没有可用日期",
    },
    sections: {
      overview: "概述",
      itinerary: "行程",
      included: "包含",
      excluded: "不包含",
      preparation: "携带物品",
      policies: "政策",
      noInfo: "暂无信息",
    },
    overview: {
      highlights: "亮点",
      difficulty: "难度",
      difficultyLevels: { easy: "简单", medium: "中等", hard: "困难" },
      minAge: "最低年龄",
      years: "岁",
      capacity: "容量",
      people: "人",
      meetingPoint: "集合地点",
      startTime: "开始时间",
      languages: "语言",
      included: "包含",
    },
    itinerary: {
      dayLabel: "第",
      activities: "活动",
      meals: { breakfast: "早餐", lunch: "午餐", dinner: "晚餐" },
      hotelNight: "酒店住宿",
    },
    policies: {
      cancellation: "取消政策",
      refund: "退款政策",
      changes: "更改政策",
      contactUs: "联系我们了解更多政策信息",
    },
    cta: {
      title: "有问题吗？",
      description: "我们的团队全天候为您提供帮助，帮您规划完美的冒险。",
      button: "立即联系",
      bookNow: "立即预订", // Added bookNow property to CTA section
    },
    cart: { added: "已加入购物车", viewCart: "查看购物车", continueShopping: "继续购物" },
  },
  ja: {
    breadcrumb: { home: "ホーム", tours: "ツアー" },
    hero: {
      duration: "所要時間",
      day: "日",
      days: "日",
      hour: "時間",
      hours: "時間",
      rating: "評価",
      reviews: "件のレビュー",
      location: "場所",
    },
    booking: {
      title: "体験を予約",
      priceFrom: "から",
      perPerson: "一人あたり",
      originalPrice: "元の価格",
      selectDate: "日付を選択",
      travelers: "旅行者",
      adults: "大人",
      children: "子供",
      addToCart: "カートに追加",
      bookNow: "今すぐ予約",
      instantConfirmation: "即時確認",
      securePayment: "安全な暗号化支払い",
      changePolicy: "日付の変更が可能です",
      bestPrice: "最低価格保証",
      availableDates: "利用可能な日程",
      bookingInfo: "予約情報",
      minPeople: "最少人数",
      maxPeople: "最大人数",
      cutoff: "予約締切",
      before: "開始前",
      alwaysAvailable: "毎日利用可能",
      noAvailableDates: "現在利用可能な日程はありません",
    },
    sections: {
      overview: "概要",
      itinerary: "旅程",
      included: "含まれるもの",
      excluded: "含まれないもの",
      preparation: "持ち物",
      policies: "ポリシー",
      noInfo: "情報がありません",
    },
    overview: {
      highlights: "ハイライト",
      difficulty: "難易度",
      difficultyLevels: { easy: "簡単", medium: "中程度", hard: "ハード" },
      minAge: "最低年齢",
      years: "歳",
      capacity: "定員",
      people: "名",
      meetingPoint: "集合場所",
      startTime: "開始時間",
      languages: "言語",
      included: "含む",
    },
    itinerary: {
      dayLabel: "日目",
      activities: "アクティビティ",
      meals: { breakfast: "朝食", lunch: "昼食", dinner: "夕食" },
      hotelNight: "ホテル泊",
    },
    policies: {
      cancellation: "キャンセルポリシー",
      refund: "返金ポリシー",
      changes: "変更ポリシー",
      contactUs: "ポリシーの詳細については、お問い合わせください",
    },
    cta: {
      title: "ご質問はありますか？",
      description: "私たちのチームは、完璧な冒険を計画するために24時間365日対応しています。",
      button: "お問い合わせ",
      bookNow: "今すぐ予約", // Added bookNow property to CTA section
    },
    cart: { added: "カートに追加されました", viewCart: "カートを見る", continueShopping: "ショッピングを続ける" },
  },
  ru: {
    breadcrumb: { home: "Главная", tours: "Туры" },
    hero: {
      duration: "Продолжительность",
      day: "День",
      days: "Дней",
      hour: "Час",
      hours: "Часов",
      rating: "Рейтинг",
      reviews: "отзывов",
      location: "Местоположение",
    },
    booking: {
      title: "Забронируйте Свой Опыт",
      priceFrom: "От",
      perPerson: "на человека",
      originalPrice: "Исходная цена",
      selectDate: "Выбрать дату",
      travelers: "Путешественники",
      adults: "Взрослые",
      children: "Дети",
      addToCart: "Добавить в Корзину",
      bookNow: "Забронировать Сейчас",
      instantConfirmation: "Мгновенное подтверждение",
      securePayment: "Безопасные зашифрованные платежи",
      changePolicy: "Доступна модификация дат",
      bestPrice: "Лучшая цена гарантирована",
      availableDates: "Доступные Даты",
      bookingInfo: "Информация о Бронировании",
      minPeople: "Минимум людей",
      maxPeople: "Максимум людей",
      cutoff: "Срок бронирования",
      before: "до начала",
      alwaysAvailable: "Доступно каждый день",
      noAvailableDates: "В настоящее время нет доступных дат",
    },
    sections: {
      overview: "Обзор",
      itinerary: "Маршрут",
      included: "Включено",
      excluded: "Не Включено",
      preparation: "Что Взять",
      policies: "Политики",
      noInfo: "Информация недоступна",
    },
    overview: {
      highlights: "Основные моменты",
      difficulty: "Сложность",
      difficultyLevels: { easy: "Легко", medium: "Умеренно", hard: "Сложно" },
      minAge: "Минимальный возраст",
      years: "лет",
      capacity: "Вместимость",
      people: "человек",
      meetingPoint: "Место встречи",
      startTime: "Время начала",
      languages: "Языки",
      included: "Включено",
    },
    itinerary: {
      dayLabel: "День",
      activities: "Мероприятия",
      meals: { breakfast: "Завтрак", lunch: "Обед", dinner: "Ужин" },
      hotelNight: "Ночь в отеле",
    },
    policies: {
      cancellation: "Политика отмены",
      refund: "Политика возврата",
      changes: "Политика изменений",
      contactUs: "Свяжитесь с нами для получения дополнительной информации о политиках",
    },
    cta: {
      title: "Есть Вопросы?",
      description: "Наша команда доступна 24/7, чтобы помочь вам спланировать идеальное приключение.",
      button: "Связаться Сейчас",
      bookNow: "Забронировать Сейчас", // Added bookNow property to CTA section
    },
    cart: { added: "Добавлено в корзину", viewCart: "Просмотреть Корзину", continueShopping: "Продолжить Покупки" },
  },
}

export function getTourDetailDictionary(locale: Locale): TourDetailDictionary {
  return tourDetailDictionaries[locale] || tourDetailDictionaries.es
}
