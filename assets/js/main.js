/* Motion for the landing demo.
   The approach mirrors what cash.app actually does: native scroll, nothing pinned,
   no scroll-jacking. Two behaviours only —
     1. the header takes the ink of the section underneath it,
     2. each section's content reveals once as it enters the viewport.
   The header stays put: no hiding on scroll. */

gsap.registerPlugin(ScrollTrigger);

const header = document.querySelector('.header');
const grounds = gsap.utils.toArray('.section, .footer');

/* 1. Ink follows the ground under the header. The switch point is the header's
      own middle, so the change lands as the boundary passes the logo. */
grounds.forEach((ground) => {
  ScrollTrigger.create({
    trigger: ground,
    start: () => `top top+=${header.offsetHeight / 2}`,
    end: () => `bottom top+=${header.offsetHeight / 2}`,
    onToggle: (self) => {
      if (self.isActive) header.dataset.ink = ground.dataset.ink;
    },
  });
});

/* 2. Reveals. The trigger is the title, not the section and not the content block:
      sections are a full viewport tall with their content centred, so anything
      anchored to the section fires while the content is still a screen below the
      fold — the animation would be over before it came into view.
      Skipped entirely when the visitor asked for less motion. */
gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
  gsap.utils.toArray('.section').forEach((section) => {
    const targets = section.querySelectorAll(
      '.section__title, .section__frame, .section__subtitle, .btn'
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
