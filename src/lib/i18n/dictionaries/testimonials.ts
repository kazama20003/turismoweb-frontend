import { isValidLocale } from "../config"

export interface TestimonialsDictionary {
  title: string
  readMore: string
  testimonial1Name: string
  testimonial1Role: string
  testimonial1Comment: string
  testimonial2Name: string
  testimonial2Role: string
  testimonial2Comment: string
  testimonial3Name: string
  testimonial3Role: string
  testimonial3Comment: string
  testimonial4Name: string
  testimonial4Role: string
  testimonial4Comment: string
}

const testimonialsDictionaries: Record<string, TestimonialsDictionary> = {
  es: {
    title: "Lo Que Dicen Nuestros Clientes",
    readMore: "Leer Más",
    testimonial1Name: "María García",
    testimonial1Role: "Tour Privado - 2023",
    testimonial1Comment:
      "El tour fue increíble. El transporte desde el hotel fue muy cómodo y puntual. Los guías conocen cada rincón de los viñedos y hacen que la experiencia sea única.",
    testimonial2Name: "Carlos Rodríguez",
    testimonial2Role: "Tour en Grupo - 2024",
    testimonial2Comment:
      "Reservamos el transporte con recogida en el aeropuerto y fue impecable. Las camionetas son modernas y confortables. El recorrido por las bodegas superó todas nuestras expectativas.",
    testimonial3Name: "Ana y Pedro Martínez",
    testimonial3Role: "Miembros del Club desde 2021",
    testimonial3Comment:
      "Ser miembros del club nos ha dado acceso a eventos exclusivos y catas privadas. El servicio de transporte para los eventos es siempre de primera, muy profesional y seguro.",
    testimonial4Name: "Luis Fernández",
    testimonial4Role: "Tour Premium - 2024",
    testimonial4Comment:
      "Contraté el tour premium con transporte VIP. Desde que nos recogieron hasta que nos dejaron en el hotel, todo fue perfecto. La comodidad del vehículo hizo el viaje muy placentero.",
  },
  en: {
    title: "What Our Customers Say",
    readMore: "Read More",
    testimonial1Name: "Mary Johnson",
    testimonial1Role: "Private Tour - 2023",
    testimonial1Comment:
      "The tour was incredible. The transport from the hotel was very comfortable and punctual. The guides know every corner of the vineyards and make the experience unique.",
    testimonial2Name: "Charles Williams",
    testimonial2Role: "Group Tour - 2024",
    testimonial2Comment:
      "We booked transport with airport pickup and it was impeccable. The vans are modern and comfortable. The winery tour exceeded all our expectations.",
    testimonial3Name: "Anna & Peter Brown",
    testimonial3Role: "Club Members since 2021",
    testimonial3Comment:
      "Being club members has given us access to exclusive events and private tastings. The transport service for events is always first class, very professional and safe.",
    testimonial4Name: "Louis Davis",
    testimonial4Role: "Premium Tour - 2024",
    testimonial4Comment:
      "I hired the premium tour with VIP transport. From pickup to hotel drop-off, everything was perfect. The vehicle comfort made the journey very pleasant.",
  },
  fr: {
    title: "Ce Que Disent Nos Clients",
    readMore: "Lire Plus",
    testimonial1Name: "Marie Dupont",
    testimonial1Role: "Visite Privée - 2023",
    testimonial1Comment:
      "La visite était incroyable. Le transport depuis l'hôtel était très confortable et ponctuel. Les guides connaissent chaque recoin des vignobles.",
    testimonial2Name: "Charles Martin",
    testimonial2Role: "Visite en Groupe - 2024",
    testimonial2Comment:
      "Nous avons réservé le transport avec prise en charge à l'aéroport et c'était impeccable. Les véhicules sont modernes et confortables.",
    testimonial3Name: "Anne & Pierre Bernard",
    testimonial3Role: "Membres du Club depuis 2021",
    testimonial3Comment:
      "Être membres du club nous a donné accès à des événements exclusifs et des dégustations privées. Le service de transport est toujours de première classe.",
    testimonial4Name: "Louis Dubois",
    testimonial4Role: "Visite Premium - 2024",
    testimonial4Comment:
      "J'ai réservé la visite premium avec transport VIP. De la prise en charge au retour à l'hôtel, tout était parfait. Le confort du véhicule était exceptionnel.",
  },
  it: {
    title: "Cosa Dicono I Nostri Clienti",
    readMore: "Leggi Di Più",
    testimonial1Name: "Maria Rossi",
    testimonial1Role: "Tour Privato - 2023",
    testimonial1Comment:
      "Il tour è stato incredibile. Il trasporto dall'hotel era molto comodo e puntuale. Le guide conoscono ogni angolo dei vigneti.",
    testimonial2Name: "Carlo Bianchi",
    testimonial2Role: "Tour di Gruppo - 2024",
    testimonial2Comment:
      "Abbiamo prenotato il trasporto con ritiro in aeroporto ed è stato impeccabile. I veicoli sono moderni e confortevoli.",
    testimonial3Name: "Anna e Pietro Verdi",
    testimonial3Role: "Membri del Club dal 2021",
    testimonial3Comment:
      "Essere membri del club ci ha dato accesso a eventi esclusivi e degustazioni private. Il servizio di trasporto è sempre di prima classe.",
    testimonial4Name: "Luigi Ferrari",
    testimonial4Role: "Tour Premium - 2024",
    testimonial4Comment:
      "Ho prenotato il tour premium con trasporto VIP. Dal ritiro al rientro in hotel, tutto era perfetto. Il comfort del veicolo era eccezionale.",
  },
  de: {
    title: "Was Unsere Kunden Sagen",
    readMore: "Mehr Lesen",
    testimonial1Name: "Maria Schmidt",
    testimonial1Role: "Private Tour - 2023",
    testimonial1Comment:
      "Die Tour war unglaublich. Der Transport vom Hotel war sehr komfortabel und pünktlich. Die Guides kennen jeden Winkel der Weinberge.",
    testimonial2Name: "Karl Müller",
    testimonial2Role: "Gruppentour - 2024",
    testimonial2Comment:
      "Wir haben den Transport mit Flughafenabholung gebucht und es war makellos. Die Fahrzeuge sind modern und bequem.",
    testimonial3Name: "Anna & Peter Weber",
    testimonial3Role: "Clubmitglieder seit 2021",
    testimonial3Comment:
      "Als Clubmitglieder haben wir Zugang zu exklusiven Events und privaten Verkostungen. Der Transportservice ist immer erstklassig.",
    testimonial4Name: "Ludwig Fischer",
    testimonial4Role: "Premium Tour - 2024",
    testimonial4Comment:
      "Ich habe die Premium-Tour mit VIP-Transport gebucht. Von der Abholung bis zur Rückkehr ins Hotel war alles perfekt.",
  },
  pt: {
    title: "O Que Dizem Nossos Clientes",
    readMore: "Leia Mais",
    testimonial1Name: "Maria Santos",
    testimonial1Role: "Tour Privado - 2023",
    testimonial1Comment:
      "O tour foi incrível. O transporte desde o hotel foi muito confortável e pontual. Os guias conhecem cada canto dos vinhedos.",
    testimonial2Name: "Carlos Oliveira",
    testimonial2Role: "Tour em Grupo - 2024",
    testimonial2Comment:
      "Reservamos o transporte com busca no aeroporto e foi impecável. Os veículos são modernos e confortáveis.",
    testimonial3Name: "Ana e Pedro Silva",
    testimonial3Role: "Membros do Clube desde 2021",
    testimonial3Comment:
      "Ser membros do clube nos deu acesso a eventos exclusivos e degustações privadas. O serviço de transporte é sempre de primeira.",
    testimonial4Name: "Luís Ferreira",
    testimonial4Role: "Tour Premium - 2024",
    testimonial4Comment:
      "Contratei o tour premium com transporte VIP. Da busca ao retorno ao hotel, tudo foi perfeito. O conforto do veículo foi excepcional.",
  },
  zh: {
    title: "客户评价",
    readMore: "阅读更多",
    testimonial1Name: "王丽",
    testimonial1Role: "私人之旅 - 2023",
    testimonial1Comment: "这次旅行太棒了。从酒店的接送非常舒适准时。导游对葡萄园了如指掌，让这次体验独一无二。",
    testimonial2Name: "张伟",
    testimonial2Role: "团体之旅 - 2024",
    testimonial2Comment: "我们预订了机场接机服务，非常完美。车辆现代舒适。酒庄之旅超出了我们的所有期望。",
    testimonial3Name: "李明和陈红",
    testimonial3Role: "2021年起俱乐部会员",
    testimonial3Comment: "成为俱乐部会员让我们有机会参加独家活动和私人品鉴会。活动的交通服务总是一流的，非常专业安全。",
    testimonial4Name: "刘强",
    testimonial4Role: "高级之旅 - 2024",
    testimonial4Comment: "我预订了带VIP交通的高级之旅。从接机到送回酒店，一切都很完美。车辆的舒适度让旅程非常愉快。",
  },
  ja: {
    title: "お客様の声",
    readMore: "続きを読む",
    testimonial1Name: "田中花子",
    testimonial1Role: "プライベートツアー - 2023",
    testimonial1Comment:
      "ツアーは素晴らしかったです。ホテルからの送迎はとても快適で時間通りでした。ガイドはブドウ園の隅々まで知っていて、ユニークな体験ができました。",
    testimonial2Name: "山田太郎",
    testimonial2Role: "グループツアー - 2024",
    testimonial2Comment:
      "空港送迎付きの交通手段を予約しましたが、完璧でした。車両は最新で快適です。ワイナリーツアーは期待以上でした。",
    testimonial3Name: "佐藤夫妻",
    testimonial3Role: "2021年からのクラブ会員",
    testimonial3Comment:
      "クラブ会員になることで、限定イベントやプライベートテイスティングに参加できるようになりました。イベントの送迎サービスは常に一流です。",
    testimonial4Name: "鈴木一郎",
    testimonial4Role: "プレミアムツアー - 2024",
    testimonial4Comment:
      "VIP送迎付きのプレミアムツアーを予約しました。送迎からホテルまで、すべてが完璧でした。車両の快適さで旅がとても楽しかったです。",
  },
  ru: {
    title: "Что Говорят Наши Клиенты",
    readMore: "Читать Далее",
    testimonial1Name: "Мария Иванова",
    testimonial1Role: "Частный тур - 2023",
    testimonial1Comment:
      "Тур был невероятным. Трансфер из отеля был очень комфортным и пунктуальным. Гиды знают каждый уголок виноградников.",
    testimonial2Name: "Карл Петров",
    testimonial2Role: "Групповой тур - 2024",
    testimonial2Comment:
      "Мы забронировали трансфер с встречей в аэропорту, и это было безупречно. Автомобили современные и комфортные.",
    testimonial3Name: "Анна и Пётр Смирновы",
    testimonial3Role: "Члены клуба с 2021 года",
    testimonial3Comment:
      "Членство в клубе дало нам доступ к эксклюзивным мероприятиям и частным дегустациям. Транспортный сервис всегда первоклассный.",
    testimonial4Name: "Людвиг Волков",
    testimonial4Role: "Премиум тур - 2024",
    testimonial4Comment:
      "Я заказал премиум-тур с VIP-трансфером. От встречи до возвращения в отель всё было идеально. Комфорт автомобиля сделал поездку очень приятной.",
  },
}

export function getTestimonialsDictionary(locale: string): TestimonialsDictionary {
  if (isValidLocale(locale)) {
    return testimonialsDictionaries[locale]
  }
  return testimonialsDictionaries.es
}
