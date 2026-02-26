import type { Locale } from "@/lib/i18n/config"

export interface FeaturedSectionDictionary {
  title: string
  titleLine2: string
  description: string
  shopButton: string
  restaurantLabel: string
}

export const featuredSectionDictionaries: Record<Locale, FeaturedSectionDictionary> = {
  es: {
    title: "E Tourism Peru Travel,",
    titleLine2: "30 Anos de Experiencia.",
    description:
      "En E Tourism Peru Travel brindamos tours de la mas alta calidad por todo el Peru. Con mas de 30 anos de experiencia, nuestro equipo crea experiencias autenticas, seguras y memorables para cada viajero.",
    shopButton: "EXPLORAR TOURS ->",
    restaurantLabel: "E TOURISM PERU TRAVEL",
  },
  en: {
    title: "E Tourism Peru Travel,",
    titleLine2: "30 Years of Experience.",
    description:
      "At E Tourism Peru Travel, we provide top-quality tours across Peru. With more than 30 years of experience, our team creates authentic, safe, and memorable experiences for every traveler.",
    shopButton: "EXPLORE TOURS ->",
    restaurantLabel: "E TOURISM PERU TRAVEL",
  },
  fr: {
    title: "E Tourism Peru Travel,",
    titleLine2: "30 Ans D Experience.",
    description:
      "Chez E Tourism Peru Travel, nous proposons des circuits de la plus haute qualite a travers le Perou. Avec plus de 30 ans d experience, notre equipe cree des experiences authentiques, sures et memorables pour chaque voyageur.",
    shopButton: "EXPLORER LES TOURS ->",
    restaurantLabel: "E TOURISM PERU TRAVEL",
  },
  it: {
    title: "E Tourism Peru Travel,",
    titleLine2: "30 Anni di Esperienza.",
    description:
      "In E Tourism Peru Travel offriamo tour della piu alta qualita in tutto il Peru. Con oltre 30 anni di esperienza, il nostro team crea esperienze autentiche, sicure e memorabili per ogni viaggiatore.",
    shopButton: "ESPLORA I TOUR ->",
    restaurantLabel: "E TOURISM PERU TRAVEL",
  },
  de: {
    title: "E Tourism Peru Travel,",
    titleLine2: "30 Jahre Erfahrung.",
    description:
      "Bei E Tourism Peru Travel bieten wir Touren von hoechster Qualitaet in ganz Peru an. Mit mehr als 30 Jahren Erfahrung schafft unser Team authentische, sichere und unvergessliche Erlebnisse fuer jeden Reisenden.",
    shopButton: "TOUREN ENTDECKEN ->",
    restaurantLabel: "E TOURISM PERU TRAVEL",
  },
  pt: {
    title: "E Tourism Peru Travel,",
    titleLine2: "30 Anos de Experiencia.",
    description:
      "Na E Tourism Peru Travel oferecemos tours da mais alta qualidade por todo o Peru. Com mais de 30 anos de experiencia, nossa equipe cria experiencias autenticas, seguras e memoraveis para cada viajante.",
    shopButton: "EXPLORAR TOURS ->",
    restaurantLabel: "E TOURISM PERU TRAVEL",
  },
  zh: {
    title: "E Tourism Peru Travel,",
    titleLine2: "30年专业经验.",
    description:
      "在 E Tourism Peru Travel，我们在秘鲁全境提供高品质旅游服务。凭借30多年的经验，我们为每位旅客打造真实、安全且难忘的旅行体验。",
    shopButton: "探索行程 ->",
    restaurantLabel: "E TOURISM PERU TRAVEL",
  },
  ja: {
    title: "E Tourism Peru Travel,",
    titleLine2: "30年の経験。",
    description:
      "E Tourism Peru Travel は、ペルー全土で高品質なツアーを提供しています。30年以上の経験を持つチームが、すべての旅行者に本物で安全、そして思い出に残る体験を届けます。",
    shopButton: "ツアーを見る ->",
    restaurantLabel: "E TOURISM PERU TRAVEL",
  },
  ru: {
    title: "E Tourism Peru Travel,",
    titleLine2: "30 лет опыта.",
    description:
      "В E Tourism Peru Travel мы предлагаем туры высокого качества по всему Перу. Более 30 лет опыта позволяют нашей команде создавать подлинные, безопасные и незабываемые путешествия для каждого гостя.",
    shopButton: "СМОТРЕТЬ ТУРЫ ->",
    restaurantLabel: "E TOURISM PERU TRAVEL",
  },
}

export function getFeaturedSectionDictionary(locale: Locale): FeaturedSectionDictionary {
  return featuredSectionDictionaries[locale]
}
