# Worklog

## 2026-09-04 — two hero variants killed, two left

**What changed.**

- `index.html`: the switch has two buttons; the `.hero-photo` comment.
- `base.css`: the variants block is rewritten for two — variant 1 is the flat green with the
  portrait (the `:root` default), variant 2 the light-grey photograph with the interface in
  the frame. The `[data-hero="3"]` and `[data-hero="4"]` blocks and the `--hero-frame-photo`
  override are gone; the `display` rules are one line each.
- `main.js`: `VARIANTS` is `[1, 2]`, `HERO_INK` is dark on both, `HERO_VIDEO` is `[2]`, and
  the `localStorage` key is bumped to `:3`.
- `CONTEXT.md`: §5's section rewritten as "The two hero variants", §4's row, and three rows of
  §7's asset table — `hero-full.webp` and `hero.webp` join `hero-green.webp` as unwired.

**Why.** Client, with two screenshots: "вот эти два варианта можно убить вообще. в селекторе
тогда останется два — с зеленым фоном и с мужиком на сером + интерфейс." The two he showed
were the graphite panel with the full square photograph behind the interface and the flat
black panel with the studio shot in the frame — numbered 2 and 3 after yesterday's reorder.

**How it was verified.** In the live page at 1440 with `localStorage` cleared: the switch
renders two buttons, a fresh load lands on `data-hero="1"` with only the first pressed, and
no console errors. Both clicked through:

| | panel | frame | ink | video |
|---|---|---|---|---|
| 1 | flat `rgb(166,237,0)` | `hero-portrait.webp` | black | paused |
| 2 | `hero-smoke.webp` / smoke | video | black | playing |

Screenshotted both.

**Left undone.** `hero-full.webp` (90 KB), `hero.webp` (103 KB) and `hero-green.webp`
(220 KB) are now referenced by nothing. Kept deliberately — this project keeps unwired
photographs — but that is 413 KB of dead weight in the repo if the client never comes back to
them.

**Note on the ink.** Both variants are black-inked, so nothing on the page varies the ink any
more. The per-variant map and the boundary pass's per-frame colour read are kept anyway: they
are what a light variant would need, and they cost one hex parse a frame.

## 2026-09-04 — the portrait from Figma, and the green variant becomes the first one

**What changed.**

- New `assets/images/hero-portrait.webp` (1440×1080, 90 KB) — the low-angle portrait, pulled
  as the raw fill of Figma `308:39424` (4096×3058 JPEG) and cut with
  `cwebp -q 88 -crop 9 0 4077 3058 -resize 1440 1080`.
- **The four hero variants are renumbered.** The flat-green one is variant 1 and the page
  opens on it; the other three kept their order and shifted down. So `base.css`'s per-variant
  blocks, the `display` rules, `HERO_INK`, `HERO_VIDEO` and the four button titles all moved
  by one, and `:root`'s resting `--ink` / `--ink-invert` are variant 1's (black on green) with
  the hero section's `data-ink` now `dark` for a no-JS visitor.
- `main.js`: the `localStorage` key is `alphaseller:hero-variant:2` — a number stored against
  the old order would restore a different variant under the new one.
- `CONTEXT.md`: §4's section table, §5's variant table and note, and four rows of §7's asset
  table.

**Why.** Client, in two messages: the Figma node is this variant with a different photograph
("давай вот это сделаем, подменим фотку"), and then "поставь этот вариант первым, а не
третьим в селекторе в левом нижнем углу, чтобы страница по умолчанию на нем открывалась".

**How it was verified.** The node's own render was pulled and measured against the raw fill
first — head top at 15% of the frame's height, glasses at 24%, the same in both — so the
Figma placement is the full frame, centred, and `center / cover` reproduces it. The source is
1.3395 against the frame's 1.3333, so the crop is half a percent of the width.

In the live page at 1440, `localStorage` cleared, all four clicked through in one pass:

| | panel | frame | ink | video |
|---|---|---|---|---|
| 1 | flat `rgb(166,237,0)` | `hero-portrait.webp` | black | paused |
| 2 | `hero-full.webp` / graphite | video | white | playing |
| 3 | flat `rgb(0,0,0)` | `hero.webp` | white | paused |
| 4 | `hero-smoke.webp` / smoke | video | black | playing |

On a fresh load `data-hero` is `1` and only the first button reads `aria-pressed="true"`.
Screenshotted against the Figma render: same composition.

**Left undone.** Nothing on this piece. The node also shows a nav with `Платформа` and
`Кейсы`, a logo in a white squircle and a wider frame — none of that was asked for and none
of it was touched.

## 2026-09-03 — hero variant 3, third shape: flat green with variant 4's photograph

**What changed.**

- `base.css`: `:root[data-hero="3"]` is a flat `--c-green` again, and the frame's photograph
  becomes a variable — `.hero-photo` reads `--hero-frame-photo`, whose default is variant 2's
  `hero.webp` and which variant 3 sets to `hero-smoke.webp`. The `display` rules now hide the
  photo on 1 and 4 and the video on 2 and 3.
- `main.js`: `HERO_VIDEO` is `[1, 4]`.
- `index.html`: the `.hero-photo` comment.
- `CONTEXT.md`: §5's variant table and note, §7's two asset rows — `hero-green.webp` is
  unwired, `hero-smoke.webp` now serves two variants.

**Why.** Client: "переделаем третий вариант — фон ровный зеленый, а в рамку давай вставим фото
мужчины из четвертого варианта."

**How it was verified.** In the live page at 1440, all four clicked through in one pass:

| | panel | frame | ink | video |
|---|---|---|---|---|
| 1 | `hero-full.webp` / graphite | video | white | playing |
| 2 | flat `rgb(0,0,0)` | `hero.webp` | white | paused |
| 3 | flat `rgb(166,237,0)` | `hero-smoke.webp` | black | paused |
| 4 | `hero-smoke.webp` / smoke | video | black | playing |

Screenshotted variant 3 — the man reads fully inside the frame on the flat green.

**Left undone.** In the 4:3 frame `center / cover` puts him a touch right of centre; a
horizontal position on `--hero-frame-photo` would fix it if it bothers the client.

**Note on the environment.** The other session's dev server on 4321 was gone but the harness
still refused the port, so `.claude/launch.json` gained a second configuration,
`alphaseller-4322`, on port 4322. `.claude/` is gitignored, so this is local only.

## 2026-09-03 — the stack's seam, and a documentation audit

**What changed.**

