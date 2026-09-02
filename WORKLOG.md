# Worklog

## 2026-09-02 — the frame becomes the closing call to action

**What changed.** `index.html`: the standalone green `.closer__cta` block is gone, replaced
by an empty spacer row; the frame's `closer` slide now holds a real `<a class="stage-frame__cta">`
and the other six slides are marked `aria-hidden`. `assets/css/base.css`: the frame's fill
and outline read `--frame-bg` / `--frame-outline` so JS can take them over, styles for the
label, and `pointer-events` gated on `[data-cta="true"]`. `assets/js/main.js`: a ScrollTrigger
over the approach to the closer that scrubs the frame's width, fill, outline and label.

**Why.** The previous version faded the frame out and showed a separate green block. The
client wanted the frame itself to shrink to 200×150, turn green and take the label.

**How it was verified.** Live DOM at 1440×900, no failed resources. Sampling the approach
with snapping temporarily off: 553×415 tinted at 6% → 465×349 → 376×282 → 288×216 →
**200×150 opaque `rgb(166, 237, 0)`**, the label's opacity tracking 0 → 0.25 → 0.50 → 0.75 →
1.00 and `data-cta` flipping to `true` only at the end. Scrolling back to the hero restores
553×415 and the 6% tint. Closer layout at rest: head 88–220, frame 395–545 centred
horizontally, footer 700–852 with the 48px bottom padding — 175px of air above the frame and
155 below. Re-checked at 1512×830 (139/119) and 1920×1080; the frame lands at exactly
200×150 and the screen fits at all three.

## 2026-09-02 — titles hyphenate, frame reaches 553 at 1440

**What changed.** `assets/css/base.css` only: `.section__title` gets
`hyphens: auto` with `overflow-wrap: break-word` as a fallback, and `--col-min` drops from
400px to 360px. `CONTEXT.md` updated.

**Why.** The client picked option C — clamped padding plus hyphenation — but asked not to
free up space as aggressively as the full version would: a 300px floor puts the frame at
673 on a 1440 screen, which he judged too big for a laptop. 360 was chosen as the middle,
and he expects to tune the number later.

**How it was verified.** Live DOM, three widths, collision sweep over all six frame-bearing
sections comparing each title's text rect and each aside's box against the frame: 1440 →
frame 553, 1512 → 617, 1920 → 760, no collisions and no horizontal overflow at any of them.
Hyphenation is genuinely doing the work, not the `overflow-wrap` fallback: a probe clone of
the marketplaces title at 360px wide measures `scrollWidth` 360 with `hyphens: auto` and 390
with `hyphens: none`, and `document.documentElement.lang` is `ru`. That title now sets in
four lines instead of three.

## 2026-09-02 — closer and footer merged into one screen; the frame gets wider

**What changed.** `index.html`: the standalone `<footer>` is gone — its four columns now
live inside the closer section, which became `.section--closer` holding a `.closer__head`
(title left, subtitle right), a green `.closer__cta` in the middle and `.closer__footer`
along the bottom. The closer's old CTA button under the subtitle was removed; the green
block is the call to action. `assets/css/base.css`: layout for all of that, plus
`--page-pad` and `--col-gap` are now clamped so a narrower screen spends less on edges and
gutters. `assets/js/main.js`: the grounds list is `.section` only, and the fixed frame now
fades out across the approach to the closer instead of over the footer. `CONTEXT.md`
updated on all three points.

**Why.** Client's design for the last screen, and his call that the frame is too small at
1440.

**Two problems this fixed for free.** The page is now exactly 7 × 100vh, so the closer is
the last snap point and centres itself properly — the old footer was ~344px tall and could
not hold a snap point, which left the closer half-scrolled at the end of the page.

**How it was verified.** Live DOM, no failed resources on load.
- 1440×900: head at y=88 under the header, green CTA 473×400 centred horizontally, footer at
  y=700 with the 48px bottom padding — 900 exactly, no overlap between the three rows.
- Frame widths went 416 → **473** at 1440, 488 → **537** at 1512, 760 → 760 at 1920. The
  collision sweep over all six other sections is still clean at 1512×830, and there is no
  horizontal overflow at any of the three widths.
- Scroll: maximum is 5400, snap points are the seven section tops, seven test jumps to
  in-between positions all landed on one (300→0, 1300→900, 2200→1800, 3100→2700, 4000→3600,
  4900→4500, 5399→5400). Ground colour and active slide correct at each; the frame is at
  opacity 0 on the closer.
