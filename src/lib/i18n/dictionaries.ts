import type { Locale } from "./config"
import { getGlobalDictionary, type GlobalDictionary } from "./dictionaries/global"
import { getHomeDictionary, type HomeDictionary } from "./dictionaries/home"
import { getToursDictionary, type ToursDictionary } from "./dictionaries/tours"
import { getVisitDictionary, type VisitDictionary } from "./dictionaries/visit"
import { getClubDictionary, type ClubDictionary } from "./dictionaries/club"
import { getEventsDictionary, type EventsDictionary } from "./dictionaries/events"
import { getAboutDictionary, type AboutDictionary } from "./dictionaries/about"
import { getHeroSectionDictionary, type HeroSectionDictionary } from "./dictionaries/hero-section"
import { getFeaturedSectionDictionary, type FeaturedSectionDictionary } from "./dictionaries/featured-section"
import { getProductsSectionDictionary, type ProductsSectionDictionary } from "./dictionaries/products-section"
import { getTestimonialsDictionary, type TestimonialsDictionary } from "./dictionaries/testimonials"
import { getPaymentMethodsDictionary, type PaymentMethodsDictionary } from "./dictionaries/payment-methods"
export interface DictionarySchema extends GlobalDictionary {
  hero: HomeDictionary["hero"]
  products: HomeDictionary["products"]
  tours: ToursDictionary
  visit: VisitDictionary
  club: ClubDictionary
  events: EventsDictionary
  about: AboutDictionary
  heroSection: HeroSectionDictionary
  featuredSection: FeaturedSectionDictionary
   productsSection: ProductsSectionDictionary
  testimonials: TestimonialsDictionary
  paymentMethods: PaymentMethodsDictionary
}

export type Dictionary = DictionarySchema

export function getDictionary(locale: Locale): DictionarySchema {
  return {
    ...getGlobalDictionary(locale),
    ...getHomeDictionary(locale),
    tours: getToursDictionary(locale),
    visit: getVisitDictionary(locale),
    club: getClubDictionary(locale),
    events: getEventsDictionary(locale),
    about: getAboutDictionary(locale),
      heroSection: getHeroSectionDictionary(locale),
      featuredSection: getFeaturedSectionDictionary(locale),
      productsSection: getProductsSectionDictionary(locale),
    testimonials: getTestimonialsDictionary(locale),
    paymentMethods: getPaymentMethodsDictionary(locale),

  }
}

export { getGlobalDictionary, getHomeDictionary, getToursDictionary, getVisitDictionary, getClubDictionary, getEventsDictionary, getAboutDictionary,getHeroSectionDictionary,
  getFeaturedSectionDictionary,
  getProductsSectionDictionary,
  getTestimonialsDictionary,
  getPaymentMethodsDictionary, }