- `base.css`: new `--case-lap` (the frame's radius). Every case card is a lap taller and pays
  it back in its bottom padding, so it runs on **under** the card after it and the seam has
  nothing showing through. Content box unchanged.
- `CONTEXT.md`, audited against the code rather than from memory. Corrected: the page is
  8 × 100vh, not 7 (two places); the cases row in §4's section table still said "carousel";
  `--col-min` was quoted at 380 and is 356; the frame-width history ended at 544 and it is
  520 at 1440 (720 at 1920); the squircle paragraph still quoted the old 32/44 radii; §7's
  asset table listed `hero.webp` as the morph panel's ground, which is `hero-full.webp` now
  (`hero.webp` is variant 2's frame photograph). Added the rows the table was missing: the
  four partner logos and the closer's photograph. The Cases section gained the lap.
- `base.css` comments: the morph panel's photograph and the hero slide's content are
  per-variant now, and the `.deck-nav` note said the case carousel still had a copy of it.

**Why.** Client on the seam: "из-за скруглений смотри какой подвох. снизу появляется такой
разрывчик между ними нехороший" — with a screenshot. Both sides of the seam are rounded, so
butting them edge to edge left a notch of the ground at each end. Same problem the frame's
curtain has and the same answer: overlap by the radius. Then: "документацию приведи в порядок
… важно чтобы всё было чистенько и актуально."

**How it was verified.** At 1440, with the section parked and the picked card in front: the
active card is 234 tall against a 210 slot, its bottom edge sits **24px** past the next card's
top edge — exactly the radius — and `scrollHeight - clientHeight` is still 0 on all four, so
nothing overflows. Looked at the seam at 5× (a temporary `scale(5)` on the deck): the rounded
corners of each card sit over the card above, no ground anywhere in the seam. Full page
reloaded afterwards: no console errors, frame radius 24, four hero buttons, no card overflow.
The doc claims above were each checked against the file they describe.

**Left undone.** The case copy is still mine and its numbers are invented. The text is four
lines at 1440 and three at 1920.

## 2026-09-03 — the cases become a Wallet stack, in four colours, and the logos get re-cut

**What changed.**

- `index.html`: the cases slide is a `.case-deck__stack` of four `.case` cards, each with a
  `.case__pick` button wrapping its logo and a longer `.case__text`. `data-tone` per card;
  `data-invert` moved to the white card's logo; the `.deck-nav` arrows are gone from this
  slide (the style deck keeps its own).
- `base.css`: the rail and the single full-frame card are replaced by the stack geometry —
  four `--case-*` tokens, `top` off `--slot` and `data-side`, `border-radius: inherit` on the
  stack so the ledges round like the frame, the four tones, `.case__text` in `lg`, and the
  `.case__pick` rules.
- `main.js`: the carousel controller is replaced by the stack controller — `--slot`,
  `data-side`, `data-active`, the pick button's `disabled`, z-index once, and the same
  on-stage gate, which now deals the stack again from the top.
- `assets/logos/*.webp`: all four re-cut, in place. The baked-in black background is keyed
  out (luminance as alpha, artwork forced white); M.Reason is additionally cropped to its own
  pill (rows 24-94 of 120, measured) and inverted first, and its soft edge flooded out with
  the background so it leaves no rim. M.Reason is now 357×71; the other three keep 120.
- `CONTEXT.md`: §4's Cases section rewritten, the partner-logo paragraph rewritten, the red
  and `lg` rows corrected.

**Why.** Four client messages in one go on 2026-09-03: `lg` in the card and a longer text,
Wallet's stack instead of the slider (with a screenshot of Wallet), four coloured cards
("черная, графитовая, красная и белая"), the logos' black backing, and the ledges' rounding.

**How it was verified.** In the live page at 1440 and at 1920.

- Geometry at 1440 (frame 520×390): ledge 60, every card 210 tall, radius 24 on all four,
  `scrollHeight - clientHeight` is 0 on every card — nothing overflows. Tops at rest
  0/60/120/180 with the last card active.
- The mechanic, with a real pointer click on the black card's ledge: `data-active` moved to
  card 0, the other three took `data-side="bottom"` with slots 3/2/1 and tops 210/270/330 —
  and 0 + 210 = 210 is exactly card 1's top, so the active card's bottom edge meets the
  stack below it with no overlap. The picked card's button went `disabled`, the rest enabled.
- At 1920 (frame 720×540): cards 360 tall, text 22px, three lines each, no overflow.
- The logos were composited over all four grounds off the keyed PNGs and looked at before
  installing — the first pass left a visible rim around M.Reason's lettering on red, which is
  what the flood fill fixed.
- Screenshotted the section at 1440 before and after the click.

**Left undone / known.**

- **The card copy is mine and its numbers are invented** — "40% за квартал", "четыре дня",
  "пять маркетплейсов". Needs the client's real cases.
- The text sets in **four** lines at 1440, not the three the "+1 line" implies; at 1920 it is
  three. Trimming it to three everywhere is a copy edit away.
- The keying script is not kept in the repo. A re-pull of these logos from Figma would have
  to redo it — better would be exports with real alpha.
- The pane's screenshot is black at any large scroll offset, so this section was captured the
  same way the closer was: triggers killed, the other sections hidden, this section's own
  state set by hand. Measurements were taken on the untouched page.

## 2026-09-03 — the cases heading gets its middle line

**What changed.** `index.html`: `#audience`'s title from `Работают ⏎ с нами` to
`Работают ⏎ и побеждают ⏎ с нами`. `CONTEXT.md` §4's copy table follows. «и» is tied to
«побеждают» with a non-breaking space, like every other conjunction on the page.

**Why.** Client, with his own break marks: "работают → и побеждают → с нами".

**How it was verified.** Emulated 1440×900, document and stylesheet cache-busted. The title
renders three lines (96px at a 32px line height), does not overflow its 356px column, and
every section is still exactly 900 tall — which matters beyond looks: the wheel controller
stands down if any section outgrows the viewport. Not looked at rendered: a hidden preview
pane will not repaint below the top of the document.

**What is left undone.** Nothing here. Note the cases section itself is mid-rebuild in
another session's working tree (an Apple-Wallet-style stack), so this heading will land on
top of that.

## 2026-09-03 — xl back to 32 at 1440

**What changed.** `assets/css/base.css`: `--fs-xl` back to
`clamp(32px, calc(8px + 1.6667vw), 40px)`, undoing the 28 of the entry below.
`CONTEXT.md` §7 and §5: the same rows put back, and the ramp note rewritten to record the
whole 36 → 32 → 28 → 32 run rather than just the last hop.

**Why.** Client looked at 28 and went back to 32.

**How it was verified.** Measured: 32 at 1440, 33.2 at 1512, 36 at 1680, 40 at 1920. No title
or subtitle overflows at either end.

**Worth noting.** 32 is the one value in that run that sits on xxl's own 1.6667vw ramp, so the
two display sizes hold the same ratio across the window again; 28 had needed a 2.5vw ramp.

## 2026-09-03 — the orb moves 8px further off the corner

**What changed.** `assets/js/tile-shader.js`: `MARGIN` 20 → 28, with the comment.
`CONTEXT.md` §5's orb entry.

**Why.** Client: "орбу надо ещё 8 пикселей отступа точно". `MARGIN` is exactly that number —
CSS px from the tile's corner to the orb's edge — so the change is the one constant.

**How it was verified.** `localhost:4321` at 1440×900. The served file reads 28 (fetched with
`cache: 'reload'`). Then measured off the canvas itself rather than the source: copied the
WebGL canvas into a 2D one and scanned it for lit green pixels.

| | before, per the previous entry | now |
|---|---|---|
| lit body from the left edge | 18 | **26.5** |
| from the bottom edge | 17 | **27** |
| orb diameter | — | 80.5 CSS px |

The canvas is 293×293 CSS at a 587×587 buffer (dpr 2), and it fills the tile exactly —
0 inset on both axes — so the margin is measured against the tile's own corner. The shortfall
against 28 is the glow's soft edge falling under the brightness threshold, and the centre
checks out: 26.5 + 40.25 ≈ 68, which is margin + radius.

**Left undone.** No screenshot — the app does not repaint in this browser pane, and the
growth section comes back black. The canvas readback above is the evidence.

## 2026-09-03 — the orb moves into the bottom-left corner

**What changed.** `assets/js/tile-shader.js`: new `u_margin` uniform and an origin computed
from it — the orb's centre sits a margin plus its resting radius in from the left and bottom
edges, and both the uv and the pointer vector are written around that origin. The margin is
20 CSS px, scaled by the device ratio at draw time. Size untouched.

**Why.** Client: centring it was a mistake; corner, 20px off it, same size.

**How verified.** Live page at 1440×900 and 1920×1080, reading the framebuffer back: the
orb's body (luminance ≥90) sits 18px from the left and 17px from the bottom at 1440, 17/17 at
1920, and measures 82×83 and 109×110 CSS px — the size it was. Its faint halo reaches about
6px closer to the corner, which is what a glow does. Text still on ink: luminance 22-26
across its strip. No 4xx.

**Left undone.** Nothing. The motion is still unseen here — hidden pane, no rAF.

## 2026-09-03 — the two marketplace app icons

**What changed.** `index.html`: two more `.frame-chip` divs in the marketplaces slide.
`assets/css/base.css`: their two rules, and the block's comment now covers four things
rather than two. New `assets/images/marketplaces-ozon.webp` (13 KB) and
`assets/images/marketplaces-megamarket.webp` (8.8 KB). `CONTEXT.md` §7: two asset rows and
a line on multi-fill raw exports.

**Why.** The client added the partner logos to the mockup (`279:55320`) after the first
pass — they had not been inside the frame when I pulled it — and asked for them, with no
motion.

**How it is built.** Same as the other two chips: the mockup's own numbers over 720, each
anchored to the frame edge it crosses. Ozon straddles the right edge (43 out, 70 down),
Megamarket clears the bottom entirely (111 below, 145 in from the left) and sits in the gap
between the frame and the page's bottom padding. Both fade on `--t` with the rest of the
slide and do nothing else.

Assets came from `rawImages`, not the node export — the export mats the icon onto Figma's
`#1E1E1E` and there is no way to get the squircle back out of that. Each icon's raw fill is
a 720×720 square with the corners already in its alpha. Both are lossy at `-q 90`: about a
third of lossless, and they are drawn at 46 and 57 px on a laptop.

**How it was verified.** `localhost:4321` at 1440×900, live DOM against the mockup (frame
520, scale 0.722):

| chip | size | expected | placement | expected |
|---|---|---|---|---|
| ozon | 46×46 | 46×46 | 31 past the right edge, 51 down from the top | 31, 51 |
| megamarket | 57×57 | 57×57 | 80 below the bottom edge, 105 in from the left | 80, 105 |
| conversion | 173×81 | 173×81 | unchanged | — |
| statuses | 118×127 | 118×127 | unchanged | — |

All four chips at opacity 1 with the slide's `--t` at 1; all four assets 200 on the wire.

The app still will not repaint in this browser pane, so as before I served a throwaway page
with the real assets at the measured geometry and screenshotted that: all four sit where the
mockup puts them, corners clean, the Ozon icon crossing the right edge and the Megamarket M
below the frame. Page deleted straight after. **Verified in a browser, not inside the
running site.**

**Left undone.** Nothing on this item. No motion, as asked.

## 2026-09-03 — three stills into the corner, the orb halved and centred

**What changed.** `assets/images/growth-{loyalty,bloggers,partners}.webp` re-pulled from
Figma (the client took their rounded corners off), keyed and trimmed to their objects.
`assets/css/base.css`: those three sit at `left: 0; bottom: 0` — no margin — while the Я/VK
pair keeps the 24px padding; bloggers' height 28% → 30% after the re-export changed its box.
`assets/js/tile-shader.js`: orb radius 0.52 → 0.27, the vertical offset gone, and every
distance constant rescaled with it (rim falloff ×2, lamps ×4, halo ×2, lean 0.16 → 0.10).
`CONTEXT.md` updated.

**Why.** Client's two notes: those three stills go into the bottom-left corner with nothing
around them, and the orb should be about half the size and centred in its tile.

**How verified.** Live page, freshly loaded stylesheet, 1440×900 and 1920×1080. The three
measure 0px from the left edge and 0px from the bottom on both widths; the Я/VK pair still
24/24; visual sides 99, 101, 99, 100 — still balanced; none overlaps its text. The orb's lit
centroid is (0.496, 0.500) of the canvas and its span 29% of the width against 52% before —
centred and halved. It still answers the pointer: centroid moves to 0.457 with the pointer
left, 0.537 right, 0.546 up, 0.466 down, and the lit area grows from 6232 to ~6730 samples.
Text stays on ink: luminance 22-26 across the strip it occupies. No 4xx.

**Left undone.** Nothing on this section. **The motion still has not been seen** — the
Browser pane is hidden here, so every reading came from hand-driven single frames.

## 2026-09-03 — two product cards around the marketplaces frame

**What changed.** `index.html`: two `.frame-chip` divs in the marketplaces slide.
`assets/css/base.css`: the `.frame-chip` block. New `assets/images/marketplaces-conversion.webp`
(4.2 KB) and `assets/images/marketplaces-statuses.svg` (58 KB). Deleted
`assets/images/marketplaces-statuses.webp` — my own first cut of the status card, matted onto
Figma's grey, replaced by the SVG and referenced by nothing. `CONTEXT.md` §7 frame-content
table (two rows plus a note on clean Figma exports) and §10 (the mockup's nodes).

**Why.** Client styled the section in Figma (`279:55320`) and asked for the elements around
the picture; the picture itself was already in the frame. He also said the mockup's left and
right text is wrong — it is section 3's copy — and to ignore it, which is why no copy moved.

**How it is built.** Both cards are flat pictures, not live UI. That is deliberate: the site
has exactly two type styles and both cards are dense product UI at 12–14px, so building them
in DOM would either add a third style or dress the product's UI in the brand's display face.

Every number is the mockup's own at the frame width it was drawn at, 720, written as
`calc(var(--frame-w) * N / 720)` so the cards scale with our frame — at 1440 the frame is 520,
so they land at 72%. Each card is anchored to the frame corner it sits by, so the overhang is
what holds. They cross the frame's box, so the curtain cannot mask them; like the tab strip
they fade on `--t`.

**A trap worth remembering:** `--chip-u: calc(var(--frame-w) / 720)` is a *length*, not a
factor, so `calc(240px * var(--chip-u))` is an area and computes to nothing. Both cards
measured 0×0 the first time. Written out as `var(--frame-w) * N / 720` it is a length again.

**How it was verified.** `localhost:4321` at 1440×900, live DOM against the mockup's numbers
(frame 520 wide, scale 0.722):

| card | size | expected | overhang | expected |
|---|---|---|---|---|
| conversion | 173×81 | 173×81 | 41 left of the frame, 26 down | 41, 26 |
| statuses | 118×127 | 118×127 | 33 inside the right edge, 43 below the bottom | 33, 43 |

`--t` on the slide 1, both chips at opacity 1, both assets 200 on the wire. The corners were
measured before shipping, by decoding each candidate to PAM and reading pixels: the node
exports are `(30,30,30,255)` in all four corners — Figma's canvas — while the raw fill and the
edited SVG are `(0,0,0,0)`.

The app itself will not repaint in this browser pane, so to see the composition I served a
throwaway page with the real assets at the measured geometry and screenshotted that: the white
card hangs off the left edge near the top, the dark list crosses the bottom edge near the
right, corners clean, the green «3» badge reading. The page was deleted straight after. **So
the arrangement is verified in a browser, but not inside the running site.**

**Left undone.** No motion — the cards sit still and fade with the section, which is all that
was asked for. If they should fly out of the frame the way the client described earlier, that
hangs off the same `--t` and is a separate piece of work.

## 2026-09-03 — the closer gets the brand in its heading and a call to action back

**What changed.**

- `index.html`: the closer's heading is "Альфа Селлер работает на твою мечту"; a filled
  `Начать бесплатно` button sits under it, the two wrapped in a new `.closer__lead`.
- `base.css`: `.closer__lead` replaces the `grid-column: 1 / 3` that was on the heading
  itself — a flex column, `gap: 24px`.

**Why.** Client: 'на последнем самом слайде давай в тайтле напишем "Альфа Селлер работает на
твою мечту" и кнопку начать бесплатно продублируем под тайтлом.' Offered stroke / filled /
green for the button; he took filled, like the header's. The wrapper is needed because
`.closer__head` is a three-column grid with `--col-gap` on both axes: a bare button beside
the heading auto-places into the free third column, and a second grid row would space it off
the heading by the column gap.

**How it was verified.** At 1440: `.closer__lead` computes `grid-column: 1 / 3` and is 928
wide, the heading fills its own 560 measure in three lines, the button is 163×40, white plate
(`rgb(255,255,255)`) with a black label, sitting 24 under the heading. Screenshotted and
looked at — white ink over the closer's photograph, legible.

**Verification caveat worth knowing.** The preview pane's screenshot comes back **solid
black** at any large scroll offset, so the closer cannot be captured by scrolling to it. The
shot above was taken by killing the ScrollTriggers, hiding the sections above, and setting
the closer's own declared state by hand (black ground, light ink, `data-photo` on, no frame —
it does not come back there). The DOM measurements were taken on the untouched page first.

**Left undone.** The heading breaks 'Альфа Селлер / работает / на твою мечту' — the natural
wrap at its 560 measure, with a short middle line. Not hand-broken; two lines do not fit
(“Альфа Селлер работает” is ~600 at the 1440 xxl). Raise it if the rag bothers him.

## 2026-09-03 — the tile stills trimmed and balanced by weight

**What changed.** `assets/images/growth-{ads,loyalty,bloggers,partners}.webp` re-cut: each
trimmed with `ffmpeg crop` to its alpha bounding box. `assets/css/base.css`: `.tile__art`
loses the flat 30% height and each still gets one of its own — ads 24%, bloggers 28%,
loyalty 30%, partners 34% — and the heart comes back in line with the rest instead of
reaching into the corner. `CONTEXT.md` records the measure.

**Why.** Client: the bottom-row stills had fallen out of place and the heart was cramped in
its corner. The cause was the padding Figma exports around each object — the Я/VK pair
carried 52px of empty pixels under it and floated, while the other three touched the bottom
of their own boxes. With the padding gone the sizes are set by **visual weight**: the square
root of each one's opaque area, normalised to about 100px against a 293px tile. A flat
height makes the widest, flattest still the heaviest thing on the screen.

**How verified.** Live page with a freshly loaded stylesheet at 1440×900 and 1920×1080, each
still measured off its own pixels: visual side 99, 101, 99, 99 at 1440 and 130, 133, 131, 131
at 1920 — within 2% of each other, where before they ranged over 11%. All four now sit 24px
from the left edge and 24px up from the bottom, drawn widths 153-166 (1440) and 202-220
(1920), none overlaps its text, no 4xx, grid still ends inside the screen.

**Left undone.** Nothing on this section.

## 2026-09-03 — the tile shader becomes a voice-assistant orb that follows the pointer

**What changed.** `assets/js/tile-shader.js` rewritten. The flat marbled field is gone; the
tile now holds an orb: polar coordinates, a noise field on the radius so the edge breathes,
a rim light and three highlights orbiting inside at different speeds, a smoothstep body and
an exponential halo. New uniforms `u_mouse` and `u_hover`, both eased in JS each frame; the
tile leans the orb toward the pointer, ripples the field, brightens and speeds up, and
settles back on `pointerleave`. `CONTEXT.md` records the technique and the reference points.

**Why.** Client rejected the first shader — he wants the thinking / voice-assistant look and
a reaction to the mouse. I read how the ones in that space are built (react-bits' Orb source
on OGL, ElevenLabs' UI orb, `react-native-magic-orb`, a couple of write-ups) and wrote ours
on the same technique rather than importing: they are all React, and the demo has to run
with no network.

**How verified.** Live page at 1440×900 and 1920×1080. The orb is where it should be — the
lit centroid sits in the lower third at rest — and the field responds to the uniforms: with
`u_hover` 1 and the pointer left the centroid moves to 0.436 of the width, right 0.548, top
0.421 of the height against 0.330 at rest, and the lit area grows from 8.8k to 10.9k samples.
Time advances the field. The text stays on ink: luminance ≤26 across the strip the text
actually occupies at 1920. `pointermove` and `pointerleave` dispatched on the tile without
error; the canvas covers the tile and sits under the text (`z-index` 1 on the paragraph).
**Not verified: the motion and the easing.** The Browser pane is hidden here, so
`requestAnimationFrame` never fires — every measurement above came from driving the uniforms
by hand and drawing single frames.

**Left undone.** Nothing outstanding; the feel of the lean and the speed are one constant
each if the client wants them different.

## 2026-09-03 — smaller stills, the heart into its corner, a shader on the last tile

**What changed.** `assets/css/base.css`: `.tile__art` is 30% tall (was 38) and stands on the
tile's 24px padding instead of its edge; the loyalty tile's still moved to the bottom-left
corner with a bleed (left -6%, bottom -5%, 34% tall); `.tile__shader` added. New file
`assets/js/tile-shader.js` and a `<canvas>` in the last tile, wired in `index.html`.
`CONTEXT.md` records all of it.

**Why.** Client: the stills too big, the Я/VK pair jammed into the corner, and the heart was
supposed to reach into the bottom-left corner — I had it against the right edge. The shader
is his too: "своруй где-нибудь красивый переливистый шейдер… зеленый наш можно использовать
как базу". It is written here rather than pulled in — domain-warped fbm is a standard
recipe, and the demo has to run with no network.

**How verified.** Live page at 1440×900 and 1920×1080. Stills: 30% of the tile's height,
24px in from the left and up from the bottom on all four; the heart sits at -18/-15 (1440)
and -23/-19 (1920) — into the corner and cut by it. Shader: WebGL context created, canvas
587² at 1440 and 776² at 1920 (2x its box), pixels read back off the buffer show the green
field, luminance 39-51 across the top where the text is against 63-81 at the foot. No 4xx,
no horizontal overflow. The only console errors on the page came from my own probe
dispatching `section:change` with no detail — `heroFocus` computes correctly on load, so the
real listeners are fine. **The motion is not verified**: the Browser pane is hidden, so
`requestAnimationFrame` never fires there; only the single load-time frame was measured.

**Left undone.** Nothing outstanding on this section.

## 2026-09-03 — the growth tiles get their artwork, and lg comes down

**What changed.** `assets/css/base.css`: `lg` is now 18/24 → 22/28; `.tile` clips its
children; new `.tile__art` layer with one file per tile, `.tile[data-tile="market"]` in the
brand red with white type, and `.tile__mark` for the Alfa "А". `index.html`: each tile
carries its art layer, the first the mark, the last nothing. Added
`assets/images/growth-{ads,loyalty,bloggers,partners}.webp` and `assets/logos/alfa-a.svg`.
`CONTEXT.md`: type table, the tiles section, the asset tables and the node index.

**Why.** Client sent Figma `279:54342` and set the two sizes. The stills export on Figma's
`#1E1E1E` canvas rather than on transparency, so each was keyed on that colour before
encoding — otherwise every tile would carry a grey slab across its foot. The sixth tile
stays bare: a shader is going there.

**How verified.** Live page, freshly loaded stylesheet, both widths. Type computes 18/24 at
1440 and 22/28 at 1920, 3-4 lines a tile, none overflows. The bank tile is
`rgb(220, 32, 12)` with white type and a 42×65 mark. Each still is 38% of the tile's height
and lands at 67-74% of its width — the mockup's own proportion — and every one of them
clears the text box. All five files return 200, no 4xx, no horizontal overflow, grid still
ends inside the screen. Keyed images measured on a canvas: corners fully transparent, fewer
than 30 interior pixels lost per image. **Not verified visually** — the Browser pane is
hidden and screenshots come back blank.

**Left undone.** The shader on the sixth tile.

## 2026-09-03 — the frame's corners go 32 → 24

**What changed.** `base.css`: `--radius: 16px` → `12px`, so `--radius-btn` (the frame, its
slides, the picture layers, the curtain's rounded leading edge, the logo square) is 24 and
`--radius-card` (the growth tiles) follows to 36. `CONTEXT.md` §7's size table and the two
places that quoted 32 by hand.

**Why.** Client: "давай скругления на рамке сделаем чуть поменьше". Offered 28 / 24 / 20; he
took 24, and chose to keep the tiles' +12 relation rather than pin them at 44. Changed at
`--radius` rather than at `--radius-btn` so the "base × 2" structure stands and `--radius`
does not become dead.

**How it was verified.** In the live page at 1440: the frame's computed `border-radius` is
`24px` and the video layer inherits `24px`; `.tile` is `36px`. Drove the hero → capabilities
crossing with snapping off — at t ≈ 1 the morph panel's clip is `inset(256.714px 459.489px
252.719px round 23.9733px)` against a frame rect of top 257, left 460, bottom 253, so it still
lands on the frame exactly and on a true 24; at t = 0.5 the radius is `12px`, half of it.

**Left undone.** Nothing. The logo square's Safari/Firefox clamp noted in §7 is unaffected —
24 on a 48px box is inside the clamp either way.

## 2026-09-03 — a new type style, lg, and the tile text moves to the top

**What changed.** `assets/css/base.css`: `--fs-lg` / `--lh-lg` added to the tokens, the tile
text set in them, and `justify-content` on `.tile` flipped to `flex-start`. `CONTEXT.md`: lg
in the type table, the tiles section rewritten.

**Why.** Client: the text goes to the top edge after all, the illustrations go under it, and
it wants a size of its own — "заведем новый стиль lg под это". **The numbers are mine**:
20/26 at 1440 → 24/30 at 1920, Regular like md rather than Medium like the titles, since it
is a block of text and not a heading. Same 1440→1920 window as md.

**How verified.** Live page with a freshly loaded stylesheet at both widths. 1440: text
computes 20/26, sits 24px off the top edge, runs 3-5 lines, leaves 139-191px under it, no
tile overflows. 1920: 24/30, 3-4 lines, 244-274px under it. Grid still ends inside the
screen (757 of 900, 932 of 1080), no 4xx, no horizontal overflow.

**Left undone.** The illustrations themselves. The lg numbers are a guess until the client
says otherwise.

## 2026-09-03 — a hard break before «клиентов»

**What changed.** `index.html`: the growth heading is now three hand-set lines,
«Приводите / и удерживайте / клиентов». `CONTEXT.md`'s copy table records the breaks.

**Why.** Client set them, the way he sets the other titles' breaks.

**How verified.** Live page at 1440×900 and 1920×1080, reading the rendered lines back off
the DOM with a Range: three rows, exactly as written, at 28px and 40px, no overflow of the
column at either width.

**Left undone.** Nothing for this change.

## 2026-09-03 — hero variant 4 becomes the light-grey photograph, interface in the frame

**What changed.**

- New `assets/images/hero-smoke.webp` (2560×1429, 96 KB) — the same shoot on a light-grey
  studio ground, from a client-supplied 2752×1536 PNG, `cwebp -q 88 -resize 2560 0`.
- `base.css`: `:root[data-hero="4"]` sets `--morph-bg` to that file at `center / cover` over
  smoke; the frame's photo layer is now hidden on 1, 3 **and** 4 — variant 2 is the only one
  left with the man in the frame.
- `main.js`: `HERO_VIDEO` becomes `[1, 3, 4]`.
- `CONTEXT.md` §5 and §7, and the variant table in `base.css`.

**Why.** Client, the same call he made for variant 3: the flat ground goes, the photograph he
was shot against it in takes the panel, and the frame goes back to the interface recording.

**How it was verified.** In the live page at 1440: variant 4 clicked, `--morph-bg` resolves to
`hero-smoke.webp` over `rgb(233,235,238)`, the video's `display` is `block`, the photo layer
`none`, `--ink` black. Froze the crossing at t = 0.5 with snapping off: `clip-path:
inset(128.5px 230px 126.5px round 16px)` and the panel reads as a distinct rounded rectangle
against the smoke ground — **the invisible-shrink problem this variant had as a flat colour is
gone**, the photograph's content gives the edge something to show against.

**Left undone / known.** The load-time autoplay is still blocked in the preview pane
(`paused: true` on a fresh navigate), so variants 1, 3 and 4 show the poster there until
`play()` gets a gesture. Environment, not the page.

## 2026-09-03 — the cases heading drops to xl

**What changed.** `index.html`: `#audience`'s heading loses `section__title--xxl`.
`CONTEXT.md` and the rule's comment in `assets/css/base.css` now say the closer's heading is
the only xxl left.

**Why.** Client: "в 'работают с нами' сделай тайтл xl а не xxl". It carried xxl from when
that screen was a card grid with nothing else on it; back in the three columns it sets like
every other section's title.

**How verified.** Live page at 1440×900: the heading computes 28px — same as the
marketplaces title — in two lines, no overflow; the closer's is still 56px.

**Left undone.** Nothing for this change.

## 2026-09-03 — the tiles flip, go square, and lose their titles

**What changed.** `index.html`: in `#growth` the heading moved to the left column and the
tiles to the right two; each tile is now a single `.tile__text` instead of a title and a
sentence, and the six strings were shortened. `assets/css/base.css`: `.tiles__lead`,
`aspect-ratio: 1 / 1` and `justify-content: flex-end` on the tile, `.tile__title` gone.
`CONTEXT.md`: the section rewritten with the client's words and a table of the copy against
his Figma originals.

**Why.** Client, on seeing the first cut: text left, cards right, always square, one block of
text pushed to the bottom edge, padding as it was. The square is what leaves room for the
artwork he is still drawing — the text sits under it rather than beside it. His originals
mixed «ты» and «вы»; the shortened copy is all «ты», like the rest of the site.

**How verified.** Live page at 1440×900 and 1920×1080. Heading in column 1 (left 52 / 108),
grid in columns 2-3; tiles measure 293×293 and 388×388 — square at both widths; the text's
bottom edge is 24px off the tile's on all six, none overflows, 2-3 lines each at 1920. Grid
ends at 757 of 900 and 932 of 1080, so the screen still holds one section. No 4xx, no
horizontal overflow.

**Left undone.** Still no artwork on the tiles.

## 2026-09-03 — the carousel's arrows stood under every section

**What changed.** `assets/css/base.css`: `.deck-nav` fades with its own slide
(`opacity: var(--t, 0)`), the way the tab strip already did.

**Why.** My bug, shipped in 73578e4. The arrows hang below the frame's box, so the curtain —
cut to that box — cannot hide them. The style deck's copy got away with it because the
curtain clips the whole deck and its buttons sit inside it; the carousel's track is what is
clipped, and its arrows are outside, so they stood on all eight screens.

**How verified.** Live page at 1440×900, walking every section and reading both nav strips'
computed opacity: 1 only on `customization` and `audience` respectively, 0 on the other six
screens for both.

**Left undone.** Nothing for this fix.

## 2026-09-03 — hero variant 3 becomes the green photograph with the interface in the frame

**What changed.**

- New `assets/images/hero-green.webp` (2560×1429, 220 KB) — the man against the brand green,
  from a client-supplied 5504×3072 PNG, `cwebp -q 88 -resize 2560 0`.
- `base.css`: `:root[data-hero="3"]` sets `--morph-bg` to that file at `center / cover` over
  green; the frame's two layers are now swapped per variant explicitly (recording on 1 and 3,
  the man on 2 and 4) instead of "anything but 1".
- `main.js`: the variant table gains `HERO_VIDEO = [1, 3]`, and `hero:variant` carries
  `video` so the video controller stops decoding on the two variants that hide it.
- `CONTEXT.md`: §5's variant table and §7's asset table.

**Why.** Client: variant 3 was a flat green with the man in the frame; he replaced it with the
photograph he was shot against green in, built like variant 1 — the man on the panel, the
interface in the frame.

**How it was verified.** In the live page at 1440: clicked variant 3, `--morph-bg` resolves to
`hero-green.webp`, the video's `display` is `block` and it is playing (`paused: false`), the
photo layer is `display: none`, `--ink` is `rgb(0, 0, 0)`. Screenshot taken — the man reads
full-bleed with the dashboard over his torso and his head clear above the frame.

**Left undone / known.** The 1.79:1 source against a 1.6 viewport crops the sides, so at 1440
the man sits a little left of where he does at 1920. Not raised with the client yet.

## 2026-09-03 — cases into the frame as a carousel, and a new tiles section

**What changed.** `index.html`: `#audience` is an ordinary three-column section again —
title, frame, subtitle and `Все кейсы` — and the four case cards moved into the frame as a
carousel with the deck's two arrows; a new black section `#growth` follows it with six tiles
and the heading «Приводите и удерживайте клиентов», and it is the one that now carries
`data-frame="none"`. `assets/css/base.css`: the cases grid, head and frameless layout
deleted; `.case-deck` / `__track` / `__rail` and the tiles block added; the track joined both
curtain selector lists; `.section__title--xxl` moved up into the section block, where it is
no longer inside a rule set that can be deleted with a layout. `assets/js/main.js`: a
carousel controller next to the deck's, with the same gate. `CONTEXT.md`: structure table,
copy table, a rewritten Cases section and a new Growth tiles one.

**Why.** Client's brief, verbatim in CONTEXT §4. The subtitle is the v1 line from `f0286fd`
("Огромные корпорации и небольшие бизнесы…") — he said to take it from the first iteration
or invent one. The tile copy is his, read off Figma `276:54325`; no artwork is wired, since
he said the graphics will be different.

**How verified.** Live page, freshly loaded stylesheet, at 1440×900 and 1920×1080. Cases:
slide `data-active=true`, `--t` 1, card = the frame's box (520×390 / 720×540), arrows under
the frame at the tab strip's drop, a click steps the rail exactly one card (0 → -520 → -1040
→ -1560 → 0 wrapping, and back the other way), leaving the section sets `inert` and resets
the rail to 0, `xxl` title 56/64px in two lines with no overflow. Growth: ground `rgb(0,0,0)`,
tiles 293×190 at 1440 and 388×232 at 1920 with no overflow in any of the six, heading in the
third column, section exactly one viewport, frame parked above the screen (`top` -643/-818).
No 4xx, no console errors, no horizontal overflow at either width. **Not verified: the
carousel's motion.** The Browser pane is hidden, so `requestAnimationFrame` never fires and
GSAP's ticker sits at frame 0 — the steps above were read by forcing each tween to
`progress(1)`. The easing has not been seen moving.

**Left undone.** The tiles have no artwork. The case copy is still my placeholder.

## 2026-09-03 — the tablet in the speed frame

**What changed.** `assets/images/speed.webp` added. `index.html`: the speed slide carries
`data-filled="true"` and one `.frame-photo`. `assets/css/base.css`: that layer's file, and
`background-size: contain` for it alone. `CONTEXT.md`: file and nodes recorded.

**Why.** Client sent the mockup `276:54234` and asked for that slide. `contain` because the
tablet is a device with edges — `cover` would crop its corners. The export needed keying:
Figma paints `#1E1E1E` behind the instance, which on a `#000` section would read as a grey
slab. Keyed on that colour and flattened onto black, so the picture's ground and the
section's ground are the same #000 and the frame never shows.

**How verified.** Live page at 1440×900 with a freshly loaded stylesheet, `#speed` on stage:
slide `data-active=true`, `--t` 1, layer 520×390 (the frame's box), `background-size:
contain`, `clip-path inset(0% …)`, page `--ground` `rgb(0, 0, 0)` — same black as the
picture's corners, sampled on a canvas at `[0,0,0,255]`. File returns 200 / 130250 bytes;
no 4xx. Screenshot not possible — the Browser pane is hidden and composites nothing.

**Left undone.** The tablet's UI is a still. If the client wants the catalogue to move, it
needs a recording like the hero's.

## 2026-09-03 — a photograph in the marketplaces frame

**What changed.** `assets/images/marketplaces.webp` added (Figma `206:60376`, node export
2298×1635 → `cwebp -q 82 -resize 2236 0`, 163 KB). `index.html`: the marketplaces slide is
no longer empty — it carries `data-filled="true"` and one `.frame-photo` layer.
`assets/css/base.css`: new generic `.frame-photo` layer plus its marketplaces file, and the
class added to both curtain selector lists so the wipe clips it like the other pictures.
`CONTEXT.md`: the file and the node recorded in the two asset tables.

**Why.** Client sent the node and asked for that photograph in the marketplaces frame. The
picture goes on an inner layer, not on the slide, because the curtain clips layers — a
background on the slide could not be wiped.

**How verified.** Live page at 1440×900, `#marketplaces` on stage: slide `data-active=true`,
`--t` 1, `.frame-photo` measures 520×390 (exactly the frame's 4:3 box), `clip-path`
`inset(0% 0px 0px round 32px…)` — curtain fully open, the file returns 200 / 167230 bytes,
`--frame-outline` transparent so the empty-frame dashes are gone, no 4xx on the page.
Screenshot not possible — the Browser pane is hidden and composites nothing.

**Left undone.** Nothing for this change.

## 2026-09-03 — the section reveal is removed

**What changed.** `assets/js/main.js`: the whole `reveals` block is gone — the `REVEAL`
token object, the per-section timeline and its ScrollTrigger, the `reveals` array, and
`catchUpReveals()` with its three listeners, which existed only to keep those reveals
honest on load, on refresh and on a jump. Two comments that described the reveal were
rewritten: the file header's list of what moves, and the load-pass note above
`ScrollTrigger.refresh()`. `CONTEXT.md` §7 item 5 now records the removal instead of the
effect.

**Why.** Client: "я передумал, убери этот эффект вообще". He asked for the lag earlier the
same day and for the replay after that; this drops the effect itself, not just those two
refinements. Read literally — "вообще" — and flagged back to him in case he meant only the
0.3s lag, in which case the single staggered tween comes back rather than nothing.

**What follows.** Section text now renders at its natural opacity from the first paint;
nothing writes `opacity` or `y` on `.section__title`, `.section__subtitle`, `.btn` or
`.case` any more. The load-time `ScrollTrigger.refresh()` / `update()` / `settleSlides()`
pass stays — it is what settles the scrubbed colours and the frame, and was never only
about reveals. Everything else that moves is untouched: the scrubbed section boundary, the
frame's slides, the tab strip, the style deck, the closer's morph, the photo parallax.

**How it was verified.** `localhost:4321` at 1440×900, fresh reload.

| check | result |
|---|---|
| `ScrollTrigger.getAll()` | **15**, was 22 — the seven title triggers are gone |
| any trigger on a `.section__title` | none |
| `.section__title` / `.section__subtitle` / `.btn` opacity, all 7 sections | 1 |
| inline `style` on title, subtitle, button, case — all 7 sections | none |
| `gsap.globalTimeline` children touching section text | none |
| console | clean |
| `node --check assets/js/main.js` | passes |
| `grep -n "REVEAL\|reveals\|catchUpReveals"` | no matches |

**Left undone.** The brief's own wish list in CONTEXT §1 item 6 still says
"scroll-triggered reveals" — left as written, because that is the brief as received, not
the current state; §7 item 5 is where the current state lives.

## 2026-09-03 — the reveal replays on every entry

**What changed.** `assets/js/main.js`: the reveal's `once: true` is gone, replaced by
`toggleActions: 'restart none restart none'` (`REVEAL.actions`). `catchUpReveals()` now
tests the trigger's **end** instead of its start. `CONTEXT.md` §7 item 5.

**Why.** Client: the reveal should run every time a section comes up, not once.

**What follows.** `restart`, not `play`, because a finished timeline has nothing left to
play — restart takes it back to 0 first. On both entries, so it runs coming back up the page
as well as down. `none` on both exits, because reversing would pull the text off a section
the visitor is still watching leave.

The `catchUpReveals` change is not cosmetic. That sweep exists for reveals the page jumped
over, and it snapped anything past `trigger.start` with `progress() === 0` straight to the
end. With `once` gone it runs against a reveal that is entering *right now* — start behind
us, end ahead, progress still 0 — and would have eaten the animation on every section
change. Testing `end` means it only touches reveals that are genuinely behind.

**How it was verified.** `localhost:4321` at 1440×900. The pane's rAF is frozen
(`gsap.ticker.frame` stays 0), so ScrollTrigger was driven by hand: `window.scrollTo` for
the position, `ScrollTrigger.update()` to evaluate, `gsap.ticker.tick()` to advance.

Config on all four probed sections (`#hero`, `#capabilities`, `#speed`, `#audience`):
`toggleActions: 'restart none restart none'`, `once` absent, trigger alive in
`ScrollTrigger.getAll()` — 22 triggers on the page.

`#capabilities`, three entries in a row (start 538, end 1404):

| step | scrollY | progress | title opacity |
|---|---|---|---|
| first play | 900 | 1 | 1 |
| back above start | 0 | 1 | 1 (no reverse, as designed) |
| 2nd entry | 900 | **0** | 0 |
| 2nd entry, ticking | 900 | 0.003 → rising | 0.011 |
| 3rd entry | 900 | **0** | 0 |
| 3rd entry, ticking | 900 | 0.002 → rising | 0.008 |

So every entry resets to 0 and plays again, and the trigger is never killed — which is what
`once: true` had been doing.

Load path, fresh reload at the top: the hero's timeline is unpaused at progress 0 before
anything is driven, and ticks take it up (0.058, title 0.23, with subtitle and button still
at 0 — the late group). It animates on load now rather than being snapped to the end by the
catch-up sweep. Console clean, no errors.

**Left undone / not verified.** No rAF-driven playback was watched or screenshotted; the
pane never ticks, so all of the above is hand-driven. Numbers unchanged and still mine: the
0.3 lag, and the choice not to reverse on exit.

## 2026-09-03 — margin = gap, and the subtitle fills its column

**What changed.** `assets/css/base.css`: `--page-pad-x` is now just `var(--col-gap)` instead
of its own `clamp(20px, calc(4.4vw - 43.36px), 96px)` ramp, and `.section__subtitle`'s
`max-width: 70%` is gone. `CONTEXT.md` §5: the padding table, the subtitle paragraph, the
measured table, and the two paragraphs on what the gap costs.

**Why.** Client: the side margin on a laptop should be proportional and equal to the gap, and
the subtitle's 70% cap should go everywhere.

**How it was verified.** Measured at three widths after a cache-busting reload.
1440: margin 52 = gap 52, columns 356, subtitle 356 (was 249) in 3 lines, frame 520×390.
1680: margin 64 = gap 64, frame 712. 1920: **nothing moved except the subtitle** — margin
still 108 from `--page-max`, gap 76, columns 416, frame at its 720 cap, and all five
subtitles now 416 wide in 3 lines. Screenshots at 1440 and 1920.

**What is left undone.** Tying the margin to the gap cost the frame 64px at 1440 (584 → 520):
the columns are on their floor there, so the margin can only come out of the frame — and it
takes it twice. Same reason the gap now costs the frame **four times** below the cap (two
gaps plus two margins), so +12 on the gap is −48 on the frame rather than −24; the frame also
reaches its 720 cap at ~1690 now instead of ~1655. Both written into CONTEXT — worth a look
before the gap is tuned again.

## 2026-09-03 — the section body flies in after its title

**What changed.** `assets/js/main.js`: the reveal is now a `gsap.timeline` per section
instead of one staggered tween. The title goes in at 0; everything else in the section —
`.section__subtitle`, `.btn`, `.case` — goes in at **0.3s** and keeps its own 0.08s stagger
inside that group. The numbers moved into a `REVEAL` object at the top of the block.
`CONTEXT.md` §7 item 5 rewritten.

**Why.** Client asked for the subtitle and its button to fly into place a little later than
the title.

**How it was verified.** `localhost:4321` at 1440×900, read off the live GSAP objects and
then sampled by driving the timeline's own clock — the browser pane will not scroll (see
below), so this is the timing itself rather than a recording of it.

Structure, `#speed`: two children, `.section__title` at start 0, then
`[.section__subtitle, .btn]` at start **0.3** with `stagger: 0.08`; timeline 1.18s long.
`#audience`: `.section__title` at 0, then `[.btn, .case ×4]` at 0.3; 1.42s long.
`#capabilities` has no CTA, so its late group is the subtitle alone.

Opacity sampled with `tl.time(t)`, `#speed`:

| t | title | subtitle | button |
|---|---|---|---|
| 0 | 0 | 0 | 0 |
| 0.15 | 0.46 | 0 | 0 |
| 0.30 | 0.76 | 0 | 0 |
| 0.50 | 0.95 | 0.58 | 0.39 |
| 0.80 | 1 | 0.95 | 0.89 |
| 1.10 | 1 | 1 | 1 |

So at the moment the body starts, the title is already three-quarters in, and the button
trails its own subtitle by the group stagger. Console clean, no errors.

**Left undone / not verified.**

- **The 0.3 is my number**, not the client's — same standing as the tab timings.
- **No rAF-driven playback was observed.** The browser pane is frozen: `gsap.ticker.frame`
  stays at 0–2, and `window.scrollTo` leaves `scrollY` at 0, so no ScrollTrigger can fire
  and the animation cannot be watched or screenshotted. Evidence is the timeline's
  structure and its own clock, which is exactly what the change is about, but it is not a
  recording of the real thing.
- Pre-existing, unrelated, found while probing: a **deep link lands blank**. On
  `/#audience` the browser applies the hash scroll after `catchUpReveals()` has run, so its
  `scrollY > trigger.start` test sees 0 and skips, and the section's text stays at opacity
  0 until something else fires. Not introduced here — the catch-up pass and its condition
  are untouched — and in a live browser ScrollTrigger's own loop covers it on the next
  frame. Worth a real fix, not done.

## 2026-09-03 — xl down to 28 at the laptop end

**What changed.** `assets/css/base.css`: `--fs-xl`
`clamp(32px, calc(8px + 1.6667vw), 40px)` → `clamp(28px, calc(2.5vw - 8px), 40px)`.
`CONTEXT.md` §7: both type tables and a note on the ramp; §5: the xl column of the measured
table. The clamp table's xl row was two rounds stale (still 36 → 44) and is now right.

**Why.** Client wants the section titles smaller on a laptop. 1920 stays 40, so only the
laptop end moves — which makes the ramp 2.5vw, steeper than xxl's 1.6667vw.

**How it was verified.** Measured: 28 at 1280 and 1440 (the floor holds below the window),
29.8 at 1512, 34 at 1680, 40 at 1920. No title or subtitle overflows at 1440 or 1920. The
customization title got a line back at 1440 — three lines to two. Screenshot at 1440.

**What is left undone.** Nothing on this change. Still uncommitted, along with the other
session's work in the same files.

## 2026-09-03 — experiment: the deck's grounds without the blur

**What changed.** `--deck-blur` 32px → 0, and the three ground files re-exported sharp:
2x node exports out of Figma, scaled to 1920px wide, `cwebp -q 78` — 194 / 63 / 62 KB
against 34 / 19 / 12 KB blurred. `CONTEXT.md` §7 says which sources belong to which state.

**Why.** Client wants to see it: "давай ради эксперимента снимем блюр с фонов". The
re-export is not optional for a fair look — the blurred set was 900px at `-q 60`, and
stretched to a 1440–1920 viewport unblurred it would have shown its own upscaling rather
than the photograph.

**How it was verified.** Emulated 1440×900, CSS and the three images cache-busted. The layer
computes `blur(0px)`, its inset collapses to 0 with the radius, the 15% scrim is untouched,
and the three sharp files are the ones served. Screenshotted all three grounds by clicking
the arrow button through the deck.

**What it looks like, honestly.**

- **fashion** is the one that works: a mid-tone field, the white headline holds, the card
  reads as floating over it.
- **care** fills the screen with skin and beige. The headline sits over the model's
  shoulder and survives; the right-hand subtitle over her hair does not really.
- **furniture** is the busiest — wood, shelves and a table all compete with the card, and
  the headline over the table is the weakest of the three.
- Across all three, the card's own white edges now melt into the light parts of the
  photograph. Blurred, the card popped; sharp, it needs an edge of its own — which is the
  shadow-or-hairline question §7 already flags, now with teeth.

**What is left undone.** This is a state to look at, not a decision. Reverting is one line
(`--deck-blur: 32px`) plus re-encoding the three grounds small again; the whole commit is
`git revert`-able in one step.

## 2026-09-03 — four hero variants, switched live from the corner

**What changed.**

- `index.html`: `data-hero="1"` on `<html>`; a `.hero-photo` layer in the hero slide next to
  the video; a `.hero-switch` group of four 18px buttons after `</main>`.
- `base.css`: the morph panel's ground becomes `--morph-bg`, set per `:root[data-hero]`
  (1 photograph over graphite, 2 black, 3 green, 4 smoke); `.hero-photo` (the 1.42:1
  `hero.webp`) joins both of the curtain's selector lists and swaps with the video by
  `display`; the switch's own block at the foot of the file, with the variant table.
- `main.js`: the boundary pass reads `coloursOf()` per frame instead of caching the pair at
  build time, so a live `data-ink` change is picked up; new `settleColours()` for the resting
  state; the video gate takes a `dropped` flag off a new `hero:variant` event; the variant
  controller at the foot of the file (writes `data-hero`, the hero's `data-ink`, the event,
  and `localStorage`; shows the control only while `data-hero-focus` is true).
- `CONTEXT.md`: §5 gets "The four hero variants"; §4's section table notes the hero's ground
  and ink now depend on the variant.

**Why.** Client wants the four grounds compared in the live page rather than in Figma, with
the switch small enough to stay out of a screenshot. The ink is not a fifth knob — white type
is unreadable on green and on smoke, so it follows the ground; it is written on the hero
section's `data-ink` so the existing scrubbed colour pass carries it into the header, the
buttons and the crossing for free. Which photograph goes in the frame was his call: the
tighter `hero.webp` (2236 wide, ~6% off each side against 4:3), not the full square.

**How it was verified.** In the live page at 1440 via the preview pane, all four clicked
through: `data-hero` 1-4, the panel's computed background graphite+`hero-full.webp` /
`rgb(0,0,0)` / `rgb(166,237,0)` / `rgb(233,235,238)`, the frame swapping video ↔ photograph by
`display`, the hero's ink `light/light/dark/dark` reaching `--ink` and the header CTA (black
pill, white label on 3 and 4). Switch measured at 16,866 → 100,884, four 18px squares,
`aria-pressed` following the choice; `opacity` 0 with `pointer-events: none` off the hero.
Froze the crossing at t = 0.5 with snapping off: `clip-path: inset(116.5px 214px 114.5px
round 16px)` — half-way, half the radius — on every variant. Screenshots of 1-4 taken and
shown to the client, who confirmed.

**Left undone / known.**

- **Variant 4's shrink is invisible.** The ground behind the panel steps to the next section's
  colour on the first movement, and capabilities is smoke — so a smoke panel shrinks against
  smoke, and the move only reappears when the dashboard wipes in. Verified at t = 0.5: panel
  and `--ground` both `rgb(233,235,238)`. Needs a client call — another grey, white behind it
  across that one crossing, or a stroke on the panel.
- Clicking a variant *mid-crossing* repaints the ground from the section at rest, so on 3 and
  4 the ground behind the panel flashes graphite until the next scroll frame. Self-corrects;
  the control is meant to be used on the hero at rest.
- The preview pane blocks the load-time autoplay outright — the `autoplay` attribute does not
  start the video either, and `play()` works as soon as it has a gesture. Not touched by this
  work; variant 1's video was already in that state.
- The deck's new arrow buttons (`.deck-nav`, another session's uncommitted work) sit at
  opacity 1 with their slide's `--t` at 0, so they show under the frame on the hero. Left
  alone — not mine.

