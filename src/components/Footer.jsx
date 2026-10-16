import React from "react";

function Footer() {
return ( <footer className="border-t border-[rgba(212,168,90,0.2)] bg-[var(--color-black)] px-[8%] pb-8 pt-20 text-[var(--color-white)]">
{/* Main Footer */} <div className="grid grid-cols-1 gap-8 pb-16 min-[900px]:grid-cols-[1.5fr_0.7fr_0.7fr_0.8fr] min-[900px]:gap-16">

    {/* Brand */}
    <div className="footer-brand">
      <a
        href="#hero"
        className="inline-block text-[clamp(1.5rem,3vw,2rem)] font-semibold tracking-[-0.02em] no-underline"
      >
        Everlasting{' '}
        <span className="text-[var(--color-gold)]">Memories</span>
      </a>

      <p className="mt-5 text-sm leading-[1.7] text-[var(--color-taupe)]">
        Capturing moments.
        <br />
        Preserving memories.
      </p>
    </div>

    {/* Navigation */}
    <div>
      <p className="mb-5 text-[0.7rem] font-semibold tracking-[0.2em] text-[var(--color-gold)]">
        EXPLORE
      </p>

      <nav className="flex flex-row justify-evenly gap-3 min-[900px]:flex-col min-[900px]:items-start" aria-label="footer navigation">
        <a
          href="#hero"
          className="w-fit text-sm text-[var(--color-taupe)] no-underline transition-all duration-300 hover:translate-x-1 hover:text-[var(--color-orange)]"
        >
          Home
        </a>
        <a
          href="#gallery"
          className="w-fit text-sm text-[var(--color-taupe)] no-underline transition-all duration-300 hover:translate-x-1 hover:text-[var(--color-orange)]"
        >
          Gallery
        </a>
        <a
          href="#about"
          className="w-fit text-sm text-[var(--color-taupe)] no-underline transition-all duration-300 hover:translate-x-1 hover:text-[var(--color-orange)]"
        >
          About
        </a>
        <a
          href="#contact"
          className="w-fit text-sm text-[var(--color-taupe)] no-underline transition-all duration-300 hover:translate-x-1 hover:text-[var(--color-orange)]"
        >
          Contact
        </a>
      </nav>
    </div>

    {/* Social Links */}
    <div className="flex flex-col gap-3 min-[900px]:justify-between">
      <p className="mb-1 text-[0.7rem] font-semibold tracking-[0.2em] text-[var(--color-gold)]">
        FOLLOW
      </p>

      <div className="flex flex-row justify-evenly gap-4 min-[900px]:flex-col min-[900px]:items-start min-[900px]:gap-3">
        <a
          href="#"
          className="w-fit text-sm text-[var(--color-taupe)] no-underline transition-all duration-300 hover:translate-x-1 hover:text-[var(--color-orange)]"
        >
          Instagram
        </a>
        <a
          href="#"
          className="w-fit text-sm text-[var(--color-taupe)] no-underline transition-all duration-300 hover:translate-x-1 hover:text-[var(--color-orange)]"
        >
          Facebook
        </a>
      </div>
    </div>

    {/* Creative Message */}
    <div className="flex min-h-[130px] flex-col justify-between border-t border-[rgba(212,168,90,0.35)] pt-4 min-[900px]:border-l min-[900px]:border-t-0 min-[900px]:pl-6 min-[900px]:pt-0">
      <span className="text-[0.7rem] tracking-[0.15em] text-[var(--color-orange)]">
        CAPTURED WITH INTENTION
      </span>

      <p className="mt-6 max-w-[250px] text-[1.3rem] leading-tight text-[var(--color-cream)] min-[900px]:max-w-[150px]">
        Every frame tells a story.
      </p>
    </div>
  </div>

  {/* Footer Bottom */}
  <div className="flex flex-col items-start justify-between gap-2 border-t border-[rgba(168,149,132,0.2)] pt-6 min-[600px]:flex-row min-[600px]:items-center">
    <p className="m-2 text-[0.7rem] tracking-[0.03em] text-[var(--color-taupe)]">
      © 2026 Everlasting Memories. All rights reserved.
    </p>

    <p className="m-2 text-[0.7rem] tracking-[0.03em] text-[var(--color-taupe)]">
      Photography &amp; Visual Stories
    </p>
  </div>
</footer>

)
}

export default Footer
