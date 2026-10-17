import { useState } from 'react'
import galleryItems from '../data/galleryData'

const filters = ['All', 'Portraits', 'Couples', 'Wedding', 'Editorial',]

function getGalleryClasses(classes) {
  const classList = classes.split(' ')

  let mobileClasses = 'col-span-1 row-span-1'
  let mediumClasses = ''
  let largeClasses = ''

  if (classList.includes('large')) {
    mobileClasses = 'col-span-2 row-span-1'
    mediumClasses = 'min-[900px]:col-span-2 min-[900px]:row-span-2'
    largeClasses = 'min-[1200px]:col-span-2 min-[1200px]:row-span-2'
  }

  if (classList.includes('small')) {
    mobileClasses = 'col-span-1 row-span-1'
    mediumClasses = 'min-[900px]:col-span-1 min-[900px]:row-span-1'
    largeClasses = 'min-[1200px]:col-span-1 min-[1200px]:row-span-1'
  }

  if (classList.includes('tall')) {
    mobileClasses = 'col-span-2 row-span-2'
    mediumClasses = 'min-[900px]:col-span-1 min-[900px]:row-span-2'
    largeClasses = 'min-[1200px]:row-span-2'
  }

  if (classList.includes('wid')) {
    mobileClasses = 'col-span-2 row-span-2'
    mediumClasses = 'min-[900px]:col-span-2 min-[900px]:row-span-1'
    largeClasses = 'min-[1200px]:col-span-2'
  }

  if (classList.includes('lrsm')) {
    mobileClasses = 'col-span-1 row-span-1'
  }

  if (classList.includes('smla')) {
    mobileClasses = 'col-span-2 row-span-1'
  }

  return `${mobileClasses} ${mediumClasses} ${largeClasses}`
}

function Gallery() {
  const [activeFilter, setActiveFilter] = useState('All')

  const filteredItems =
    activeFilter === 'All'
      ? galleryItems
      : galleryItems.filter(
          (item) => item.category === activeFilter,
        )

  return (
    <section
      id="gallery"
      className="bg-[var(--color-cream)] px-[5%] py-16 text-[var(--color-black)] sm:py-20"
    >
      <div className="mb-8 max-w-2xl sm:mb-12">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-orange)]">
          Our Work
        </p>

        <h2 className="mb-4 text-3xl font-semibold leading-tight sm:text-4xl">
          Moments Worth{' '}
          <span className="text-[var(--color-terracotta)]">
            Remembering
          </span>
        </h2>

        <p className="max-w-xl leading-7 text-[#76675B]">
          A collection of stories, emotions, and moments captured to last forever.
        </p>
      </div>

      <div
        className="mb-8 flex flex-wrap gap-3"
        aria-label="Filter gallery by category"
      >
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            aria-pressed={activeFilter === filter}
            className={`rounded-full border px-5 py-2 text-sm transition duration-300 ${
              activeFilter === filter
                ? 'border-[var(--color-orange)] bg-[var(--color-orange)] text-white'
                : 'border-[var(--color-taupe)] bg-transparent text-[var(--color-black)] hover:border-[var(--color-orange)] hover:text-[var(--color-orange)]'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 auto-rows-[220px] gap-4 min-[900px]:grid-cols-4">
        {filteredItems.map((item) => (
          <figure
            key={item.id}
            className={`group relative m-0 overflow-hidden bg-[var(--color-espresso)] ${
                activeFilter === 'All'
                ? getGalleryClasses(item.classes)
                : getGalleryClasses('large')
  }`}          >
            <img
              src={item.image}
              alt={item.alt}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100" />

            <figcaption className="absolute bottom-4 left-4 z-10 text-xs uppercase tracking-[0.15em] text-white opacity-100 transition duration-300 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
              {item.category}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

export default Gallery