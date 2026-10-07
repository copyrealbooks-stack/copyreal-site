# Copy Real Direct Store — integration preview

This implementation is deliberately isolated from production on branch `feature/direct-store-integration-preview-2026-10-07`.

## Current scope

- `/store/` is the shop, not a homepage clone.
- `/store/books` and `/store/books/` redirect to `/store/`.
- The catalogue contains 47 known inventory title records and 235 commercial SKU slots: eBook, PN, CFX, eBook+PN and eBook+CFX for each title.
- PN and CFX remain separate alternatives. There is no PN+CFX bundle.
- Currency is GBP.
- Frankenstein is the pilot product.
- Approved prices are code-controlled in `store/catalogue-data.js`.
- A product becomes purchasable only when a matching private Cloudflare `STORE_PRODUCTS_JSON` entry is explicitly enabled and has a valid private R2 object key.
- Restricted titles additionally require a non-empty ISO country allow-list.
- Stripe checkout never accepts price, currency or storage location from the browser.
- R2 is streamed through a protected endpoint; permanent object URLs are never returned.
- D1 stores orders and hashed delivery tokens only.
- Download tokens are short-lived and capped at three successful claims; revisiting the Stripe success URL cannot reset that cap.

## Pricing

Classic/public-domain: eBook £1.99; PN £4.99; CFX £6.99; eBook+PN £5.99; eBook+CFX £7.99.

Copy Real original/owned: eBook £3.99; PN £6.99; CFX £8.99; eBook+PN £7.99; eBook+CFX £9.99.

## Security boundary

Do not commit Stripe keys, webhook secrets, customer data, Drive folder IDs, private R2 object keys or private storage URLs. The older feature branch's public R2-prefix manifest is intentionally not brought onto this integration branch.

The repository contains only public SKU metadata and a disabled example of the private Cloudflare mapping shape.
