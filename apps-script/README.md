# Seemani lightweight catalogue API

This optional Google Apps Script starter lets you keep a small product catalogue and incoming gift requests in a Google Sheet while the public site remains hosted on GitHub Pages.

## Google Sheet setup

Create a spreadsheet with two tabs.

### Products

Put these headers in row 1:

`id | title | category | description | priceLabel | badge | emoji | theme | url | status`

Add products from `gifts/products.json` as rows. Use `hidden` in the status column to hide a product from the API.

### Orders

Put these headers in row 1:

`createdAt | orderId | giftId | senderName | recipientName | senderEmail | message | status`

Limit spreadsheet access to trusted administrators. Only collect details you genuinely need.

## Deploy the script

1. Open the spreadsheet and choose **Extensions → Apps Script**.
2. Replace the editor contents with `Code.gs` from this folder.
3. In Apps Script **Project Settings → Script properties**, add `SPREADSHEET_ID` with the spreadsheet ID from its URL.
4. Run a small test from the editor if you add a test function, and authorize the requested Sheets access.
5. Choose **Deploy → New deployment → Web app**.
6. Set **Execute as** to your account. Choose access deliberately: a public web app is callable by anyone, so the endpoint must not be treated as private.
7. Copy the deployed `/exec` URL and test `?action=products`.

## Important limitations

- The GitHub Pages storefront currently reads the static `gifts/products.json` file. It does **not** submit customer information to this script by default.
- `Code.gs` is a starter API for catalogue reads and gift requests, not a payment processor or production order system.
- Do not trust a browser-supplied price. Verify prices and payment status on the server before fulfilling paid orders.
- Before public use, add rate limiting/spam protection, retention/deletion procedures, consent wording, and stronger input validation. Apps Script's simple web-app deployment does not provide a full production API security layer.
- Never put secret keys or private credentials in the GitHub repository or browser JavaScript.
- To connect the catalogue to the website, update `gifts/store.js` to fetch the deployed endpoint and map the returned `products` array. Keep the static JSON fallback so the storefront remains available if the API is unavailable.
