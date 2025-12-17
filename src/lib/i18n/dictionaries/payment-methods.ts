import type { Locale } from "@/lib/i18n/config"

export interface PaymentMethodsDictionary {
  title: string
  subtitle: string
  securePayment: string
  quote: string
  quoteAuthor: string
  description: string
  ctaText: string
}

const paymentMethodsDictionaries: Record<Locale, PaymentMethodsDictionary> = {
  es: {
    title: "Métodos de Pago Seguros",
    subtitle: "Paga de forma segura con cualquier tarjeta de crédito o débito",
    securePayment: "Pagos seguros procesados por Izipay",
    quote:
      "La seguridad en cada transacción nos da la confianza para disfrutar de los mejores vinos sin preocupaciones.",
    quoteAuthor: "- Izipay, Socio desde 2020",
    description:
      "Aceptamos todas las tarjetas de crédito y débito. Paga con total seguridad y confianza. Todas las transacciones están protegidas y encriptadas.",
    ctaText: "Más información",
  },
  en: {
    title: "Secure Payment Methods",
    subtitle: "Pay securely with any credit or debit card",
    securePayment: "Secure payments processed by Izipay",
    quote: "Security in every transaction gives us the confidence to enjoy the best wines without worries.",
    quoteAuthor: "- Izipay, Partner since 2020",
    description:
      "We accept all credit and debit cards. Pay with total security and confidence. All transactions are protected and encrypted.",
    ctaText: "Learn more",
  },
  fr: {
    title: "Méthodes de Paiement Sécurisées",
    subtitle: "Payez en toute sécurité avec n'importe quelle carte de crédit ou de débit",
    securePayment: "Paiements sécurisés traités par Izipay",
    quote: "La sécurité dans chaque transaction nous donne la confiance de profiter des meilleurs vins sans soucis.",
    quoteAuthor: "- Izipay, Partenaire depuis 2020",
    description:
      "Nous acceptons toutes les cartes de crédit et de débit. Payez en toute sécurité et confiance. Toutes les transactions sont protégées et cryptées.",
    ctaText: "En savoir plus",
  },
  it: {
    title: "Metodi di Pagamento Sicuri",
    subtitle: "Paga in modo sicuro con qualsiasi carta di credito o debito",
    securePayment: "Pagamenti sicuri elaborati da Izipay",
    quote: "La sicurezza in ogni transazione ci dà la fiducia di goderci i migliori vini senza preoccupazioni.",
    quoteAuthor: "- Izipay, Partner dal 2020",
    description:
      "Accettiamo tutte le carte di credito e debito. Paga con totale sicurezza e fiducia. Tutte le transazioni sono protette e crittografate.",
    ctaText: "Scopri di più",
  },
  de: {
    title: "Sichere Zahlungsmethoden",
    subtitle: "Zahlen Sie sicher mit jeder Kredit- oder Debitkarte",
    securePayment: "Sichere Zahlungen verarbeitet von Izipay",
    quote: "Sicherheit bei jeder Transaktion gibt uns das Vertrauen, die besten Weine ohne Sorgen zu genießen.",
    quoteAuthor: "- Izipay, Partner seit 2020",
    description:
      "Wir akzeptieren alle Kredit- und Debitkarten. Zahlen Sie mit vollständiger Sicherheit und Vertrauen. Alle Transaktionen sind geschützt und verschlüsselt.",
    ctaText: "Mehr erfahren",
  },
  pt: {
    title: "Métodos de Pagamento Seguros",
    subtitle: "Pague com segurança com qualquer cartão de crédito ou débito",
    securePayment: "Pagamentos seguros processados pela Izipay",
    quote: "A segurança em cada transação nos dá a confiança para desfrutar dos melhores vinhos sem preocupações.",
    quoteAuthor: "- Izipay, Parceiro desde 2020",
    description:
      "Aceitamos todos os cartões de crédito e débito. Pague com total segurança e confiança. Todas as transações são protegidas e criptografadas.",
    ctaText: "Saiba mais",
  },
  zh: {
    title: "安全支付方式",
    subtitle: "使用任何信用卡或借记卡安全付款",
    securePayment: "由Izipay处理的安全支付",
    quote: "每笔交易的安全性让我们有信心无忧无虑地享受最好的葡萄酒。",
    quoteAuthor: "- Izipay，自2020年起合作",
    description: "我们接受所有信用卡和借记卡。安全放心地付款。所有交易都受到保护和加密。",
    ctaText: "了解更多",
  },
  ja: {
    title: "安全な支払い方法",
    subtitle: "クレジットカードまたはデビットカードで安全にお支払いください",
    securePayment: "Izipayによる安全な支払い処理",
    quote: "すべての取引のセキュリティにより、心配なく最高のワインを楽しむ自信が生まれます。",
    quoteAuthor: "- Izipay、2020年からのパートナー",
    description:
      "すべてのクレジットカードとデビットカードを受け付けています。完全なセキュリティと信頼で支払いができます。すべての取引は保護され暗号化されています。",
    ctaText: "詳細を見る",
  },
  ru: {
    title: "Безопасные Способы Оплаты",
    subtitle: "Оплачивайте безопасно любой кредитной или дебетовой картой",
    securePayment: "Безопасные платежи обрабатываются Izipay",
    quote: "Безопасность каждой транзакции дает нам уверенность наслаждаться лучшими винами без забот.",
    quoteAuthor: "- Izipay, Партнер с 2020",
    description:
      "Мы принимаем все кредитные и дебетовые карты. Оплачивайте с полной безопасностью и уверенностью. Все транзакции защищены и зашифрованы.",
    ctaText: "Узнать больше",
  },
}

export function getPaymentMethodsDictionary(locale: Locale): PaymentMethodsDictionary {
  return paymentMethodsDictionaries[locale] || paymentMethodsDictionaries.es
}
