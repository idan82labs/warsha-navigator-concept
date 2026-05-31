# Warsha · Weitzen — Immigration Navigator (homepage concept)

A no-build, app-like homepage concept for the new firm site. **Double-click
`index.html`** to open it — no server, no install. Fully isolated from the
intake system (nothing here touches that codebase).

## What it is
An interactive **decision-tree / "Immigration Navigator"** homepage:
- The visitor either **types their situation** ("I'm an Israeli citizen and
  my partner is from Argentina") or **picks one of 6 needs**.
- The screen **morphs in place** (app-like, no page reload) into a tailored
  result: matched track, estimated timeline, key documents, a **case-fit
  verdict**, and a single CTA to talk to a lawyer.
- Four sections only: interactive **HERO** → **need selection** → clean
  **social proof** → **call CTA**. RTL Hebrew first, EN toggle (top-left).

## The 6 tracks
International relationship · Relocation · Visa refusal · Work visa ·
Elderly parents · Political asylum.

## Design system (dark-luxury)
- Near-black ink `#0A0B0D`, **one** accent — champagne gold `#C8A96A`,
  off-white text. No glow, no gradient mesh, hairline dividers.
- Type: **Frank Ruhl Libre** (serif display, HE+Latin) × **Heebo** (UI).
- Motion: reveal 480ms expo-out, morph ~560ms (View Transitions API), press
  scale .97, 70ms stagger. Respects `prefers-reduced-motion`.

## Files
- `index.html` — structure + all CSS (inlined).
- `app.js` — state machine (hash-routed, back-button works), i18n (he/en),
  the 6-track content, and the free-text matcher.
- `assets/*.png` — reference screenshots (mobile + desktop, hero + result).

## How it behaves
- **Back button + deep links** work: each result is a URL
  (`#/route?need=relationship&from=Argentina`) — shareable, bookmarkable.
- **Accessible**: real buttons, focus moves to the new panel on each step,
  `aria-live` announces the matched track, reduced-motion supported.
- **Mobile**: sticky thumb-zone Call (primary) + WhatsApp bar.

## Known placeholders / to confirm with the firm
1. **Content is orientation copy**, not legal advice. Timelines + the
   case-fit labels are deliberately shown as ranges with a visible
   disclaimer (Israeli Bar rules — no guarantees). Review the Hebrew before
   publishing.
2. **The free-text Navigator** uses a deterministic keyword matcher (offline,
   no backend). Upgrade path: swap `matchQuery()` in `app.js` for a call to
   the firm's existing OpenAI key (Responses API, gpt-5.4-mini) returning
   `{track, country, confidence}` — keep the keyword matcher as the offline
   fallback. See the comment block in `app.js`.
3. **Proof points** (Dun's #1, 23 years, 18 attorneys, Netflix/Google/ZEISS,
   053-491-1336, 18 Rival St) are pulled from public sources — confirm exact
   figures + which client logos may be displayed.
4. **Fonts** load from Google Fonts; for production self-host the woff2
   subsets so it renders identically offline and faster.

## Design review — two-lens synthesis
Critiqued under two independent rubrics and merged:
- **Taste (aesthetic/composition)** → reached 9/10 after a 3-round loop:
  broke a centered hero into a 7/5 right-anchored split, lifted contrast,
  promoted the case-fit verdict, elevated the proof strip.
- **UI/UX Pro Max (measurable usability + a11y)** → 8.3/10; caught what the
  aesthetic lens missed:
  - **Contrast fix (applied):** the dim secondary token failed WCAG (3.39:1)
    for real text incl. the legal disclaimer → raised `--faint` to ≈5.7:1
    so every readable small-text surface clears 4.5:1.
  - **Stagger cap (applied):** need-pill entrance tail was 770ms; capped to
    ≤400ms so a fast tapper never hits a still-fading pill.
  - **Touch target (applied):** language toggle enlarged toward 44px.

Two deliberate tensions arbitrated (kept the luxury, noted for sign-off):
1. **Motion timing** — the usability rubric wants ≤400ms; the 480ms reveals
   / 560ms morph are kept as the signature luxury gesture (entrance-only,
   non-blocking, `prefers-reduced-motion` fully honored). Presses are 120ms.
2. **Dim hierarchy** — kept a dim whisper tier for *decoration* only;
   everything a user must read now clears 4.5:1.

Still open for production (not blockers): self-host the woff2 fonts (kill
serif-h1 FOUT/CLS), and add a submit pending-state when the Navigator is
wired to the live OpenAI matcher.

## Hosting
Static — publish this folder as-is. Render static site (matches the firm's
existing Render footprint) or Vercel; **build command: none, output dir:
`/website`**. Or just send the folder — it opens from `file://`.
