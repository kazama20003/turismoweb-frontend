import type { Locale } from "../config"

interface BookingStepItem {
  title: string
  description: string
}

export interface BookingStepsSectionDictionary {
  badge: string
  title: string
  subtitle: string
  description: string
  steps: BookingStepItem[]
  confirmationText: string
  ctaButton: string
}

const bookingStepsSectionDictionaries: Record<Locale, BookingStepsSectionDictionary> = {
  es: {
    badge: "RESERVA FACIL",
    title: "Reservar Es Rapido y Seguro.",
    subtitle: "En pocos pasos aseguras tu viaje.",
    description: "Sigue este flujo para reservar tours o transportes sin complicaciones.",
    steps: [
      {
        title: "Busca Tu Tour o Transporte",
        description: "Explora opciones segun destino, ruta y horario para elegir la mejor alternativa.",
      },
      {
        title: "Haz Clic En Reservar",
        description: "Cuando encuentres la opcion ideal, presiona reservar para iniciar tu compra.",
      },
      {
        title: "Agrega Al Carrito y Paga",
        description: "Revisa tu carrito, confirma datos y completa el pago de forma segura.",
      },
      {
        title: "Recibe Tu Confirmacion",
        description: "Al validarse el pago, enviamos un email de confirmacion con todos los detalles.",
      },
    ],
    confirmationText: "Si el pago es correcto, la confirmacion llega automaticamente a tu correo.",
    ctaButton: "EMPEZAR RESERVA",
  },
  en: {
    badge: "EASY BOOKING",
    title: "Booking Is Fast and Secure.",
    subtitle: "Complete your reservation in just a few steps.",
    description: "Follow this flow to book tours or transports without friction.",
    steps: [
      {
        title: "Find Your Tour or Transport",
        description: "Browse options by destination, route, and schedule to pick the best one.",
      },
      {
        title: "Click Reserve",
        description: "When you find the right option, click reserve to start your order.",
      },
      {
        title: "Add to Cart and Pay",
        description: "Review your cart, confirm your details, and complete secure payment.",
      },
      {
        title: "Get Your Confirmation Email",
        description: "Once payment is approved, we send a confirmation email with all details.",
      },
    ],
    confirmationText: "If your payment is successful, confirmation is sent to your email automatically.",
    ctaButton: "START BOOKING",
  },
  fr: {
    badge: "RESERVATION SIMPLE",
    title: "Reservation Rapide Et Securisee.",
    subtitle: "Finalisez en quelques etapes.",
    description: "Suivez ce flux pour reserver vos tours ou transports facilement.",
    steps: [
      {
        title: "Recherchez Votre Tour ou Transport",
        description: "Parcourez les options par destination, trajet et horaire.",
      },
      {
        title: "Cliquez Sur Reserver",
        description: "Choisissez votre option ideale et demarrez la reservation.",
      },
      {
        title: "Ajoutez Au Panier et Payez",
        description: "Verifiez vos donnees puis effectuez le paiement en toute securite.",
      },
      {
        title: "Recevez Votre Confirmation",
        description: "Apres validation du paiement, vous recevez un email de confirmation.",
      },
    ],
    confirmationText: "Si le paiement est valide, la confirmation arrive automatiquement par email.",
    ctaButton: "COMMENCER LA RESERVATION",
  },
  it: {
    badge: "PRENOTAZIONE FACILE",
    title: "Prenotazione Rapida e Sicura.",
    subtitle: "Completa in pochi passaggi.",
    description: "Segui questo flusso per prenotare tour o trasporti senza complicazioni.",
    steps: [
      {
        title: "Cerca Tour o Trasporto",
        description: "Filtra per destinazione, percorso e orario.",
      },
      {
        title: "Clicca Su Prenota",
        description: "Seleziona la soluzione ideale e avvia la prenotazione.",
      },
      {
        title: "Aggiungi Al Carrello e Paga",
        description: "Controlla i dati e completa il pagamento sicuro.",
      },
      {
        title: "Ricevi La Conferma",
        description: "Dopo il pagamento corretto, ricevi un email di conferma.",
      },
    ],
    confirmationText: "Se il pagamento va a buon fine, la conferma arriva automaticamente via email.",
    ctaButton: "INIZIA PRENOTAZIONE",
  },
  de: {
    badge: "EINFACHE BUCHUNG",
    title: "Buchung Schnell und Sicher.",
    subtitle: "In wenigen Schritten fertig.",
    description: "Folgen Sie diesem Ablauf fuer Touren und Transporte.",
    steps: [
      {
        title: "Tour oder Transport Suchen",
        description: "Optionen nach Ziel, Route und Zeitplan vergleichen.",
      },
      {
        title: "Auf Reservieren Klicken",
        description: "Passende Option waehlen und Buchung starten.",
      },
      {
        title: "In Den Warenkorb und Bezahlen",
        description: "Warenkorb pruefen und sichere Zahlung abschliessen.",
      },
      {
        title: "Bestaetigungs-E-Mail Erhalten",
        description: "Nach erfolgreicher Zahlung senden wir die Bestaetigung per E-Mail.",
      },
    ],
    confirmationText: "Bei erfolgreicher Zahlung erhalten Sie die Bestaetigung automatisch per E-Mail.",
    ctaButton: "BUCHUNG STARTEN",
  },
  pt: {
    badge: "RESERVA FACIL",
    title: "Reserva Rapida e Segura.",
    subtitle: "Conclua em poucos passos.",
    description: "Siga este fluxo para reservar tours e transportes com facilidade.",
    steps: [
      {
        title: "Busque Seu Tour ou Transporte",
        description: "Escolha opcoes por destino, rota e horario.",
      },
      {
        title: "Clique Em Reservar",
        description: "Selecione a melhor opcao e inicie a compra.",
      },
      {
        title: "Adicione Ao Carrinho e Pague",
        description: "Revise os dados e finalize o pagamento seguro.",
      },
      {
        title: "Receba A Confirmacao",
        description: "Apos pagamento aprovado, enviamos email com os detalhes.",
      },
    ],
    confirmationText: "Se o pagamento for aprovado, a confirmacao chega automaticamente por email.",
    ctaButton: "INICIAR RESERVA",
  },
  zh: {
    badge: "轻松预订",
    title: "预订快速且安全。",
    subtitle: "几步即可完成你的行程预订。",
    description: "按照以下流程即可轻松预订旅游线路或交通服务。",
    steps: [
      {
        title: "查找行程或交通",
        description: "按目的地、路线和时间筛选，选择最适合你的方案。",
      },
      {
        title: "点击预订",
        description: "找到理想选项后，点击预订开始下单。",
      },
      {
        title: "加入购物车并支付",
        description: "确认订单信息后，安全完成付款。",
      },
      {
        title: "接收确认邮件",
        description: "支付成功后，我们会发送包含完整信息的确认邮件。",
      },
    ],
    confirmationText: "当付款成功后，确认邮件会自动发送到你的邮箱。",
    ctaButton: "立即预订",
  },
  ja: {
    badge: "かんたん予約",
    title: "予約はスピーディーで安心。",
    subtitle: "数ステップで予約が完了します。",
    description: "以下の流れで、ツアーや交通サービスを簡単に予約できます。",
    steps: [
      {
        title: "ツアーや交通を探す",
        description: "目的地・ルート・時間で比較して最適なプランを選びます。",
      },
      {
        title: "予約ボタンを押す",
        description: "希望のプランが見つかったら、予約を開始します。",
      },
      {
        title: "カート追加と支払い",
        description: "内容を確認し、安全に決済を完了します。",
      },
      {
        title: "確認メールを受け取る",
        description: "支払い完了後、詳細入りの確認メールをお送りします。",
      },
    ],
    confirmationText: "決済が正常に完了すると、確認メールが自動送信されます。",
    ctaButton: "予約をはじめる",
  },
  ru: {
    badge: "ЛЕГКОЕ БРОНИРОВАНИЕ",
    title: "Бронировать Быстро и Безопасно.",
    subtitle: "Всего несколько шагов до готовой брони.",
    description: "Следуйте этому процессу, чтобы легко забронировать тур или транспорт.",
    steps: [
      {
        title: "Найдите Тур или Транспорт",
        description: "Выберите подходящий вариант по направлению, маршруту и времени.",
      },
      {
        title: "Нажмите Забронировать",
        description: "Когда найдете нужный вариант, начните оформление брони.",
      },
      {
        title: "Добавьте в Корзину и Оплатите",
        description: "Проверьте заказ, подтвердите данные и оплатите безопасно.",
      },
      {
        title: "Получите Письмо Подтверждения",
        description: "После успешной оплаты мы отправим письмо со всеми деталями.",
      },
    ],
    confirmationText: "Если платеж прошел успешно, подтверждение автоматически придет на email.",
    ctaButton: "НАЧАТЬ БРОНЬ",
  },
}

export function getBookingStepsSectionDictionary(locale: Locale): BookingStepsSectionDictionary {
  return bookingStepsSectionDictionaries[locale]
}
