import type { Locale } from "../config"

export interface ProductsSectionDictionary {
  title: string
  subtitle: string
  description: string
  exploreTours: string
  reserve: string
  viewDetails: string
}

const productsSectionDictionaries: Record<Locale, ProductsSectionDictionary> = {
  es: {
    title: "Nuestros",
    subtitle: "Tours Selectos.",
    description:
      "Cada Tour es el resultado de nuestros antepasados que dieron años de dedicación y maestría en la elaboración de cultura y arte. Utilizamos técnicas ancestrales combinadas con innovación moderna para ofrecer experiencias de sabor incomparables.",
    exploreTours: "EXPLORAR TOURS",
    reserve: "Reservar",
    viewDetails: "Ver Detalles",
  },
  en: {
    title: "Our",
    subtitle: "Selected Tours.",
    description:
      "Each Tour is the result of our ancestors who gave years of dedication and mastery in the elaboration of culture and art. We use ancestral techniques combined with modern innovation to offer incomparable flavor experiences.",
    exploreTours: "EXPLORE TOURS",
    reserve: "Reserve",
    viewDetails: "View Details",
  },
  fr: {
    title: "Nos",
    subtitle: "Tours Sélectionnés.",
    description:
      "Chaque Tour est le résultat de nos ancêtres qui ont consacré des années de dévouement et de maîtrise à l'élaboration de la culture et de l'art. Nous utilisons des techniques ancestrales combinées à l'innovation moderne pour offrir des expériences de saveur incomparables.",
    exploreTours: "EXPLORER LES TOURS",
    reserve: "Réserver",
    viewDetails: "Voir Détails",
  },
  it: {
    title: "I Nostri",
    subtitle: "Tour Selezionati.",
    description:
      "Ogni Tour è il risultato dei nostri antenati che hanno dedicato anni di dedizione e maestria nell'elaborazione della cultura e dell'arte. Utilizziamo tecniche ancestrali combinate con l'innovazione moderna per offrire esperienze di sapore incomparabili.",
    exploreTours: "ESPLORA TOUR",
    reserve: "Prenota",
    viewDetails: "Vedi Dettagli",
  },
  de: {
    title: "Unsere",
    subtitle: "Ausgewählten Touren.",
    description:
      "Jede Tour ist das Ergebnis unserer Vorfahren, die Jahre der Hingabe und Meisterschaft in der Entwicklung von Kultur und Kunst investiert haben. Wir verwenden ancestrale Techniken kombiniert mit moderner Innovation, um unvergleichliche Geschmackserlebnisse zu bieten.",
    exploreTours: "TOUREN ERKUNDEN",
    reserve: "Reservieren",
    viewDetails: "Details Anzeigen",
  },
  pt: {
    title: "Nossos",
    subtitle: "Tours Selecionados.",
    description:
      "Cada Tour é o resultado de nossos ancestrais que dedicaram anos de devoção e maestria na elaboração de cultura e arte. Usamos técnicas ancestrais combinadas com inovação moderna para oferecer experiências de sabor incomparáveis.",
    exploreTours: "EXPLORAR TOURS",
    reserve: "Reservar",
    viewDetails: "Ver Detalhes",
  },
  zh: {
    title: "我们的",
    subtitle: "精选之旅。",
    description:
      "每一次之旅都是我们祖先多年奉献和精通文化与艺术的结果。我们采用祖传技术与现代创新相结合，提供无与伦比的味觉体验。",
    exploreTours: "探索之旅",
    reserve: "预订",
    viewDetails: "查看详情",
  },
  ja: {
    title: "私たちの",
    subtitle: "厳選ツアー。",
    description:
      "各ツアーは、文化と芸術の製作に多年の献身と卓越性を捧げた私たちの祖先の成果です。祖伝の技法と最新の革新を組み合わせて、比類のない味わい体験を提供します。",
    exploreTours: "ツアーを探索",
    reserve: "予約",
    viewDetails: "詳細を見る",
  },
  ru: {
    title: "Наши",
    subtitle: "Избранные туры.",
    description:
      "Каждый тур является результатом многолетней преданности и мастерства наших предков в развитии культуры и искусства. Мы используем традиционные методы в сочетании с современными инновациями для предоставления несравненного опыта вкуса.",
    exploreTours: "ИССЛЕДОВАТЬ ТУРЫ",
    reserve: "Забронировать",
    viewDetails: "Посмотреть Детали",
  },
}

export function getProductsSectionDictionary(locale: Locale): ProductsSectionDictionary {
  return productsSectionDictionaries[locale]
}
