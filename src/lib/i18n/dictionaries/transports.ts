import type { Locale } from "../config"

export interface TransportsDictionary {
  hero: {
    subtitle: string
    title: string
    description: string
  }
  filters: {
    all: string
    popular: string
    airport: string
    cities: string
    touristic: string
  }
  section: {
    title: string
    titleItalic: string
    loading: string
    noResults: string
  }
  card: {
    hours: string
    minutes: string
    passengers: string
    viewDetails: string
    bookNow: string
  }
  detail: {
    backButton: string
    perPerson: string
    origin: string
    destination: string
    departure: string
    arrival: string
    duration: string
    capacity: string
    passengers: string
    availableDays: string
    bookNow: string
    fullDescription: string
    cancellationPolicy: string
    vehicleDetails: string
    brand: string
    model: string
    year: string
    plate: string
    notFound: string
    backToTransports: string
    tripDetails: string
    booking: string
  }
  weekdays: {
    monday: string
    tuesday: string
    wednesday: string
    thursday: string
    friday: string
    saturday: string
    sunday: string
  }
}

const es: TransportsDictionary = {
  hero: {
    subtitle: "TRANSPORTE CONFIABLE",
    title: "Viaja con Comodidad",
    description: "Servicios de transporte seguros y cómodos para todos tus destinos",
  },
  filters: {
    all: "Todos",
    popular: "Populares",
    airport: "Aeropuerto",
    cities: "Entre Ciudades",
    touristic: "Turísticos",
  },
  section: {
    title: "Descubre Nuestros",
    titleItalic: "Servicios",
    loading: "Cargando transportes...",
    noResults: "No se encontraron transportes",
  },
  card: {
    hours: "horas",
    minutes: "minutos",
    passengers: "pasajeros",
    viewDetails: "Ver Detalles",
    bookNow: "Reservar Ahora",
  },
  detail: {
    backButton: "Volver a transportes",
    perPerson: "por persona",
    origin: "Origen",
    destination: "Destino",
    departure: "Salida",
    arrival: "Llegada",
    duration: "Duración",
    capacity: "Capacidad",
    passengers: "pasajeros",
    availableDays: "Días disponibles",
    bookNow: "RESERVAR AHORA",
    fullDescription: "Descripción completa",
    cancellationPolicy: "Política de cancelación",
    vehicleDetails: "Detalles del vehículo",
    brand: "Marca",
    model: "Modelo",
    year: "Año",
    plate: "Placa",
    notFound: "Transporte no encontrado",
    backToTransports: "Volver a transportes",
    tripDetails: "Detalles del Viaje",
    booking: "Reservar",
  },
  weekdays: {
    monday: "Lun",
    tuesday: "Mar",
    wednesday: "Mié",
    thursday: "Jue",
    friday: "Vie",
    saturday: "Sáb",
    sunday: "Dom",
  },
}

const en: TransportsDictionary = {
  hero: {
    subtitle: "RELIABLE TRANSPORT",
    title: "Travel in Comfort",
    description: "Safe and comfortable transportation services for all your destinations",
  },
  filters: {
    all: "All",
    popular: "Popular",
    airport: "Airport",
    cities: "Between Cities",
    touristic: "Touristic",
  },
  section: {
    title: "Discover Our",
    titleItalic: "Services",
    loading: "Loading transports...",
    noResults: "No transports found",
  },
  card: {
    hours: "hours",
    minutes: "minutes",
    passengers: "passengers",
    viewDetails: "View Details",
    bookNow: "Book Now",
  },
  detail: {
    backButton: "Back to transports",
    perPerson: "per person",
    origin: "Origin",
    destination: "Destination",
    departure: "Departure",
    arrival: "Arrival",
    duration: "Duration",
    capacity: "Capacity",
    passengers: "passengers",
    availableDays: "Available days",
    bookNow: "BOOK NOW",
    fullDescription: "Full description",
    cancellationPolicy: "Cancellation policy",
    vehicleDetails: "Vehicle details",
    brand: "Brand",
    model: "Model",
    year: "Year",
    plate: "Plate",
    notFound: "Transport not found",
    backToTransports: "Back to transports",
    tripDetails: "Trip Details",
    booking: "Book",
  },
  weekdays: {
    monday: "Mon",
    tuesday: "Tue",
    wednesday: "Wed",
    thursday: "Thu",
    friday: "Fri",
    saturday: "Sat",
    sunday: "Sun",
  },
}

