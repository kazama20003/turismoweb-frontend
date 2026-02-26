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
  ja: {
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
  ru: {
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
}

export function getBookingStepsSectionDictionary(locale: Locale): BookingStepsSectionDictionary {
  return bookingStepsSectionDictionaries[locale]
}
