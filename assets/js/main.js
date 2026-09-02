/* Motion for the landing demo.
   Native page scroll, no wheel hijacking and no smooth-scroll library. The effect
   copied from cash.app is the one that matters: the frame in the middle stays put
   while the two text columns scroll past it, and what the frame holds changes as
   the section changes.
     1. the header and the frame take the ink of the section underneath,
     2. the frame swaps its slide per section, and fades out over the footer,
     3. each section's text reveals once as it enters the viewport.
   The header itself never hides. */

gsap.registerPlugin(ScrollTrigger);

const header = document.querySelector('.header');
const frame = document.querySelector('.stage-frame');
const slides = gsap.utils.toArray('.stage-frame__slide');
const grounds = gsap.utils.toArray('.section, .footer');

function showSlide(id) {
  slides.forEach((slide) => {
    slide.dataset.active = String(slide.dataset.for === id);
  });
}

showSlide(grounds[0].id);

/* 1 & 2. Whatever ground sits under the header drives the ink and the slide. The
          switch point is the header's own middle, so it lands as the boundary
          passes the logo. */
grounds.forEach((ground) => {
  ScrollTrigger.create({
    trigger: ground,
    start: () => `top top+=${header.offsetHeight / 2}`,
    end: () => `bottom top+=${header.offsetHeight / 2}`,
    onToggle: (self) => {
      if (!self.isActive) return;

      header.dataset.ink = ground.dataset.ink;

      if (ground.classList.contains('section')) {
        frame.dataset.ink = ground.dataset.ink;
        showSlide(ground.id);
      }
    },
  });
});

/* The footer is shorter than a screen, so it never reaches the header line and
   cannot drive the frame the way a section does. Fade the frame out across the
   footer's own entrance instead — by the bottom of the page it is gone. */
gsap.to(frame, {
  opacity: 0,
  ease: 'none',
  scrollTrigger: {
    trigger: document.querySelector('.footer'),
    start: 'top bottom',
    end: 'bottom bottom',
    scrub: true,
  },
});

/* 3. Reveals. The trigger is the title, not the section: sections are a full
      viewport tall with their content centred, so anything anchored to the section
      fires while the content is still a screen below the fold and the animation is
      over before it comes into view.
      Skipped entirely when the visitor asked for less motion. */
gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
  gsap.utils.toArray('.section').forEach((section) => {
    const targets = section.querySelectorAll(
      '.section__title, .section__subtitle, .btn'
    );

    gsap.from(targets, {
      y: 24,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      stagger: 0.08,
      scrollTrigger: {
        trigger: section.querySelector('.section__title'),
        start: 'top 90%',
        once: true,
      },
    });
  });
});
