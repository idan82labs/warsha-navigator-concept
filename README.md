# Warsha · Weitzen — Immigration Navigator (homepage concept)

A no-build, app-like homepage concept for the new firm site. **Double-click
`index.html`** to open it — no server, no install. Fully isolated from the
intake system (nothing here touches that codebase).

> Live: https://idan82labs.github.io/warsha-navigator-concept/ (auto-redeploys
> from `main`).

## What it is
An interactive **decision-tree / "Immigration Navigator"** homepage:
- The visitor either **types their situation** ("I'm an Israeli citizen and
  my partner is from Argentina") or **taps one of 6 needs** (label-only glass
  chips — no boxes-with-text).
- The screen **morphs in place** (app-like, no reload) — a glass result panel
  **crystallizes in** with the matched track, estimated timeline, key
  documents, an animated **case-fit ring**, and one CTA to talk to a lawyer.
- RTL Hebrew first, EN toggle (top-left).

## Art direction — "The Compass" (liquid-glass / high-tech)
The firm's circular gold W·W monogram becomes a **living navigational
instrument** at the hero's heart (immigration = navigation). The free-text
navigator is primary; the 6 needs are **headings around the compass**; the
needle reacts as you hover/type, then the screen morphs into the glass result.
Apple-visionOS register, on-brand champagne **gold** over near-black.
- **The instrument:** the real monogram is the hub; concentric rings + degree
  ticks are drawn around it (inline SVG). It's alive at rest — rings rotate, a
  radar wedge sweeps, the hub breathes — and the needle *seeks*: it points to a
  heading on hover and tracks the matcher live as you type. An intro "seal"
  draws the rings on load. All of it freezes under `prefers-reduced-motion`,
  and every heading is a real keyboard-reachable `<button>`.
- **Depth field:** a Stripe-style **WebGL mesh gradient** (vendored
  `assets/vendor/gradient.js`, MIT) — restrained gold + a cool counter-tone so
  it reads as *precious metal, not sepia* — over a faint gold cartographic grid
  + SVG grain. A CSS aurora is the reduced-motion / offline fallback.
- **Material:** real frosted glass — warm specular top rim-light, a faint gold
  inner edge, and a swept sheen (`.glass::before`) — the visionOS "lit rim".
- **Logo as a system:** monogram in the header, the hub of the compass, the
  breadcrumb glyph in the result, and the full lockup in the footer.
- **Cut for redundancy:** the kicker pill, the "smart navigator" label, the
  lede paragraph, and the "or choose your need" divider — the compass headings
  replace the chip row.
- **Type (this is what makes it un-generic):** **Secular One** (Hebrew display,
  hero + final headline) × **Noto Sans Hebrew** (UI/body) × **Cormorant
  Garamond** italic (Latin accents — "Immigration Law", client names). No
  default Heebo/Frank-Ruhl.
- **Composition:** start-anchored / asymmetric (copy on the reading edge, gold
  breathing in the negative space) — not the centered-everything template.
- **Motion:** expo-out reveals, a 560ms View-Transitions morph, the case-fit
  ring fills via an animated `@property --p`, a slow gold text-shimmer on the
  hero keyphrase. Fully honors `prefers-reduced-motion`.

## The 6 tracks
International relationship · Relocation · Visa refusal · Work visa ·
Elderly parents · Political asylum.

## Files
- `index.html` — structure + all CSS (inlined).
- `app.js` — state machine (hash-routed, back-button works), i18n (he/en),
  the 6-track content, and the free-text matcher.
- `assets/brand/` — the firm's real gold monogram (cropped from the logo).
- `assets/vendor/gradient.js` — vendored WebGL gradient (MIT).
- `assets/*.png` — reference screenshots (mobile + desktop, hero + result).

## Real firm data wired in
Dun's #1, founded 2002 (23 yrs), 18 attorneys; clients Netflix / Google /
ZEISS / James Richardson / Maccabi Tel Aviv; **calls → main office
03-561-5845**, WhatsApp → 053-491-1336; office@warsha-adv.com; Ribel 18, TLV.

## Known placeholders / to confirm with the firm
1. **Content is orientation copy**, not legal advice. Timelines + the case-fit
   labels are deliberately qualitative (the ring fills but shows **no number** —
   Israeli Bar rules, no guarantee) with a visible disclaimer. Review the
   Hebrew before publishing.
2. **The free-text Navigator** uses a deterministic offline keyword matcher.
   Upgrade path: swap `matchQuery()` in `app.js` for the firm's OpenAI key
   (Responses API, gpt-5.4-mini) returning `{track, country, confidence}` —
   keep the keyword matcher as the offline fallback. See the comment in `app.js`.
3. **Proof points / client logos** are from public sources — confirm exact
   figures and which client names/logos may be displayed.
4. **Fonts + the gradient** load from Google Fonts / a vendored local file. The
   gradient is already vendored (offline-safe); for fonts, self-host the woff2
   subsets for production to render identically offline and faster.

## How it behaves
- **Back button + deep links** work: each result is a URL
  (`#/route?need=relationship&from=Argentina`) — shareable, bookmarkable.
- **Accessible**: real buttons, focus moves to the new panel on each step,
  `aria-live` announces the matched track, reduced-motion fully supported.
- **Mobile**: sticky thumb-zone Call (primary) + WhatsApp bar.

## Hosting
Static — publish this folder as-is. GitHub Pages (current), or any static host
(Render static site / Vercel). Build command: none; output dir: this folder.
