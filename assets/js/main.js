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
  ScrollTrigger.create({
    trigger: ground,
    start: () => `top top+=${header.offsetHeight / 2}`,
    end: () => `bottom top+=${header.offsetHeight / 2}`,
    onToggle: (self) => {
      if (self.isActive) header.dataset.ink = ground.dataset.ink;
    },
  });
});

/* 2. Hide on the way down, show on the way up.
      The direction is only trusted after DIRECTION_THRESHOLD pixels in one
      direction — a raw reading flips on every stray pixel of trackpad drift and
      makes the bar flicker. */
const DIRECTION_THRESHOLD = 24;
let anchor = window.scrollY;

ScrollTrigger.create({
  start: 0,
  end: 'max',
  onUpdate: (self) => {
    const y = self.scroll();

    /* Always visible near the top. */
    if (y < header.offsetHeight) {
      header.dataset.hidden = 'false';
      anchor = y;
      return;
    }

    const travelled = y - anchor;

    /* Still inside the dead zone, or reversing — keep the anchor at the extreme
       so the threshold is measured from the turning point, not from the last
       event. */
    if (Math.abs(travelled) < DIRECTION_THRESHOLD) {
      const goingDown = header.dataset.hidden === 'true';
      if ((goingDown && travelled < 0) || (!goingDown && travelled > 0)) return;
      anchor = y;
      return;
    }

    header.dataset.hidden = String(travelled > 0);
    anchor = y;
  },
});

/* 3. Reveals. The trigger is the title, not the section and not the content block:
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