- 1512 and 1920: the closer fits the screen at both, CTA 437×328 and 760×609.

**Note for the client.** The CTA is not exactly 4:3 — the middle row's height binds first,
so at 1440 it is 473×400 (1.18:1). Ratio or size, whichever should win, is his call.

**Process note.** The previous three commits of mine had swept in a parallel session's
work-in-progress via `git add -A`. That session's finished change (the `--ink-invert`
counter-ink) was committed on its own as `01a3242` before this work started, and this commit
stages only the files this session touched.

## 2026-09-02 — button labels and the logo mark take the counter-ink, not the ground

**What changed.** `assets/js/main.js`: new `COUNTER = { dark: INK.light, light: INK.dark }`,
`coloursOf` returns it, `paint()` takes a third argument and writes `--ink-invert` on
`<html>`, and both the scroll interpolation and the initial paint pass it. `base.css`:
`--ink-invert: var(--c-white)` joins `--ground` and `--ink` as a declared fallback, and
`.btn`, `.btn--secondary:hover` and `.header__mark` read it instead of `var(--ground)`.
`CONTEXT.md` §4: new "The three live colours" table with the reason.

**Why.** Client saw it and rejected it: with the label set to `--ground`, the hero's black
pill carried a *green* label and the logo mark inside its black square was green too. What
is drawn on the ink is the opposite ink, not the page colour. On the two black sections the
ink is white, so the counter is black — a white pill with a black label; "always white"
cannot be literal there.

**How it was verified.** `localhost:4321` at 1440×900, live DOM. Green state (`--ink` black,
`--ink-invert` white): header CTA `background rgb(0,0,0)` + label `rgb(255,255,255)`, logo
square black + `.header__mark` fill `rgb(255,255,255)`, and a real `:hover` on the hero's
secondary button gives `background rgb(0,0,0)` + label `rgb(255,255,255)` — green before,
white now. Black state (`--ink` white, `--ink-invert` black): header CTA white pill with a
`rgb(0,0,0)` label; secondary idle white label and white stroke. Console clean; the eight
404s seen earlier were stale `assets/images/` requests from a load before that directory
existed, and the current load is all 200/304.

**Left undone.** Still no screenshot — the pane is hidden and does not repaint. Reading a
transitioned property mid-flight is also unreliable there: the animation clock is frozen, so
`.btn--secondary`'s colour reads as its start value. Both live readings above were taken
with `transition: none` forced on the element, or on a fresh probe element.

## 2026-09-02 — photographic ground for the customization section (experiment)

**What changed.** New `assets/images/customization.webp` (from Figma node `201:56528`,
1858×2000, 75 KB — the Figma export is a 9 MB PNG, converted with `cwebp -q 80`).
`index.html`: a `.stage-photo` layer and `data-photo="true"` on the customization section.
`assets/css/base.css`: the fixed photo layer, and explicit stacking — photo 0, sections and
footer 1, frame 5, header 10. `assets/js/main.js`: photo opacity joins the colour
interpolation, a scrubbed ±60px parallax runs across the section, and a load-time catch-up
pass was added. `CONTEXT.md` records it as an experiment that may be rolled back.

**Why.** The client asked to try a photograph as one section's background, with a light
parallax so it drifts and dissolves more slowly than the content.

**A real bug found on the way.** A deep link or a reload part-way down the page left the
reveals permanently at `opacity: 0` — ScrollTrigger does not fire `onEnter` for triggers the
page opens below, and with `once: true` they never fired at all. Reproduced at
`/#customization`: `titleOpacity` was `0` and stayed there. The reveals are now collected
into an array, and after `ScrollTrigger.refresh()` any whose trigger the page opened below
is jumped to its end state.

**How it was verified.** Live DOM at 1440×900, image request 200, `img.decode()` succeeds at
1858×2000 with sampled pixels matching the photo. With snapping temporarily off, the photo's
opacity across the passage reads 0.00 at 1800, 0.50 at 2250, 1.00 at 2700, 0.50 at 3150,
0.00 at 3600, and stays 0 everywhere else including both black sections at the end; the
parallax runs 60 → 0 → −60 linearly over the same range. Deep-linking to `/#customization`
now settles with title and subtitle at opacity 1, ground black, photo at 1.

**Harness note.** Screenshots of this section came back pure black several times. The cause
is the tool, not the page: `screenshot` eventually returned *"the Browser pane is not
displayed, so the page is not compositing frames"*. Composited layers (the fixed photo, with
`will-change`) are the first thing to go missing. **The photograph has not been seen by
anyone yet — it needs a human look.**