## 2026-09-03 — the deck deals out on arrival and gets two arrow buttons

**What changed.**

- `main.js`: `enter()` replaces the bare `nudge()` on the slide's gate. The cards behind are
  set to the front card's slot and slide down into their own, 0.55s `power3.out`, staggered
  0.08s; the hint's wait moves 0.35 → 0.7s so it follows rather than overlaps. Skipped under
  `prefers-reduced-motion`.
- `index.html` + `base.css`: `.deck-nav` with two `.deck-arrow` buttons under the frame —
  round at the site's control height, 1px inset ring in the ink, ink fill on hover with the
  arrow in the counter-ink, one arrow path mirrored in CSS.
- `main.js`: the buttons call `toss()` with a velocity (`push` 1.2 px/ms), so a click runs
  the same physics as a flick; a press during a flight is ignored. The nav also fades in
  (0.4s, from `opacity 0` and `y 8`) as part of the arrival.

**Why.** Client: "при каждом заходе на секцию с свайпером не-фокусные плашки мягко выезжали
вниз с ease out" and "добавим снизу посередине под свайпером кнопки вправо влево — круглые,
со стрелочкой, со строуком."

**A collision worth writing down.** While this was being built, another session replaced the
slides' opacity cross-fade with a curtain wipe, and it clips `.style-deck` to the frame's box
unless the deck carries `data-onstage="true"` — an attribute their code added to *my* gate.
Two consequences: the buttons are hidden through a crossing (which is why they now fade in),
and a hit-test at their centre returns the section underneath unless that attribute is set.
The first screenshot attempt looked like the buttons were missing; they were clipped.

**How it was verified.** Emulated 1440×900, stylesheet and script caches busted, GSAP on
manual ticks primed *before* the gate fires.

```
arrival        y per 100ms: 0/16/9 → 0/24/35 → 0/27/49 → 0/28/54 → 0/28/56 by ~500ms
               nav opacity/y alongside: 0@8 → 0.20@6 → 0.69@3 → 0.92@1 → 1@0 by ~600ms
               then the hint: x 0 → -18 (≈1.0s) → +18 (≈1.45s) → 0 (≈1.8s)
buttons        40×40, radius 999px, inset 0 0 0 1px white ring, 16px arrow, mirrored
               scale -1 1 on the right one; nav centre 720 = frame centre 720;
               nav top 743 against a frame bottom of 671
right press    x +62 in 60ms, +163 by 240ms, rotation 1.3°, opacity 0.70 — decelerating,
               ground switched to `care` on the press; front `care` when it settled
left press     x -106 by 120ms, rotation -2.2°, ground and front both `furniture`
guard          two presses during a flight changed nothing; the deck cycled back to
               `fashion` after three
hit test       with data-onstage="true" the topmost element at the button's centre is the
               button; with it unset the clip hides it
```

Screenshotted: both buttons under the deck, centred, clear of the ledges. No console errors.

**What is left undone.** The buttons take `--ink`, which is white on this section, and sit
over the blurred ground — the same contrast question as the section's text, still the
client's call (§11).

## 2026-09-03 — the hero headline goes to three hand-set lines

**What changed.** `index.html`: the `<h1>` becomes
`Одна платформа<br>для&nbsp;управления<br>ecom-бизнесом`, and the `<title>` follows in plain
text. `CONTEXT.md` §4: the section 1 copy row, in the same `⏎` notation the other rows use.

**Why.** Client's call, breaks included — he wrote the line as three.

**How it was verified.** `localhost:4321`, measured on the live DOM at two widths and then
seen in a screenshot at 1440:

| viewport | font | text column | the three lines | overflow |
|---|---|---|---|---|
| 1440 | 32 / 32 | 356 (its `--col-min` floor) | 259 / 245 / 246 | none |
| 1920 | 40 / 40 | 416 | 324 / 306 / 308 | none |

