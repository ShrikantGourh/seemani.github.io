# Seemani digital gift storefront

This is a static GitHub Pages storefront at `/gifts/`. It does not replace the existing homepage or `/digitalgift/` page.

## Add or edit a product

Edit `products.json`. Each product can include:

- `id`: stable unique identifier
- `title`, `description`: public product copy
- `category`: `birthday`, `love`, `memories`, or `family`
- `priceLabel`: display label only, not a trusted price
- `badge`, `emoji`, `theme`: presentation
- `url`: existing gift page or contact link
- `status`: `available`, `preview`, or `coming-soon`

The catalogue is public because GitHub Pages is static hosting. Do not store customer records, passwords, private information, or API secrets in this file.

## Preview

Open `/gifts/` after the change is merged and the GitHub Pages deployment completes. The existing site and gift page are unchanged by these files.