## 2026-09-02 — footer social icons placed instead of masked

**What changed.** `index.html`: the four `<span class="footer__icon">` masks are `<img>`
again, pointing straight at `assets/icons/*.svg`. `assets/css/base.css`: the `--icon`
custom properties and the `mask` / `-webkit-mask` / `background: var(--ink)` block are gone;
`.footer__icon` is now just `display: block; width: 40px; height: 40px`. `CONTEXT.md` §7
gains a "Social icons" subsection with the measurement and the rule, and §10 gains node
`201:56530`.

**Why.** The icons rendered as solid squares. Cause is the assets, not the CSS: each file is
a white squircle badge whose glyph is carved out of the badge path over a `#0F0F0F`
backplate, so the glyph is a difference in colour, not in alpha — and `mask` reads alpha.
Nothing is lost by placing them, because the footer ground is black in every state.

**How it was verified.** Rasterised each file to 40×40 in a canvas and counted pixels.
Before, as a mask source: `alpha > 200` over **93.1%** of the box in all four — a solid
square. After, drawing the live `<img>` elements: telegram 1227 white / 251 dark, vk 1251 /
196, mail 1173 / 269, instagram 1152 / 212, 52 transparent corner px each — two colours, the
badge and the glyph. DOM confirms `tagName IMG`, `mask none`, `filter none`, 40×40 box,
`naturalWidth 53`. Pulled fresh SVGs from Figma `201:56530` and diffed them against the
vendored files: identical, byte for byte, all four.

**Left undone.** The screenshot check is still blocked — the browser pane is hidden, the
compositor does not repaint and every screenshot of the footer comes back solid black, so
the evidence above is pixel measurement through canvas, not a visual. The node-level Figma
export is unusable (it bakes a `#1E1E1E` canvas rect in); only the vector-layer export is
clean. The header logo mark keeps its mask — its alpha is real, 52.5% coverage.

## 2026-09-02 — sentence case on every link

**What changed.** `index.html`: the 5 header nav links and the 8 lowercase footer links in
columns 2 and 3 are now sentence case (`продукты` → `Продукты`, `о компании` → `О компании`).
Column 4 was already capitalised; `support@alfasell.com` is left alone. `CONTEXT.md` §4:
header and footer inventories updated, with the rule and the reason recorded.

**Why.** The lowercase nav next to the capitalised legal column read as two different
systems. Client asked for one.

**How it was verified.** Reloaded on `localhost:4321` and read the live DOM: all 5 nav and
all 12 footer link strings; the "first character is not upper case" filter returns `[]`
apart from the email. Done in the markup, not with `text-transform: capitalize` — that
would have produced "Крупному Бизнесу".

**Left undone.** Nothing on this item. Section titles, subtitles and CTA labels untouched.

## 2026-09-02 — colour interpolated against the scroll

**What changed.** The colour system is now two live variables on `<html>`, `--ground` and
`--ink`, lerped by JS against the scroll instead of switched at a line and transitioned.
`assets/css/base.css`: the `[data-ink]` and `body[data-theme]` colour rules are gone,
everything reads the two variables, and the transitions on body and header are removed so
they cannot fight the scrub. `assets/js/main.js`: a ScrollTrigger per adjacent pair of
grounds, `start: 'top bottom'` to `end: 'top top'`, interpolating both colours on
`onUpdate`. `index.html`: the logo mark and the four social icons became masked spans.

**Why.** The client saw the colour arriving late. It did: the switch could only fire once
the section boundary had crossed the header, by which point the section had nearly landed,
and the 0.9s fade then ran on after it. Now the transition zone is exactly the one gesture
that moves one section, so the colour lands with the section.

**Two dead ends, recorded so they are not retried.** Painting the colour on each section
made it arrive as a hard edge sliding up the screen. Moving it to `<body>` with a CSS
transition produced the lag above.

**A trap worth remembering.** `url()` inside a custom property resolves against the
stylesheet that *uses* the property, not the document. An inline `--icon:
url('assets/icons/x.svg')` was fetched from `assets/css/assets/icons/x.svg` and 404'd; the
urls now live in the stylesheet as modifier classes.