Two `<br>`, three lines, and every line clears its column with ~100px to spare, so the
breaks are the only thing setting the wrap at either width — nothing re-wraps behind them.
The `&nbsp;` in "для управления" is therefore doing nothing at these sizes; it is there so
the pair cannot split if the column ever gets narrower.

**Left undone.** Hand-set breaks are width-blind by definition: below ~1200 the column
narrows further and a line could wrap inside itself. The page is a desktop demo, so that is
not in scope — noted rather than guarded.

## 2026-09-03 — the scrim ramps in instead of stepping on

**What changed.** `assets/css/base.css`: new `--scrim-ramp: 0.15` token, and the under
layer's filter becomes
`brightness(calc(1 - var(--scrim) * min(1, (1 - var(--t, 0)) / var(--scrim-ramp))))`.
`CONTEXT.md` §5: the curtain's scrim row and a paragraph on the ramp.

**Why.** Client saw the scrim flick on at the first pixel of the gesture and asked for it
over one or two tenths of the crossing. 0.15 is the middle of that.

**How it was verified.** Sampled the computed filter across a crossing at 1440:
`none` at rest, `brightness(0.986667)` at p = 0.010, `0.96` at 0.030, `0.899` at 0.076,
`0.8` from p = 0.150 on and held to 0.5, `none` again at the far end. So it is linear over
the first 15% and flat after, and neither rest point carries a filter.

**What is left undone.** Nothing on this. `1 - --t` is used as the crossing's progress from
the under layer's side, which is only correct because that slide's `--t` counts down — worth
knowing if the roles are ever reworked.

## 2026-09-03 — the hero headline becomes "весь онлайн-бизнес"

**What changed.** `index.html`: the `<h1>` and the `<title>`, "Одна платформа
на всю онлайн-торговлю" → "Одна платформа на весь онлайн-бизнес". `CONTEXT.md` §4:
the section 1 copy row. The `&nbsp;` after "на" is kept, so "на весь" cannot be split.

**Why.** Client's call — the page is about the whole online business, not only the selling.

**How it was verified.** `localhost:4321` at 1440×900, measured on the live DOM and then
seen in a screenshot. Three lines, 96px tall at 32/32, inside the 356px text column, which
is sitting on its `--col-min` floor:

    Одна платформа
    на·весь            (· = the nbsp, holding)
    онлайн-бизнес

Same line count as the old headline, but the hyphen break is gone — "онлайн-торговлю" used
to split across lines 2 and 3 as "онлайн-" / "торговлю". The middle line is now short, two
short words on their own.

**Left undone.** Nothing on this item. The thin middle line is a consequence of the 356px
column, not of the copy; a hand-set `<br>` after "на" would give two fuller lines
("Одна платформа на" / "весь онлайн-бизнес") if he wants that instead.

## 2026-09-03 — the curtain gets a rounded edge and a scrim under it

**What changed.** `assets/css/base.css`: the curtain's two `linear-gradient` masks become
`clip-path: inset(… round …)` — the arriving layer's top corners take `--radius-btn` — the
layer underneath now runs on past the edge by the radius instead of butting against it, and
takes `filter: brightness(calc(1 - var(--scrim)))`; new `--scrim: 0.2` token; `data-wipe`
now also sets the two slides' z-order. `assets/js/main.js`: a `role()` helper that sets
`data-wipe` during a crossing and **clears** it at both ends. `CONTEXT.md` §5: the curtain
subsection rewritten.

**Why.** Client: round the curtain's top corners like the frame, and put a 20% black scrim
on the layer that falls under it.

**How it was verified.** Swept hero → capabilities at 1440. At rest (both ends): no role, no
filter, plain `inset(0% … round 32px 32px 0 0)` — full box, nothing dimmed. Mid-crossing at
t = 0.1 / 0.5 / 0.9: the arriving pane clips to `(90%|50%|10%) 0 0 0 round 32px 32px 0 0` at
z 2, the layer under it to `0 0 calc((10%|50%|90%) - min(32px, …)) 0` at z 1 with
`brightness(0.8)`, and **both stay at `opacity: 1` throughout**. Froze a crossing at 45% and
screenshotted: rounded top corners on the arriving screen, the picture above it visibly
darkened, no seam artefacts.

**Why overlap rather than butted edges.** Rounding a butted edge leaves two crescents of bare
frame at the ends of the line. The layer underneath therefore runs past the edge by the
radius, capped by `min(radius, --t * 100%)` so it tapers to nothing as the curtain lands —
without that cap a strip of the old picture survives the end of a crossing into a section
whose slide is empty.

**What is left undone.** The scrim comes on as a step the moment a crossing starts, which is
the literal reading of the client's "when it starts overlapping". If it reads as a flick,
ramping it over the first tenth of the gesture is a one-line change — his call. The tab strip
still fades rather than wipes, for the reason already written down.

## 2026-09-03 — the frame's content wipes instead of fading

**What changed.** `assets/css/base.css`: `.stage-frame__slide` loses `opacity: var(--t, 0)`;
`.stage-frame__video`, `.frame-pane` and the off-stage `.style-deck` take a
`linear-gradient` mask driven by `--t`, mirrored under `[data-wipe="out"]`; `.frame-tabs`
gets an explicit `opacity: var(--t, 0)`. `assets/js/main.js`: the scrubbed pass writes
`data-wipe` on the two slides in a crossing, and the deck's gate writes `data-onstage`.
`CONTEXT.md` §5: the two stale "cross-faded / opacity" claims corrected and a new
"The curtain" subsection.

**Why.** Client: the transition between what the frame holds should be a curtain from the
bottom up, and the content must not pass through zero opacity.

**How it was verified.** Swept hero → capabilities at 1440 with `ScrollTrigger.update()`:
the video's mask edge runs 100% → 0% downward while the pane's runs 0% → 100% upward, and
**both layers stay at `opacity: 1` at every step** — the regions are disjoint, so at t = 0.5
the frame is the old picture's top half over the new picture's bottom half with no overlap
and no gap. Froze a crossing at 45% and screenshotted it: one hard line, the hero's video
above, the capabilities screen below, neither dimmed. Deck: `mask: none` and `inert: false`
at rest, masked and inert at every step of a crossing (checked at t = 0.75, 0.5, 0).

**What is left undone.** The tab strip still fades — it lives below the frame's box, so a
mask sized to that box would delete it outright; written up as a deliberate exception. If the
client wants it to wipe too it needs its own mask geometry. Watch out for the browser cache
when checking this by hand: python's `http.server` sends no `Cache-Control`, and Chrome
served a stale `base.css` and `main.js` through two reloads until forced with
`fetch(url, {cache: 'reload'})`.

## 2026-09-03 — the full picture on the panel, anchor solved to 18%

**What changed.** New `assets/images/hero-full.webp` (1254×1254, 89 KB).
`assets/css/base.css`: the morph panel now uses it at `50% 18% / cover` instead of
`hero.webp` at `center top`, with the arithmetic written into the comment.

**Why.** Client supplied the full shot, Figma `275:53708`, and asked me to watch the quality.

**How it was verified.** Encoding: compared `-q 82`, `-q 90`, `-q 95` and `-lossless` against
each other on three 500-row scanlines through the gradient. Mean |Δ| from lossless is 1.44 /
1.21 / 1.13 of 255, and the largest adjacent-row step in the lossy files (75–91) is *below*
the lossless file's own (92) — so the steps are the photograph, not banding. Took `-q 90
-sharp_yuv -m 6`: 89 KB against 56 at q82 and 1247 lossless; `-sharp_yuv` because saturated
red is where chroma subsampling smears.
Placement: measured the source by decoding to PPM and classifying rows by saturation — head
top at 12.28% of the height, sunglasses at 21.53%. Solved the anchor from that against the
band between the header and the frame's top edge, then checked it in the page: 1440 → head
80, glasses 213, frame 233; 1920 → head 85, glasses 262, frame 262.

**What is left undone / broken.** Two things the client has to decide:

1. **At 1920 his glasses land exactly on the frame's top edge — zero slack**, and the edge
   reads as cutting his eyes. The full square does not fit: 178px of head-to-eyes into a
   182px band. 18% is the best any position value can do. The fixes are all structural —
   bring the frame down, crop the picture tighter than the full square, or use `contain`
   (fits with 30px spare, but graphite bands down both sides).
2. **Resolution.** The node is 2030×2020 but its bitmap is only **1254×1254** — Figma is
   already upscaling 1.62×, and my @2x export (4060px) was pure interpolation. Shipped at the
   native 1254, so the browser upscales 1.53× to fill 1920. The previous `hero.webp` was
   2236 wide and was *downscaled* there, so the hero photograph is measurably softer than it
   was. If he has the original camera file, that fixes it; nothing in the encode can.

## 2026-09-03 — the panel's photograph anchored to the top

**What changed.** `assets/css/base.css`: the morph panel's background goes
`center / cover` → **`center top / cover`**. `CONTEXT.md` §5: why, with the measurements.

**Why.** Client: the man's face was being cut and he wanted it kept without giving up a
responsive page. `background-position` is the knob — `cover` decides the scale, the position
decides what survives.

**How it was verified.** Measured the source first, by decoding `hero.webp` to PPM and
scanning rows: the top of his head is 25px from the edge, 1.6% of 1578 — **no headroom**, the
file already clips his hair, so no position value can clear the 80px header entirely. With
`top`, the discarded height all comes off the studio floor at the bottom. Because the image
is taller than the box across 1440–1920, its scale follows the width alone: rendered height =
width / 1.4171, face at 8% of it → 81px at 1440, 108px at 1920, both below the header.
Screenshots at 1440×900, 1920×1080 and 1920×900 (ratio 2.13, the worst case): the face is
clear of the bar in all three, hair behind it.

**What is left undone.** The hair still sits behind the header, and the only real fix is a
re-export with gradient headroom above him — raised, not done. I have edit access to that
file, so I can extend the canvas myself if he says so.

## 2026-09-03 — 15% black over the deck's grounds

**What changed.** `base.css`: `--deck-scrim: 15%` and a `.deck-ground::after` that paints it
over all three blurred layers. `CONTEXT.md` §7 and §11 updated.

**Why.** Client: "докинь ещё по 15% черного на фоны, чуть ярковаты сейчас."

**One scrim, not three.** Per-layer overlays would stack mid-cross-fade and darken the
middle of every swipe; a single overlay above the layers holds steady, and it still fades
with the section because the layer's opacity lives on the parent.

**How it was verified.** Emulated 1440×900, stylesheet cache busted first. `::after` on
`.deck-ground` computes `rgba(0, 0, 0, 0.15)`, inset 0 over the full 900px height,
`--deck-scrim` reads `15%`, the layers still blur 32px. Screenshotted with the deck forced
on stage: the fashion ground is visibly deeper than the shot in the previous entry and the
white title reads better against it. No console errors.

**What is left undone.** The care and furniture photographs are beige even under 15%; if
the white ink still reads weak on them, `--deck-scrim` is the number to raise.

## 2026-09-03 — the deck's screens come from Figma, each with a blurred ground of its own

**What changed.** The three placeholder screenshots in the style deck are replaced by the
client's own, and each card now brings the photograph that belongs with it.

- Six new files from Figma section `275:39451` ("tinder"), which holds three pairs. Cards:
  raw fills at 2448×1740 → cropped to the frame's 4:3 → 1440×1080 (@2x for the 720px cap) →
  `cwebp -q 90`, 84 / 116 / 74 KB. Grounds: the node exports → 900px wide → `-q 60`,
  34 / 19 / 12 KB, because a 32px blur leaves nothing for more pixels to describe.
  `customization-bags.webp` and `-apparel.webp` are gone; `-furniture.webp` is a new image
  under the old name.
- `index.html`: cards renamed `fashion` / `care` / `furniture`, and a `.deck-ground` layer
  with one child per card. The pairing lives in `data-card` on both sides — no names in JS.
- `base.css`: the ground layer — fixed, z-index 0, `overflow: hidden`, children inset by
  twice `--deck-blur` (32px, the client's floor) and cross-faded on 0.5s.
- `main.js`: `layout()` marks the ground layer matching the front card, so the ground cannot
  disagree with the deck on any path; the deck's gate writes the layer's own opacity from
  the scrubbed `--t`, before its edge check.

**Why.** Client: "в фигме лежат три секции, в каждой по две фотки. первая — бэкграунд
секции, вторая — связанный с ним пример стиля магазина... я листаю и меняется фон на
привязанный. фон при этом надо заблюрить будет я думаю минимум на 32px."

**How it was verified.** Emulated 1440×900, frame 584×438. Synthetic pointer events, GSAP on
manual ticks, and — twice — the documented cache traps.

```
on load        ground layer opacity 0, active layer `fashion` (the front card)
on section 4   layer opacity 1, blur(32px), inset -64px, overflow hidden, z-index 0
sources        all six 200, no 4xx; cards point at fashion/care/furniture
swipe right    40ms after release the ground is already `care` — it changes as the card
               leaves, not after it lands; front card `care` when it settles
swipe left     front `furniture`, ground `furniture`
transitions    read with transitions forced off (a hidden pane gives them no frames):
               active layer 1.00, the other two 0.00
```

Screenshotted at 1440×900 with the deck forced on stage: the POLENE screen fills the frame,
the field-and-mountains photograph behind it is blurred to a soft grey-green, and the two
veiled ledges show under the card. No console errors.

**Two traps, both already in CONTEXT §11 and both hit again.** The stylesheet and the script
cache independently of the document, so the first run showed the old CSS and JS with the new
markup — `fetch(url, {cache: 'reload'})` on both, then navigate. And `performance
.getEntriesByType('resource')` accumulates across loads, so a 200 in the list is not proof
that *this* load fetched it: an image reused under the same file name (`-furniture.webp`)
rendered as its old self until its cache entry was busted too.

**What is left undone.**
- **White ink over two of the three grounds.** The care and furniture photographs are beige;
  the section's ink is white. It reads on the fashion ground and is weak on the others. A
  scrim over the ground fixes it in one rule — the client's call, flagged in §11.
- The blur is a live `filter` on a viewport-sized layer. It is cheap here because the layer
  only exists on one screen, but it is the kind of thing to check on a weak GPU.
- Still no trusted pointer input in this session; the deck has only ever been swiped by
  synthetic events.

## 2026-09-03 — closer heading rewritten, its subtitle dropped

**What changed.** `index.html`: the closer's heading is now "Работает на твою мечту" and its
subtitle is gone. `assets/css/base.css`: the `.closer__head .section__subtitle` placement
rule removed with it. `CONTEXT.md` copy table updated.

**Why.** Client's call — the heading carries that screen alone, over the photograph.

**How it was verified.** Freshly loaded stylesheet. No `.section__subtitle` left anywhere in
`#closer`. The heading sets in two lines at both widths — "Работает / на твою мечту" — at
56px on 1440 and 64 on 1920, settles at opacity 1, and the screen still fits: head ends at
224, footer starts at 684, footer bottom inside the viewport. No horizontal overflow.

## 2026-09-03 — the cases heading becomes "Работают с нами"

**What changed.** `index.html`: `#audience`'s title from `С нами работают самые смелые` to
`Работают<br>с нами`, with the break the client asked for after «Работают».
`CONTEXT.md` §4: the copy table's row for section 6.

**Why.** Client's copy. Note it drops «самые смелые» — I took his instruction literally
("замени X на работают с нами") and flagged the reading back to him, since restoring the
tail is one word either way.

**How it was verified.** `localhost:4321` at 1440×900, live DOM on the title: exactly one
`<br>`, **2 lines** at 56/56 xxl, 258px wide inside a 1400px column — no wrap of its own, so
the break is doing all the work. No screenshot: the browser pane stopped repainting again
after the first navigation, and the section's reveal sits at opacity 0 until a real scroll
event, so a capture there is blank whatever the markup says.

**Left undone.** Nothing on this item.

## 2026-09-03 — the deck gets a veil and a nudge, the photograph moves to the closer

**What changed.** Three of the client's calls, in one pass.

- `base.css`: `.style-card::after` — 20% black over each card, `opacity: var(--veil)`.
  `main.js`: `--veil` replaces the per-step opacity in `slot()` and in `lead()`, so a card's
  `opacity` now means the dissolve of a throw and nothing else. Drop raised 22 → 28.
- `main.js`: `nudge()`, an arrival hint — the front card pulls 18px each way and settles,
  0.35s after the slide lands, on the drag's own rotation mapping. Runs from the slide's
  gate on every arrival, skipped under `prefers-reduced-motion`, killed by a hand on the
  card or by leaving the section.
- `index.html`: `data-photo="true"` moves from `#customization` to `#closer`.
  `assets/images/customization.webp` → `closer.webp` (`git mv`), url updated in `base.css`.
  The customization screen is flat black now.

**Why.** His words: the opacity dimming "шумит" and should be an overlay instead; the drop
could be stronger; "при заходе на слайд активная картинка должна показать что её можно
двигать — должна дернуться влево и вправо"; and "убираем фото девушки с фона... фото
девушки ставим на последний самый слайд закрывашку".

**How it was verified.** Emulated 1440×900 — note the frame is 584×438 there now, not the
424×318 of this morning; another session widened the text columns. GSAP on manual ticks,
synthetic pointer events, `setPointerCapture` stubbed.

```
stack at rest   y 0 / 28 / 56, scale 1 / 0.95 / 0.90, opacity 1 / 1 / 1,
                --veil 0 / 1 / 1 and ::after paints at exactly those, ledges 17px / 34px
arrival hint    x per 100ms: 0 0 0 0 -9 -18 -18 -13 5 16 18 16 6 0 0 0
                rotation follows, ±0.4° at this frame width; settles at x 0 rot 0;
                the second card does not move (y 28, veil 1) while it plays
throw           mid-drag the next card's veil interpolates to 0.69; mid-flight x 267 with
                opacity 0.77; after landing y 56, veil 1, opacity back to 1
customization   data-photo gone, .stage-photo opacity 0, --ground rgb(0,0,0)
closer          data-photo true, .stage-photo opacity 1, background closer.webp
requests        closer.webp 200, three deck cards 200, no 4xx anywhere
```

Screenshotted the stack at 1440×900. No console errors.

**A test trap worth remembering** (added to CONTEXT §11 earlier today, and I still fell for
it): prime `gsap.ticker.tick()` *before* the action that schedules a tween, not after. The
first tick after an `await` carries the whole paused interval as one frame — it swallowed
the hint's 0.35s delay and its 1.1s of movement in one step, and the first run looked like
the hint had never fired.

**What is left undone.**
- The photograph's fade now only happens on the way in, and its drift never completes,
  because the closer is the last section. Documented in §5; nothing to fix unless the page
  grows a section after it.
- Still no trusted pointer input in this session; the stack is still only ever seen over the
  hero's ground in screenshots.
- The deck's sources are unchanged and now render smaller relative to a 584px frame: 836×627
  is 1.43x there, and 1.16x at a 720px frame.

## 2026-09-03 — laptop side margin down to 20

**What changed.** `assets/css/base.css`: `--page-pad-x` from
`clamp(40px, calc(4.4vw - 24px), 96px)` to `clamp(20px, calc(4.4vw - 43.36px), 96px)`. The
4.4vw slope is untouched; the intercept is shifted so the ramp crosses the floor exactly at
1440, which is what makes the margin land on 20 there rather than on the old ramp value of
39.4. `CONTEXT.md`: the token table, the "76 → 52 → 40" history line, and the measured
layout table.

**Why.** Client asked for ~20 at 1440.

**How it was verified.** `localhost:4321`, measured at three widths after cache-busting the
stylesheet:

| viewport | side margin | gap | frame | text column | section 3's title |
|---|---|---|---|---|---|
| 1440 | **20** (was 40) | 52 | **584** (was 544) | 356, its floor | 3 lines |
| 1512 | 23 | 55.6 | 642 | 356, its floor | 3 lines |
| 1920 | 108, from `--page-max` | 76 | 720, its cap | 416 | 3 lines |

The 40px given up went straight into the frame: the text columns sit on their `--col-min`
floor at the laptop end, so they neither gain nor lose, and the client's hand-set third line
in `и интернет магазин` still holds at three lines — that is the wrap CONTEXT warns about.
At 1920 nothing moved at all: `--page-max` sets the margin there and the frame is capped.
`.section__inner` measures 20px from both edges at 1440, no horizontal overflow, console
clean.

**Left undone.** The header sits at 16 (`--header-pad-side`) while the sections now sit at
20, so the logo and the section content are 4px out of line on a laptop. Raised with the
client, not changed — the header number is his.

