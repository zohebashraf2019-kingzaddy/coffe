# Karajillo & Co. — website redesign concept

Café by day, cantina by night. A no-build static site (HTML, CSS, vanilla JS)
for Karajillo & Co., 50 N Sierra St, downtown Reno.

> Unofficial redesign concept. Not affiliated with or approved by Karajillo & Co.
> Get the owners' sign-off before using their name, photos or menu publicly.

## What's in it
- **Day / night theme** that follows Reno time (cantina after 5pm), or the toggle. Switching the menu tab switches the whole site, with a circular reveal (View Transitions API).
- **Crema canvas**: generative particle flow field in the hero. Move the cursor (or drag on mobile) to stir it. Pauses off-screen; static frame with reduced motion.
- **Live open/closed status** in America/Los_Angeles.
- **Menu** rendered from data, plus a **drink finder** that only suggests real items.
- **Gallery grid** with filters, lightbox (arrow keys, swipe, Esc).
- **Social cards** for Instagram, Yelp and Google Maps with tilt + spotlight.
- **Visit** section with tap-to-call, directions and map. Mobile quick bar.
- SEO: meta tags + `CafeOrCoffeeShop` structured data.

## Project structure
```
index.html
css/style.css
js/data.js       <- edit copy, menu, links, gallery here
js/crema.js      <- hero animation
js/main.js       <- everything interactive
data/site.json   <- same data as JSON (for a CMS or a future Next.js version)
images/          <- photos
PROMPT.md        <- the brief/prompt + all scraped business data
vercel.json
```

## Add gallery photos
1. Put the file in `images/` (WebP or JPG, about 1600px on the long side).
2. Add a line to `window.GALLERY` in `js/data.js`:
   ```js
   { src: "images/my-photo.webp", alt: "Describe the photo", shape: "tall", tag: "drinks" },
   ```
   `shape`: `tall`, `wide`, `square` or `big`. `tag`: `drinks`, `bar` or `room`.
   If the grid shows a gap, change one photo's shape (tall and wide each take two cells).

Tip: the current photos are about 510px tall. Swap in full-resolution originals for a sharper result.

## Run locally
Any static server works:
```bash
npx serve .
# or
python3 -m http.server 8080
```

## Push to GitHub
```bash
git init
git add .
git commit -m "Karajillo & Co. redesign concept"
git branch -M main
git remote add origin https://github.com/YOUR-USER/karajillo-redesign.git
git push -u origin main
```

## Deploy on Vercel
1. vercel.com > Add New > Project > import the GitHub repo.
2. Framework preset: **Other**. Build command: none. Output directory: `./`.
3. Deploy. Every push to `main` redeploys.

Or from the CLI: `npm i -g vercel && vercel --prod`.

## Notes
- No prices are on the current site, so none are shown. Add `price: "$6"` to an item in `data.js`.
- No review text or star rating is shown; the Yelp card links out. Quote real reviews only with permission.
- The "team behind Toro Bravo, La Condesa and Mexcal" line comes from Edible Reno-Tahoe. Confirm with the owners.
