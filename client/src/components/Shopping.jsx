
import React from 'react'

function Shopping() {
  return (
    <section
      id="shopping"
      className="flex min-h-[85vh] flex-col items-center gap-12 bg-[var(--color-espresso)] px-[8%] py-28 text-[var(--color-white)] min-[900px]:grid min-[900px]:grid-cols-[1fr_1fr] min-[900px]:items-center min-[900px]:gap-20"
    >
      {/* Shopping Content */}
      <div className="w-full max-w-[620px]">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold)]">
          Our Collection
        </p>

        <h2 className="text-[clamp(2.8rem,5vw,4.8rem)] font-semibold leading-[1.05]">
          Turn Moments
          <span className="block text-[var(--color-orange)]">
            into Keepsakes.
          </span>
        </h2>

        <p className="mb-8 mt-8 max-w-[520px] text-lg leading-[1.8] text-[var(--color-taupe)]">
          Some memories deserve more than a place in your gallery.
          Discover beautiful prints, timeless albums, and meaningful
          keepsakes made to bring your favorite moments to life.
        </p>

        <a
          href="/shop"
          className="group inline-flex items-center gap-4 border border-[var(--color-gold)] px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold)] transition-all duration-300 hover:bg-[var(--color-gold)] hover:text-[var(--color-black)]"
        >
          Shop Now
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </a>

        {/* Shopping Highlights */}
        <div className="mt-12 grid grid-cols-3 gap-4 border-t border-[rgba(168,149,132,0.3)] pt-7">
          <div>
            <span className="mb-2 block text-xs tracking-[0.12em] text-[var(--color-gold)]">
              QUALITY
            </span>
            <p className="text-xs leading-relaxed text-[var(--color-taupe)]">
              Premium prints and materials.
            </p>
          </div>

          <div>
            <span className="mb-2 block text-xs tracking-[0.12em] text-[var(--color-gold)]">
              PERSONAL
            </span>
            <p className="text-xs leading-relaxed text-[var(--color-taupe)]">
              Made for your memories.
            </p>
          </div>

          <div>
            <span className="mb-2 block text-xs tracking-[0.12em] text-[var(--color-gold)]">
              TIMELESS
            </span>
            <p className="text-xs leading-relaxed text-[var(--color-taupe)]">
              Treasures to keep forever.
            </p>
          </div>
        </div>
      </div>

      {/* Shopping Image */}
      <div className="group relative h-[420px] w-full overflow-hidden bg-[var(--color-espresso)] min-[900px]:h-[620px]">
        <img
          src={`${import.meta.env.BASE_URL}images/shooping.jpg`}
          alt="Beautiful printed photographs and memory albums"
          loading="lazy"
          className="block h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.04]"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(21,21,21,0.75)] via-transparent to-transparent" />

        <span className="absolute bottom-6 left-6 text-xs tracking-[0.2em] text-[var(--color-gold)]">
          PRINTS · ALBUMS · KEEPSAKES
        </span>
      </div>
    </section>
  )
}

export default Shopping