## 2026-09-03 — logo down to 20, an 8px left margin, header items back on the centre line

**What changed.** `assets/css/base.css`: `--logo-h` 24 → 20, `.header__logo` gains
`margin-left: 8px`, and `--header-pad-bottom` now just reads `--header-pad-top` instead of
its own 20. `CONTEXT.md` updated.

**The 8px.** The lockup starts with the mark, which carries no side bearing, so at the bar's
flat 16 inset it read as flush against the screen edge. The logo now starts at 24 while the
button's right inset stays 16 — deliberately uneven, and the client asked for it.

**The alignment was a real bug, not a feeling.** The header's padding was 16 top / 20 bottom
— my placeholder, never a client number — so `align-items: center` centred everything in a
content box that sits 2px above the bar's own middle. Measured before: the logo, the nav and
the button all had their centres at 40 against a bar centre of 42. After: all three read 0
offset.

**How it was verified.** Freshly loaded stylesheet at 1440×900. Header 80 tall (was 84),
padding a flat 16, all three items at exactly 0 from the centre line. Lockup 228×20, its
left edge at 24 against the button's 16 on the right. No horizontal overflow.

**Knock-on.** `--header-h` goes 84 → 80, so the sections' top padding and the frame's optical
centre move up 4 and 2px respectively — the frame now sits at y 248 on the hero.

**Mine, not the client's.** The 20px logo height, and reading "16 on top" as "16 all round".

## 2026-09-03 — hero goes graphite, the photograph moves to the morph panel

**What changed.** `index.html`: the hero section is `data-theme="graphite" data-ink="light"`,
and the looping screen recording is back in its slide. `assets/js/main.js`: `graphite` added
to the `GROUND` map. `assets/css/base.css`: the `:root` colour fallbacks are graphite / white
/ black, the morph panel is `var(--c-graphite) url("../images/hero.webp") center / cover`,
and the street-photo rule on the hero slide is gone. `CONTEXT.md`: §4 section table and the
colour-rhythm note, §7 palette and the frame-content table, and §5's morph subsection —
which a concurrent rewrite of that file had dropped — put back and brought up to date.

**Why.** Client, in three steps: make the first screen dark grey (graphite, his pick), move
the panel to graphite with it, then put the studio photograph on the panel and the interface
back in the frame.

**How it was verified.** `download_assets` on `196:53708` returned 2236×1578 — decoded the
repo's `hero.webp` and compared: the same shot, so no new asset was added. In the page at
1440 after a cache-busting reload: `--ground` `rgb(26, 24, 23)`, `--ink` `#ffffff`, title and
nav links white, panel `background-image` resolves to `hero.webp` with `cover` over graphite,
`.stage-frame__video` back in the DOM with the slide's `--t` at 1, 22 ScrollTriggers, no
errors. Crossing swept: `inset(0px)` at t = 0 → `inset(250px 448px 242px 448px round 32px)`
at t = 1 against a frame box of 544×408, `display: none` from t = 1.

**What is left undone.** Video **playback** unverified — `play()` resolves and `readyState`
is 4, but the element stays paused while the browser pane is hidden, which throttles it. The
ink dip mid-crossing is real and unfixed, now written up in CONTEXT §5. Two things worth the
client's eye: at 1440 `cover` on a 1.42:1 photograph in a 1.6:1 viewport puts the man's head
right under the header, and the white masked lockup now sits on the bright part of the
gradient. And green is now used **nowhere** on the page — the accent has left it entirely.

## 2026-09-03 — the header takes the full logo lockup

**What changed.** `assets/css/base.css`: `.header__logo` loses its badge — no plate, no
size, no radius — and `.header__mark` now masks `alphaseller-logo.svg` (mark + wordmark)
at `--logo-h: 24px`, width derived from the file's 1037 × 91.13. It is painted with `--ink`
rather than `--ink-invert`, since there is no plate to sit on any more. The `--logo-size`
token and the `@supports (corner-shape: squircle)` rule are gone; a comment marks where a
squircle would go back. `CONTEXT.md` updated.

**Why.** Client asked for the big version with the wordmark to the right.

**Two consequences worth knowing.** The badge was the only thing on the page carrying
`corner-shape`, so nothing uses corner shaping now — everything rounded is either a rounded
rectangle or a full pill. And `alphaseller-mark.svg` is no longer referenced; it stays in
the repo.

**How it was verified.** Freshly loaded stylesheet. The lockup renders 273×24 at both 1440
and 1920, `alphaseller-logo.svg` returns 200, no failed resources, no horizontal overflow.
The mask follows the ink across the page: white on the graphite hero, black on smoke, white
on both black sections, black on the cases. 40px of clear space to the nav at 1440.

**Mine, not the client's.** The 24px height.

## 2026-09-03 — 544 at 1440: gap and side margin trimmed there

**What changed.** `assets/css/base.css`: `--col-gap`
`clamp(52px, calc(2.5vw + 28px), 76px)` → `clamp(52px, calc(5vw - 20px), 76px)`;
`--page-pad-x` `clamp(52px, calc(4.4vw - 12px), 96px)` →
`clamp(40px, calc(4.4vw - 24px), 96px)`. `CONTEXT.md` §5: both tokens, the measured table,
the 1440 arithmetic, the frame's history.

**Why.** Client wants the frame bigger again and chose to trim the gap and the side margin at
the laptop end rather than the columns. 52 / 40 out of the five combinations measured for him.

**Why the ramp changed shape.** The gap had to stay 76 at 1920 while dropping to 52 at 1440,
and a 2.5vw ramp cannot span that — hence 5vw. `--page-pad-x` keeps its 4.4vw slope, shifted
24 further down so its floor binds at exactly 40 at 1440.

**How it was verified.** 1440: gap 52, side margin 40, frame 544×408, columns 356, bottom
padding still 76, the frame's centre still 454, nothing overflowing, every title's line count
unchanged (3-2-3-3-3-2-2). 1512: gap 55.6, margin 43, frame 604. 1680: gap 64, margin 50,
frame 720 — at the cap. 1920: gap 76, margin 108 (from `--page-max`), frame 720, columns 416,
bottom padding 96 — nothing moved. Screenshot at 1440.

**What is left undone.** **The frame is now capped from ~1655 up**, so it only grows across
1440–1655; that band was 1440–1830 this morning. Raising the 720 cap is the only thing that
changes it — flagged for the client, not touched. Headroom left at 1440 is in CONTEXT §5.

**Noted, not mine.** The hero is now `data-theme="graphite"` with a video, and the morph
panel's fill was moved from `--c-green` to `--c-graphite` to match — another session's work,
landed while this was in progress. Verified the morph still lands on the frame's box.

## 2026-09-03 — a photograph back in the hero frame

**What changed.** New `assets/images/hero-street.webp` (1440×1080, 91 KB). `index.html`: the
hero slide is empty markup again, filled from the stylesheet like the other picture slides —
the `<video>` is gone from it. `assets/css/base.css`: a `background-image` rule for
`[data-for="hero"]`, replacing the stale "deliberately empty" comment.

**Why.** Client supplied the shot — Figma `265:39107` in the project file — and said it goes
in the frame, which means the screen recording leaves it.

**How it was verified.** `download_assets` on that node gave a 4096×2286 JPEG. Cropped centred
to 4:3 and resized in one `cwebp -q 82 -crop 524 0 3048 2286 -resize 1440 1080` pass — lossy
because it is a photograph, per CONTEXT §7. Looked at the output: man centred, hands inside
the frame, both edge pedestrians partly kept. In the page at 1440: the slide's
`background-image` resolves, `background-size: cover`, no `.stage-frame__video` left in the
DOM, no console errors, and the dashed placeholder outline stays off (`data-filled="true"`).

