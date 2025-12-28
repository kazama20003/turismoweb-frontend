import type { Metadata } from "next"
import type { Locale } from "@/lib/i18n/config"

export const siteConfig = {
  name: "eTourism - Tourism & Transport Booking",
  description: "Book tours and transportation services worldwide. Find the best travel experiences.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://etourism.com",
  ogImage: "https://res.cloudinary.com/ddbzpbrje/image/upload/v1766907724/ChatGPT_Image_28_dic_2025_02_41_45_kwivpk.png",
}

export const seoTranslations: Record<
  Locale,
  {
    title: string
    description: string
    keywords: string[]
    toursTitle: string
    toursDescription: string
    transportsTitle: string
    transportsDescription: string
  }
> = {
  es: {
    title: "eTourism - Reserva Tours y Transporte | Viajes Internacionales",
    description:
      "Descubre y reserva los mejores tours y servicios de transporte en todo el mundo. Experiencias de viaje auténticas y asequibles.",
    keywords: ["tours", "viajes", "transporte", "reservas", "turismo", "vacaciones", "experiencias"],
    toursTitle: "Tours Turísticos | Explora Destinos Increíbles | eTourism",
    toursDescription:
      "Descubre tours auténticos en destinos fascinantes. Guías locales experientes, precios competitivos y reservas seguras.",
    transportsTitle: "Transporte de Viajes | Buses, Taxis y Traslados | eTourism",
    transportsDescription:
      "Reserva transporte confiable para tus viajes. Opciones de traslados, buses y servicios de transporte profesionales.",
  },
  en: {
    title: "eTourism - Book Tours & Transportation | Global Travel Booking",
    description:
      "Discover and book the best tours and transportation services worldwide. Authentic travel experiences at affordable prices.",
    keywords: ["tours", "travel", "transportation", "booking", "tourism", "vacations", "experiences"],
    toursTitle: "Tours & Activities | Explore Amazing Destinations | eTourism",
    toursDescription:
      "Discover authentic tours in fascinating destinations. Expert local guides, competitive prices, and secure bookings.",
    transportsTitle: "Travel Transportation | Buses, Taxis & Transfers | eTourism",
    transportsDescription:
      "Book reliable transportation for your travels. Transfer services, buses, and professional transport options.",
  },
  fr: {
    title: "eTourism - Réservez Excursions et Transports | Voyages Internationaux",
    description:
      "Découvrez et réservez les meilleures excursions et services de transport dans le monde. Expériences de voyage authentiques.",
    keywords: ["tours", "voyage", "transport", "réservation", "tourisme", "vacances", "expériences"],
    toursTitle: "Excursions & Activités | Explorez Destinations Fascinantes | eTourism",
    toursDescription:
      "Découvrez des excursions authentiques dans des destinations fascinantes. Guides locaux experts et réservations sécurisées.",
    transportsTitle: "Transport de Voyage | Bus, Taxis & Transferts | eTourism",
    transportsDescription:
      "Réservez un transport fiable pour vos voyages. Services de transfert, bus et options de transport professionnel.",
  },
  it: {
    title: "eTourism - Prenota Tour e Trasporti | Prenotazioni Viaggi Globali",
    description:
      "Scopri e prenota i migliori tour e servizi di trasporto in tutto il mondo. Esperienze di viaggio autentiche a prezzi convenienti.",
    keywords: ["tour", "viaggio", "trasporto", "prenotazione", "turismo", "vacanze", "esperienze"],
    toursTitle: "Tour e Attività | Esplora Destinazioni Incredibili | eTourism",
    toursDescription:
      "Scopri tour autentici in destinazioni affascinanti. Guide locali esperte, prezzi competitivi e prenotazioni sicure.",
    transportsTitle: "Trasporto Viaggi | Autobus, Taxi e Trasferimenti | eTourism",
    transportsDescription:
      "Prenota trasporti affidabili per i tuoi viaggi. Servizi di trasferimento, autobus e opzioni di trasporto professionali.",
  },
  de: {
    title: "eTourism - Tours & Transport Buchen | Globale Reisebuchung",
    description:
      "Entdecke und buche die besten Touren und Transportservices weltweit. Authentische Reiseerlebnisse zu erschwinglichen Preisen.",
    keywords: ["touren", "reisen", "transport", "buchung", "tourismus", "ferien", "erlebnisse"],
    toursTitle: "Touren & Aktivitäten | Erkunde Faszinierende Ziele | eTourism",
    toursDescription:
      "Entdecke authentische Touren an faszinierenden Reisezielen. Erfahrene lokale Guides, wettbewerbsfähige Preise und sichere Buchungen.",
    transportsTitle: "Reistransport | Busse, Taxis & Transfers | eTourism",
    transportsDescription:
      "Buche zuverlässigen Transport für deine Reisen. Transferservices, Busse und professionelle Transportoptionen.",
  },
  pt: {
    title: "eTourism - Reserve Tours e Transporte | Reservas de Viagem Global",
    description:
      "Descubra e reserve os melhores tours e serviços de transporte em todo o mundo. Experiências de viagem autênticas a preços acessíveis.",
    keywords: ["tours", "viagem", "transporte", "reserva", "turismo", "férias", "experiências"],
    toursTitle: "Tours e Atividades | Explore Destinos Incríveis | eTourism",
    toursDescription:
      "Descubra tours autênticos em destinos fascinantes. Guias locais experientes, preços competitivos e reservas seguras.",
    transportsTitle: "Transporte de Viagem | Ônibus, Táxis e Transferências | eTourism",
    transportsDescription:
      "Reserve transporte confiável para suas viagens. Serviços de transferência, ônibus e opções de transporte profissional.",
  },
  zh: {
    title: "eTourism - 预订旅游和交通 | 全球旅行预订",
    description: "发现并预订全球最佳旅游和运输服务。真实的旅行体验，价格实惠。",
    keywords: ["旅游", "旅行", "运输", "预订", "观光", "假期", "体验"],
    toursTitle: "旅游和活动 | 探索奇妙目的地 | eTourism",
    toursDescription: "发现令人着迷的目的地的真实旅游体验。专业的当地导游，具有竞争力的价格和安全预订。",
    transportsTitle: "旅行交通 | 公交车、出租车和接送服务 | eTourism",
    transportsDescription: "为您的旅行预订可靠的交通工具。接送服务、公交车和专业运输选项。",
  },
  ja: {
    title: "eTourism - ツアーと交通を予約 | グローバル旅行予約",
    description: "世界中の最高のツアーと交通サービスを発見して予約します。本物の旅行体験を手頃な価格で。",
    keywords: ["ツアー", "旅行", "交通", "予約", "観光", "休暇", "体験"],
    toursTitle: "ツアーとアクティビティ | 魅力的な目的地を探索 | eTourism",
    toursDescription:
      "魅力的な目的地で本物のツアー体験を発見します。経験豊富な現地ガイド、競争力のある価格、安全な予約。",
    transportsTitle: "旅行交通 | バス、タクシー、送迎サービス | eTourism",
    transportsDescription: "旅行のための信頼できる交通機関を予約します。送迎サービス、バス、専門的な交通オプション。",
  },
  ru: {
    title: "eTourism - Забронируйте Туры и Транспорт | Глобальное Бронирование Путешествий",
    description:
      "Откройте и забронируйте лучшие туры и услуги транспорта по всему миру. Подлинные впечатления от путешествий по доступным ценам.",
    keywords: ["туры", "путешествия", "транспорт", "бронирование", "туризм", "отпуск", "впечатления"],
    toursTitle: "Туры и Деятельность | Исследуйте Удивительные Направления | eTourism",
    toursDescription:
      "Откройте подлинные туры в увлекательные направления. Опытные местные гиды, конкурентные цены и безопасное бронирование.",
    transportsTitle: "Транспорт для Путешествий | Автобусы, Такси и Трансферы | eTourism",
    transportsDescription:
      "Забронируйте надежный транспорт для ваших путешествий. Услуги трансферов, автобусы и профессиональные транспортные варианты.",
  },
}