**How it was verified.** Live DOM at 1440×900, network clean, no console errors.
- With snapping temporarily off, sampling the hero→capabilities gesture at 0/225/450/675/900
  gives `rgb(166,237,0)` → `(188,242,64)` → `(211,246,128)` → `(233,251,191)` →
  `(255,255,255)`: a real interpolation, complete exactly at the snap point. The ink lerps
  too — mid-way through the smoke→black gesture it reads `rgb(191,191,191)`.
- Scrolling back up restores every colour: black → smoke → hero green.
- All 8 snap positions carry the right body background, header colour and active slide; the
  frame never moves from 512,306; 7 `section:change` events fire; no horizontal overflow.
- Masks resolve: the mark is 24×16 painted with `--ground`, the icons are painted with
  `--ink`, all five svg requests return 200.

**Left undone.** Still verified by measurement — the browser pane here returns no usable
screenshots. Open questions unchanged: the footer's height, and whether the frame should
stay bigger than 416px on a 1440 screen.

## 2026-09-02 — one button padding, matched radii, secondary button style

**What changed.**
- `assets/css/base.css`: `--btn-pad-x-nav` dropped, `--btn-pad-x` is 20px for both button
  sizes. The logo square moved from `--radius` to `--radius-btn`, so it matches the buttons.
  New `.btn--secondary`: no fill, 1px inset-shadow stroke in `var(--ink)`, fills with the
  ink and inverts the label on hover/focus-visible over new `--hover: 0.2s`; no transition
  under `prefers-reduced-motion`.
- `index.html`: all 7 section CTAs are now `.btn .btn--secondary`. The header CTA stays
  primary.
- `CONTEXT.md` §7: control-size table rewritten for the single padding and the shared
  radius, plus a new "Button styles" table.

**Why.** Client items: 20px padding everywhere, the logo square and the buttons must be
rounded the same, and the body of every section needs an outline button that fills on hover.

**How it was verified.** `python3 -m http.server 4321`, Chrome at 1440×900. Computed styles:
section button `padding-inline` 20/20, `border-radius` 32, `corner-shape` squircle,
`background rgba(0,0,0,0)`, `box-shadow inset 0 0 0 1px`; header CTA 20/20 and radius 32;
logo square 52×52, radius 32, squircle. Hover on `#hero` (green): `background rgb(0,0,0)` +
`color rgb(255,255,255)`. Hover on `#customization` (black): `background rgb(255,255,255)` +
`color rgb(0,0,0)`. Screenshot of the hero confirms the fill on hover.

**Follow-up in the same session.** He confirmed the 1px stroke and asked for the frame to
match too, so `.stage-frame` moved to `--radius-btn` as well: every rounded thing on the
page is now 32. Verified — computed `border-radius` 32 and `corner-shape squircle` on the
frame (416×312), the logo square, and both button sizes.

**Left undone.** Hover duration (0.2s) is still my placeholder. Primary buttons have no
hover state. `--radius: 16px` is now only the base of the `* 2` calc — nothing uses it
directly; collapse it to a single token when the number is final. In Safari and Firefox the
`border-radius` fallback clamps 32 on the 52×52 logo square to 26 and draws a full circle;
Chrome's squircle does not. Note: GSAP
reveals freeze mid-animation while the browser pane is hidden (rAF is throttled) — an
artifact of the preview, not a page bug.

## 2026-09-02 — section-by-section snapping

**What changed.** `assets/css/base.css` only: `scroll-snap-type: y mandatory` on `html`,
`scroll-snap-align: start` + `scroll-snap-stop: always` on `.section`, and
`scroll-snap-align: end` on `.footer`. `CONTEXT.md` records it and why Lenis was rejected.

**Why.** The client wants the scroll to be section-by-section with no resting position
between sections. He asked to check Lenis first: `lenis/snap` exists and supports
`proximity | mandatory | lock`, but Lenis replaces native scrolling and its own docs say it
does not coexist with CSS scroll snapping. Native snapping does the job in three
declarations with no dependency.

**How it was verified.** Live DOM at 1440×900. Snap positions are the section tops
0/900/1800/2700/3600/4500/5400 plus the footer at 5744 (the maximum scroll). Ten scrolls to
deliberately-between positions all landed on a snap point: 120→0, 450→0, 1200→900,
1700→1800, 2500→2700, 3300→3600, 4200→4500, 5100→5400, 5600→5744. At all eight resting
positions the theme, header ink, active slide and frame opacity are correct — green/white/
smoke/black/smoke/white/black, ink flipping to `light` on the two black sections, and the
frame faded to 0 at the footer stop.

