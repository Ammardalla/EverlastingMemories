import { useEffect, useRef, useState } from 'react'

function BookingModal({ isOpen, onClose }) {
  const dialogRef = useRef(null)
  const [status, setStatus] = useState('')

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen && !dialog.open) {
      dialog.showModal()
    } else if (!isOpen && dialog.open) {
      dialog.close()
    }
  }, [isOpen])

  function handleSubmit(event) {
    event.preventDefault()
    setStatus(
      'Thank you! This demo form is ready, but it does not send a real booking.'
    )
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="booking-title"
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-[680px] overflow-y-auto rounded border border-[rgba(212,168,90,0.35)] bg-[var(--color-black)] p-0 text-[var(--color-white)] shadow-2xl backdrop:bg-[rgba(10,8,7,0.78)] backdrop:backdrop-blur-sm"
    >
      <div className="flex items-start justify-between gap-6 border-b border-[rgba(168,149,132,0.2)] px-5 py-8 sm:px-10">
        <div>
          <p className="mb-4 text-xs font-semibold tracking-[0.16em] text-[var(--color-gold)]">
            LET'S CREATE SOMETHING TIMELESS
          </p>

          <h2 id="booking-title" className="text-3xl leading-tight sm:text-5xl">
            Book Your <span className="text-[var(--color-orange)]">Session.</span>
          </h2>

          <p className="mt-4 max-w-[440px] leading-7 text-[var(--color-taupe)]">
            Tell us about your plans, and let's make something worth remembering.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close booking form"
          autoFocus
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[rgba(168,149,132,0.4)] bg-transparent text-3xl leading-none transition hover:border-[var(--color-terracotta)] hover:bg-[var(--color-terracotta)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]"
        >
          &times;
        </button>
      </div>

      <form onSubmit={handleSubmit} className="px-5 py-8 sm:px-10">
        <div className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2">
          <div className="min-w-0">
            <label htmlFor="booking-name" className="mb-2 block text-sm text-[var(--color-cream)]">
              Full Name <span className="text-[var(--color-gold)]">*</span>
            </label>
            <input
              id="booking-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Your full name"
              minLength={3}
              maxLength={16}
              required
              className="min-h-12 w-full rounded-sm border border-[rgba(168,149,132,0.4)] bg-[var(--color-espresso)] px-3 py-3 text-sm text-[var(--color-white)] placeholder:text-[var(--color-taupe)] focus-visible:border-[var(--color-gold)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]"
            />
          </div>

          <div className="min-w-0">
            <label htmlFor="booking-email" className="mb-2 block text-sm text-[var(--color-cream)]">
              Email Address <span className="text-[var(--color-gold)]">*</span>
            </label>
            <input
              id="booking-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              className="min-h-12 w-full rounded-sm border border-[rgba(168,149,132,0.4)] bg-[var(--color-espresso)] px-3 py-3 text-sm text-[var(--color-white)] placeholder:text-[var(--color-taupe)] focus-visible:border-[var(--color-gold)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]"
            />
          </div>

          <div className="min-w-0">
            <label htmlFor="booking-service" className="mb-2 block text-sm text-[var(--color-cream)]">
              Photography Type <span className="text-[var(--color-gold)]">*</span>
            </label>
            <select
              id="booking-service"
              name="service"
              defaultValue=""
              required
              className="min-h-12 w-full rounded-sm border border-[rgba(168,149,132,0.4)] bg-[var(--color-espresso)] px-3 py-3 text-sm text-[var(--color-white)] focus-visible:border-[var(--color-gold)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]"
            >
              <option value="" disabled>Select a session</option>
              <option value="portrait">Portraits</option>
              <option value="couples">Couples</option>
              <option value="wedding">Weddings</option>
              <option value="editorial">Editorial</option>
            </select>
          </div>

          <div className="min-w-0">
            <label htmlFor="booking-date" className="mb-2 block text-sm text-[var(--color-cream)]">
              Preferred Date <span className="text-[var(--color-gold)]">*</span>
            </label>
            <input
              id="booking-date"
              name="date"
              type="date"
              required
              className="min-h-12 w-full rounded-sm border border-[rgba(168,149,132,0.4)] bg-[var(--color-espresso)] px-3 py-3 text-sm text-[var(--color-white)] focus-visible:border-[var(--color-gold)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]"
            />
          </div>

          <div className="min-w-0 sm:col-span-2">
            <label htmlFor="booking-message" className="mb-2 block text-sm text-[var(--color-cream)]">
              Your Vision <span className="text-xs text-[var(--color-taupe)]">(Optional)</span>
            </label>
            <textarea
              id="booking-message"
              name="message"
              rows="3"
              maxLength={120}
              placeholder="Tell us a little about the session you have in mind..."
              className="min-h-[110px] w-full resize-y rounded-sm border border-[rgba(168,149,132,0.4)] bg-[var(--color-espresso)] px-3 py-3 text-sm text-[var(--color-white)] placeholder:text-[var(--color-taupe)] focus-visible:border-[var(--color-gold)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]"
            />
          </div>
        </div>

        <p className="mt-4 text-xs text-[var(--color-taupe)]">* Required fields</p>

        <p role="status" aria-live="polite" className="mt-3 text-sm leading-6 text-[var(--color-gold)]">
          {status}
        </p>

        <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-[rgba(168,149,132,0.2)] pt-6">
          <button
            type="button"
            onClick={onClose}
            className="min-h-12 rounded-sm border border-[rgba(168,149,132,0.5)] px-5 py-3 text-sm font-semibold text-[var(--color-cream)] transition hover:border-[var(--color-cream)] hover:bg-white/5"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="inline-flex min-h-12 items-center justify-center gap-5 rounded-sm border border-[var(--color-orange)] bg-[var(--color-orange)] px-5 py-3 text-sm font-semibold text-[var(--color-white)] transition hover:border-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-[var(--color-black)]"
          >
            Book Session <span aria-hidden="true">→</span>
          </button>
        </div>
      </form>
    </dialog>
  )
}

export default BookingModal