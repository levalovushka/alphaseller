/* Motion for the landing demo.
   The approach mirrors what cash.app actually does: native scroll, nothing pinned,
   no scroll-jacking. Three behaviours only —
     1. the header takes the ink of the section underneath it,
     2. the header hides on scroll down and comes back on scroll up,
     3. each section's content reveals once as it enters the viewport. */

gsap.registerPlugin(ScrollTrigger);

const header = document.querySelector('.header');
const grounds = gsap.utils.toArray('.section, .footer');

/* 1. Ink follows the ground under the header. The switch point is the header's
      own middle, so the change lands as the boundary passes the logo. */
grounds.forEach((ground) => {
  const line = () => `top top+=${header.offsetHeight / 2}`;

  ScrollTrigger.create({
    trigger: ground,
    start: line,
    end: () => `bottom top+=${header.offsetHeight / 2}`,
    onToggle: (self) => {
      if (self.isActive) header.dataset.ink = ground.dataset.ink;
    },
  });
});

/* 2. Hide on the way down, show on the way up. Always visible at the very top. */
ScrollTrigger.create({
  start: 0,
  end: 'max',
  onUpdate: (self) => {
    const atTop = self.scroll() < header.offsetHeight;
    header.dataset.hidden = String(!atTop && self.direction === 1);
  },
});

/* 3. Reveals. Skipped entirely when the visitor asked for less motion. */
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
        trigger: section,
        start: 'top 75%',
        once: true,
      },
    });
  });
});