**Note.** The footer snaps by its bottom edge because it is shorter than a screen; a `start`
alignment would place its snap point past the maximum scroll. This is a workaround for the
still-open question of the footer's height.

## 2026-09-02 — colour cross-fade, section events, column floor, button padding

**What changed.**
- `assets/css/base.css`: the ground colour moved from the sections to `<body>` and
  cross-fades (`background-color var(--fade) ease-in-out`); sections are transparent now.
  New `--fade: 0.9s` drives the body colour, the header ink, the frame fill and the slide
  swap. New `--col-gap`, `--col-min` and a `--frame-w` that derives from them. Button side
  padding split into `--btn-pad-x: 22px` and `--btn-pad-x-nav: 20px`.
- `assets/js/main.js`: `activate(ground)` sets `body[data-theme]`, the header ink, the frame
  ink and the slide, and dispatches a `section:change` CustomEvent on `document`.
- `CONTEXT.md`: records the body-colour mechanism, the event contract, the column floor and
  the button paddings.

**Why.** Four client items: button padding per size, a real cross-fade between section
colours, a slower header recolour, and an event to hang slide swaps on. Plus a bug he hit on
a 14" MacBook — text running into the frame.

**The overlap bug.** Measured, not guessed: the longest unbreakable word in the copy is
`маркетплейсах`, 391px wide in the xl style. At 1512×830 the text columns were 340px, so the
word ran 2px past the frame's left edge. `--col-min` is now 400px and the frame takes what is
left. Re-measure the floor if a longer word ever lands in a title.

**How it was verified.** Live DOM, no console errors.
- Walked all 7 sections: `body[data-theme]` goes green → white → smoke → black → smoke →
  white → black, header ink flips `dark`/`light` to match, and 7 `section:change` events
  fired with the right `id/theme/ink`.
- `getComputedStyle(body).transition` is `background-color 0.9s ease-in-out`.
- Button padding: header `2px 20px 0px`, section `2px 22px 0px`.
- `corner-shape` computes to `squircle` on the logo square, the buttons and the frame.
- Collision sweep across all 7 sections comparing the title's text rect and the aside's box
  against the frame: 1512×830 none (frame 488), 1440×900 none (frame 416), 1920×1080 none
  (frame 760), no horizontal overflow.

**Left undone / for the client.** The frame is only 416px wide at 1440 now — the column floor
and the frame compete for the same space. If the frame should stay bigger on small laptops,
either the 64px page padding shrinks there or long words in titles need to break. Also still
open: the footer is too short for the closer section to centre itself. Verified by
measurement only — the browser pane here returns no usable screenshots.

## 2026-09-02 — the frame stays, the text scrolls past it

**What changed.** `index.html`: the seven per-section frames became
`.section__frame-slot` elements that only hold the middle grid column open, and one
`.stage-frame` was added after the header, carrying one slide per section.
`assets/css/base.css`: `.stage-frame` is `position: fixed`, aligned to the middle column via
a shared `--frame-w` and a top offset that matches the section content's optical centre;
slides cross-fade on `[data-active]`. `assets/js/main.js`: the ground trigger now drives the
frame's ink and active slide as well as the header ink, and a scrubbed tween fades the frame
out across the footer's entrance. `CONTEXT.md` rewritten on motion.

**Why.** The earlier teardown of cash.app was wrong — see below — and the client corrected
it. He wants what they actually do: the middle frame holds still while the two text columns
scroll past, and the frame's content changes per section.

**The earlier mistake.** The first reading of cash.app was taken with their nav overlay open.
That state sets `body { overflow: hidden }` and collapses the page to 1280px, so the
scrolling machinery was not in the DOM to be found, and I concluded they do not pin anything.
Read properly: `body { overflow: hidden }` permanently, a `smooth-scroll-manager` element is
the real scroller (`clientHeight` 900, `scrollHeight` 9745), and there are nine
`homepage-scroll-section` elements of exactly one viewport each.

**How it was verified.** Live DOM at 1440×900, no console errors. The fixed frame's rect
matches the hero's slot exactly (x 389, y 214, 662×497). Walking hero → capabilities →
customization → closer → footer → back to top, the frame stays at x 389 / y 214 at every
stop; the active slide follows the section every time; ink flips to `light` on the black
sections; opacity scrubs 1.00 → 0.50 → 0.00 across the footer and returns to 1.00 at the top.

