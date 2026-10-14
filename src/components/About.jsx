import React from 'react'

const values = [
{
number: '01',
title: 'Emotion',
description: 'Authentic moments, naturally captured.',
},
{
number: '02',
title: 'Story',
description: 'Every photograph has something to say.',
},
{
number: '03',
title: 'Memory',
description: 'Images made to stay with you forever.',
},
]

function About() {
return ( <section
   id="about"
   className="flex min-h-[90vh] flex-col items-center gap-12 bg-[var(--color-black)] px-[8%] py-28 text-[var(--color-white)] min-[900px]:grid min-[900px]:grid-cols-[0.9fr_1.1fr] min-[900px]:items-center min-[900px]:gap-24"
 >
{/* Content */} <div className="max-w-[620px]"> <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold)]">
About Us </p>

    <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[1.05]">
      More Than a
      <span className="block text-[var(--color-orange)]">
        Photograph.
      </span>
    </h2>

    <p className="mb-5 mt-8 max-w-[520px] text-xl leading-relaxed text-[var(--color-white)]">
      We believe the most meaningful photographs are the ones that make
      you feel something.
    </p>

    <p className="max-w-[560px] leading-[1.8] text-[var(--color-taupe)]">
      Everlasting Memories was created to capture genuine emotions,
      beautiful details, and unforgettable moments. From intimate
      portraits to once-in-a-lifetime celebrations, we turn real
      moments into photographs that remain timeless.
    </p>

    {/* Values */}
    <div className="mt-12 flex flex-col gap-6 border-t border-[rgba(168,149,132,0.3)] pt-8 min-[900px]:grid min-[900px]:grid-cols-3 min-[900px]:gap-6">
      {values.map((value) => (
        <div key={value.number}>
          <span className="mb-3 block text-xs tracking-[0.15em] text-[var(--color-gold)]">
            {value.number}
          </span>

          <h3 className="mb-2 text-base font-semibold text-[var(--color-white)]">
            {value.title}
          </h3>

          <p className="text-sm leading-relaxed text-[var(--color-taupe)]">
            {value.description}
          </p>
        </div>
      ))}
    </div>
  </div>

  {/* Image */}
  <div className="group relative h-[400px] w-full overflow-hidden bg-[var(--color-espresso)] min-[900px]:h-[600px]">
    <img
      src={`${import.meta.env.BASE_URL}images/studio.jpg`}
      alt="Photographer capturing a meaningful moment"
      className="block h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.04]"
    />

    <span className="absolute bottom-6 left-6 bg-[rgba(21,21,21,0.75)] px-3 py-2 text-[0.7rem] tracking-[0.2em] text-[var(--color-gold)]">
      CAPTURING MOMENTS
    </span>
  </div>
</section>

)
}

export default About