**What is left undone.** The client also asked for the first screen to go dark grey — not
done, waiting on two answers: which grey (`--c-graphite` #1A1817 or another), and what
happens to the morph panel, which is the hero's green ground and would either turn grey with
it or need the green to come from somewhere else. `data-theme="graphite"` does not exist in
the `GROUND` map in main.js yet either. The video is unwired, not deleted: `hero.mp4`, its
poster and the old studio `hero.webp` all stay, and the controller in main.js is guarded on
the element being present, so it stands down on its own — dead code left in place rather than
ripped out of another session's work.

## 2026-09-03 — 496 at 1440, paid out of the side margin

**What changed.** `assets/css/base.css`: new `--page-pad-x`,
`clamp(52px, calc(4.4vw - 12px), 96px)` — the old 4.4vw ramp shifted down 24 — used by
`--frame-w` and by the sections' side padding. `--page-pad` keeps its old value and now means
vertical only: the bottom padding and the frame's optical centre. `CONTEXT.md` §5: the two
tokens, the measured table, the arithmetic paragraph, the frame's history.

**Why.** Client asked the frame bigger again at 1440 and chose the side margin to pay for it
rather than the columns, which had already cost two titles a line.

**Why two tokens.** `--page-pad` was both the side margin and the sections' bottom padding,
and the frame's centre is derived from it. Lowering the one token would have taken 24 off the
bottom padding and moved the frame's centre 12px down — not asked for. Splitting is the only
way to move one without the other.

**How it was verified.** 1440: frame 496×372, side padding 52, bottom padding still 76, the
frame's centre still 454, columns 356, no title or subtitle overflowing, every line count the
same as at 448. 1680: frame 656 → 704, margin 86 → 62, bottom padding untouched at 85.92.
1920: nothing moved — margin 108 from `--page-max`, frame at its 720 cap, columns 416, bottom
padding 96. Screenshot at 1440.

**What is left undone.** The frame now reaches its 720 cap at about 1700 rather than 1830, so
the band where it grows with the screen is shorter. Not raised with the client. Headroom left
at 1440 is written down in CONTEXT: columns to 324 (frame 560) before `speed` goes to four
lines.

## 2026-09-03 — the frame back up to 448 at 1440

**What changed.** `assets/css/base.css`: `--col-min` 380 → 356. `CONTEXT.md` §5: the floor's
comment, the measured table, what actually binds the floor, and the frame's history.

**Why.** Client: the frame read too small at 1440 after the gap went up (400). He chose to
pay for it out of the text columns rather than out of the page margin, and asked for 448 —
wider than the 424 it had before the gap.

**How it was verified.** At 1440: frame 448×336, columns 356, gap 64, side margin 76, no
title or subtitle overflowing. 1680: frame 656. 1920: unchanged, 720 and 416 — the cap binds
there, so the floor does nothing.

**What is left undone / broke.** **380 was the exact edge.** Stepped the floor down 4px at a
time in the live page: at 380 the hero and customization titles set in two lines, at 376 and
below both go to three. So his choice costs those two titles a line at 1440. Told him with
the numbers; not reverted, it was his call. The one alternative that keeps 448 *and* two
lines is a 52px side margin instead of 76 — at 1440 the width does not divide any other way.
The figure in CONTEXT that made 356 look safe (the widest hard-broken run, ~275) was never
the real constraint; that is now written down.

## 2026-09-03 — +12 on the column gap

**What changed.** `assets/css/base.css`: `--col-gap` `clamp(40px, calc(2.5vw + 16px), 64px)`
→ `clamp(52px, calc(2.5vw + 28px), 76px)`. `CONTEXT.md` §5: the value, the measured table
(now with the text column and 1680), and the paragraph on which side pays for the gap.

**Why.** Client wants more air between the frame and the two text columns.

**How it was verified.** Measured at four widths: gap 64 / 65.8 / 70 / 76 at 1440 / 1512 /
1680 / 1920 — +12 at every one. Below the frame's cap the frame pays: 424 → 400 at 1440,
487 → 463 at 1512, 632 → 608 at 1680, columns staying on their 380 floor. At 1920 the cap
binds, the frame holds 720 and each column pays: 428 → 416. No title overflows its column at
1440 or 1920, and A/B against the old gap in the live page shows every title keeping the same
line count. The closer's head takes the same token — 76 at 1920. The morph's target box is
measured off the frame, so it followed on its own.

**What is left undone.** The frame lost 24px on every screen below ~1830 as a side effect —
nobody asked for a smaller frame, and CONTEXT warns against re-tuning it unasked. Flagged
for the client; not compensated with a bigger cap.

## 2026-09-03 — section 3 goes black

**What changed.** `index.html`: `#speed` moved from `data-theme="smoke" data-ink="dark"` to
`data-theme="black" data-ink="light"`. `CONTEXT.md` §4: the background table and the
colour-sequence note.

**Why.** Client asked for it.

**What follows.** The page now reads green → smoke → **black** → black → smoke → smoke →
black, so sections 3 and 4 are adjacent blacks: the ground does not change colour across
that crossing at all, and only the frame's content swaps. Nothing in the CSS or the JS keys
on a section id or on `data-theme` — grepped for both — so the change is the attribute pair
and nothing else. Everything the ground drives follows on its own: the section's text, the
frame's tint and dashed outline, and the secondary CTA, which is now a white stroke with a
white label.

**How it was verified.** `localhost:4321` at 1440×900, snap off, scrolled to every section's
own `offsetTop` with `ScrollTrigger.update()` and read the three live colours off `<html>`:

| section | `--ground` | `--ink` |
|---|---|---|
| hero | `rgb(166, 237, 0)` | black |
| capabilities | `rgb(233, 235, 238)` | black |
| **speed** | **`rgb(0, 0, 0)`** | **white** |
| customization | `rgb(0, 0, 0)` | white |
| marketplaces | `rgb(233, 235, 238)` | black |
| audience | `rgb(233, 235, 238)` | black |
| closer | `rgb(0, 0, 0)` | white |

**Left undone.** The `speed` slide has no screen, so its frame is an empty tint on black
now. Nothing else on this item.

## 2026-09-03 — the deck's throw is integrated, not tweened

**What changed.** `main.js`, `the style deck`: the exit tween is gone. A card that is let go
of now has its position integrated per frame from the release velocity against exponential
friction (`v *= e^(-dt/tau)`, tau 190ms) on a `gsap.ticker` callback, with nowhere it has to
end up; the only fixed animation is opacity — 0.42s `power1.in` — and its completion is what
retires the card to the back of the deck. It also leaves the deck's order at release, so the
stack closes up while it is still dissolving above it; `layout()` skips whatever is in the
air, and the gate cancels a flight if the section is left mid-throw. `CONTEXT.md` §7 rewritten
to match: the two wrong cuts and why.

**Why.** Client's diagnosis, and it was the right one: "может это надо через физику как-то
делать? конкретно перемещение. а уход в нулевой опасити хардкодить. то есть если я увел
карточку и оставил сбоку — она на месте растворится. если я выкинул её драгом — улетит
растворяясь." The previous cut was honest about acceleration but still forced every card to
cross the whole frame inside its tween, so a slow release exited faster than the hand.

**How it was verified.** Emulated 1440×900 (frame 424×318), GSAP on manual ticks with
`lagSmoothing(0)`, synthetic `PointerEvent`s at ~16ms spacing, `setPointerCapture` stubbed —
the pane is hidden here, so trusted pointer events cannot be delivered.

```
slow release   20 × 6px at 16ms → released at x 120, ~0.375 px/ms
  x/opacity      139/0.98  152/0.93  163/0.82  171/0.68  176/0.49  180/0.27  183/0
               63px of travel — it dissolves where it stands, decelerating throughout
flick          3 × 26px at 16ms = 78px (under the 110px catch) at ~1.6 px/ms
  x/rot/op       155/4°/0.98  214/6°/0.92  257/7°/0.82  288/8°/0.68  311/9°/0.50
                 328/9°/0.27  340/10°/0.01
               262px of travel in the same 0.42s, still turning as it goes
landing        both cases: back slot, x 0, y 44, opacity faded up to 0.30, z 1, top false;
               order rotated, deck closed up
short + slow   4 × 6px = 24px released still → x 0, rotation 0, opacity 1, order unchanged,
               card behind sank back to y 22 / opacity 0.65
mid-flight     the thrown card sits at z4 above the deck while the next one is already
               rising into the frame's box behind it
left mid-air   scrolled away during a flight → every card back at its slot
               (x 0, y 0/22/44, op 1/0.65/0.30, z 3/2/1), deck inert, and it stays put
               under another 300ms of ticks: the ticker callback was removed, no drift
```

Screenshotted mid-flight at 1440×900: the card at x 238, ~7°, opacity 0.87 — the page's
right-hand column reads through it — with the next card already full-size in the frame.
No console errors. The resting geometry is unchanged from the last entry, so nothing new to
look at there.

**What is left undone / known soft.**
- **Not committed.** A parallel session's uncommitted `.stage-morph` work sits in the same
  four files, and in `WORKLOG.md` our two entries land in one hunk, so there is no clean
  file-level commit to make. Waiting on Levon.
- A card in the air blocks a new drag for 0.42s; several cards in flight would need a set,
  not a single `flight`.
- Still no trusted pointer input in this session, and the stack has still only been seen
  over the hero's green ground — a hidden pane does not repaint after a scroll.
- Sources unchanged: 836×627 is 2.0x at a 1440 frame, 1.16x at 1920.

## 2026-09-03 — the morph is gone once it lands, not just covered

**What changed.** `assets/js/main.js`: one `setMorph(t)` now owns both the shape and the
panel's presence — `display: none` from t = 1 — and the crossing and `settleMorph()` both go
through it. Dropped the separate "hide on the way off capabilities" hook, which is what left
the panel alive under the tab strip. `CONTEXT.md` §5: that bullet rewritten.

**Why.** Client: green showed through on section 2 while the tabs switched panes. The panes
cross-fade, so mid-swap both are part transparent and the panel behind the frame was visible.
Covered is not enough — it has to be gone.

**How it was verified.** Swept the crossing both ways at 1440: `hidden` false through the
whole gesture (t = 0.978 at 880, t = 0.999 at 899), true at exactly 900 and everywhere past
it, false again on the way back at 450. On capabilities: `display: none`, and
`elementsFromPoint` through the frame's centre no longer lists `.stage-morph` at all.
Deep link `#capabilities` settles hidden.

**What is left undone.** Same as the entry below — not watched at full speed, the browser
pane throttles `requestAnimationFrame` while hidden. The mid-gesture half-opaque dashboard
inside the still-large green rectangle is untouched and still the client's call.

## 2026-09-03 — the deck's throw made physical, and the fan replaced by a stack

**What changed.** `main.js`, `the style deck`: the exit tween is now an ease-**out** whose
duration is derived from the release speed, the drag keeps a smoothed velocity, a fast
flick throws a card that never reached the catch distance, and the card behind rises
towards the front slot while the front one is dragged. `slot()` lost its rotation and
gained opacity, so the stack is smaller-lower-dimmer instead of a fan. `base.css` and
`CONTEXT.md` updated to match.

**Why.** Client, after seeing it: the animations lacked finish, and one thing was plainly
wrong — "отвел карточку в сторону с драгом, отпустил, а она начинает ускоряться вбок.
антифизично". That was `power2.in` on the exit: an ease that starts from a standstill. He
also dropped the fan for a Tinder stack and asked for the off-cards to be dimmed.

**Numbers now.** drop 22px, shrink 5%, dim 35%, catch 26% of the frame's width, flick
0.7 px/ms, swing 12°, exit clamped to 0.26–0.5s, return 0.5s `power3.out`.

**How it was verified.** Emulated 1440×900 (frame 424×318), GSAP on manual ticks with
`lagSmoothing(0)`, synthetic `PointerEvent`s at ~16ms spacing with `setPointerCapture`
stubbed — the pane is hidden here, so trusted pointer events cannot be delivered.

```
at rest        1 / 0.95 / 0.90 scale, y 0 / 22 / 44, opacity 1 / 0.65 / 0.30, rotation 0
               ledges under the front card measure 14px and 28px; widths 424 / 403 / 382
slow drag      20 × 6px at 16ms → x 120, rotation 3.40° (120/424 × 12° — to spec)
  (past 110px)   card behind came up: y 22→5.6-equivalent, scale 0.98, opacity 0.86
release        step sizes per 40ms: 64 58 52 46 41 35 29 23 18 12 6 — monotonically
               DECELERATING from the first frame. This is the bug the client caught.
flick          3 × 26px at 16ms = 78px, under the 110px catch, but 1.6 px/ms → flew;
               x kept going 78 → 190 in the first 60ms
short + slow   4 × 6px = 24px released still → returned to x 0, rotation 0, order
               unchanged, and the card behind sank back to y 22 / opacity 0.65
```

No console errors. Screenshotted at 1440×900: the front card fills the frame, two dimmed
ledges under it, no rotation anywhere.

**What is left undone / known soft.**
- A deliberately slow release still hands off to a quicker exit — continuing 0.4 px/ms
  honestly would need ~2s to clear the frame, so the speed floor and the 0.5s clamp bite.
  The acceleration is gone; the speed step is not. Written up in CONTEXT with the fix to
  reach for if it shows (fade the card out mid-flight, do not lengthen the tween).
- Still not touched by a real mouse or trackpad, and the stack has still only been seen
  over the hero's green ground: a hidden pane does not repaint after a scroll, so captures
  at the section's own black ground come back solid black.
- Sources unchanged and still short — 836×627 is 2.0x at a 1440 frame, 1.16x at 1920.

## 2026-09-03 — the hero's green shrinks into the frame

**What changed.** New `.stage-morph` layer — `index.html` (one div beside `.stage-photo`),
`assets/css/base.css` (the layer, full-bleed and square at rest), `assets/js/main.js`
(`measureMorph` / `drawMorph` / `settleMorph`, and two hooks in the boundary pass: the
hero → capabilities crossing draws the shape and steps the ground to smoke on the first
movement, the crossing off capabilities hides the panel). `CONTEXT.md` §5: a new subsection
and the boundary pass's inventory.

**Why.** Client, 2026-09-03: repeat cash.app's move — the bright first ground "becomes" the
frame in the middle of the screen. His three calls: start full-bleed with no radius, end
without dissolving (the green stays behind the frame), ground smoky from the first movement.

**How it was verified.** Swept the crossing in both directions at 1440 with
`ScrollTrigger.update()`: t = 0 `inset(0px)` and green ground; t > 0 smoke immediately;
t = 1 `inset(295px 508px 287px 508px round 32px)` against a frame box measured at
(508, 295) 424×318 — exact, radius exactly 32. At 1920: `inset(264 600 276 600 round 32)`
against a 720×540 box at (600, 264) — exact after a resize refresh. Hidden past capabilities,
un-hidden coming back. Deep links `#capabilities` and `#speed` settle right. One screenshot
mid-crossing shows the rounded green rectangle over smoke.

**What is left undone.** The capabilities slide fades in on the same scrub, so mid-gesture a
half-opaque dashboard sits inside a still-large green rectangle — flagged for the client,
not changed. The browser pane throttles `requestAnimationFrame` when hidden, so the shrink
was verified frame by frame from script rather than watched running; screenshots of fixed
layers came back with stale offsets. Not looked at with eyes at full speed.

## 2026-09-03 — the hero frame plays a looping screen recording

**What changed.** New `assets/video/hero.mp4` (933 KB) and `assets/images/hero-poster.webp`
(40 KB). `index.html`: the hero slide holds a `<video autoplay muted loop playsinline
preload="auto">` and is marked `data-filled="true"`. `base.css`: new `.stage-frame__video`
— absolute, `object-fit: cover`, `border-radius: inherit`, `pointer-events: none`.
`main.js`: a hero-video block that registers a `--t` gate so playback stops off stage, and
pauses outright under `prefers-reduced-motion`. `CONTEXT.md` §7: new "The hero video"
subsection, and the frame-content table now lists the video plus the old photograph as kept
but unused.

**Why.** Client asked for that Figma node as the hero, looping, "for now".

**Figma cannot hand over the video.** `download_assets` on `247:42060` returns only PNGs —
a node render and a 1108×720 poster — because it is a video *fill*. `export_video` refuses:
"Export root must be a top-level frame. Sub-clips cannot be exported directly"; that tool
renders Figma timelines. The client supplied the file by hand after I said so.

**Encoding.** Source 1108×720, 60fps, 14s, 1.93 MB, no audio. Shipped at 1000×650, 30fps,
x264 `-crf 30 -preset slow -tune animation`, `+faststart` → 933 KB. Measured alternatives:
`-crf 28` 1.25 MB, `-crf 32` 720 KB (checked a frame at true display size — still legible),
and VP9 `-crf 36` **2.0 MB**, which is why there is no webm at all. 1000px wide is chosen
off the real box: the frame is 424×318, so 848×636 at 2×.

**How it was verified.** `localhost:4321` at 1440×900. Live DOM on the video: `currentSrc`
the mp4, `object-fit cover`, `border-radius 32px`, box 424×318 exactly matching the frame,
`loop`/`muted`/`autoplay` all true, `readyState 4`, intrinsic 1000×650. Gate driven by hand
with `ScrollTrigger.update()`:

| scrollY | slide `--t` | video |
|---|---|---|
| 0 | 1 | playing |
| 450 | 0.5 | paused |
| 900 | 0 | paused |
| 0 | 1 | playing again |

`play()` resolves, so autoplay is permitted; frames do not advance because the browser pane
is hidden (`document.hidden` is true) — that part is unobservable here, not broken.

**Watch out.** The console showed `Cannot read properties of null (reading 'style')` at
`main.js:255`. Not a live fault: the browser was holding a cached `index.html` from before
another session added `.stage-morph`, against the current `main.js`. Confirmed by wiping
`--t` and forcing `ScrollTrigger.refresh()` — the listener on the last line of `main.js`
restored it, so the file runs to the end. A cache-busted load has no error.

**Left undone.** The 4:3 crop eats into the left column of the recording — flagged for the
client, `contain` or a 4:3 recrop are the ways out. `preload="auto"` means the 933 KB is
fetched on load; if that matters for the board demo, `preload="metadata"` plus the poster is
the trade. `assets/images/hero.webp` is now referenced by nothing.

## 2026-09-03 — a Tinder deck in the frame on section 4

**What changed.** `index.html`: the `customization` slide stops being empty — it gets
`data-filled="true"` and a `.style-deck` with three `.style-card`s. `base.css`: a
`the style deck` block — cards absolute on the frame, `cover`, radius inherited, only the
front one takes a pointer. `main.js`: a `the style deck` controller, and `stage()`'s single
gate hook generalised into a `gates` map so the tabs and the deck can both hang off it.
Three new files under `assets/images/`, cropped out of the client's AVIFs.

**Why.** Client asked for the mechanic on 2026-09-03 and picked all three options himself:
by hand only (no timer, no buttons), the deck fans out, and the 16:9 screens are cropped to
the frame rather than letterboxed. Cards rejoin the deck at the back after a throw — that
part is mine, or three throws would leave an empty frame.

**How it was verified.** Emulated 1440×900 (frame 424×318 there), GSAP on manual ticks with
`lagSmoothing(0)`, synthetic `PointerEvent`s with `setPointerCapture` stubbed — the pane is
hidden in this session, so trusted pointer events cannot be delivered.

```
at rest        furniture TOP z3 flat | bags z2 y10 +3.15° | apparel z1 y20 −3.10°
drag 150px     transform x150 y8 rot 4.95°  (150/424 × 14° — exactly the spec)
release        threshold 119px → flew out; after 520ms bags is TOP, apparel z2,
               furniture back at the tail slot; after another 400ms the fan is closed up
drag 60px      under the threshold → returned to identity, top card unchanged
gate           load at hero: --t 0, deck inert. On section 4: --t 1, not inert.
               Section 6: --t 0, inert again.
tabs           unbroken by the gates refactor: not inert on section 2, sweep 0% → 12%
               across 600ms of ticks (5s dwell)
```

No console errors. Screenshotted the deck at 1440×900 — the card fills the frame with the
right radius, the crop keeps the shop's own header, and the two cards behind read as a fan.

**What is left undone / known soft.**
- The screenshot had to be taken with the deck forced on stage over the *hero's* green
  ground: the hidden pane does not repaint after a scroll, so every capture at the
  section's own black ground came back solid black. Its real ground is unseen.
- Sources are too short: crop tops out at 836×627, which is 2.0x at a 1440 frame but
  1.16x at 1920. Ask for taller screens.
- Not touched by a real mouse or trackpad — no trusted pointer events in this session.
- No shadow or hairline between cards; the fan relies on the black ground for contrast.
- Keyboard cannot throw a card. Nothing was asked for, and the whole frame sits inside
  `aria-hidden="true"`, so the deck is invisible to assistive tech either way — the same
  as the capabilities tabs, and pre-existing.

## 2026-09-02 — subtitle narrowed 30%, xl down 4px

**What changed.** `assets/css/base.css`: `.section__subtitle` gets `max-width: 70%`, and
`--fs-xl` goes `clamp(36px, calc(12px + 1.6667vw), 44px)` →
`clamp(32px, calc(8px + 1.6667vw), 40px)`. Two stale comments corrected with the new
measurements. `CONTEXT.md` updated.

**Why this shape.** The client wanted the subtitle about 30% narrower but not at the cost of
the title, and ruled out asymmetric columns. `max-width` on the paragraph does it without
touching the grid: the column stays 380, so the fixed frame stays on the screen's axis and
on its slot. The alternative — different column widths — would have moved the slot 57px off
centre and forced the frame to be re-anchored.

**Numbers behind the advice.** The text column's floor is set by the widest hard-broken run
in a title, not by a word: `и интернет магазин` measures 309 at the 1440 size and 386 at
1920, while the longest word `маркетплейсах` needs only 236 and 295. That is why a symmetric
shrink could only have been ~8%, not 30%.

**How it was verified.** Freshly loaded stylesheet.

| viewport | xl | subtitle | frame |
|---|---|---|---|
| 1440×900 | 32 | 266 (was 380) | 424, unchanged |
| 1512×830 | 33.2 | 266 | 487, unchanged |
| 1920×1080 | 40 | 300 | 720, unchanged |

Subtitle line counts at 1440 go 3→4, 2→3, 3→4, 2→3, 2→3, 2→2. Every title keeps its
hand-set breaks — "Твоё приложение / и интернет магазин / за один день", "Весь цикл / в одном
кабинете", "Управляй / своим бизнесом / на маркетплейсах". No collisions with the frame at
any width, no horizontal overflow.

## 2026-09-02 — the twelve-column grid, tried and rolled back

**What happened.** The layout was moved onto a page grid modelled on cash.app's — 12
columns, a fixed gutter, capped columns, two flexible edge tracks, the three parts of a
section on `2 / span 4`, `6 / span 4`, `10 / span 4`. It worked and every screen lined up,
but it makes the three areas *equal*, and the client rejected that: the frame had been
taking the leftover and was wider than a third on a big screen, so at 1920 it fell from 720
to 524. "Рамка на 1920 не может быть такой крошечной."

**Reverted** in this commit — `git revert` of `7df4eed`. Back to `--col-gap`, `--col-min`
and the frame as the leftover after the two floored text columns.

**Worth keeping from it**, in case this comes up again. What cash.app actually does,
measured on their live page: 12 columns, a flat 20px gutter, columns capped at 102px so the
content stops at 1444, and the surplus goes to two flexible edge tracks — margins 0 at 1280,
16 at 1512, 220 at 1920. Sections span `1 / -1`; their content wrapper is
`grid-template-columns: subgrid`, so children place on the page's own columns — headline
`1 / span 4`, phone `5 / span 4`, text `9 / span 4`.

**Why their architecture cannot keep our proportions.** Twelve columns only offer symmetric
splits of 4/4/4 or 3/6/3. 4/4/4 makes the frame exactly a third — that is the 524. 3/6/3
gives the frame 818 at 1920 but leaves the text columns at 284 on a laptop, where the titles
need about 380. Anything in between needs asymmetric spans, which is no longer their
architecture. Do not retry this without deciding that trade first.

## 2026-09-02 — pushes now authenticate as levalovushka

**What changed.** `.git/config` of this repo only: `credential.helper` reset to empty and
then set to `!gh auth git-credential`. `CONTEXT.md` §9 gains a "Pushing" subsection with the
commands, the check and the undo.

**Why.** Every push failed with `403 Permission to levalovushka/alphaseller.git denied to
llleva`. Git Credential Manager holds a second GitHub account on this machine and was
answering first; `gh` was already logged in as `levalovushka` with `repo` scope, so pointing
git at gh's helper is enough. The empty value first is what drops the inherited GCM entry
for this repo — without it GCM still wins, since helpers are tried in order.

**Scope.** Repo-local. Global config, the keychain and GCM itself are untouched, and no
token was typed, printed or stored — gh passes its keyring credential to git directly.

**How it was verified.** `printf 'protocol=https\nhost=github.com\n\n' | git credential
fill | grep '^username='` → **`username=levalovushka`** (password line filtered out, never
displayed). `git push origin main` then reported `Everything up-to-date` with the branch
level against `origin/main`; `8064ea9` is on `origin/main`, so yesterday's and today's work
is out.

**Left undone.** Only this repo is fixed. `gh auth setup-git` would fix every repo on the
machine — the client's call, not done.

## 2026-09-02 — case cards rounded 12 harder

**What changed.** `assets/css/base.css`: new `--radius-card: calc(var(--radius-btn) + 12px)`
= 44px, and `.case` reads it instead of `--radius-btn`. `CONTEXT.md`: the control-size table
gains a row for it and the "two shapes" paragraph is now "two shapes, three radii".

**Why.** Client asked for +12 on the cards. It is the first thing on the page to leave the
shared 32, hence its own token rather than a literal.

**How it was verified.** `localhost:4321` at 1440×900, live DOM: all **four** cards report
`border-radius 44px`, the token resolves to `calc(calc(16px * 2) + 12px)`. Nothing else
moved — frame 32, logo square 32, buttons still `999px` pills.

**Watch out.** The first read came back 32 across the board: the browser was serving a
cached `base.css`. Confirmed by fetching the file with `cache: 'reload'` (the new token was
in it) and then cache-busting the `<link>`. Worth remembering for the next CSS check in this
preview.

**Left undone.** Nothing on this item.

## 2026-09-02 — squircle narrowed to the logo, buttons become pills

**What changed.** `assets/css/base.css`: the `@supports (corner-shape: squircle)` block now
lists only `.header__logo`; the second such block on `.case` is gone. New `--radius-pill:
999px` drives `.btn` and `.frame-tab`. The frame, its slides, the panes and the cards keep
`--radius-btn` (32) as plain rounded rectangles. `CONTEXT.md` updated in three places.

**Why.** Client's call.

**How it was verified.** Freshly loaded stylesheet, computed values read off the page:

| element | radius | corner-shape |
|---|---|---|
| logo square | 32px | **squircle** |
| header button | 999px | round |
| section button | 999px | round |
| cases button | 999px | round |
| frame tab | 999px | round |
| frame | 32px | round |
| frame slide | 32px | round |
| case card | 32px | round |

## 2026-09-03 — the wheel gets its own controller

**What changed.** `assets/js/main.js` gains a `one gesture, one section` block at the
bottom: `wheel` is taken with `{ passive: false }`, `preventDefault`ed, and one section per
gesture is animated by hand with GSAP. Three constants in `WHEEL` hold the whole feel —
`trip` 12px, `rearm` 90ms, `glide` 0.65s. The file's own header comment no longer claims
"no wheel hijacking". `base.css`: the snapping comment now says what CSS still owns
(keyboard, touch, scrollbar) and what it does not; the three declarations themselves are
untouched. `CONTEXT.md` §5 gains "The wheel is ours, everything else is the browser's".

**Why.** With a trackpad the page was fine; on a mouse the client got "один клик не
двигает" and "вязко доезжает". A wheel click is ~100px against a 900px screen, so Chrome's
mandatory snapping resolved the gesture to the *nearest* point — the one it started from —
and `scroll-behavior: smooth` animated that round trip. He picked the unified controller
over a wheel-only heuristic, so the trackpad goes through the same path now.

**Two measured facts that shaped it.** (1) Mandatory snapping re-resolves any scripted
scroll position — `scrollBy(0, 60)` from the top lands on 720 immediately — so the glide
turns `scroll-snap-type` off for its duration and restores it on the exact snap point at
the end. (2) cash.app has dropped CSS snapping entirely: `scroll-snap-type: none`, no
`scroll-snap-align` anywhere, zero `scroll-snap` occurrences in all seven of its
stylesheets, and `_scrollTop` / `_scrollLeft` on `window`.

**How it was verified.** Emulated 1440×900, seven sections of exactly 900, GSAP on manual
ticks with `lagSmoothing(0)` — the Browser pane is hidden in this session, so rAF is paused
and trusted `wheel` events cannot be delivered at all. Synthetic `wheel` events exercise
the whole controller, since it moves the page itself rather than relying on the browser's
snap:

```
one click down (deltaY 100)   → prevented, snap off during, path
                                59:3 119:22 179:74 239:177 299:347 359:574 419:737
                                479:834 539:882 599:898 659:900 → landed 900, snap restored
burst of eight clicks          → all prevented, landed 1800 — one section, not eight
one click up                   → landed 900, --ground rgb(233,235,238) (smoke)
three trackpad-sized deltas    → first two swallowed under the 12px trip, third advances
  (deltaY 4)                      one section
Firefox line mode (deltaY 3,   → landed 2700, exactly the next section top
  deltaMode 1)
at 2700, after a yield         → --ground rgb(0,0,0), --ink rgb(255,255,255), photo 1
```

The last line matters: colour, ink and the photographic ground all end the glide where the
section change should leave them. Their *per-frame* coupling during the glide could not be
sampled — ScrollTrigger updates off native scroll events, which are not delivered inside a
synchronous tick loop, and rAF is paused in a hidden pane.

**What is left undone.** Not tried on a real mouse or a real trackpad — that is the
client's next test, and the three `WHEEL` numbers are what to turn. A continuous spin of
the wheel deliberately moves one section only (`rearm` swallows the burst); if that reads
as unresponsive, lower `rearm`. The keyboard is still on native snapping and was not
touched, so a single arrow key may well have the same "nearest point" problem the wheel
had — unmeasured. Nothing here was screenshotted: the change is input handling, the
rendered page is identical.

## 2026-09-02 — the case cards grow to a 24px gap

**What changed.** `assets/css/base.css`: `.cases__grid` takes a flat `gap: 24px` instead of
`--col-gap`, and `.case` lost its `max-height: 100%`. `CONTEXT.md` records the sizes.

**Why the max-height went.** With the width coming from the grid and the height from
`aspect-ratio: 1 / 1`, a height cap can only be paid for out of the ratio — the cards would
stop being square exactly when the screen is short. The client asked for the square, so the
cap had to go.

**How it was verified.** Freshly loaded stylesheet at each size. Cards are square at every
width and the measured gaps between all four are 24 (one reads 23 at 1512 — subpixel
rounding on a fractional container):

| viewport | card |
|---|---|
| 1440×900 | 304×304 |
| 1512×830 | 321×321 |
| 1920×1080 | 408×408 |

The grid still fits its screen at all of them, and at a deliberately short 1440×780 as well —
head ends at 300, grid runs 340–704 inside 780, no overlap. No horizontal overflow.

## 2026-09-02 — wider column gap, and the frame cap follows it down

**What changed.** `assets/css/base.css`: `--col-gap` `clamp(24px, 2.5vw, 48px)` →
`clamp(40px, calc(2.5vw + 16px), 64px)`, and the frame's cap 752 → 720. `CONTEXT.md` updated
with the new numbers and the coupling.

**Why the cap moved with it.** At 1920 the cap sets the text columns. Adding 16 to the gap
took each column from 428 to 412, and "и интернет магазин" needs 425 — the client's hand-set
third line broke to a fourth immediately. Giving the same 32 back off the cap restores 428.
The two numbers are coupled; noted in `CONTEXT.md` so the next change to either does not
silently break that title.

**How it was verified.** Freshly loaded stylesheet at each width.

| viewport | gap | frame | speed title |
|---|---|---|---|
| 1440×900 | 52 | 424 | three lines |
| 1512×830 | 54 | 487 | — |
| 1920×1080 | 64 | 720 | three lines, column 428 |

No collisions on any frame-bearing section, no horizontal overflow. Cards in the cases grid
follow the gap and are 283 wide at 1440, down from 295.

**Worth the client's eye.** The frame is now 424 at 1440 and 720 at 1920 — the gap was paid
for out of the frame, since the column floor and the page margins are fixed.

## 2026-09-02 — photograph off the hero

**What changed.** `index.html`: `data-filled="true"` dropped from the hero slide.
`assets/css/base.css`: the `background-image` rule for that slide removed, replaced by a
comment saying why the file is still there. `CONTEXT.md` records it.
`assets/images/hero.webp` is **kept** — the client wants it again later, just not on the
first screen.

**How it was verified.** With a freshly loaded stylesheet: the hero slide computes
`background-image: none`, carries no `data-filled`, and `hero.webp` is not requested at all
on a full page load. The frame is back to its dashed outline there. The capabilities panes
are untouched — all three still resolve their own images and return 200.

## 2026-09-02 — third pane filled, all three tabs now carry a screen

**What changed.** New `assets/images/capabilities-logistics.webp` — Figma node `223:37237`,
exported @2x to 2236×1677, **`cwebp -q 90`**, 167 KB. `base.css` fills the `logistics`
pane and its comment now lists all three nodes; the TODO is gone. `CONTEXT.md` §7 gains the
row and a rewritten encoding rule, §10 the node.

**Why.** Client supplied the last of the three. The tabs no longer show an empty frame on
any dwell.

**Lossy here, lossless on the other two.** This screen has product photographs in it, which
inverts the earlier finding: 196,206 bytes lossless against **170,734** at `-q 90`, so the
rule in §7 is now "encode both ways, keep the smaller". Safe because the frame renders these
at roughly a fifth of their pixel size — `-q 90` artefacts do not survive that downscale.

**How it was verified.** `localhost:4321` at 1440×900, capabilities on stage. All three
panes resolve to their own file: `capabilities-promotion.webp`, `capabilities-orders.webp`,
`capabilities-logistics.webp`. The new file decodes to 2236×1677, ratio **1.3333** against
the frame's **1.3333**. Ran the carousel on real elapsed time with `lagSmoothing(0)` and
manual ticks, four samples across three dwells:

```
promotion  → capabilities-promotion.webp
orders     → capabilities-orders.webp
logistics  → capabilities-logistics.webp
promotion  → capabilities-promotion.webp
```

Full cycle, wrapping correctly, no empty frame.

**Left undone.** The screen assigned to `Логистика` is titled «Товары и остатки» — the
client's assignment, flagged for him in case the tab wants renaming. No screenshot: the
browser pane does not repaint.

## 2026-09-02 — promotion screen arrives, the old one becomes orders

**What changed.** `assets/images/capabilities-promotion.webp` → renamed to
`capabilities-orders.webp` (same bytes — the client said that dashboard is Заказы, not
Продвижение, so it was a rename and not a re-export). New
`assets/images/capabilities-promotion.webp` from Figma node `206:62480`, named
"Продвижение — 4×3 / content": @2x → 2236×1677, `cwebp -lossless`, **172 KB** — here
lossless beats `-q 90` by a wide margin (175,616 against 190,262). `base.css` gains the
`orders` pane rule and its comment now lists both nodes. `CONTEXT.md` §7 and §10 updated.

**Why.** Client supplied the real Продвижение screen and reassigned the one already in the
repo.

**How it was verified.** `localhost:4321` at 1440×900, capabilities on stage. Panes:
`promotion` → `capabilities-promotion.webp`, `orders` → `capabilities-orders.webp`, both
`background-size cover`; `logistics` → `background-image none`. Both files decode to
2236×1677, ratio **1.3333** against the frame's **1.3333**, so neither is cropped. Ran the
carousel on real elapsed time with `lagSmoothing(0)` and manual ticks — the pane that is
`data-active` walks `promotion → orders → logistics`, and its background follows:
`capabilities-promotion.webp` → `capabilities-orders.webp` → `none`.

**Left undone.** The `logistics` pane has no screen, so every third dwell shows an empty
frame — waiting on the node. No screenshot: the browser pane does not repaint.

## 2026-09-02 — md down to 14/18 at 1440, small buttons to 40

**What changed.** `assets/css/base.css`: `--fs-md` → `clamp(14px, calc(2px + 0.8333vw), 18px)`,
`--lh-md` → `clamp(18px, 1.25vw, 24px)`, `--btn-h` 44 → 40. `CONTEXT.md` §7: the type table,
the clamp table (now with `xxl`), the control-sizes row, and the tabs' 44px reference.

**Why.** Client wants the small text smaller on a laptop and the section buttons shorter.

**How it was verified.** Measured in the browser at three widths — 1440 → 14/18, 1680 → 16/21,
1920 → 18/24, one group for all 117 text elements at each. Boxes: section CTA and the three
capabilities tabs 40 high at every width, header CTA still 48, header still 84. Hero
screenshot at 1440 and 1920.

**What is left undone.** The leading needed a second clamp — 18/14 = 1.286 against
24/18 = 1.333, so one multiplier cannot hit both ends. `--btn-h` is flat 40 across the
window, not scaled 40 → 44; say if it should scale with the type. Sections 2–7 were not
looked at with eyes: the browser pane kept resetting `scrollY` to 0 and screenshots off the
hero came back black.

## 2026-09-02 — re-pulled the promotion screen

**What changed.** `assets/images/capabilities-promotion.webp` re-exported from the same
Figma node `209:35586` after the client edited it: 193,192 → **192,266 bytes**. Nothing else
— same node, same file name, same `cwebp -lossless`, so no CSS or markup touched.
`CONTEXT.md` §7 notes the re-pull.

**Why.** Client edited the node and asked for a refresh. The export did change: the PNG
differs from the previous pull byte for byte (`cmp` says so), and the content sits about
30px lower — the header block above "Доброе утро!" grew.

**How it was verified.** `localhost:4321` at 1440×900, capabilities on stage. Server serves
the new file: `status 200`, `content-length 192266` — matching the file on disk. Decoded in
the page at 2236×1677, ratio **1.3333** against the frame's **1.3333**. Pane
`data-active true`, opacity 1, `background-image` still resolving to the same path.

**Left undone.** `orders` and `logistics` panes still have no image. No screenshot: the
browser pane does not repaint.

## 2026-09-02 — new cut of the promotion screen, one file per pane

**What changed.** `assets/images/capabilities-promotion.webp` — Figma node `209:35586`,
exported @2x to 2236×1677, `cwebp -lossless`, 189 KB (lossless beat `-q 90` again: 193,192
against 194,462). `assets/images/capabilities.webp` deleted: it was the previous cut of the
same screen, added by me earlier today, and nothing referenced it once the CSS moved.
`base.css` points the `promotion` pane at the new file. `CONTEXT.md` §7 and §10 updated with
the supersession chain and a row for the two panes still to come.

**Why.** Client supplied a cleaner cut of the same dashboard. Renamed per pane now rather
than later — two more files are coming for `orders` and `logistics`, and `capabilities.webp`
would have been the odd one out.

**How it was verified.** `localhost:4321` at 1440×900, capabilities on stage:
`background-image` resolves to `capabilities-promotion.webp`, pane `data-active true`,
opacity 1, `background-size cover`. Decoded 2236×1677 — image ratio **1.3333** against frame
ratio **1.3333**, so nothing is cropped. Old path `assets/images/capabilities.webp` now
returns **404** and no rule asks for it.

**Left undone.** `orders` and `logistics` panes still have no image — the client is bringing
the nodes. No screenshot: the browser pane does not repaint.

## 2026-09-02 — speed title rewritten, and a caching trap found

**What changed.** `index.html`: the speed title is now "Твоё приложение<br>и интернет
магазин<br>за один день". `assets/css/base.css`: the frame's cap went 760 → 752.
`CONTEXT.md`: copy table, plus a new §11 on how to verify in the browser.

**Why the frame cap moved.** At 1920 the cap is what sets the text columns: with the frame
at 760 they came out 424, and "и интернет магазин" needs 425 at the 44px xl. The title broke
to a fourth line one pixel short of fitting. Eight pixels off the frame gives the columns
four each — 428 — and the three lines the client asked for. Below about 1830 the cap does not
bind, so 1440 and 1512 are untouched (frame still 456 and 519).

**The trap, which matters beyond this change.** The stylesheet caches independently of the
document: a `?v=` on the page does not bust `base.css`. The first check of this change
reported the frame still at 760 and the title still on four lines — the file on disk had the
new value and the browser was using the old sheet. Any style-dependent measurement made this
way can be wrong. The fix, now written into `CONTEXT.md` §11, is to swap the `<link>` for one
with a cache-busting query and `ScrollTrigger.refresh()` before measuring. I re-checked the
recent CSS-dependent claims with fresh CSS: cards 390×390 white with `invert(1)` on the
flagged logos, xxl 64/64 with a 640px measure, the closer fitting its screen and the frame
absent there — all still true.

**How it was verified.** With a freshly loaded stylesheet: at 1440 frame 456, title in three
lines; at 1920 frame 752, column 428, title in three lines. No collisions on any
frame-bearing section, no horizontal overflow at either width.

**One for the client.** The copy says "интернет магазин"; the usual spelling is
"интернет-магазин" with a hyphen. Left exactly as written.

## 2026-09-02 — no CTA on the capabilities section

**What changed.** `index.html`: the `О платформе` secondary button is gone from
`#capabilities`; its aside is now the subtitle alone, with a comment saying why.
`CONTEXT.md` §4: the copy table's CTA cell for section 2 reads "dropped", and the note
under the table records that the section deliberately has no CTA.

**Why.** Client's call, once the frame got its tabs: the tabs are the thing to interact with
there and a second control beside them competed with them.

**How it was verified.** Reloaded `localhost:4321` and read the live DOM: `#capabilities
.btn` count **0**, the aside's only child is `P.section__subtitle`, and the CTA labels left
on the page are the six of sections 1, 3, 4, 5, 6 and 7. The three tabs are still there and
the strip still goes live on that section. The reveal tween's target list includes `.btn`,
so nothing needed changing there — it simply matches one fewer element.

**On the console.** It still shows an old `Cannot read properties of null (reading 'style')`
at `main.js:393`, from a version of the file that no longer exists — the MCP console buffer
survives reloads and `console.clear()`. Checked rather than assumed: wiped `--t` off two
slides and forced `ScrollTrigger.refresh()`; the listener registered on the *last* line of
`main.js` re-settled them (`cap 1`, `hero 0`), so the top level runs to the end with no
throw. Also tidied a stray blank line that edit had left at that spot.

## 2026-09-02 — two titles with hand-set breaks

**What changed.** `index.html`: "Весь цикл продаж в одном кабинете" → "Весь цикл<br>в одном
кабинете", and "Свои каналы продаж за один день" → "Свой сайт,<br>и приложение<br>за один
день". `CONTEXT.md` copy table updated, with ⏎ marking a hard break.

**Why.** Client's copy, and he set these two breaks by hand rather than leaving them to
`text-wrap: balance`.

**How it was verified.** Rendered line breaks read off the DOM, identical at 1440 and 1920:
"Весь цикл / в одном кабинете" and "Свой сайт, / и приложение / за один день". No collision
with the frame, no horizontal overflow.

## 2026-09-02 — tabs redrawn as pills, timer as a dark grey sweep

**What changed.** `assets/css/base.css`: `.frame-tab` is a pill on the buttons' geometry —
`--btn-h`, `--btn-pad-x`, `--radius-btn`, squircle, and the same 2px optical lift. Idle is
the secondary button (no fill, 1px ink stroke, ink label); `[aria-selected="true"]` is an
ink pill with an `--ink-invert` label, and its background is a two-stop gradient whose stop
is `--p`: `--tab-elapsed` (new token, 78% ink over the ground) to the left, plain ink to the
right. `background-clip: text` and the green are gone; `--tab-gap` 28px → 12px.
`assets/js/main.js`: `show()` now sets `--p` to 0% on every tab, because 0% *is* the resting
active state — manual mode needs no special case. Comments and `CONTEXT.md` §7 rewritten.

**Why.** Client's spec, after rejecting the green-through-the-letters version: idle pills
with a black stroke and black text, active a black pill with white text, the timer shown as
a dark grey fill moving left to right across the active pill. His rejection was sound — with
`--p` at 0% at the start of each dwell, all three labels read as the same grey and nothing
marked the active tab.

**How it was verified.** `localhost:4321` at 1440×900, capabilities on stage. Computed
style — idle: `background-image none`, `color rgb(0, 0, 0)`, `box-shadow inset 0 0 0 1px
rgb(0, 0, 0)`, height 44, padding 20/20, radius 32, `corner-shape squircle`. Active:
`color rgb(255, 255, 255)`, gradient `color(srgb 0.201 0.203 0.205)` → `rgb(0, 0, 0)` —
`#333435` on black. Sweep, driven by real elapsed time with `lagSmoothing(0)` and manual
ticks: the stop moved to **79.98%** and the pane advanced on completion. Real pointer click
on `Логистика` at (474, 377): pane `logistics`, `aria-selected` moved, `--p` 0% on all three
— a clean ink pill — and +3.5s later still no advance. Strip 389px wide. `node --check`
clean, snap restored.

**Left undone.** Still only `Продвижение` has a screen; the client owes nodes for the other
two. `--tab-fade`, `--tab-gap`, `--tab-drop` and `--tab-elapsed` are my numbers. The active
pill keeps the idle stroke underneath — ink on ink, invisible, left in place rather than
zeroed. No screenshot: the browser pane does not repaint.

## 2026-09-02 — the closer heading takes xxl too

**What changed.** `index.html`: `section__title--xxl` on "Продавай по своим правилам".
`assets/css/base.css`: the xxl rule is no longer scoped to the cases section, its measure
became `calc(var(--fs-xxl) * 10)`, and the closer heading is allowed to span
`grid-column: 1 / 3`. `CONTEXT.md` updated.

**Why.** Client's call. The span and the measure follow from it: at 56–64px a single text
column (380px) is far too narrow, and a fixed 560px measure put the closer heading on three
lines at 1920.

**How it was verified.** Live DOM. Measure resolves to 560px at 1440 and 640px at 1920. Both
xxl headings set in two lines at both widths — "Продавай по своим / правилам" and "С нами
работают / самые смелые". No overlap between the closer's heading and its subtitle (heading
ends at 636, subtitle starts at 984 on 1440), the screen still fits, no horizontal overflow.

