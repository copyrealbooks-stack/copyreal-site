# Preview deployment handover

No production deployment or merge is authorised by this branch.

## Cloudflare Pages preview requirements

Create or select a preview deployment for this branch only. Required bindings:

- D1 binding: `STORE_DB`
- R2 binding: `STORE_ASSETS` pointing to a private bucket

Required preview variables/secrets:

- `STORE_ENABLED=true`
- `STORE_MODE=test`
- `STORE_PUBLIC_ORIGIN=https://<exact-preview-host>`
- `STORE_PRODUCTS_JSON=<private JSON mapping>`
- `STRIPE_SECRET_KEY=<Stripe test secret>`
- `STRIPE_WEBHOOK_SECRET=<Stripe test webhook signing secret>`

For live mode the code additionally requires `STORE_LIVE_APPROVED=true` and a live Stripe key. Do not set this until a separate live-readiness review.

## D1

Apply `store/migrations/0001_store.sql` to an isolated preview database. Do not run it against an unrelated production database.

## R2

Keep the bucket private. Upload or confirm the deliverable object for every enabled SKU. Bundle SKUs need their own prepared delivery archive (eBook+PN or eBook+CFX). Do not create a PN+CFX archive for this store model.

For the Frankenstein pilot, private mappings are required for up to five SKUs. Authoritative source references for the Frankenstein PN and CFX materials exist in the private Copy Real records, but those Drive folder IDs/links are deliberately not copied into GitHub.

## Stripe

In Stripe test/sandbox mode create a webhook endpoint:
`https://<exact-preview-host>/api/store/webhook`

Subscribe to:
- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`

Copy the webhook signing secret directly into the Cloudflare secret field.

## Smoke test after authentication is available

1. Open `/store/` on the branch preview.
2. Confirm only privately enabled Frankenstein SKUs show **Buy now**.
3. Run a Stripe test checkout.
4. Confirm webhook marks the D1 order paid.
5. Confirm success page returns a short-lived `/api/store/download?token=...` URL.
6. Confirm the R2 object downloads without revealing an R2 URL/key.
7. Confirm a fourth download is rejected.
8. Revisit the Stripe success URL and verify the download cap does not reset.
9. Confirm restricted titles cannot be enabled without an approved country allow-list.
