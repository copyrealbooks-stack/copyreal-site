# Stripe + Cloudflare development integration — NOT live

## Code completed on feature/direct-audio-store

Cloudflare Pages Functions at `/api/store/*` implement test-only Stripe Checkout session creation, webhook HMAC verification, server-side paid-order reconciliation, a 24-hour delivery token, and a private R2 object stream with an atomic three-attempt cap backed by D1. The checkout does **not** accept a price or storage key from the browser. No API credentials are in GitHub. Site includes `/store/success/` to verify payment before displaying the download button.

## Required Cloudflare setup for a non-production preview

1. Deploy this branch as a **preview only** and obtain its exact HTTPS URL. Do not merge to production or attach the live custom domain.
2. Create a dedicated D1 database, e.g. `copy-real-store-dev`. Apply `store/migrations/0001_store.sql` using the D1 Console SQL editor or Wrangler migrations against **development** only. Bind it to the Pages preview under `STORE_DB`.
3. Add an R2 binding `STORE_ASSETS` to the existing *private* R2 bucket that contains the 47 title prefixes. The pilot test file must actually exist at the configured key. For a synthetic test, use a harmless dummy file at `store-test/test-ebook.txt`, not an actual paid eBook or audiobook. Keep the bucket private.
4. Set preview-only environment secrets: `STRIPE_SECRET_KEY` = Stripe sandbox secret (`sk_test_...`); `STRIPE_WEBHOOK_SECRET` = signing secret for the Stripe **sandbox** webhook endpoint. Configure `STORE_PRODUCTS_JSON` as a secret or protected server environment variable with SKU mappings, private object keys and prices (see `products.example.json`). Do **not** paste these into a chat, frontend file or GitHub.
5. Set preview-only vars `STORE_MODE=test`, `STORE_ENABLED=true`, and if known `STORE_PUBLIC_ORIGIN=https://<exact-preview-host>`. Do not set these production vars. Production deployment must have `STORE_ENABLED=false` until an independent live readiness review and explicitly enabled live-mode code release.
6. In **Stripe Sandbox**, create a webhook for `https://<exact-preview-host>/api/store/webhook`. Subscribe to `checkout.session.completed` and `checkout.session.async_payment_succeeded`. Copy its signing secret **directly into the Cloudflare secret field**.
7. Ensure Stripe payment method supports sandbox card test flow, and verify the preview's allowed country mapping (`territories` list). `amount` is Stripe's smallest unit: `10000` = THB 100. The user-created Stripe dashboard product is not automatically wired into code; this pilot uses `price_data` for a single authorized SKU.
8. Open `/store/dev-checkout/` on preview. Check that the pilot only appears if its private config has `enabled=true`, a valid R2 key, and the test store flags are enabled. Then run a sandbox test card through Stripe, verify the webhook/order records, retrieve a private file using the success page, and check expired-token and download-cap behavior.

## Before live sales

- Select final prices and currency; confirm fiscal/tax, refunds, customer support details and product-rights / territory policy by edition.
- Replace preview secrets with verified live credentials **only in a reviewed production implementation**. Current code intentionally refuses live Stripe keys.
- Confirm card/wallet payment availability for this Thailand-based account from its actual Stripe Dashboard. Payment method availability varies.
- Verify test delivery using a dummy object before wiring any finished books. Create SKU-private R2 mappings, confirm original eBook/PN/CFX deliverables, cover images and approved remastered samples. Product folder existence alone does not mean files exist.
- Set order retention/privacy policy and email receipt/delivery experience. Stripe may send its own receipt if enabled; this application does not currently send one. Consider tax collection if required.
- Test failure/retry, asynchronous webhook, dispute/refund revocation, currency/territory controls, download interruptions, preview vs production variables, and real merchant account capability before launch.

**Important:** The live Copy Real website stays unchanged. The Stripe dashboard 'Ready to go' and account 'Active' screenshots did not prove that a live transaction has completed; do not claim the merchant integration is operational until tested.

## Preview configuration checkpoint — 2026-09-28

The Copy Real development sandbox and its Stripe webhook have been created. Cloudflare Pages preview settings were populated with encrypted `STRIPE_WEBHOOK_SECRET` and `STRIPE_SECRET_KEY`, `STORE_MODE=test`, `STORE_PRODUCTS_JSON` for the single synthetic `CR-TEST-EBOOK`, and `STORE_ENABLED=true`. The isolated `copy-real-store-dev` D1 and private `copyrealdownloads` R2 bindings are preview only; a harmless `store-test/test-ebook.txt` object was uploaded by the user. Never enable live checkout by this configuration. Rebuild the feature-branch preview after changes to environment variables and confirm `/api/store/catalogue` before attempting a sandbox test purchase.