## 2026-09-02 — square white cards, xxl in use, the frame stops becoming a button

**What changed.** `assets/css/base.css`: `.case` is square (`aspect-ratio: 1 / 1`), white with
its own black ink; the three pure-white logos get `filter: invert(1)`; the cases heading takes
`--fs-xxl`. `index.html`: `data-invert` on those three logos, `--xxl` class on the heading,
and the frame's `<a class="stage-frame__cta">` removed — the frame is decorative again.
`assets/js/main.js`: the whole `morph()` block and its trigger are gone; the frame now only
has its exit, and `settleFrame()` shrank to match. `CONTEXT.md` rewritten on all three points.

**Why.** Client: cards square and white, "С нами работают самые смелые" in the new xxl size,
and the closer's button detached from the frame while he redraws that screen.

**A knock-on worth knowing.** The partner logos are white on transparent and there is no dark
version of the source artwork — I checked the raw bitmaps behind the Figma nodes, they are
white too. On a white card the three pure-white ones are inverted in CSS. M.Reason is left
alone: it is dark lettering on its own white plate. Real dark exports would beat the filter.

**How it was verified.** Live DOM, no failed resources.
- Frame: 283 and visible on the hero and marketplaces, −617 and off screen on the cases
  **and on the closer**, back to 283 after scrolling to the top. No `.stage-frame__cta` in
  the document, and the closer's middle row is empty.
- Cards: 295×295 at 1440 and 390×390 at 1920, `rgb(255, 255, 255)` with black text, the
  grid fitting the screen at both. `filter` on the flagged logos computes to `invert(1)`.
- Heading: 56/56 at 1440 and 64 at 1920, two lines at both.
- No horizontal overflow; the closer still fits its screen.

**Mine, not the client's.** The heading's 560px measure — it is what makes the xxl title set
in two lines rather than four.

## 2026-09-02 — tabbed panes in the capabilities frame

**What changed.** `index.html`: the capabilities slide now holds three `.frame-pane`s and a
`.frame-tabs` strip of three buttons (`Продвижение`, `Заказы`, `Логистика` — capitalised,
per the sentence-case rule); it lost `aria-hidden`, because it takes clicks.
`assets/css/base.css`: `.frame-pane` (absolute, `cover`, cross-faded on `--tab-fade`),
`.frame-tabs` (below the frame at `top: 100%`, `pointer-events: auto` inside the frame's
`none`), `.frame-tab` (a two-stop gradient clipped to the text with `background-clip: text`,
swept by `--p`), four new tokens, and `.frame-pane` added to the squircle group. The
capabilities image moved off the slide onto the first pane. `assets/js/main.js`: a tabs
controller — one GSAP tween per dwell that both moves `--p` and advances the pane on
completion; click switches to manual for the page's life; `stage()` gained the gate that
makes the strip live only while its slide is fully on stage; `currentSection()` extracted
out of `settleSlides()`.

**Why.** Client's spec: tabs under the frame on section 2, green fill, 5s auto-advance,
click drops to manual until reload.

**The gate moved off `section:change`.** It was the obvious hook and it was wrong: a
discrete toggle can be missed on a jump, and it is processed in GSAP's tick loop. `--t` is
written on every path instead, and `stage()` is its single writer, so the gate is right for
a crossing, a jump, a deep link and a refresh alike.

**How it was verified.** `localhost:4321` at 1440×900, snap off, `ScrollTrigger.update()`
after each move on a clean load:

| scrollY | slide `--t` | strip inert |
|---|---|---|
| 0 (load) | 0 | true |
| 450 | 0.5 | true |
| 899 | 0.9989 | **false** |
| 900 | 1 | false |
| 450 (back up) | 0.5 | **true** |
| 0 | 0 | true |

