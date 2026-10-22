import React from 'react'

function Contact() {
return ( <section
   id="contact"
   className="flex min-h-[85vh] flex-col items-center gap-12 bg-[var(--color-espresso)] px-[8%] py-28 text-[var(--color-white)] min-[900px]:grid min-[900px]:grid-cols-[1fr_0.8fr] min-[900px]:items-center min-[900px]:gap-24"
 >
{/* Contact Content */} <div className="w-full max-w-[620px]"> <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold)]">
Contact </p>

    <h2 className="text-[clamp(3rem,6vw,5rem)] font-semibold leading-[1.02]">
      Let's Stay
      <span className="block text-[var(--color-orange)]">
        Connected.
      </span>
    </h2>

    <p className="mb-12 mt-8 max-w-[500px] text-base leading-[1.8] text-[var(--color-taupe)]">
      Have a question, an idea, or simply want to say hello? We'd love to
      hear from you.
    </p>

    {/* Contact Details */}
    <div className="grid grid-cols-1 gap-x-12 gap-y-8 border-t border-[rgba(168,149,132,0.3)] pt-8 min-[900px]:grid-cols-2">
      <div>
        <span className="mb-2 block text-[0.7rem] font-semibold tracking-[0.18em] text-[var(--color-gold)]">
          EMAIL
        </span>
        <a
          href="mailto:hello@everlastingmemories.com"
          className="break-words text-sm text-[var(--color-white)] transition-colors duration-300 hover:text-[var(--color-orange)]"
        >
          hello@everlastingmemories.com
        </a>
      </div>

      <div>
        <span className="mb-2 block text-[0.7rem] font-semibold tracking-[0.18em] text-[var(--color-gold)]">
          PHONE
        </span>
        <a
          href="tel:+96100000000"
          className="text-sm text-[var(--color-white)] transition-colors duration-300 hover:text-[var(--color-orange)]"
        >
          +961 00 000 000
        </a>
      </div>

      <div>
        <span className="mb-2 block text-[0.7rem] font-semibold tracking-[0.18em] text-[var(--color-gold)]">
          LOCATION
        </span>
        <p className="text-sm leading-relaxed text-[var(--color-white)]">
          Beirut, Lebanon
        </p>
      </div>

      <div>
        <span className="mb-2 block text-[0.7rem] font-semibold tracking-[0.18em] text-[var(--color-gold)]">
          FOLLOW
        </span>

        <div className="flex flex-wrap gap-5">
          <a
            href="#"
            className="text-sm text-[var(--color-white)] transition-colors duration-300 hover:text-[var(--color-orange)]"
          >
            Instagram
          </a>
          <a
            href="#"
            className="text-sm text-[var(--color-white)] transition-colors duration-300 hover:text-[var(--color-orange)]"
          >
            Facebook
          </a>
        </div>
      </div>
    </div>
  </div>

  {/* Contact Image */}
  <div className="group relative h-[400px] w-full overflow-hidden bg-[var(--color-black)] min-[900px]:h-[600px]">
    <img
      src={`${import.meta.env.BASE_URL}images/contact-img.jpg`}
      alt="Cinematic photography moment"
      className="block h-full w-full object-cover saturate-[0.8] contrast-[1.05] transition-transform duration-700 ease-in-out group-hover:scale-[1.04]"
    />

    {/* Image Overlay */}
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(21,21,21,0.85)] to-[rgba(21,21,21,0.05)]" />

    {/* Quote */}
    <div className="absolute bottom-8 left-8 right-8 z-10">
      <span className="text-[0.7rem] tracking-[0.2em] text-[var(--color-gold)]">
        EVERLASTING
      </span>

      <p className="mt-2 max-w-[350px] text-xl leading-relaxed text-[var(--color-white)]">
        Every moment has a story worth remembering.
      </p>
    </div>
  </div>
</section>

)
}

export default Contact