**Left undone / needs a decision.** The footer is only ~344px tall, so the page runs out of
scroll before the closer section can centre itself: at maximum scroll the closer's content
sits about 106px from the top of the screen and the frame is already half faded. The closer
never gets a screen of its own. Raised with the client — the fix is the footer's height, his
call. Still verified by measurement only; the browser pane here returns no usable
screenshots.

## 2026-09-02 — drop the header hiding, double the button radius

**What changed.** `assets/js/main.js`: the scroll-direction ScrollTrigger and all show/hide
logic removed — the header now only recolours. `assets/css/base.css`: the `[data-hidden]`
rule and the opacity/transform transitions gone (only `color 0.6s` left); new
`--radius-btn: calc(var(--radius) * 2)` = 32px on `.btn`, while the logo square and the
frame stay at 16. `index.html`: the `data-hidden` attribute removed. `CONTEXT.md` updated.

**Why.** Client decisions.

**How it was verified.** Live DOM at 1440×900, no console errors: 15 ScrollTriggers left
(8 grounds + 7 reveals), no `data-hidden` attribute anywhere, header transition is
`color 0.6s` only, and after scrolling to 2500 and jittering back to 2400 the header holds
`opacity: 1` / `transform: none`. Radii: buttons 32px, logo square 16px, frame 16px.

**Note for the client.** 32px is more than half of either button height (44 and 52), so the
browser clamps it and both buttons render fully rounded — a squircle capsule rather than the
distinct 32px corner. Anything at or below 22px would keep a visible flat side on the 44px
button.

## 2026-09-02 — fix invisible reveals and header flicker

**What changed.** `assets/js/main.js`. Reveals now trigger on the section title
(`start: 'top 90%'`) instead of the section itself. The header's show/hide only trusts a
direction after 24px of travel in it, and the anchor resets at the turning point.

**Why.** Two real bugs the client hit. Sections are a full viewport tall with their content
centred, so a section-anchored trigger fired while the content was still a full screen below
the fold — every reveal played out of sight, and only the hero (which animates on load)
looked alive. And the raw `self.direction` flipped on a single pixel of trackpad drift, so
the bar flickered.

**How it was verified.** Live DOM at 1440×900, viewport 900px. Before: at each trigger's
start the title sat at 103–108% of the viewport, i.e. off screen, for all 7 sections. After:
all 7 fire with the title at 90% and the frame at 67–75% — both on screen. Header: from
`hidden=true`, ten alternating ±6px jitters left it `true` throughout; a deliberate 30px
reverse set it `false`; near the top it is always `false`.

**Left undone.** Still verified by measurement only — the browser pane in this harness will
not return usable screenshots. Needs a look on a real machine.

## 2026-09-02 — button optical shift back to 1px

**What changed.** `assets/css/base.css`: `.btn` padding `4px 24px 0` -> `2px 24px 0`, so the
label sits 1px below the geometric centre instead of 2px.

**Why.** The client read 2px as overdone.

**How it was verified.** Live DOM at 1440×900: both the 52px header button and the 44px
section button measure a text-box offset of +0.75px from the button centre, down from
+1.75px — a 1px raise.

## 2026-09-02 — motion, squircle everywhere

**What changed.** New `assets/js/main.js` and vendored GSAP 3.15 + ScrollTrigger in
`assets/vendor/` (no CDN, the demo must run off a laptop). Three behaviours: the header
takes the ink of the ground under it, the header hides on scroll down and returns on scroll
up, and each section reveals its content once on entry — the reveals skipped under
`prefers-reduced-motion`. `assets/css/base.css`: header colour/opacity/transform transitions
and the `[data-hidden]` state; `corner-shape: squircle` extended from the logo square to the
buttons and the frame. `CONTEXT.md` records the decision and the cash.app findings.

**Why.** The client picked option A after the teardown showed cash.app does not pin
sections at all. He also clarified that squircle was meant for every rounded corner.

**How it was verified.** Live DOM at 1440×900, GSAP 3.15.0 loaded, 16 ScrollTriggers, no
console errors. Walked all 8 grounds: hero/capabilities/speed/marketplaces/audience →
`dark`, customization/closer/footer → `light`, every one matching the section's own
`data-ink`. Header `data-hidden` goes true scrolling down, false scrolling up, false at the
top. A below-fold title's reveal fires on entry (opacity 1 → 0 → animating in).
`corner-shape` computes to `squircle` on the logo, the buttons and the frame.

