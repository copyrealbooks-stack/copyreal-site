# Copy Real Direct Store

## Purpose

Copy Real will sell its own digital products directly while continuing to use third-party retailers for reach. The store is product-agnostic: eBooks, Pure Narration audiobooks, CFX/Cinematic audiobooks, digital extras and bundles use the same checkout and delivery engine.

Music is NOT a Copy Real product line. Music belongs to ChasBurn.com and must not appear in Copy Real store navigation or branding.

## Customer flow

1. Customer opens a Copy Real title page.
2. Customer selects an edition: eBook, Pure Narration, CFX/Cinematic, or an available bundle.
3. Customer checks out through the configured payment provider.
4. Payment is verified server-side.
5. Copy Real issues a short-lived/download-limited delivery token.
6. Customer downloads the purchased package without seeing a permanent private-storage URL.

## Storage model

Existing title/author-specific Google Drive accounts may remain the storage layer. Public pages contain only product SKUs. Private runtime configuration maps each SKU to the corresponding delivery asset.

This deliberately separates catalogue identity from physical storage. A file can later move to another Drive or storage provider without changing the public product URL or SKU.

## Security rules

- Never commit payment secrets, Google credentials, private Drive file IDs or permanent share URLs to GitHub.
- Never treat the browser success page as proof of payment; verify payment server-side.
- Never expose permanent Drive URLs in public HTML or JavaScript.
- Download tokens must expire and can be download-limited.
- PN, CFX and eBook editions have separate SKUs.

## Brand/store scope

Copy Real store:
- Books / eBooks
- Pure Narration audiobooks
- CFX / Cinematic audiobooks
- Digital extras
- Bundles

Separate brand/site:
- Music -> ChasBurn.com

## Build phases

### Phase 1 — foundation
- Product catalogue/SKU schema
- Store UI integrated into existing Copy Real design
- Server-side checkout endpoint
- Payment verification/webhook endpoint
- Secure delivery-token endpoint
- Order/delivery record design

### Phase 2 — pilot
Use one title with PN + CFX + eBook where available. Test purchase, payment verification, token creation, download and failure/retry paths.

### Phase 3 — catalogue rollout
Add remaining titles by data/configuration rather than bespoke code.

### Phase 4 — bundles and refinements
Title bundles, multi-title bundles, promotional pricing, customer receipts and optional customer library/account features.

## Runtime inputs required before live sales

- payment provider: PayPal or Stripe
- selling currency and pricing policy
- private storage mapping for pilot files
- Cloudflare environment secrets for payment verification, token signing and storage access

Until these are configured, purchase controls remain disabled and the live Copy Real site is unchanged.