const fr: TransportsDictionary = {
  hero: {
    subtitle: "TRANSPORT FIABLE",
    title: "Voyagez Confortablement",
    description: "Services de transport sûrs et confortables pour toutes vos destinations",
  },
  filters: {
    all: "Tous",
    popular: "Populaires",
    airport: "Aéroport",
    cities: "Entre Villes",
    touristic: "Touristiques",
  },
  section: {
    title: "Découvrez Nos",
    titleItalic: "Services",
    loading: "Chargement des transports...",
    noResults: "Aucun transport trouvé",
  },
  card: {
    hours: "heures",
    minutes: "minutes",
    passengers: "passagers",
    viewDetails: "Voir Détails",
    bookNow: "Réserver",
  },
  detail: {
    backButton: "Retour aux transports",
    perPerson: "par personne",
    origin: "Origine",
    destination: "Destination",
    departure: "Départ",
    arrival: "Arrivée",
    duration: "Durée",
    capacity: "Capacité",
    passengers: "passagers",
    availableDays: "Jours disponibles",
    bookNow: "RÉSERVER",
    fullDescription: "Description complète",
    cancellationPolicy: "Politique d'annulation",
    vehicleDetails: "Détails du véhicule",
    brand: "Marque",
    model: "Modèle",
    year: "Année",
    plate: "Plaque",
    notFound: "Transport non trouvé",
    backToTransports: "Retour aux transports",
    tripDetails: "Détails du Voyage",
    booking: "Réserver",
  },
  weekdays: {
    monday: "Lun",
    tuesday: "Mar",
    wednesday: "Mer",
    thursday: "Jeu",
    friday: "Ven",
    saturday: "Sam",
    sunday: "Dim",
  },
}

const it: TransportsDictionary = {
  hero: {
    subtitle: "TRASPORTO AFFIDABILE",
    title: "Viaggia in Comodità",
    description: "Servizi di trasporto sicuri e confortevoli per tutte le tue destinazioni",
  },
  filters: {
    all: "Tutti",
    popular: "Popolari",
    airport: "Aeroporto",
    cities: "Tra Città",
    touristic: "Turistici",
  },
  section: {
    title: "Scopri i Nostri",
    titleItalic: "Servizi",
    loading: "Caricamento trasporti...",
    noResults: "Nessun trasporto trovato",
  },
  card: {
    hours: "ore",
    minutes: "minuti",
    passengers: "passeggeri",
    viewDetails: "Vedi Dettagli",
    bookNow: "Prenota",
  },
  detail: {
    backButton: "Torna ai trasporti",
    perPerson: "a persona",
    origin: "Origine",
    destination: "Destinazione",
    departure: "Partenza",
    arrival: "Arrivo",
    duration: "Durata",
    capacity: "Capacità",
    passengers: "passeggeri",
    availableDays: "Giorni disponibili",
    bookNow: "PRENOTA",
    fullDescription: "Descrizione completa",
    cancellationPolicy: "Politica di cancellazione",
    vehicleDetails: "Dettagli del veicolo",
    brand: "Marca",
    model: "Modello",
    year: "Anno",
    plate: "Targa",
    notFound: "Trasporto non trovato",
    backToTransports: "Torna ai trasporti",
    tripDetails: "Dettagli del Viaggio",
    booking: "Prenota",
  },
  weekdays: {
    monday: "Lun",
    tuesday: "Mar",
    wednesday: "Mer",
    thursday: "Gio",
    friday: "Ven",
    saturday: "Sab",
    sunday: "Dom",
  },
}

