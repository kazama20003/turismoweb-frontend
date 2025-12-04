import type { Locale } from "./config"

export interface DictionarySchema {
  nav: {
    tours: string
    shop: string
    visit: string
    club: string
    events: string
    about: string
    reservations: string
  }
  hero: {
    title: string
    titleLine2: string
    description: string
    planVisit: string
    shopNow: string
  }
  products: {
    moreTours: string
  }
  common: {
    scrollDown: string
    language: string
    search: string
    user: string
    cart: string
    menu: string
  }
  footer: {
    rights: string
    privacy: string
    terms: string
    contact: string
  }
}

export type Dictionary = DictionarySchema

const dictionaries: Record<Locale, DictionarySchema> = {
  es: {
    nav: {
      tours: "TOURS",
      shop: "TIENDA",
      visit: "VISITAR",
      club: "CLUB",
      events: "EVENTOS",
      about: "NOSOTROS",
      reservations: "RESERVACIONES",
    },
    hero: {
      title: "VALLE SAGRADO",
      titleLine2: "DEL PERÚ",
      description:
        "En el corazón del Pueblo Sagrado del Perú, donde los ecos de los Inkas aún susurran entre los valles, Majestusa florece como un símbolo de tradición y renovación.",
      planVisit: "PLANIFICA TU VISITA",
      shopNow: "COMPRAR AHORA",
    },
    products: {
      moreTours: "+TOURS",
    },
    common: {
      scrollDown: "DESPLAZAR",
      language: "Idioma",
      search: "Buscar",
      user: "Usuario",
      cart: "Carrito",
      menu: "Menú",
    },
    footer: {
      rights: "Todos los derechos reservados",
      privacy: "Política de Privacidad",
      terms: "Términos de Servicio",
      contact: "Contacto",
    },
  },
  en: {
    nav: {
      tours: "TOURS",
      shop: "SHOP",
      visit: "VISIT",
      club: "CLUB",
      events: "EVENTS",
      about: "ABOUT",
      reservations: "RESERVATIONS",
    },
    hero: {
      title: "SACRED VALLEY",
      titleLine2: "OF PERU",
      description:
        "In the heart of the Sacred Land of Peru, where the echoes of the Inkas still whisper through the valleys, Majestusa flourishes as a symbol of tradition and renewal.",
      planVisit: "PLAN YOUR VISIT",
      shopNow: "SHOP NOW",
    },
    products: {
      moreTours: "+TOURS",
    },
    common: {
      scrollDown: "SCROLL",
      language: "Language",
      search: "Search",
      user: "User",
      cart: "Cart",
      menu: "Menu",
    },
    footer: {
      rights: "All rights reserved",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      contact: "Contact",
    },
  },
  fr: {
    nav: {
      tours: "CIRCUITS",
      shop: "BOUTIQUE",
      visit: "VISITER",
      club: "CLUB",
      events: "ÉVÉNEMENTS",
      about: "À PROPOS",
      reservations: "RÉSERVATIONS",
    },
    hero: {
      title: "VALLÉE SACRÉE",
      titleLine2: "DU PÉROU",
      description:
        "Au cœur de la Terre Sacrée du Pérou, où les échos des Incas murmurent encore à travers les vallées, Majestusa s'épanouit comme un symbole de tradition et de renouveau.",
      planVisit: "PLANIFIEZ VOTRE VISITE",
      shopNow: "ACHETER",
    },
    products: {
      moreTours: "+CIRCUITS",
    },
    common: {
      scrollDown: "DÉFILER",
      language: "Langue",
      search: "Rechercher",
      user: "Utilisateur",
      cart: "Panier",
      menu: "Menu",
    },
    footer: {
      rights: "Tous droits réservés",
      privacy: "Politique de Confidentialité",
      terms: "Conditions d'Utilisation",
      contact: "Contact",
    },
  },
  it: {
    nav: {
      tours: "TOUR",
      shop: "NEGOZIO",
      visit: "VISITARE",
      club: "CLUB",
      events: "EVENTI",
      about: "CHI SIAMO",
      reservations: "PRENOTAZIONI",
    },
    hero: {
      title: "VALLE SACRA",
      titleLine2: "DEL PERÙ",
      description:
        "Nel cuore della Terra Sacra del Perù, dove gli echi degli Inca ancora sussurrano attraverso le valli, Majestusa fiorisce come simbolo di tradizione e rinnovamento.",
      planVisit: "PIANIFICA LA TUA VISITA",
      shopNow: "ACQUISTA ORA",
    },
    products: {
      moreTours: "+TOUR",
    },
    common: {
      scrollDown: "SCORRI",
      language: "Lingua",
      search: "Cerca",
      user: "Utente",
      cart: "Carrello",
      menu: "Menu",
    },
    footer: {
      rights: "Tutti i diritti riservati",
      privacy: "Politica sulla Privacy",
      terms: "Termini di Servizio",
      contact: "Contatto",
    },
  },
  de: {
    nav: {
      tours: "TOUREN",
      shop: "SHOP",
      visit: "BESUCHEN",
      club: "CLUB",
      events: "VERANSTALTUNGEN",
      about: "ÜBER UNS",
      reservations: "RESERVIERUNGEN",
    },
    hero: {
      title: "HEILIGES TAL",
      titleLine2: "VON PERU",
      description:
        "Im Herzen des Heiligen Landes von Peru, wo die Echos der Inkas noch immer durch die Täler flüstern, blüht Majestusa als Symbol für Tradition und Erneuerung.",
      planVisit: "PLANEN SIE IHREN BESUCH",
      shopNow: "JETZT KAUFEN",
    },
    products: {
      moreTours: "+TOUREN",
    },
    common: {
      scrollDown: "SCROLLEN",
      language: "Sprache",
      search: "Suchen",
      user: "Benutzer",
      cart: "Warenkorb",
      menu: "Menü",
    },
    footer: {
      rights: "Alle Rechte vorbehalten",
      privacy: "Datenschutzrichtlinie",
      terms: "Nutzungsbedingungen",
      contact: "Kontakt",
    },
  },
  pt: {
    nav: {
      tours: "PASSEIOS",
      shop: "LOJA",
      visit: "VISITAR",
      club: "CLUBE",
      events: "EVENTOS",
      about: "SOBRE",
      reservations: "RESERVAS",
    },
    hero: {
      title: "VALE SAGRADO",
      titleLine2: "DO PERU",
      description:
        "No coração da Terra Sagrada do Peru, onde os ecos dos Incas ainda sussurram pelos vales, Majestusa floresce como um símbolo de tradição e renovação.",
      planVisit: "PLANEJE SUA VISITA",
      shopNow: "COMPRAR AGORA",
    },
    products: {
      moreTours: "+PASSEIOS",
    },
    common: {
      scrollDown: "ROLAR",
      language: "Idioma",
      search: "Buscar",
      user: "Usuário",
      cart: "Carrinho",
      menu: "Menu",
    },
    footer: {
      rights: "Todos os direitos reservados",
      privacy: "Política de Privacidade",
      terms: "Termos de Serviço",
      contact: "Contato",
    },
  },
  zh: {
    nav: {
      tours: "旅游",
      shop: "商店",
      visit: "访问",
      club: "俱乐部",
      events: "活动",
      about: "关于",
      reservations: "预订",
    },
    hero: {
      title: "神圣山谷",
      titleLine2: "秘鲁",
      description: "在秘鲁神圣土地的中心，印加人的回声仍在山谷间低语，Majestusa作为传统与复兴的象征蓬勃发展。",
      planVisit: "计划您的访问",
      shopNow: "立即购买",
    },
    products: {
      moreTours: "+更多旅游",
    },
    common: {
      scrollDown: "滚动",
      language: "语言",
      search: "搜索",
      user: "用户",
      cart: "购物车",
      menu: "菜单",
    },
    footer: {
      rights: "版权所有",
      privacy: "隐私政策",
      terms: "服务条款",
      contact: "联系我们",
    },
  },
  ja: {
    nav: {
      tours: "ツアー",
      shop: "ショップ",
      visit: "訪問",
      club: "クラブ",
      events: "イベント",
      about: "私たちについて",
      reservations: "予約",
    },
    hero: {
      title: "聖なる谷",
      titleLine2: "ペルー",
      description:
        "ペルーの聖地の中心で、インカの響きがまだ谷間にささやく場所、Majestusaは伝統と再生の象徴として栄えています。",
      planVisit: "訪問を計画する",
      shopNow: "今すぐ購入",
    },
    products: {
      moreTours: "+ツアー",
    },
    common: {
      scrollDown: "スクロール",
      language: "言語",
      search: "検索",
      user: "ユーザー",
      cart: "カート",
      menu: "メニュー",
    },
    footer: {
      rights: "全著作権所有",
      privacy: "プライバシーポリシー",
      terms: "利用規約",
      contact: "お問い合わせ",
    },
  },
  ru: {
    nav: {
      tours: "ТУРЫ",
      shop: "МАГАЗИН",
      visit: "ПОСЕТИТЬ",
      club: "КЛУБ",
      events: "СОБЫТИЯ",
      about: "О НАС",
      reservations: "БРОНИРОВАНИЕ",
    },
    hero: {
      title: "СВЯЩЕННАЯ ДОЛИНА",
      titleLine2: "ПЕРУ",
      description:
        "В сердце Священной земли Перу, где отголоски инков все еще шепчут в долинах, Majestusa расцветает как символ традиции и обновления.",
      planVisit: "ПЛАНИРУЙТЕ ВИЗИТ",
      shopNow: "КУПИТЬ СЕЙЧАС",
    },
    products: {
      moreTours: "+ТУРЫ",
    },
    common: {
      scrollDown: "ПРОКРУТИТЬ",
      language: "Язык",
      search: "Поиск",
      user: "Пользователь",
      cart: "Корзина",
      menu: "Меню",
    },
    footer: {
      rights: "Все права защищены",
      privacy: "Политика конфиденциальности",
      terms: "Условия использования",
      contact: "Контакт",
    },
  },
}

export function getDictionary(locale: Locale): DictionarySchema {
  return dictionaries[locale] || dictionaries.es
}
