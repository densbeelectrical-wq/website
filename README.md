# Densbe Electrical — website revamp

Static site (plain HTML / CSS / JS), no build step. Open `index.html` or serve the folder:

```bash
python3 -m http.server 8765
```

## Files
- `index.html` — home: preloader, hero **component finder** (search + category / application / requirement / brand filters, live suggestions, "Ask Densbe to source it"), stats, featured categories, brand marquee, about, E-Store brands, popular items, contact form.
- `products.html` — full catalogue with sidebar filters, live search, chips, sort, load-more. Accepts `?q=`, `?cat=`, `?group=estore`, `?brand=`, `?app=`, `?tech=`.
- `product.html?id=` — product detail, quantity + **Enquire item**, quick quote, related items.
- `about.html`, `brands.html`, `contact.html`, `privacy.html`, `terms.html`.
- `data.js` — the catalogue (175 products, 28 categories, 34 brand logos) scraped from the live site.
- `main.js` — shared header/footer, search engine, enquiry list (saved in the browser), forms, preloader, animations.
- `style.css` — all styling. Brand colours are in `:root` at the top.

## Add your own photos
Drop files with these exact names into `assets/site/` and they appear automatically:
- `assets/site/hero-bg.jpg` — full-width background behind the hero finder (dark industrial photo works best, ~1920×1080).
- `assets/site/about-img.jpg` — image beside the "About Densbe" text on the home and about pages (4:3).

## Products
Each product in `data.js` has `id`, `name`, `model`, `cat`, `cats` (category slugs), `brand`, `img`, `desc` (HTML), `apps`, `tech`.
To replace a product photo, overwrite the file in `assets/products/` keeping the same file name. To add a product, append an object to the `products` array and add the image.

## Receiving enquiries
By default the contact form and enquiry list open the visitor's email app addressed to `sales@densbe-electric.com`.
To receive submissions (including photo uploads) directly, set `FORM_ENDPOINT` at the top of `main.js` to a form service URL (e.g. Formspree or Web3Forms) or your own API.