const de: TransportsDictionary = {
  hero: {
    subtitle: "ZUVERLÄSSIGER TRANSPORT",
    title: "Reise Bequem",
    description: "Sichere und komfortable Transportdienste für alle Ihre Ziele",
  },
  filters: {
    all: "Alle",
    popular: "Beliebt",
    airport: "Flughafen",
    cities: "Zwischen Städten",
    touristic: "Touristisch",
  },
  section: {
    title: "Entdecken Sie Unsere",
    titleItalic: "Dienste",
    loading: "Transporte werden geladen...",
    noResults: "Keine Transporte gefunden",
  },
  card: {
    hours: "Stunden",
    minutes: "Minuten",
    passengers: "Passagiere",
    viewDetails: "Details Ansehen",
    bookNow: "Jetzt Buchen",
  },
  detail: {
    backButton: "Zurück zu Transporte",
    perPerson: "pro Person",
    origin: "Herkunft",
    destination: "Ziel",
    departure: "Abfahrt",
    arrival: "Ankunft",
    duration: "Dauer",
    capacity: "Kapazität",
    passengers: "Passagiere",
    availableDays: "Verfügbare Tage",
    bookNow: "JETZT BUCHEN",
    fullDescription: "Vollständige Beschreibung",
    cancellationPolicy: "Stornierungsbedingungen",
    vehicleDetails: "Fahrzeugdetails",
    brand: "Marke",
    model: "Modell",
    year: "Jahr",
    plate: "Nummernschild",
    notFound: "Transport nicht gefunden",
    backToTransports: "Zurück zu Transporte",
    tripDetails: "Reisedetails",
    booking: "Buchen",
  },
  weekdays: {
    monday: "Mo",
    tuesday: "Di",
    wednesday: "Mi",
    thursday: "Do",
    friday: "Fr",
    saturday: "Sa",
    sunday: "So",
  },
}

const pt: TransportsDictionary = {
  hero: {
    subtitle: "TRANSPORTE CONFIÁVEL",
    title: "Viaje com Conforto",
    description: "Serviços de transporte seguros e confortáveis para todos os seus destinos",
  },
  filters: {
    all: "Todos",
    popular: "Populares",
    airport: "Aeroporto",
    cities: "Entre Cidades",
    touristic: "Turísticos",
  },
  section: {
    title: "Descubra Nossos",
    titleItalic: "Serviços",
    loading: "Carregando transportes...",
    noResults: "Nenhum transporte encontrado",
  },
  card: {
    hours: "horas",
    minutes: "minutos",
    passengers: "passageiros",
    viewDetails: "Ver Detalhes",
    bookNow: "Reservar",
  },
  detail: {
    backButton: "Voltar aos transportes",
    perPerson: "por pessoa",
    origin: "Origem",
    destination: "Destino",
    departure: "Partida",
    arrival: "Chegada",
    duration: "Duração",
    capacity: "Capacidade",
    passengers: "passageiros",
    availableDays: "Dias disponíveis",
    bookNow: "RESERVAR",
    fullDescription: "Descrição completa",
    cancellationPolicy: "Política de cancelamento",
    vehicleDetails: "Detalhes do veículo",
    brand: "Marca",
    model: "Modelo",
    year: "Ano",
    plate: "Placa",
    notFound: "Transporte não encontrado",
    backToTransports: "Voltar aos transportes",
    tripDetails: "Detalhes da Viagem",
    booking: "Reservar",
  },
  weekdays: {
    monday: "Seg",
    tuesday: "Ter",
    wednesday: "Qua",
    thursday: "Qui",
    friday: "Sex",
    saturday: "Sáb",
    sunday: "Dom",
  },
}

const zh: TransportsDictionary = {
  hero: {
    subtitle: "可靠运输",
    title: "舒适出行",
    description: "为您的所有目的地提供安全舒适的交通服务",
  },
  filters: {
    all: "全部",
    popular: "热门",
    airport: "机场",
    cities: "城际",
    touristic: "旅游",
  },
  section: {
    title: "发现我们的",
    titleItalic: "服务",
    loading: "加载中...",
    noResults: "未找到交通工具",
  },
  card: {
    hours: "小时",
    minutes: "分钟",
    passengers: "乘客",
    viewDetails: "查看详情",
    bookNow: "立即预订",
  },
  detail: {
    backButton: "返回交通",
    perPerson: "每人",
    origin: "出发地",
    destination: "目的地",
    departure: "出发",
    arrival: "到达",
    duration: "时长",
    capacity: "容量",
    passengers: "乘客",
    availableDays: "可用日期",
    bookNow: "立即预订",
    fullDescription: "完整描述",
    cancellationPolicy: "取消政策",
    vehicleDetails: "车辆详情",
    brand: "品牌",
    model: "型号",
    year: "年份",
    plate: "车牌",
    notFound: "未找到交通",
    backToTransports: "返回交通",
    tripDetails: "行程详情",
    booking: "预订",
  },
  weekdays: {
    monday: "周一",
    tuesday: "周二",
    wednesday: "周三",
    thursday: "周四",
    friday: "周五",
    saturday: "周六",
    sunday: "周日",
  },
}

