
import { useState } from 'react'
import BookingModal from './BookingModal'

function Hero() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  return (
    <>

        <section
        id="hero"
        className="relative flex min-h-[80vh] items-center overflow-hidden bg-[var(--color-espresso)] bg-cover bg-center px-6 py-16 sm:px-12 md:px-16"
        style={{ backgroundImage: `url('${import.meta.env.BASE_URL}images/Gemini.jpg')`,}}
        >
        <div
            aria-hidden="true"
            className="absolute inset-0 bg-black/60"
        />

        <div
            id="hero-content"
            className="relative z-10 flex max-w-2xl flex-col items-start"
        >
            <p className="mb-6 text-sm font-normal tracking-[0.16em] text-[var(--color-gold)]">
            YOUR MOMENTS. YOUR STORY.
            </p>

            <h1 className="mb-6 text-3xl font-semibold leading-tight tracking-wide text-[var(--color-white)] sm:text-4xl lg:text-5xl">
            Turn Moments Into{' '}
            <span className="text-[var(--color-gold)]">Memories</span>
            </h1>

            <p className="max-w-lg leading-7 text-[var(--color-white)]">
            We capture the emotions, details, and moments that deserve to last forever.
            </p>

            <button
            type="button"
            id="open-booking"
            onClick={() => setIsBookingOpen(true)}
            className="mt-10 rounded-full border border-[var(--color-orange)] bg-[var(--color-orange)] px-6 py-3 font-medium tracking-wide text-[var(--color-white)] transition duration-300 hover:-translate-y-1 hover:border-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-[var(--color-black)] hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)]"
            >
            Capture Your Moment
            </button>
        </div>
        </section>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </>
  )
}

export default Hero