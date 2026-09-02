# Worklog

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
