# Elegant Enterprises — company website

Static marketing site for **Elegant Enterprises Pvt Ltd**, a sanitary and hygiene product manufacturer in Galle, Sri Lanka. The design uses light blues taken from the brand logo, with a concise home page and deeper detail on inner pages.

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Home — hero, product category tiles, sales CTA |
| `about.html` | Company story and overview |
| `products.html` | Product details by category (masks, tissue, baby care, sanitary) |
| `services.html` | What we can do — manufacturing, private label, B2B services |
| `factory.html` | Plant details, hours, map |
| `contact.html` | Contact form and location |

## Project structure

```
├── index.html, about.html, products.html, services.html, factory.html, contact.html
├── css/site.css          # Theme, layout, components, animations
├── js/main.js            # Mobile menu, scroll reveals, header shadow
└── assets/logo.png       # Brand logo (also used as favicon)
```

## Tech stack

- HTML5, [Tailwind CSS](https://tailwindcss.com/) (CDN), custom CSS in `css/site.css`
- [Google Fonts](https://fonts.google.com/): Cormorant Garamond (headings), Manrope (body)
- [Font Awesome 6](https://fontawesome.com/) (icons)
- No build step or backend — open any `.html` file in a browser or serve the folder locally

## Run locally

From the project root:

```bash
python3 -m http.server 8080
```

Then open [http://localhost:8080/index.html](http://localhost:8080/index.html).

Alternatively, open `index.html` directly in a browser (`file://` works; maps may behave best over HTTP).

## Brand colors (CSS variables)

Defined in `:root` in `css/site.css`:

| Variable | Hex | Use |
|----------|-----|-----|
| `--sky` | `#00a0d8` | Primary accent (from logo) |
| `--brand-deep` | `#2868a0` | Secondary blue (from logo) |
| `--brand` | `#007bb0` | Links, kickers |
| `--navy` | `#04243a` | Footer, dark sections |

After editing `site.css`, bump the `?v=` query on the stylesheet link in each HTML file so browsers pick up changes.

## Contact (on site)

- **Phone:** 074 100 8160  
- **Email:** sales@elegantenterprises.lk  
- **Factory:** 496 Akuressa Road, Galle 80000, Sri Lanka  

## Notes

- Embedded Google Maps use a search query for the factory address; for an exact pin, replace the map URL with coordinates or a Google Maps share link.
- Animations respect `prefers-reduced-motion` where implemented in CSS/JS.
