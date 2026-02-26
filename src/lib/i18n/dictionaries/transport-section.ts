import type { Locale } from "../config"

export interface TransportSectionDictionary {
  title: string
  titleLine2: string
  description: string
  highlights: string[]
  ctaButton: string
  imageLabel: string
}

const transportSectionDictionaries: Record<Locale, TransportSectionDictionary> = {
  es: {
    title: "Transporte Turistico,",
    titleLine2: "Traslados Entre Destinos Clave.",
    description:
      "Ofrecemos buses turisticos y traslados para viajeros que quieren ir de un lugar especifico a otro. Operamos rutas seguras entre zonas turisticas con horarios claros y atencion profesional.",
    highlights: [
      "Rutas entre zonas turisticas principales",
      "Salidas programadas todos los dias",
      "Unidades comodas con conductores expertos",
    ],
    ctaButton: "VER TRANSPORTES",
    imageLabel: "BUSES TURISTICOS",
  },
  en: {
    title: "Tourist Transport,",
    titleLine2: "Transfers Between Key Destinations.",
    description:
      "We provide tourist buses and transfer services for travelers who need to move from one specific place to another. We run safe routes across major tourist areas with reliable schedules and professional service.",
    highlights: [
      "Routes between major tourist zones",
      "Daily departures with clear schedules",
      "Comfortable units with expert drivers",
    ],
    ctaButton: "VIEW TRANSPORTS",
    imageLabel: "TOURIST BUSES",
  },
  fr: {
    title: "Transport Touristique,",
    titleLine2: "Transferts Entre Destinations Cles.",
    description:
      "Nous proposons des bus touristiques et des services de transfert pour les voyageurs qui veulent aller d un lieu specifique a un autre. Nous operons des routes sures avec des horaires clairs et un service professionnel.",
    highlights: [
      "Routes entre zones touristiques principales",
      "Departs quotidiens et ponctuels",
      "Unites confortables avec chauffeurs experts",
    ],
    ctaButton: "VOIR LES TRANSPORTS",
    imageLabel: "BUS TOURISTIQUES",
  },
  it: {
    title: "Trasporto Turistico,",
    titleLine2: "Trasferimenti Tra Destinazioni Chiave.",
    description:
      "Offriamo bus turistici e servizi di trasferimento per viaggiatori che vogliono andare da un luogo specifico a un altro. Gestiamo rotte sicure con orari chiari e servizio professionale.",
    highlights: [
      "Rotte tra principali zone turistiche",
      "Partenze giornaliere e puntuali",
      "Mezzi comodi con autisti esperti",
    ],
    ctaButton: "VEDI TRASPORTI",
    imageLabel: "BUS TURISTICI",
  },
  de: {
    title: "Touristischer Transport,",
    titleLine2: "Transfers Zwischen Wichtigen Zielen.",
    description:
      "Wir bieten touristische Busse und Transferdienste fuer Reisende an, die von einem bestimmten Ort zu einem anderen fahren moechten. Unsere sicheren Routen verbinden touristische Gebiete mit klaren Fahrplaenen.",
    highlights: [
      "Routen zwischen wichtigen Touristenzonen",
      "Taegliche Abfahrten mit festen Zeiten",
      "Komfortable Fahrzeuge mit erfahrenen Fahrern",
    ],
    ctaButton: "TRANSPORTE ANSEHEN",
    imageLabel: "TOURISTENBUSSE",
  },
  pt: {
    title: "Transporte Turistico,",
    titleLine2: "Traslados Entre Destinos Principais.",
    description:
      "Oferecemos onibus turisticos e servicos de traslado para viajantes que precisam ir de um ponto especifico a outro. Operamos rotas seguras com horarios claros e atendimento profissional.",
    highlights: [
      "Rotas entre zonas turisticas principais",
      "Saidas diarias com horarios definidos",
      "Veiculos confortaveis com motoristas experientes",
    ],
    ctaButton: "VER TRANSPORTES",
    imageLabel: "ONIBUS TURISTICOS",
  },
  zh: {
    title: "Tourist Transport,",
    titleLine2: "Transfers Between Key Destinations.",
    description:
      "We provide tourist buses and transfer services for travelers who need to move from one specific place to another. We run safe routes across major tourist areas with reliable schedules and professional service.",
    highlights: [
      "Routes between major tourist zones",
      "Daily departures with clear schedules",
      "Comfortable units with expert drivers",
    ],
    ctaButton: "VIEW TRANSPORTS",
    imageLabel: "TOURIST BUSES",
  },
  ja: {
    title: "Tourist Transport,",
    titleLine2: "Transfers Between Key Destinations.",
    description:
      "We provide tourist buses and transfer services for travelers who need to move from one specific place to another. We run safe routes across major tourist areas with reliable schedules and professional service.",
    highlights: [
      "Routes between major tourist zones",
      "Daily departures with clear schedules",
      "Comfortable units with expert drivers",
    ],
    ctaButton: "VIEW TRANSPORTS",
    imageLabel: "TOURIST BUSES",
  },
  ru: {
    title: "Tourist Transport,",
    titleLine2: "Transfers Between Key Destinations.",
    description:
      "We provide tourist buses and transfer services for travelers who need to move from one specific place to another. We run safe routes across major tourist areas with reliable schedules and professional service.",
    highlights: [
      "Routes between major tourist zones",
      "Daily departures with clear schedules",
      "Comfortable units with expert drivers",
    ],
    ctaButton: "VIEW TRANSPORTS",
    imageLabel: "TOURIST BUSES",
  },
}

export function getTransportSectionDictionary(locale: Locale): TransportSectionDictionary {
  return transportSectionDictionaries[locale]
}
