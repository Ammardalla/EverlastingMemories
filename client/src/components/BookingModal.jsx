
  import { useEffect, useRef, useState } from 'react'
  import { useSession } from '../lib/auth-client'

  const packages = [
    { id: '10', photos: 10, price: 30, label: 'Essential' },
    { id: '20', photos: 20, price: 50, label: 'Classic' },
    { id: '30', photos: 30, price: 70, label: 'Premium' },
  ]

  function BookingModal({ isOpen, onClose }) {
    const dialogRef = useRef(null)

    const { data: session, isPending: sessionLoading } = useSession()
    const isLoggedIn = Boolean(session?.user?.id) && !sessionLoading

    const [selectedPackage, setSelectedPackage] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('cash')
    const [status, setStatus] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [bookingConfirmed, setBookingConfirmed] = useState(false)
    const getPackagePrice = (item) => {
    const originalCents = Math.round(item.price * 100)

    const discountedCents = Math.round(
      (originalCents * 90) / 100
    )

    return {
      original: originalCents / 100,
      discounted: discountedCents / 100,
      finalPrice: isLoggedIn
        ? discountedCents / 100
        : originalCents / 100,
    }
  }

    useEffect(() => {
      const dialog = dialogRef.current
      if (!dialog) return

      if (isOpen && !dialog.open) {
        dialog.showModal()
      } else if (!isOpen && dialog.open) {
        dialog.close()
      }
    }, [isOpen])

function resetForm() {
  setSelectedPackage('')
  setPaymentMethod('cash')
  setIsSubmitting(false)
  setBookingConfirmed(false)
  setStatus('')
}

    function handleClose() {
      resetForm()
      onClose()
    }


  async function handleSubmit(event) {
    event.preventDefault()

    const chosenPackage = packages.find(
      (item) => item.id === selectedPackage
    )

if (!chosenPackage || isSubmitting || bookingConfirmed) return
    setIsSubmitting(true)
    setStatus('')

    const formData = new FormData(event.currentTarget)

    const bookingData = {
      name: formData.get('name'),
      email: formData.get('email'),
      service: formData.get('service'),
      date: formData.get('date'),
      packageId: selectedPackage,
      message: formData.get('message'),
      paymentMethod,
    }

    try {
  const response = await fetch(
    'https://everlastingmemories.onrender.com/api/bookings/checkout',
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    }
  )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Could not create your booking.')
      }

if (paymentMethod === 'cash') {
  setBookingConfirmed(true)
  setStatus('')
  return
}

      if (data.checkoutUrl) {
        window.location.assign(data.checkoutUrl)
        return
      }

      throw new Error('Stripe checkout link was not returned.')
    } catch (error) {
      setStatus(error.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }


    return (
      <dialog
        ref={dialogRef}
        aria-labelledby="booking-title"
        onClose={() => {
          resetForm()
          onClose()
        }}
        onCancel={(event) => {
          event.preventDefault()
          handleClose()
        }}
        className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-[680px] overflow-y-auto rounded border border-[rgba(212,168,90,0.35)] bg-[var(--color-black)] p-0 text-[var(--color-white)] shadow-2xl backdrop:bg-[rgba(10,8,7,0.78)] backdrop:backdrop-blur-sm"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-6 border-b border-[rgba(168,149,132,0.2)] px-5 py-8 sm:px-10">
          <div>
            <p className="mb-4 text-xs font-semibold tracking-[0.16em] text-[var(--color-gold)]">
              LET'S CREATE SOMETHING TIMELESS
            </p>

            <h2
              id="booking-title"
              className="text-3xl leading-tight sm:text-5xl"
            >
              Book Your{' '}
              <span className="text-[var(--color-orange)]">Session.</span>
            </h2>

            <p className="mt-4 max-w-[440px] leading-7 text-[var(--color-taupe)]">
              Choose your photography package and let&apos;s create
              something worth remembering.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close booking form"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[rgba(168,149,132,0.4)] bg-transparent text-3xl leading-none transition hover:border-[var(--color-terracotta)] hover:bg-[var(--color-terracotta)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]"
          >
            &times;
          </button>
        </div>

        {bookingConfirmed ? (
  <div className="px-5 py-12 text-center sm:px-10 sm:py-16">
    <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full border border-green-500/40 bg-green-500/10">
      <span className="text-5xl text-green-400">✓</span>
    </div>

    <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-[var(--color-gold)]">
      BOOKING CONFIRMED
    </p>

    <h2 className="mb-5 text-3xl font-semibold sm:text-4xl">
      Thank You!
    </h2>

    <p className="mx-auto max-w-md leading-7 text-[var(--color-taupe)]">
      Your photography session has been successfully booked.
      We look forward to welcoming you to Everlasting Memories.
    </p>

    <div className="mx-auto mt-8 max-w-md rounded-sm border border-[rgba(212,168,90,0.35)] bg-[var(--color-espresso)] p-5">
      <p className="text-sm font-semibold text-[var(--color-gold)]">
        Payment Method
      </p>

      <p className="mt-2 text-lg font-semibold">
        Cash at the Shop
      </p>

      <p className="mt-2 text-sm leading-6 text-[var(--color-taupe)]">
        Your booking is saved. Please pay when you arrive for your photography session.
      </p>
    </div>

    <button
      type="button"
      onClick={handleClose}
      className="mt-8 min-h-12 rounded-sm border border-[var(--color-orange)] bg-[var(--color-orange)] px-8 py-3 text-sm font-semibold text-white transition hover:border-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-[var(--color-black)]"
    >
      Done
    </button>
  </div>
) : (
  <form onSubmit={handleSubmit} className="px-5 py-8 sm:px-10">
          {/* Step 1: Select package */}
          <section aria-labelledby="package-title">
            <div className="mb-5">
              <p className="mb-2 text-xs font-semibold tracking-[0.16em] text-[var(--color-gold)]">
                STEP 01
              </p>

              <h3
                id="package-title"
                className="text-xl font-semibold sm:text-2xl"
              >
                Choose Your Package
              </h3>

              <p className="mt-2 text-sm leading-6 text-[var(--color-taupe)]">
                Select the package that best fits your vision.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {packages.map((item) => {
                const isSelected = selectedPackage === item.id

                return (
                  <label
                    key={item.id}
                    className={`relative flex cursor-pointer flex-col rounded-sm border p-4 transition duration-200 ${
                      isSelected
                        ? 'border-[var(--color-gold)] bg-[rgba(212,168,90,0.10)]'
                        : 'border-[rgba(168,149,132,0.3)] bg-[var(--color-espresso)] hover:border-[var(--color-gold)]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="package"
                      value={item.id}
                      checked={isSelected}
                      onChange={() => {
                        setSelectedPackage(item.id)
                        setStatus('')
                      }}
                      className="sr-only"
                    />

                    <span className="mb-3 flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold tracking-wider text-[var(--color-gold)]">
                        {item.label.toUpperCase()}
                      </span>

                      <span
                        className={`grid h-5 w-5 place-items-center rounded-full border text-xs ${
                          isSelected
                            ? 'border-[var(--color-gold)] bg-[var(--color-gold)] text-[var(--color-black)]'
                            : 'border-[rgba(168,149,132,0.5)]'
                        }`}
                      >
                        {isSelected ? '✓' : ''}
                      </span>
                    </span>

                    <span className="text-3xl font-semibold">
                      {item.photos}
                    </span>

                    <span className="mt-1 text-sm text-[var(--color-taupe)]">
                      Edited Photos
                    </span>

  <div className="mt-4 flex flex-wrap items-baseline gap-2 border-t border-[rgba(168,149,132,0.2)] pt-3">
    {isLoggedIn && (
      <span className="text-sm text-red-400 line-through">
        ${getPackagePrice(item).original.toFixed(2)}
      </span>
    )}

    <span className="text-2xl font-semibold text-[var(--color-orange)]">
      ${getPackagePrice(item).finalPrice.toFixed(2)}
    </span>

    {isLoggedIn && (
      <span className="text-xs font-semibold text-green-400">
        discount 10%
      </span>
    )}
  </div>

                    <span className="mt-1 text-xs text-[var(--color-taupe)]">
                      One-time package
                    </span>
                  </label>
                )
              })}
            </div>
          </section>

          {/* Show the rest only after package selection */}
          {selectedPackage && (
            <>
              {/* Step 2: Personal information */}
              <section className="mt-10 border-t border-[rgba(168,149,132,0.2)] pt-8">
                <p className="mb-2 text-xs font-semibold tracking-[0.16em] text-[var(--color-gold)]">
                  STEP 02
                </p>

                <h3 className="mb-6 text-xl font-semibold sm:text-2xl">
                  Your Details
                </h3>

                <div className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2">
                  <div className="min-w-0">
                    <label
                      htmlFor="booking-name"
                      className="mb-2 block text-sm text-[var(--color-cream)]"
                    >
                      Full Name{' '}
                      <span className="text-[var(--color-gold)]">*</span>
                    </label>

                    <input
                      id="booking-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Your full name"
                      minLength={3}
                      maxLength={100}
                      required
                      className="min-h-12 w-full rounded-sm border border-[rgba(168,149,132,0.4)] bg-[var(--color-espresso)] px-3 py-3 text-sm text-[var(--color-white)] placeholder:text-[var(--color-taupe)] focus-visible:border-[var(--color-gold)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]"
                    />
                  </div>

                  <div className="min-w-0">
                    <label
                      htmlFor="booking-email"
                      className="mb-2 block text-sm text-[var(--color-cream)]"
                    >
                      Email Address{' '}
                      <span className="text-[var(--color-gold)]">*</span>
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
                    <label
                      htmlFor="booking-service"
                      className="mb-2 block text-sm text-[var(--color-cream)]"
                    >
                      Photography Type{' '}
                      <span className="text-[var(--color-gold)]">*</span>
                    </label>

                    <select
                      id="booking-service"
                      name="service"
                      defaultValue=""
                      required
                      className="min-h-12 w-full rounded-sm border border-[rgba(168,149,132,0.4)] bg-[var(--color-espresso)] px-3 py-3 text-sm text-[var(--color-white)] focus-visible:border-[var(--color-gold)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]"
                    >
                      <option value="" disabled>
                        Select a session
                      </option>
                      <option value="portrait">Portraits</option>
                      <option value="couples">Couples</option>
                      <option value="wedding">Weddings</option>
                      <option value="editorial">Editorial</option>
                    </select>
                  </div>

                  <div className="min-w-0">
                    <label
                      htmlFor="booking-date"
                      className="mb-2 block text-sm text-[var(--color-cream)]"
                    >
                      Preferred Date{' '}
                      <span className="text-[var(--color-gold)]">*</span>
                    </label>

                    <input
                      id="booking-date"
                      name="date"
                      type="date"
                      min={new Date().toLocaleDateString('en-CA')}
                      required
                      className="min-h-12 w-full rounded-sm border border-[rgba(168,149,132,0.4)] bg-[var(--color-espresso)] px-3 py-3 text-sm text-[var(--color-white)] focus-visible:border-[var(--color-gold)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]"
                    />
                  </div>

                  <div className="min-w-0 sm:col-span-2">
                    <label
                      htmlFor="booking-message"
                      className="mb-2 block text-sm text-[var(--color-cream)]"
                    >
                      Your Vision{' '}
                      <span className="text-xs text-[var(--color-taupe)]">
                        (Optional)
                      </span>
                    </label>

                    <textarea
                      id="booking-message"
                      name="message"
                      rows={3}
                      maxLength={160}
                      placeholder="Tell us a little about the session you have in mind..."
                      className="min-h-[110px] w-full resize-y rounded-sm border border-[rgba(168,149,132,0.4)] bg-[var(--color-espresso)] px-3 py-3 text-sm text-[var(--color-white)] placeholder:text-[var(--color-taupe)] focus-visible:border-[var(--color-gold)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]"
                    />
                  </div>
                </div>
              </section>

              {/* Step 3: Payment */}
              <section className="mt-10 border-t border-[rgba(168,149,132,0.2)] pt-8">
                <p className="mb-2 text-xs font-semibold tracking-[0.16em] text-[var(--color-gold)]">
                  STEP 03
                </p>


  <h3 className="text-xl font-semibold sm:text-2xl">
    Payment Method
  </h3>

  <p className="mb-5 mt-2 text-sm leading-6 text-[var(--color-taupe)]">
    Choose how you would like to pay for your session.
  </p>

  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
    {/* Cash payment */}
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-sm border p-4 transition ${
        paymentMethod === 'cash'
          ? 'border-[var(--color-gold)] bg-[rgba(212,168,90,0.10)]'
          : 'border-[rgba(168,149,132,0.3)] bg-[var(--color-espresso)] hover:border-[var(--color-gold)]'
      }`}
    >
      <input
        type="radio"
        name="paymentMethod"
        value="cash"
        checked={paymentMethod === 'cash'}
        onChange={() => setPaymentMethod('cash')}
        className="accent-[var(--color-gold)]"
      />

      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[rgba(168,149,132,0.3)] text-xl">
        $
      </span>

      <span>
        <span className="block text-sm font-semibold">
          Cash Payment
        </span>
        <span className="mt-1 block text-xs text-[var(--color-taupe)]">
          Pay in person
        </span>
      </span>
    </label>

    {/* Stripe payment */}
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-sm border p-4 transition ${
        paymentMethod === 'stripe'
          ? 'border-[var(--color-gold)] bg-[rgba(212,168,90,0.10)]'
          : 'border-[rgba(168,149,132,0.3)] bg-[var(--color-espresso)] hover:border-[var(--color-gold)]'
      }`}
    >
      <input
        type="radio"
        name="paymentMethod"
        value="stripe"
        checked={paymentMethod === 'stripe'}
        onChange={() => setPaymentMethod('stripe')}
        className="accent-[var(--color-gold)]"
      />

      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[rgba(168,149,132,0.3)] text-xl">
        ↗
      </span>

      <span>
        <span className="block text-sm font-semibold">
          Online Payment
        </span>
        <span className="mt-1 block text-xs text-[var(--color-taupe)]">
          Credit / Debit Card via Stripe
        </span>
      </span>
    </label>
  </div>

  {/* Stripe information */}
  {paymentMethod === 'stripe' && (
    <div className="mt-4 rounded-sm border border-[rgba(212,168,90,0.35)] bg-[var(--color-espresso)] p-4 sm:p-5">
      <p className="text-sm font-semibold text-[var(--color-gold)]">
        Secure Online Payment
      </p>

      <p className="mb-2 mt-2 text-sm leading-6 text-[var(--color-taupe)]">
        You will be redirected to Stripe's secure checkout page
        to complete your payment.
      </p>
    </div>
  )}

              </section>

              {/* Booking summary */}
              <div className="mt-8 rounded-sm border border-[rgba(168,149,132,0.25)] bg-[var(--color-espresso)] p-4 sm:p-5">
                <p className="mb-4 text-xs font-semibold tracking-[0.16em] text-[var(--color-gold)]">
                  BOOKING SUMMARY
                </p>

                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-[var(--color-taupe)]">
                    {packages.find((item) => item.id === selectedPackage)?.photos} Edited Photos
                  </span>

                  <span className="font-semibold">
                    {packages.find((item) => item.id === selectedPackage)?.label}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4 border-t border-[rgba(168,149,132,0.2)] pt-4">
                  <span className="text-sm text-[var(--color-cream)]">
                    Total
                  </span>

  {(() => {
    const chosenPackage = packages.find(
      (item) => item.id === selectedPackage
    )

    if (!chosenPackage) return null

    const price = getPackagePrice(chosenPackage)

    return (
      <div className="flex items-center gap-3">
        {isLoggedIn && (
          <span className="text-base text-red-400 line-through">
            ${price.original.toFixed(2)}
          </span>
        )}

        <span className="text-2xl font-semibold text-[var(--color-orange)]">
          ${price.finalPrice.toFixed(2)}
        </span>
      </div>
    )
  })()}
                </div>

                <p className="mt-3 text-xs text-[var(--color-taupe)]">
                  Payment: {paymentMethod === 'cash' ? 'Cash' : 'Credit / Debit Card via Stripe'}              </p>
              </div>

              <p className="mt-4 text-xs text-[var(--color-taupe)]">
                * Required fields
              </p>

              <p
                role="status"
                aria-live="polite"
                className="mt-3 text-sm leading-6 text-[var(--color-gold)]"
              >
                {status}
              </p>

              {/* Actions */}
              <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-[rgba(168,149,132,0.2)] pt-6">
                <button
                  type="button"
                  onClick={handleClose}
                  className="min-h-12 rounded-sm border border-[rgba(168,149,132,0.5)] px-5 py-3 text-sm font-semibold text-[var(--color-cream)] transition hover:border-[var(--color-cream)] hover:bg-white/5"
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  disabled={isSubmitting || bookingConfirmed}
                  className="inline-flex min-h-12 items-center justify-center gap-5 rounded-sm border border-[var(--color-orange)] bg-[var(--color-orange)] px-5 py-3 text-sm font-semibold text-[var(--color-white)] transition hover:border-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-[var(--color-black)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting
                    ? 'Processing...'
                    : paymentMethod === 'stripe'
                      ? 'Continue to Payment'
                      : 'Book Session'}

                  <span aria-hidden="true">→</span>
                </button>

              </div>
            </>
          )}
      </form>
)}
    </dialog>
    )
  }

  export default BookingModal