export function generateLocaleSEO(locale: Locale, type: "home" | "tours" | "transports"): Metadata {
  const seo = seoTranslations[locale]
  const baseUrl = siteConfig.url

  const alternateLanguages: Record<string, string | URL> = {}
  const locales = ["es", "en", "fr", "it", "de", "pt", "zh", "ja", "ru"] as const

  locales.forEach((lang) => {
    if (type === "home") {
      alternateLanguages[lang] = `${baseUrl}/${lang}`
    } else {
      alternateLanguages[lang] = `${baseUrl}/${lang}/${type}`
    }
  })

  const metadata: Metadata = {
    title: type === "home" ? seo.title : type === "tours" ? seo.toursTitle : seo.transportsTitle,
    description:
      type === "home" ? seo.description : type === "tours" ? seo.toursDescription : seo.transportsDescription,
    keywords: seo.keywords,
    alternates: {
      languages: alternateLanguages,
      canonical: type === "home" ? `${baseUrl}/${locale}` : `${baseUrl}/${locale}/${type}`,
    },
    openGraph: {
      title: type === "home" ? seo.title : type === "tours" ? seo.toursTitle : seo.transportsTitle,
      description:
        type === "home" ? seo.description : type === "tours" ? seo.toursDescription : seo.transportsDescription,
      url: type === "home" ? `${baseUrl}/${locale}` : `${baseUrl}/${locale}/${type}`,
      type: "website",
      images: [
        {
          url: `${baseUrl}${siteConfig.ogImage}`,
          width: 1200,
          height: 630,
          alt: type === "home" ? seo.title : type === "tours" ? seo.toursTitle : seo.transportsTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: type === "home" ? seo.title : type === "tours" ? seo.toursTitle : seo.transportsTitle,
      description:
        type === "home" ? seo.description : type === "tours" ? seo.toursDescription : seo.transportsDescription,
      images: [`${baseUrl}${siteConfig.ogImage}`],
    },
  }

  return metadata
}
