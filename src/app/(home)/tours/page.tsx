"use client"

import Header from "@/components/home/header"

export default function ToursPage() {
  const tours = [
    {
      title: "Maxwell Wine Tasting",
      description: "Choose your wine flight. Add snacks for a decadent tasting experience.",
      price: "FROM $20",
      duration: "DURATION: 1 HOUR",
      image: "/wine-tasting-by-fireplace-with-wine-glass.jpg",
    },
    {
      title: "Vineyard Experience",
      description: "Walk through our historic vineyards with expert guides and taste exclusive wines.",
      price: "FROM $45",
      duration: "DURATION: 2 HOURS",
      image: "/green-vineyard-rows-aerial-view.jpg",
    },
    {
      title: "Private Cellar Tour",
      description: "Exclusive access to our wine cellar with sommelier-led tasting session.",
      price: "FROM $75",
      duration: "DURATION: 1.5 HOURS",
      image: "/wine-cellar-with-barrels.jpg",
    },
    {
      title: "Food Pairing Experience",
      description: "Gourmet food paired with our finest wines in an intimate setting.",
      price: "FROM $95",
      duration: "DURATION: 2.5 HOURS",
      image: "/gourmet-food-wine-pairing-elegant.jpg",
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="relative w-full h-[50vh] overflow-hidden">
        <div className="absolute inset-0">
          <video
            src="https://res.cloudinary.com/ddbzpbrje/video/upload/v1763011237/11929213_1920_1080_60fps_lq178j.mp4"
            className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto 
                       -translate-x-1/2 -translate-y-1/2 object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
        <div className="absolute inset-0 bg-black/20 z-10" />

        <div className="absolute bottom-8 left-8 z-20">
          <h2 className="text-white text-2xl md:text-4xl font-bold tracking-wider">WELCOME TO THE</h2>
          <h2 className="text-white text-2xl md:text-4xl font-bold tracking-wider">MAXWELL RESTAURANT</h2>
        </div>
      </section>

      <section className="py-20 px-4 md:px-8 bg-[#F5F3EF]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold tracking-wider text-center mb-2 text-black">Add On To</h1>
          <h2 className="text-5xl md:text-7xl font-bold tracking-wider italic text-center mb-16 text-black">
            Your Experience
          </h2>

          <div className="flex flex-col">
            {tours.map((tour, index) => (
              <div key={index}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-transparent py-8">
                  {/* Image - Left Side (50% width) */}
                  <div className="relative aspect-[4/3] lg:aspect-[16/10] overflow-hidden">
                    <img
                      src={tour.image || "/placeholder.svg"}
                      alt={tour.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content - Right Side */}
                  <div className="p-8 lg:p-12 flex flex-col justify-center bg-[#F5F3EF]">
                    <h3 className="text-3xl md:text-4xl font-bold tracking-wider mb-4 text-black">{tour.title}</h3>

                    {/* Separator line */}
                    <div className="w-full h-px bg-black/20 mb-6" />

                    {/* Description and Price/Duration row */}
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
                      <p className="text-sm leading-relaxed text-black/70 max-w-md">{tour.description}</p>
                      <div className="flex flex-col items-start md:items-end text-xs font-bold tracking-wider text-black shrink-0">
                        <span>{tour.price}</span>
                        <span className="mt-1">{tour.duration}</span>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-wrap gap-4 mb-6">
                      <button className="px-8 py-3 bg-black text-white text-xs font-bold tracking-wider rounded-full hover:bg-black/80 transition-all">
                        MAKE A RESERVATION
                      </button>
                      <button className="px-8 py-3 border border-black text-black text-xs font-bold tracking-wider rounded-full hover:bg-black hover:text-white transition-all">
                        GIFT VOUCHER
                      </button>
                    </div>

                    {/* More Information link */}
                    <button className="text-xs font-bold tracking-wider text-black hover:opacity-70 transition-opacity flex items-center gap-2 self-start">
                      MORE INFORMATION
                      <span>→</span>
                    </button>
                  </div>
                </div>

                {index < tours.length - 1 && (
                  <div className="flex justify-center py-4">
                    <div className="w-32 h-px bg-black/20" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