**Left undone.** No screenshot: the browser pane in this harness keeps going hidden, which
throttles rAF (ScrollTrigger needed a manual `ScrollTrigger.update()` in tests) and returns
blank or mis-scaled captures. Everything above was verified by measurement, not by eye — the
motion needs a look on a real machine. No parallax on the frame; not discussed.

## 2026-09-02 — CTA casing and optical centring in buttons

**What changed.** `index.html`: the header CTA is `Начать бесплатно`, capitalised like the
other two. `assets/css/base.css`: `.btn` padding is now `4px 24px 0` — the label sits 2px
below the geometric centre, because YFF rides high in its line box.

**Why.** Client decisions. Note the arithmetic: the buttons had no vertical padding to
start with (they are height-driven with the label flex-centred), so +1/-1 was not available
and would only have moved the label 1px anyway — with the height fixed, a shift of N needs
`padding-top: 2N`.

**How it was verified.** Live DOM at 1440×900. All three CTAs read `Начать бесплатно`. Text
box (Range rect) vs button box: header button top 16 height 52 → centre 42, text centre
43.75; hero button top 512 height 44 → centre 534, text centre 535.75. Both +1.75px, and
exactly +2.00px against the same measurement before the change (the residual −0.25 is the
font's own metric asymmetry).

**Left undone.** Motion approach still undecided — cash.app turns out not to pin sections
at all, options are with the client. No JS yet.

## 2026-09-02 — one radius, header top padding, typography audit

**What changed.** `assets/css/base.css`: a single `--radius: 16px` now drives everything
rounded — the logo square, both buttons and the frame; buttons stopped being pills
(they were `999px`). Header top padding down to 16px (sides stay 20px, bottom 20px is still
a placeholder), so the bar is 88px. Header padding split into three tokens. Stale comments
fixed. `CONTEXT.md` updated.

**Why.** Client decisions.

**How it was verified.** Live DOM at 1440×900 (with a cache-buster — see the gotcha below).
Every one of `.header__logo`, `.btn`, `.section__frame` computes `border-radius: 16px`;
header height 88. Typography audit across title, subtitle, nav link, header CTA, section
CTA, footer link and footer copy: all seven compute `YFF RARE | 87%` and are either
`500 / 44px / 44px` (title) or `400 / 18px / 24px / 0.18px` (the other six) — no third
style anywhere.

**Left undone.** Squircle is still only on the logo square; whether buttons and the frame
should get `corner-shape` too is undecided. No JS yet: no navbar ink switching, no motion.

## 2026-09-02 — non-breaking spaces, second pass

**What changed.** `index.html`: 6 more `&nbsp;` in the 7 titles / 7 subtitles, total 23 -> 29.
Glued `для`, `без`, `как`, `под`, `над`, `его` to the following word on lines 37, 63, 72, 76,
115. Nothing else touched.

**Why.** Client wanted glue after one-, two- and three-letter function words, not just the
classic short prepositions. Six is all the agreed word list allows: `и Max&nbsp;—` and
`красивые и с&nbsp;твоей` were left alone because gluing there would weld a short word on
both sides (three-word unbreakable run).

**How it was verified.** `verify.py` in scratchpad: 14 elements found; each string with
`&nbsp;` mapped back to a space is byte-identical to `git show HEAD:index.html`; 0 literal
U+00A0; no unbreakable run of 3+ words. `git diff -U0 -- index.html` touches only lines
37/63/72/76/115, all `section__title` / `section__subtitle`. Not rendered in a browser.

**Left undone.** Not committed. `assets/css/base.css` carries unrelated uncommitted work
from another session — left alone.

## 2026-09-02 — full-bleed header, centred nav, non-breaking spaces

**What changed.** `assets/css/base.css`: the header is now full-bleed with a 20px inset on
top and sides (`--header-pad`), its height derived from that inset plus the 52px controls
rather than fixed; it became a `1fr auto 1fr` grid so the nav sits on the screen's centre
instead of the centre of the leftover space. `index.html`: 23 `&nbsp;` inserted into the 7
titles and 7 subtitles (delegated to a subagent).

**Why.** Client decisions. The nav was visibly off-centre under flex `space-between`.

**How it was verified.** Live DOM at 1440×900: header `x=0 w=1440 h=92`, logo at `x=20`,
CTA right edge at `1420`, nav centre `720` against a viewport centre of `720`. For the
copy: `index.html` with every `&nbsp;` replaced back by a space is byte-identical to the
committed version, no literal U+00A0 in the file, no lines outside the title/subtitle
elements changed, and the rendered DOM carries 23 U+00A0. No horizontal overflow.

**Left undone.** Header height came out at 92px (20 + 52 + 20) — the client asked for a
shorter bar and has not yet given a bottom padding. Still no JS: no navbar ink switching,
no GSAP. Frames empty. Corner radius and the logo square's fill are still placeholders.

**Gotcha.** `python3 -m http.server` plus the browser cache served a stale `index.html`
after an edit; verification silently ran against the old file. Append a cache-buster query
when re-checking.

## 2026-09-02 — md style to 18/24 Regular, squircle logo, first commit

**What changed.** `assets/css/base.css`: style `md` is now Hyper Regular 18/24 (was Medium
22/28), tracking unchanged at 1%; weights moved into `--weight-xl` / `--weight-md` tokens.
The logo square is a squircle — `border-radius` as the fallback, `corner-shape: squircle`
inside `@supports` for Chrome 139+. `CONTEXT.md` updated to match.

**Why.** Client decisions.

**How it was verified.** Live DOM at 1440×900 over the local server: title
`500 / 87% / 44px / 44px`, body `400 / 87% / 18px / 24px / 0.18px`, logo box 52×52 with
computed `corner-shape: squircle` and `border-radius: 14px`, no horizontal overflow.

**Left undone.** Still no JS: no navbar ink switching, no GSAP. Frames empty. Corner radius
value, the square's fill, the mark size inside it and the header height are still
placeholders.

## 2026-09-02 — typography, logo lockup, control heights

**What changed.** `assets/css/base.css`: replaced the placeholder type scale with the
client's two styles — `xl` (Hyper Medium 44/44, titles) and `md` (Hyper Medium 22/28, 1%
tracking, everything else); both map to `font-stretch: 87%; font-weight: 500`. Buttons are
now height-driven: 52 in the header, 44 under subtitles. `index.html`: the header logo is
the mark only, in a 52×52 rounded square; trailing periods removed from all 7 subtitles.
`CONTEXT.md` updated to match.

