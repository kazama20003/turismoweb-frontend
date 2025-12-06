import type { Locale } from "../config"

export interface FooterDictionary {
  subscribe: string
  email: string
  restaurant: string
  careers: string
  trade: string
  story: string
  sustainability: string
  news: string
  contact: string
  address: string
  phone: string
  country: string
  brand: string
  privacy: string
  terms: string
  shipping: string
  copyright: string
  license: string
}

const footerDictionaries: Record<Locale, FooterDictionary> = {
  es: {
    subscribe: "Suscribirse a nuestra lista",
    email: "Correo electrónico",
    restaurant: "Restaurante",
    careers: "Carreras",
    trade: "Comercio y Medios",
    story: "Nuestra Historia",
    sustainability: "Sostenibilidad",
    news: "Noticias",
    contact: "Contacto",
    address: "Olivers Rd McLaren Vale",
    phone: "Teléfono:",
    country: "South Australia 5171",
    brand: "MAXWELL-MADE",
    privacy: "Política de Privacidad",
    terms: "Términos",
    shipping: "Política de Envío",
    copyright: "© Maxwell Wines 2025",
    license:
      "SA Liquor Licensing Act 1997, Section 113. Liquor Licence Number: 57005946 Producer's Licence 57600699 Liquor Must Not Be Supplied To Persons Under 18.",
  },
  en: {
    subscribe: "Subscribe to our list",
    email: "Email",
    restaurant: "Restaurant",
    careers: "Careers",
    trade: "Trade & Media",
    story: "Our Story",
    sustainability: "Sustainability",
    news: "News",
    contact: "Contact",
    address: "Olivers Rd McLaren Vale",
    phone: "Phone:",
    country: "South Australia 5171",
    brand: "MAXWELL-MADE",
    privacy: "Privacy Policy",
    terms: "Terms",
    shipping: "Shipping Policy",
    copyright: "© Maxwell Wines 2025",
    license:
      "SA Liquor Licensing Act 1997, Section 113. Liquor Licence Number: 57005946 Producer's Licence 57600699 Liquor Must Not Be Supplied To Persons Under 18.",
  },
  fr: {
    subscribe: "S'abonner à notre liste",
    email: "Adresse e-mail",
    restaurant: "Restaurant",
    careers: "Carrières",
    trade: "Commerce et Médias",
    story: "Notre Histoire",
    sustainability: "Durabilité",
    news: "Actualités",
    contact: "Contact",
    address: "Olivers Rd McLaren Vale",
    phone: "Téléphone:",
    country: "South Australia 5171",
    brand: "MAXWELL-MADE",
    privacy: "Politique de Confidentialité",
    terms: "Conditions",
    shipping: "Politique d'Expédition",
    copyright: "© Maxwell Wines 2025",
    license:
      "SA Liquor Licensing Act 1997, Section 113. Liquor Licence Number: 57005946 Producer's Licence 57600699 Liquor Must Not Be Supplied To Persons Under 18.",
  },
  it: {
    subscribe: "Iscriviti alla nostra lista",
    email: "Email",
    restaurant: "Ristorante",
    careers: "Carriere",
    trade: "Commercio e Media",
    story: "La Nostra Storia",
    sustainability: "Sostenibilità",
    news: "Notizie",
    contact: "Contatti",
    address: "Olivers Rd McLaren Vale",
    phone: "Telefono:",
    country: "South Australia 5171",
    brand: "MAXWELL-MADE",
    privacy: "Informativa sulla Privacy",
    terms: "Termini",
    shipping: "Politica di Spedizione",
    copyright: "© Maxwell Wines 2025",
    license:
      "SA Liquor Licensing Act 1997, Section 113. Liquor Licence Number: 57005946 Producer's Licence 57600699 Liquor Must Not Be Supplied To Persons Under 18.",
  },
  de: {
    subscribe: "Melden Sie sich auf unserer Liste an",
    email: "E-Mail",
    restaurant: "Restaurant",
    careers: "Karrieren",
    trade: "Handel und Medien",
    story: "Unsere Geschichte",
    sustainability: "Nachhaltigkeit",
    news: "Nachrichten",
    contact: "Kontakt",
    address: "Olivers Rd McLaren Vale",
    phone: "Telefon:",
    country: "South Australia 5171",
    brand: "MAXWELL-MADE",
    privacy: "Datenschutzrichtlinie",
    terms: "Geschäftsbedingungen",
    shipping: "Versandrichtlinie",
    copyright: "© Maxwell Wines 2025",
    license:
      "SA Liquor Licensing Act 1997, Section 113. Liquor Licence Number: 57005946 Producer's Licence 57600699 Liquor Must Not Be Supplied To Persons Under 18.",
  },
  pt: {
    subscribe: "Inscreva-se em nossa lista",
    email: "Email",
    restaurant: "Restaurante",
    careers: "Carreiras",
    trade: "Comércio e Mídia",
    story: "Nossa História",
    sustainability: "Sustentabilidade",
    news: "Notícias",
    contact: "Contato",
    address: "Olivers Rd McLaren Vale",
    phone: "Telefone:",
    country: "South Australia 5171",
    brand: "MAXWELL-MADE",
    privacy: "Política de Privacidade",
    terms: "Termos",
    shipping: "Política de Envio",
    copyright: "© Maxwell Wines 2025",
    license:
      "SA Liquor Licensing Act 1997, Section 113. Liquor Licence Number: 57005946 Producer's Licence 57600699 Liquor Must Not Be Supplied To Persons Under 18.",
  },
  zh: {
    subscribe: "订阅我们的列表",
    email: "电子邮件",
    restaurant: "餐厅",
    careers: "职业",
    trade: "贸易与媒体",
    story: "我们的故事",
    sustainability: "可持续性",
    news: "新闻",
    contact: "联系",
    address: "Olivers Rd McLaren Vale",
    phone: "电话:",
    country: "South Australia 5171",
    brand: "MAXWELL-MADE",
    privacy: "隐私政策",
    terms: "条款",
    shipping: "运费政策",
    copyright: "© Maxwell Wines 2025",
    license:
      "SA Liquor Licensing Act 1997, Section 113. Liquor Licence Number: 57005946 Producer's Licence 57600699 Liquor Must Not Be Supplied To Persons Under 18.",
  },
  ja: {
    subscribe: "リストにサブスクライブ",
    email: "メールアドレス",
    restaurant: "レストラン",
    careers: "キャリア",
    trade: "貿易とメディア",
    story: "私たちのストーリー",
    sustainability: "持続可能性",
    news: "ニュース",
    contact: "お問い合わせ",
    address: "Olivers Rd McLaren Vale",
    phone: "電話:",
    country: "South Australia 5171",
    brand: "MAXWELL-MADE",
    privacy: "プライバシーポリシー",
    terms: "利用規約",
    shipping: "配送ポリシー",
    copyright: "© Maxwell Wines 2025",
    license:
      "SA Liquor Licensing Act 1997, Section 113. Liquor Licence Number: 57005946 Producer's Licence 57600699 Liquor Must Not Be Supplied To Persons Under 18.",
  },
  ru: {
    subscribe: "Подписаться на список",
    email: "Эл. почта",
    restaurant: "Ресторан",
    careers: "Карьера",
    trade: "Торговля и СМИ",
    story: "Наша История",
    sustainability: "Устойчивость",
    news: "Новости",
    contact: "Контакты",
    address: "Olivers Rd McLaren Vale",
    phone: "Телефон:",
    country: "South Australia 5171",
    brand: "MAXWELL-MADE",
    privacy: "Политика конфиденциальности",
    terms: "Условия",
    shipping: "Политика доставки",
    copyright: "© Maxwell Wines 2025",
    license:
      "SA Liquor Licensing Act 1997, Section 113. Liquor Licence Number: 57005946 Producer's Licence 57600699 Liquor Must Not Be Supplied To Persons Under 18.",
  },
}

export function getFooterDictionary(locale: Locale): FooterDictionary {
  return footerDictionaries[locale]
}
