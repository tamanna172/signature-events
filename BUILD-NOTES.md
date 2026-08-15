# Signature Events Co. — build notes

ICT726 Assignment 3 · Tamanna Toma (20027709)

**Read this before you submit.** The site is complete and working, but there
are five things only you can do. They're in section 6.

---

## 1. What's in the folder

```
signature-events/
├── index.html          Home
├── about.html          About Us
├── services.html       Services
├── gallery.html        Gallery (media page)
├── testimonials.html   Testimonials
├── contact.html        Contact + validated form
├── css/
│   ├── style.css       Main stylesheet (mobile-first base)
│   └── responsive.css  Media queries only
├── js/
│   └── script.js       Nav toggle, gallery filters, lightbox, form validation
├── images/             Placeholder SVG artwork (see section 6.2)
└── videos/
    └── highlight.mp4   Placeholder highlight clip (106 KB)
```

Two stylesheets exactly — the assignment caps you at two. Don't add a third.

## 2. Previewing it locally

Double-clicking `index.html` works, but a local server behaves more like the
real host. From inside the folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## 3. Requirement → where it lives

| Requirement | Where |
|---|---|
| 5+ pages | 6 pages, all with identical header/nav/footer |
| Home intro 20–50 words | `index.html` hero paragraph — **33 words** |
| Most creative page = home | Hero with layered SVG string-lights, gradient ground, staggered entrance animation |
| Media page, thumbnails enlarge on click | `gallery.html` — 12 thumbnails, each wrapped in a `<button>`, opens accessible lightbox |
| 3+ pieces of rich media | 12 gallery images + 1 video + illustrated icons/team art |
| Contact page: email, socials, validated form | `contact.html` — mailto + tel links, social list, 6-field form |
| Form error + success feedback | `js/script.js` → `.error-msg` per field, `#form-status` live region |
| No PHP / server-side | Form is client-side only; nothing is sent anywhere |
| No Bootstrap / templates | Zero frameworks, zero CDN links, zero inline `style=` attributes |
| Max 2 external stylesheets | Exactly 2 |
| Semantic HTML5 | `header`, `nav`, `main`, `section`, `article`, `figure`, `footer` throughout |
| Media queries, mobile-first | Base styles are mobile; `responsive.css` adds `min-width` breakpoints at 40rem / 56rem / 72rem |
| Alt text | Every image has descriptive alt text (verified — 38 images, 0 missing) |
| ARIA | See section 5 |
| Optimised file sizes | Whole site is ~200 KB. Artwork is SVG (vector, tiny) |

## 4. The CSS3 effects (you need at least 3 — there are 6)

Each is commented `/* CSS3: ... */` in `style.css` so you can point at it in
your report:

1. **Linear gradients** — hero ground, CTA banners, foil dividers
2. **Box shadows** — card panels, lifted tiles, lightbox
3. **Rounded corners** — cards, buttons, form fields
4. **Transitions** — button hovers, card lifts, nav toggle
5. **Transforms** — `translateY` lift on card hover, `scale` zoom on gallery thumbnails
6. **Multi-column** — the values text on `about.html` uses `column-count: 2` at desktop width

## 5. Accessibility features (worth 4 marks — know these)

- Skip-to-content link, first thing in the tab order on every page
- One `<h1>` per page, headings never skip a level (verified)
- `aria-current="page"` on the active nav item
- Mobile nav button uses `aria-expanded`, closes on `Esc`
- Gallery filter buttons use `aria-pressed`; result count announced via
  `aria-live` region (`#filter-status`)
- Lightbox: focus moves in on open, is returned to the triggering thumbnail on
  close, `Esc` closes, arrow keys move between images, background scroll locked
- Every form field has a `<label for>`, a hint, and `aria-describedby` pointing
  at its error message
- Form status uses `role="status" aria-live="polite"`
- `prefers-reduced-motion` honoured — animations disabled for users who ask
- Colour contrast: gold text uses the darker `--foil-deep` on light backgrounds
  to clear 4.5:1

Run it through WAVE (wave.webaim.org) or Lighthouse once it's hosted and
screenshot the result for your report.

---

## 6. What you still have to do

### 6.1 Rewrite the copy in your own voice

This is the big one. **3 marks** ride on showing you customised AI output, and
originality is judged across the whole thing. Right now the words are drafted,
not yours. Go through each page and rewrite the headings, the service
descriptions, the team bios, the testimonials. Change the brand colours if you
want a different feel. Keep the AI version of each page saved somewhere — you
need before/after pairs for the report.

### 6.2 Swap the placeholder artwork for real photos

Everything in `images/` is placeholder SVG artwork. It looks intentional, but
it is not photography, and your brief asks for sourced media with a licence
trail.

For each gallery image, replace the file and add a `data-full` attribute so the
lightbox loads a bigger version:

```html
<img src="images/gallery/wedding-arch.jpg"
     data-full="images/gallery/wedding-arch-large.jpg"
     alt="Write a real description of the actual photo here.">
```

The lightbox uses `data-full` if present, otherwise falls back to `src`. Update
the `alt` text and the button's `aria-label` to match what's actually in the
new photo — leaving my descriptions on a different image is worse than no alt
text.

Same for `videos/highlight.mp4` and its poster frame `images/video-poster.jpg`.

Sources that are safe: Pexels, Pixabay, Unsplash (photos); Coverr, Mixkit
(video). Keep each file under ~300 KB for photos, under 5 MB for the video.

### 6.3 Keep a licence log

Put this table in your report's ethics section:

| File | Source | URL | Photographer | Licence |
|---|---|---|---|---|
| `wedding-arch.jpg` | Pexels | | | Pexels Licence — free, no attribution required |
| | | | | |

Fill a row for every single downloaded file. The rubric asks you to confirm
media is royalty-free; this table is the confirmation.

### 6.4 Host it

**GitHub Pages** (2 marks):
1. Create a public repo, upload the folder contents (not the folder itself —
   `index.html` must be at the repo root)
2. Settings → Pages → Source: `main` branch, `/ (root)` → Save
3. Wait ~1 minute, your URL is `https://<username>.github.io/<repo>/`

**Netlify** is faster if you'd rather: drag the folder onto
`app.netlify.com/drop`. No account needed for the first deploy, but make one so
the link doesn't expire.

Open the live link on your phone before you submit. Check the nav toggle, the
lightbox, and the form all work there — not just on your laptop.

### 6.5 Fix your Week 4 report

Section 2 of your draft lists `shae_works.html` in the sitemap, but section 3.5
calls the same page `testimonials.html`. The built site uses
`testimonials.html`. Correct the sitemap line.

Also worth a proofread in section 3.4 — "Internationalization of things like
words, images and other visual features" doesn't read as intended. You probably
meant *interactivity*.

---

## 7. Placeholder content to check before submitting

All of this is invented and should either stay clearly fictional or be changed:

- Contact details: `hello@signatureevents.example`, `+61 2 5550 1234`,
  12 Foveaux St Surry Hills
- Team members: Amara Rahman, Daniel Whitmore, Priya Nair
- All six testimonials and client names
- Social links point to `#` — they're prototype links, which is fine for a
  static assignment, but mention it in your report

The footer on every page already states the site is a fictional student project
for ICT726. Leave that in — it covers the "no real personal data" requirement.