**Why.** The client fixed the type system and the control sizes.

**How it was verified.** Measured the live DOM at 1440×900 over the local server:
title `500 / 87% / 44px / 44px`, body and nav `500 / 87% / 22px / 28px / 0.22px` tracking,
logo box 52×52, header button 52 high, section button 44 high, subtitles ending in "." — 0,
no horizontal overflow.

**Left undone.** Still no JS: no navbar ink switching, no GSAP. Frames still empty. Logo
square radius, its fill, the mark size inside it and the header height are placeholders
awaiting the client. Nothing committed or pushed.

## 2026-09-02 — project setup, context file, structural markup

**What changed.** Cloned the empty repo. Vendored assets: `assets/fonts/` (YFF RARE VF —
woff2 built from the TTF, plus the source TTF and the static PowerBlack cut),
`assets/logo/` (full lockup + mark, clean vectors from Figma `196:46920`),
`assets/screens/` (4 product screens @2x from Figma `196:46923`), `assets/icons/`
(4 social icons from Figma `37:23880`). Wrote `CONTEXT.md` — the single source of truth for
the project. Wrote `index.html` (header, 7 sections, footer, all v1 copy) and
`assets/css/base.css` (structure and brand colors only). Added `.claude/launch.json` for
the local preview server and a `.gitignore` that excludes it.

**Why.** The client needs a desktop homepage demo to show the board. This step establishes
the shared context and the section skeleton before any visual design lands — the type
scale and the motion are still with the client.

**How it was verified.** Served over `python3 -m http.server 4321` and measured the live
DOM in the browser. At 1440×900: all 7 sections 1440×900 each, backgrounds
`#A6ED00 / #FFF / #E9EBEE / #000 / #E9EBEE / #FFF / #000`, footer `#000`, ink flips to
white on the black sections, `document.fonts.check('700 64px "YFF RARE"')` → `true`,
hero columns 277 / 662 / 277 px, no horizontal overflow. At 1920×1080: 436 / 760 / 436,
no overflow. Font axes and Cyrillic coverage checked with fontTools.

**Left undone.** No JS at all: the navbar ink switching and the per-section GSAP scroll
animation are not built. Frames are empty placeholders by the client's instruction. Type
scale is a placeholder (`--fs-title: 64px` etc.) pending his decision. Nothing committed or
pushed yet. Screenshots of the emulated 1440 viewport came back mis-scaled from the browser
pane, so the layout was verified by measurement rather than by eye.