Timer, driven by real elapsed time with `gsap.ticker.lagSmoothing(0)` and manual ticks
(the pane's rAF is frozen while the browser pane is hidden): panes cycle
`promotion → orders → logistics → promotion`, with the fill mid-sweep at 59.98% two and a
half seconds into a dwell. Real pointer click on `Продвижение` at (346, 371): `--p` 100% on
it, 0% on the others, pane switched, `aria-selected` moved, focus on the button — so the
click really does get through the frame's `pointer-events: none`. Then +3s and +6s: no
advance; left the section and returned: still manual, not restarted. Computed style on a
tab: `background-clip: text`, `color: rgba(0, 0, 0, 0)`, gradient
`rgb(166, 237, 0)` → `color(srgb 0.685 0.691 0.7)`. Strip measures 295px wide, 32px below
the frame. `node --check` clean, snap restored.

**Left undone.** Two of the three panes have no image — the client owes the Figma nodes for
`Заказы` and `Логистика`; until then the frame's own tint shows through on those two.
`--tab-fade`, `--tab-gap`, `--tab-drop`, the idle grey (25% ink) and the `md` type are my
placeholders. One reading is still open: on click the chosen tab stays fully green, but
"заливка зеленым выключается" could mean it should drop to ink instead. Keyboard support is
whatever native buttons give — no arrow-key roving tabindex. `onLeave` / `onLeaveBack` pin
the crossing ends through GSAP's toggle path, which this preview cannot exercise; the ends
were confirmed through `onUpdate` at 0.0011 and 0.9989 instead.

## 2026-09-02 — partner logos, cases back to smoke, an xxl token

**What changed.** `assets/logos/` — four partner logos vendored from Figma node `32:29061`
(KINASH, Домодедово, 12 месяцев, M.Reason), exported at 3× and converted to webp, 1.5–4.8 KB
each. `index.html`: the cases section carries them, its ground goes back to
`data-theme="smoke"` / `data-ink="dark"`, and each card gets its own placeholder sentence
instead of one repeated four times. `assets/css/base.css`: logo styling, cards keep their own
white ink, and a new `--fs-xxl` / `--lh-xxl`. `CONTEXT.md` updated.

**Why.** Client's corrections: the black section in his screenshot was a layout reference,
not a colour decision; he asked me to write placeholder card copy; and he wants an xxl size
declared.

**A consequence worth stating.** The logos ship white on transparent, so they need a dark
ground. With the section back to smoky white, the cards stay `--c-graphite` and carry their
own ink — dark cards on a light section. If the cards should be light instead, the logos have
to be re-exported in a dark version.

**How it was verified.** Live DOM at 1440×900. Grounds across the page read green → smoke →
smoke → black → smoke → **smoke** → black, so the cases section is light again. Card ground
computes to `rgb(26, 24, 23)` with white text. All four logos load and keep their own
proportions at 40px tall — 63, 102, 64 and 119 wide against naturals of 190, 306, 192 and 357
at 120. No failed resources, the grid fits the screen, no horizontal overflow. `--fs-xxl`
resolves to `clamp(56px, calc(32px + 1.6667vw), 64px)`.

**Open.** `xxl` is declared and unused — it needs a home. The card sentences are mine and
should be replaced with real cases. The section's old subtitle still has nowhere to sit.

## 2026-09-02 — cases grid, and the frame learns to leave

**What changed.** `index.html`: section 6 rebuilt as `.section--cases` — black ground,
title "С нами работают самые смелые" and a `Все кейсы` button top left, four cards along the
bottom; it carries `data-frame="none"`. `assets/css/base.css`: the cases layout, cards on
`--c-graphite` at `--radius-btn` with a squircle, empty logo slots.
`assets/js/main.js`: the frame's exit, a `settleFrame()` pass, and cards joined the reveal
stagger. `CONTEXT.md` updated.

**The frame's exit is the substantial part.** On the boundary into the cases section the
frame's `top` is scrubbed by exactly one viewport, so it rises at the same rate as the
section it belonged to and reads as part of that screen leaving rather than as a thing that
faded. It is parked a viewport above until the closer's morph brings it back down as the
green button — the two ranges are adjacent and share that parked position, so nothing jumps
between them.

**A trap that bit again.** Both of the frame's moves are scrubbed, so a jump that clears a
whole range fires nothing: scrolling from the closer to the hero in one step left the frame
parked above the screen permanently. `settleFrame()` now recomputes it from the two
triggers' own progress on load, on refresh and on every section change — the same shape as
`settleSlides()` and the reveal catch-up.

**How it was verified.** Live DOM at 1440×900 unless noted. Frame across the passage, with
snapping off: 283 at marketplaces → 58 → −167 → −392 → **−617 at the cases, off screen** →
back down −369 → −121 → 127 → **375 at the closer**, shrinking 456 → 392 → 328 → 264 → 200.
At rest and after arbitrary jumps (hero → customization → cases → closer → hero → cases →
capabilities) the frame is right every time: 283 with the full width on the frame sections,
−617 and off screen on the cases, 375 at 200px wide on the closer. Cases layout: head at
y=116, four cards 299×256 bottom-aligned with 76px to the screen edge, the whole screen
fitting 900; at 1920 the cards are 390×334 and it still fits. Card ground computes to
`rgb(26, 24, 23)`. Title, button and cards all settle at opacity 1. No horizontal overflow.

**Waiting on the client.** The card logos — the slots are empty rectangles. The card copy is
one sentence repeated four times, from his screenshot. And the section's old subtitle now has
nowhere to sit.

## 2026-09-02 — md type scales too

**What changed.** `assets/css/base.css`: `--fs-md` is now
`clamp(16px, calc(10px + 0.4167vw), 18px)` and `--lh-md` is `calc(var(--fs-md) * 4 / 3)`.
`CONTEXT.md` §7: both clamps now in one table.

**Why.** Client wants the small text to follow the screen the way the titles do — 18 at
1920 as before, 16 at 1440.

**How it was verified.** Measured in the browser at both widths: 1440 → 16.0005 / 21.334,
1920 → 18 / 24, `xl` unchanged at 36 / 36 and 44 / 44. Hero screenshot at both.

**What is left undone.** The leading tightens with the size (21.33 at 1440) rather than holding 24
flat — my choice, not specified; ask if he wants it flat.

## 2026-09-02 — no more white sections

**What changed.** `index.html`: `data-theme="white"` → `"smoke"` on capabilities and
audience. `CONTEXT.md`: section table, palette table and the colour-rhythm note.

**Why.** Client wants no pure-white grounds.

**How it was verified.** Walked the seven snap positions: the page now reads green → smoke →
smoke → black → smoke → smoke → black, `rgb(233, 235, 238)` on all four light sections, ink
flipping to white on the two black ones. No `data-theme="white"` left in the markup.

**Worth noting.** Pure white is now only an ink colour, and four of the seven sections share
one ground — the colour sequence is flatter than it was. Said out loud in case the board
demo wanted more variety there; the client asked for it explicitly.

## 2026-09-02 — marketplaces subtitle rewritten

**What changed.** `index.html`: the marketplaces subtitle is now "Даём аналитику
по заказам, остаткам, логистике и помогаем выбрать лучшие карточки товаров", with
non-breaking spaces after `по` and `и`. `CONTEXT.md`: copy table updated, and the note about
a period inside that subtitle dropped — the new text has none.

**Why.** Client's rewrite.

**How it was verified.** Rendered text at 1440×900: two U+00A0, no trailing period, three
lines — "Даём аналитику по заказам, остаткам, / логистике и помогаем выбрать лучшие /
карточки товаров". 36px clear of the frame, no horizontal overflow.

**One liberty taken.** The client wrote it starting lowercase; it is capitalised here, like
every other subtitle on the page. Say the word and it goes back.

## 2026-09-02 — balanced titles, two more copy tweaks

**What changed.** `index.html`: a non-breaking space between `своим` and `бизнесом`, and the
customization title became "Стиль магазина уникальный, как ты сам".
`assets/css/base.css`: `text-wrap: balance` on `.section__title`. `CONTEXT.md` updated.

**Why.** Client's copy edits, and his suggestion that balancing the lines may be simpler than
placing every break by hand.

**How it was verified.** Line breaks read off the rendered text at 1440, 1512 and 1920 —
identical at all three:

```
Управляй                 Стиль магазина
своим бизнесом           уникальный,
на маркетплейсах         как ты сам
```

`text-wrap` computes to `balance`. No collision with the frame at any width, no horizontal
overflow, no mid-word break in any of the seven titles.

**Worth the client's eye.** The new non-breaking space is what puts `Управляй` alone on the
first line: with `своим бизнесом` welded together, balance has nowhere else to put the break.
Dropping that one nbsp gives "Управляй своим / бизнесом / на маркетплейсах" instead.

## 2026-09-02 — capabilities screen swapped for the 4:3 cut

**What changed.** `assets/images/capabilities.webp` replaced: Figma node `206:58220`
instead of `204:51472` — the same dashboard laid out at 1118×838.5 rather than 1118×789.
Exported @2x to 2236×1677, `cwebp -lossless`, 206 KB (lossless again beat `-q 90`: 210,674
against 212,852). The comment above the slide fills in `base.css` and the §7 table in
`CONTEXT.md` updated; §10 records that `206:58220` supersedes `204:51472`.

**Why.** The client supplied a source already in the frame's ratio, which removes the crop
question raised in the entry below.

**How it was verified.** `localhost:4321` at 1440×900, snap off, y=900 with
`ScrollTrigger.update()`. Decoded 2236×1677, image ratio **1.3333**; frame 456×342, ratio
**1.3333** — identical, so `cover` crops nothing. Slide `--t` 1, opacity 1. Snap restored.

**Left undone.** The hero photograph is still 1.42:1 and `cover` still takes 33px off each
side there; if a 4:3 cut of it exists, it would remove that too — not asked for. Still no
screenshot of the real page: the pane does not repaint.

## 2026-09-02 — the capabilities frame gets the dashboard screen

**What changed.** New `assets/images/capabilities.webp` — Figma node `204:51472` ("main",
the dashboard screen), exported @2x to 2236×1578 and encoded `cwebp -lossless -metadata
none`, 205 KB. `base.css`: a rule fills the capabilities slide with it, and the comment above
the slide fills now covers both nodes. `index.html`: that slide is marked
`data-filled="true"` so the frame's dashed placeholder outline stays off. `CONTEXT.md` §7:
frame-content table gains the row, plus the encoding rule and the crop note.

**Why.** Second piece of real frame content, asked for as an image — §7 already says the
product screens stay images rather than being rebuilt in code.

**Lossless, not lossy.** For this screen `-lossless` is 209,940 bytes against 212,312 for
`-q 90` — smaller *and* exact, and lossy encoding softens 14px type. The hero photograph
stays `-q 82`; it has no type in it.

**How it was verified.** `localhost:4321` at 1440×900, snap off, scroll stepped by hand with
`ScrollTrigger.update()`. At y=900 (capabilities at rest): slide `--t` 1, `opacity` 1,
`background-image` resolved to the webp, `background-size cover`, `data-filled true`. At
y=450, mid-crossing: hero `--t` 0.5 and capabilities `--t` 0.5 — the two pictures cross-fade
in lock-step. Decoded in the page: 2236×1578.

**Left undone.** The 4:3 crop is more damaging here than on a photograph — it clips the
user avatar on the right and eats the logo's left margin. Reproduced the crop offline with
`sips` and sent it; `contain` is the alternative (~12px of frame tint top and bottom, whole
screen visible) and it is the client's call, so `cover` stands for now. Five slides still
empty. No screenshot of the real page — the pane still does not repaint.

## 2026-09-02 — copy edits, hyphenation off, and a repair of main

**What changed by me.** `index.html`: two titles rewritten — "Уникальное, как твой бизнес" →
"Стиль уникальный, как ты сам", "Управляй продажами на маркетплейсах" → "Управляй своим
бизнесом на маркетплейсах", both with their non-breaking spaces. `assets/css/base.css`:
`hyphens: auto` removed from `.section__title`. `CONTEXT.md` updated on both.

**Why hyphenation had to go.** With the new copy it broke `бизнесом` across two lines —
"Управляй своим бизн- / есом / на маркетплейсах" — because `hyphens: auto` hyphenates to
even out the rag even when the word fits whole on the next line. Without it the title sets
as the client wanted: "Управляй своим / бизнесом / на маркетплейсах", three clean lines at
1440, 1512 and 1920. `overflow-wrap: break-word` stays; it only fires for a word too long
for its column, and no current title is.

**What else is in this commit, and why.** The parallel session's work: the scrubbed slide
transition in `assets/js/main.js`, the hero image (`assets/images/hero.webp` and
`data-filled` in `index.html`), and their `CONTEXT.md` / `WORKLOG.md` entries. It is here
because I had already broken `main` by staging shared files wholesale: commit `4cb5bf9` swept
their half-finished CSS — `opacity: var(--t, 0)` on the slides and a `background-image`
pointing at `assets/images/hero.webp` — while the JS that sets `--t` and the image file
itself stayed uncommitted. `main` therefore had slides that could never become visible and a
stylesheet referencing a missing file. Committing the working tree, which is verified
working, is what makes the branch coherent again.

**How it was verified.** Live DOM at 1440×900 unless noted. Line breaks read straight off the
rendered text: `marketplaces` → "Управляй своим" / "бизнесом" / "на маркетплейсах" at 1440,
1512 and 1920; `customization` → "Стиль уникальный," / "как ты сам"; no mid-word break in any
of the seven titles. Frame collision sweep clean at all three widths, no horizontal overflow.
Slides track their sections — opacity 1 on exactly the active one at each of the seven snap
positions, ground colour correct at each. Hero slide shows `hero.webp` at opacity 1 and the
file returns 200; no failed resources on the page.

**Process.** Two parallel sessions have now collided three times in these files. Staging
whole files is not safe here: either serialise the sessions, or stage hunk by hunk.

## 2026-09-02 — slides scrubbed by the same scroll as the colours

**What changed.** `assets/js/main.js`: the per-boundary trigger is now the single place that
owns a section change. Its body became `apply(t)` — paints the three colours, sets the
photographic ground's opacity, writes `--t` on the outgoing and incoming slides (`1 - t`
and `t`), and dispatches a new `section:scrub` event with `{ from, to, t }`.
`onLeave` / `onLeaveBack` pin the two ends; new `settleSlides()` sets slides from geometry at
rest, called on load and on every `refresh`. `assets/css/base.css`: `.stage-frame__slide`
lost `transition: opacity var(--fade)` and the `[data-active="true"]` opacity rule — opacity
is `var(--t, 0)`; `--fade` is now declared and unused. `CONTEXT.md` §5: new "The section
boundary — one scrubbed pass".

**Why.** The client noticed the photograph outlasting the ground colour. Real, not an
impression: the ground was scroll-linked, the slide swap fired at the middle of the header
and then ran 0.9s of wall clock. He also asked that the fix generalise — later sections will
fly elements out of the frame and those have to land with everything else — so the boundary
is one scrubbed pass with a CSS hook (`--t` per slide, children unclipped) and a JS hook.

**How it was verified.** `localhost:4321` at 1440×900. Snap off, stepped the scroll by hand
across hero → capabilities, `ScrollTrigger.update()` at each stop, read live values:

| scrollY | `--ground` | hero `--t` | hero opacity |
|---|---|---|---|
| 0 | `rgb(166, 237, 0)` | 1 | 1 |
| 225 | `rgb(188, 242, 64)` | 0.75 | 0.75 |
| 450 | `rgb(211, 246, 128)` | 0.5 | 0.5 |
| 675 | `rgb(233, 251, 191)` | 0.25 | 0.25 |
| 900 | `rgb(255, 255, 255)` | 0 | 0 |

Lock-step — green→white at 25% is 166 + 89 × 0.25 = 188. `section:scrub` fired 13 times
across the moves; sample `{ from: hero, to: capabilities, t: 0.333 }` at y=300 (300/900).
Jumped y=0 → 2700 in one step, clearing two whole boundaries: `customization` alone at 1,
every other slide 0; back to 0, hero 1 and the rest 0. Snap restored, `node --check` clean.

**Left undone.** The frame's dashed placeholder outline is still keyed to `data-active`, so
crossing away from the hero it can reappear as a hairline over the fading photograph.
Fixable inside the same pass; not done, because the outline is also what the closer's morph
overrides and it was not the ask. Reduced motion unchanged — a scroll-linked scrub is the
same class as the colour interpolation, which was already kept. The
`@media (prefers-reduced-motion)` rule zeroing `.stage-frame__slide`'s transition is dead
now; left alone, it sits in the frame block another session is editing.

**Note on the repo.** A parallel session's commits rewrote `CONTEXT.md` and dropped two
sections I had added earlier today — "the three live colours" (`--ink-invert`) and the
sentence-case link rule. Restored both in this pass. The code was untouched.

## 2026-09-02 — +12px on the side margins, 48px navbar controls

**What changed.** `assets/css/base.css` only. `--page-pad`
`clamp(64px, 4.4vw, 84px)` → `clamp(76px, calc(4.4vw + 12px), 96px)`; `--page-max`
1728 → 1704; `--logo-size` and `--btn-h-nav` 52 → 48. `CONTEXT.md` updated.

**Why.** Client: side margins wider by 12px, navbar controls 48 tall.

**The `--page-max` part is the non-obvious bit.** At 1920 the side margin is set by the
container cap, not by the padding — raising `--page-pad` alone left 1920 at the old 96px.
Taking 24 off `--page-max` is what delivers the +12 there. The frame stays 760 at that width,
so nothing else moved.

**How it was verified.** Live DOM, collision sweep over the six frame-bearing sections at
each width.

| viewport | side margin | frame | collisions |
|---|---|---|---|
| 1440×900 | 76 (was 64) | 456 | none |
| 1512×830 | 79 (was 67) | 519 | none |
| 1920×1080 | 108 (was 96) | 760 | none |

Navbar: logo box 48×48, CTA 48 high, header 84 tall (16 + 48 + 20). No horizontal overflow
at any width; the closer still fits its screen at 1512 and 1920, with the button centred on
the screen centre.

## 2026-09-02 — 36px titles on a laptop, wider section margins, tighter navbar

**What changed.** `assets/css/base.css` only. `--fs-xl` is now
`clamp(36px, calc(12px + 1.6667vw), 44px)` — 36/36 at 1440, still 44/44 at 1920.
`--page-pad` went `clamp(32px, 3.3vw, 64px)` → `clamp(64px, 4.4vw, 84px)`.
`--header-pad-side` 20px → 16px. `CONTEXT.md` updated.

**Why.** Client: smaller titles on a MacBook, more air at the section edges, less at the
navbar's.

**How it was verified.** Live DOM, collision sweep over the six frame-bearing sections at
each width.

| viewport | xl | frame | section margin | collisions |
|---|---|---|---|---|
| 1440×900 | 36 / 36 | 480 | 64 | none |
| 1512×830 | 37.2 | 543 | 67 | none |
| 1920×1080 | 44 / 44 | 760 | 96 | none |

At 1920 the margin is 96 rather than the 84 the padding asks for, because the 1728px
`--page-max` binds first. Navbar: logo 16px from the left edge, CTA 16px from the right. No
horizontal overflow anywhere. The closer still fits at 1440 — head at y=120, button 200×150
centred at 450 against a screen centre of 450, footer bottom at 836 of 900.

**Numbers that were mine, not the client's.** He asked for "bigger side margins" without a
figure; `clamp(64px, 4.4vw, 84px)` is my reading of it, and the frame narrowing from 513 to
480 is its consequence.

## 2026-09-02 — xl scales with the screen, frame settles at 513 on a laptop

**What changed.** `assets/css/base.css` only: `--fs-xl` became
`clamp(40px, calc(28px + 0.8333vw), 44px)` with `--lh-xl: var(--fs-xl)`, so titles set 40/40
at 1440 and 44/44 at 1920; `--col-min` went 360 → 380. `CONTEXT.md` updated.

**Why.** Client wanted the frame's growth to be more moderate still, and the xl size a
little smaller on a MacBook while 1920 keeps the full 44.

**How it was verified.** Live DOM at three widths, collision sweep over the six
frame-bearing sections each time.

| viewport | xl | frame | collisions |
|---|---|---|---|
| 1440×900 | 40 / 40 | 513 | none |
| 1512×830 | 40.6 | 577 | none |
| 1920×1080 | 44 / 44 | 760 | none |

No horizontal overflow at any of them. The marketplaces title is back to three lines: at a
380px column and 40px type, its longest word measures exactly 380 with `hyphens: none`, so
nothing is being hyphenated on a laptop any more — the rule stays as a safety net. The
closer still lands correctly at 1440: head at y=120, button 200×150 centred at 450 against a
screen centre of 450, footer bottom at 852.

## 2026-09-02 — closer spacing, and reveals that survive a jump

**What changed.** `assets/css/base.css`: `.section--closer` gets
`padding-top: calc(var(--header-h) + 32px)`. `assets/js/main.js`: the morph into the call to
action now also interpolates the frame's `top`, from the content's optical centre to the
screen's centre; and the reveal catch-up became a function that runs on load, on every
ScrollTrigger refresh, and on each `section:change`.

**Why.** Client: the closer's title needed more air under the navbar, and the button read as
sitting below the middle of the screen. It did — the frame is aligned to the content's
optical centre, which the 88px header pushes 20px below the screen's centre.

**A bug found while measuring.** A scroll long enough to clear a whole section in one step
left that section's title and subtitle at `opacity: 0` forever: ScrollTrigger does not fire
`onEnter` for a trigger jumped over in a single update, and the reveals fire `once`.
Reproduced by jumping 0 → 5400 → 900, which left `#capabilities` hidden with
`transform: translateY(24px)`. The load-time catch-up added earlier only covered the first
paint; it now also runs on refresh and on every section change.

**How it was verified.** Live DOM. 1440×900: head at y=120 (was 88), frame 200×150 with its
centre at 450 against a screen centre of 450, footer bottom at 852 inside the 900. Same at
1512×830 (centre 415/415) and 1920×1080 (540/540), head at 120 and the frame at exactly
200×150 in all three. After the 0 → 5400 → 900 jump, no title or subtitle is left below
opacity 1, and on a normal section the frame's centre and the title's centre agree at 470.

**Note for the client.** With the button on the screen's centre the air is not symmetrical —
123px above it and 175px below at 1440 — because the head is shorter than the footer.

## 2026-09-02 — the hero frame gets its photograph

**What changed.** New `assets/images/hero.webp` — Figma node `196:53708`, exported at @2x
(2236×1578) and converted with `cwebp -q 82 -metadata none`, 101 KB. `base.css`:
`.stage-frame__slide` gains `center / cover / no-repeat`, a rule fills the hero slide with
the image, `.stage-frame__slide` joins the `corner-shape: squircle` group (`border-radius:
inherit` carries the radius but not the shape, so the slide would have clipped as a plain
rounded rect inside a squircle frame), and a `:has()` rule drops the frame's dashed
placeholder outline while a `data-filled` slide is active. `index.html`: the hero slide is
marked `data-filled="true"`. `CONTEXT.md`: new §7 "Frame content" table, and node
`196:53708` added to §10.

**Why.** First real content in the frame. The dashed outline is a marker for an empty
frame; over a photograph it reads as a defect.

**How it was verified.** `localhost:4321` at 1440×900. Network: `assets/images/hero.webp`
→ 200. Live DOM on the hero slide: `data-active true`, `background-image` resolved to the
webp, `background-size cover`, `border-radius 32px`, `corner-shape squircle`, and opacity
`1` once its transition is taken out of the way. Frame `outline-color rgba(0,0,0,0)` — the
placeholder outline is gone. Decoded the file in the page: 2236×1578. Console has no new
errors; the 404s still listed there are stale requests from loads before `assets/images/`
existed.

**Left undone.** No screenshot of the real page — the pane does not repaint. Instead I
reproduced the crop offline with `sips` (centre crop to 4:3) and sent that PNG, so the
framing is confirmed, but the rounding, the squircle and the cross-fade are confirmed by
computed style only. Six raw source images sit behind that Figma node; I took the node
export, which is the cropped composition as designed, not the raw plates. The other six
slides are still empty.

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
