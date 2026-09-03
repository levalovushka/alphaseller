# Worklog

## 2026-09-02 — the layout moves onto a real page grid

**What changed.** `assets/css/base.css`: `--col-gap`, `--col-min` and the hand-rolled
`--frame-w` subtraction are gone, replaced by a page grid modelled on cash.app's —
`--grid-cols: 12`, a fixed `--grid-gutter`, `--grid-col-max: 83px`, and `--grid-content`,
`--grid-col` and `--frame-w` derived from them. `.section__inner` is now
`1fr repeat(12, ≤83px) 1fr` with the three parts on `2 / span 4`, `6 / span 4`,
`10 / span 4`. `.section` lost its horizontal padding — the edge tracks are the margin. The
cases and closer sections take `--grid-content` as their width so all seven screens share
the same edges. `--page-max` deleted. `CONTEXT.md` §5 rewritten.

**What cash.app actually does**, measured on their live page: 12 columns, a flat 20px
gutter, columns capped at 102px so the content stops at 1444, and the surplus goes to two
flexible edge tracks — margins 0 at 1280, 16 at 1512, 220 at 1920. Their sections span
`1 / -1` and their content wrapper is `grid-template-columns: subgrid`, so children place on
the page's own columns: headline `1 / span 4`, phone `5 / span 4`, text `9 / span 4`.

**How it was verified.** Freshly loaded stylesheet at each width.

| viewport | edge track | column | gutter | margin | area |
|---|---|---|---|---|---|
| 1440×900 | 24 | 60 | 52 | 76 | 395 |
| 1512×830 | — | 66 | 54 | 79 | 416 |
| 1920×1080 | 46 | 83 (capped) | 64 | 110 | 524 |

The fixed frame matches its in-flow slot exactly at every width. Titles keep their hand-set
breaks — "Твоё приложение / и интернет магазин / за один день" at 1440 and 1920,
"Управляй / своим бизнесом / на маркетплейсах" — no collisions, no horizontal overflow, no
console errors. Alignment across sections at 1440: hero, cases and closer content all start
at 76 and end at 1364.

**For the client.** The three areas are equal now, which is the point of the architecture but
also the cost: the frame used to take the leftover and was wider than a third on a big
screen. 424/380 at 1440 → 395/395; 720/428 at 1920 → 524/524. `3 / 6 / 3` is the only other
symmetric split and it starves the text columns (284 at 1440, titles need ~380), so getting
the wide-screen frame back needs asymmetric spans or a wider cap — his call.

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
