
import { useState } from 'react'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-4 bg-[var(--color-black)] px-4 py-3 md:justify-around md:gap-8">
      <a
        href="#hero"
        className="m-1 text-xl font-bold text-[var(--color-gold)] sm:text-2xl"
        aria-label="Everlasting Memories - Home"
        onClick={() => setIsMenuOpen(false)}
      >
        Everlasting{' '}
        <span className="inline-block text-[var(--color-orange)] transition-transform duration-1000 ease-in hover:rotate-360">
          Memories
        </span>
      </a>

      <nav className="relative" aria-label="Main navigation">
        <button
          className="flex h-[46px] w-[46px] flex-col items-center justify-center gap-[6px] rounded-sm border border[var(--color-gold)] bg-transparent md:hidden"
          id="menu-toggle"
          type="button"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          aria-controls="nav-links"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span
            aria-hidden="true"
            className={`h-0.5 w-[22px] bg-[#D4A85A] transition duration-300 ${
              isMenuOpen ? 'translate-y-2 rotate-45' : ''
            }`}
          />
          <span
            aria-hidden="true"
            className={`h-0.5 w-[22px] bg-[#D4A85A] transition duration-300 ${
              isMenuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            aria-hidden="true"
            className={`h-0.5 w-[22px] bg-[#D4A85A] transition duration-300 ${
              isMenuOpen ? '-translate-y-2 -rotate-45' : ''
            }`}
          />
        </button>

        <ul
          id="nav-links"
          className={`${
            isMenuOpen ? 'flex' : 'hidden'
          } absolute right-0 top-[calc(100%+12px)] z-50 w-[min(280px,calc(100vw-2rem))] flex-col gap-0 border border-[rgba(212,168,90,0.3)] bg-[#291c14] p-3 shadow-xl md:static md:flex md:w-auto md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
        >
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block p-4 text-[#FAF7F2] transition-colors duration-200 hover:bg-[rgba(212,168,90,0.08)] hover:text-[#D4A85A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A85A] md:px-3"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export default Header