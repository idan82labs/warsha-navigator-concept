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

## Art direction — "Aurora Glass" (liquid-glass / high-tech)
Apple-visionOS register, on-brand champagne **gold** over near-black.
- **Depth field:** a Stripe-style **WebGL mesh gradient** (vendored
  `assets/vendor/gradient.js`, MIT — reverse-engineered from Stripe.com).
  Tuned to a restrained gold + a cool blue counter-tone so the gold reads as
  *precious metal, not sepia*. A CSS aurora sits beneath as the
  reduced-motion / offline / no-WebGL fallback so the page is never flat-black.
- **Material:** real frosted glass — warm specular top rim-light, a faint gold
  inner edge, and a swept sheen (`.glass::before`) — the visionOS "lit rim".
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