const ja: TransportsDictionary = {
  hero: {
    subtitle: "信頼できる交通",
    title: "快適な旅",
    description: "すべての目的地への安全で快適な交通サービス",
  },
  filters: {
    all: "すべて",
    popular: "人気",
    airport: "空港",
    cities: "都市間",
    touristic: "観光",
  },
  section: {
    title: "私たちの",
    titleItalic: "サービス",
    loading: "読み込み中...",
    noResults: "交通が見つかりません",
  },
  card: {
    hours: "時間",
    minutes: "分",
    passengers: "乗客",
    viewDetails: "詳細を見る",
    bookNow: "今すぐ予約",
  },
  detail: {
    backButton: "交通に戻る",
    perPerson: "一人あたり",
    origin: "出発地",
    destination: "目的地",
    departure: "出発",
    arrival: "到着",
    duration: "所要時間",
    capacity: "定員",
    passengers: "乗客",
    availableDays: "利用可能日",
    bookNow: "今すぐ予約",
    fullDescription: "詳細説明",
    cancellationPolicy: "キャンセルポリシー",
    vehicleDetails: "車両詳細",
    brand: "ブランド",
    model: "モデル",
    year: "年式",
    plate: "ナンバープレート",
    notFound: "交通が見つかりません",
    backToTransports: "交通に戻る",
    tripDetails: "旅行詳細",
    booking: "予約",
  },
  weekdays: {
    monday: "月",
    tuesday: "火",
    wednesday: "水",
    thursday: "木",
    friday: "金",
    saturday: "土",
    sunday: "日",
  },
}

const ru: TransportsDictionary = {
  hero: {
    subtitle: "НАДЕЖНЫЙ ТРАНСПОРТ",
    title: "Путешествуйте с Комфортом",
    description: "Безопасные и комфортные транспортные услуги для всех ваших направлений",
  },
  filters: {
    all: "Все",
    popular: "Популярные",
    airport: "Аэропорт",
    cities: "Между Городами",
    touristic: "Туристические",
  },
  section: {
    title: "Откройте Наши",
    titleItalic: "Услуги",
    loading: "Загрузка транспорта...",
    noResults: "Транспорт не найден",
  },
  card: {
    hours: "часов",
    minutes: "минут",
    passengers: "пассажиров",
    viewDetails: "Подробнее",
    bookNow: "Забронировать",
  },
  detail: {
    backButton: "Назад к транспорту",
    perPerson: "на человека",
    origin: "Откуда",
    destination: "Куда",
    departure: "Отправление",
    arrival: "Прибытие",
    duration: "Длительность",
    capacity: "Вместимость",
    passengers: "пассажиров",
    availableDays: "Доступные дни",
    bookNow: "ЗАБРОНИРОВАТЬ",
    fullDescription: "Полное описание",
    cancellationPolicy: "Условия отмены",
    vehicleDetails: "Детали транспорта",
    brand: "Марка",
    model: "Модель",
    year: "Год",
    plate: "Номер",
    notFound: "Транспорт не найден",
    backToTransports: "Назад к транспорту",
    tripDetails: "Детали Поездки",
    booking: "Забронировать",
  },
  weekdays: {
    monday: "Пн",
    tuesday: "Вт",
    wednesday: "Ср",
    thursday: "Чт",
    friday: "Пт",
    saturday: "Сб",
    sunday: "Вс",
  },
}

const dictionaries = {
  es,
  en,
  fr,
  it,
  de,
  pt,
  zh,
  ja,
  ru,
}

export function getTransportsDictionary(locale: Locale): TransportsDictionary {
  return dictionaries[locale] || dictionaries.es
}
