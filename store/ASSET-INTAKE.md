# Copy Real store — asset intake and launch checks

## Current inventory
- Website book catalogue: 41 existing book entries; this is not the full R2 catalogue.
- R2: Work reported 46 private title folders; the extra *What Is Happening Now? 2027* folder requires confirmation from Work before calling the total 47.
- Existing development-store SKU records: The Time Machine PN/CFX; The War of the Worlds PN/CFX; The Lion, the Witch and the Wardrobe PN/CFX. All disabled.
- The Lion, the Witch and the Wardrobe: separate PN and CFX cover/sample slots prepared. Do not substitute the older shared cover for the newly supplied artwork.

## User-supplied art staging
- Google Drive account: Copy Real Books.
- Folder: Covers, Branding & Print Masters / All Book Covers.
- Suggested names: `<title-slug>-ebook.jpg`, `<title-slug>-pn.jpg`, `<title-slug>-cfx.jpg`. Preserve originals; only rename a copy if needed.
- Match each asset to exact title AND edition before uploading to the website. Confirm portrait vs square use, resolution, legibility on mobile, and territory-specific rights where relevant.
- Do not mark a title as purchasable merely because cover art or a matching R2 prefix exists.

## Audiobook sample staging
- Use edition-specific preview MP3 files only after Copy Real approves their current remastered versions. No original distribution preview should be assumed current.
- Do not commit full audiobook masters, confidential R2 keys, customer files, payment secrets, or private storage URLs to the public repository.
- Keep sample players hidden or labelled pending until their actual source exists; never create broken player URLs.

## Remaining development work
1. Reconcile all website book entries, audio pages, and actual R2 title prefixes; log missing website entries and avoid conflating novel status with store eligibility.
2. Match all supplied covers to book and edition, including Narnia PN and CFX.
3. Add edition-specific sample players only for verified uploaded previews.
4. Deploy a **development preview** and test search, filters, covers, navigation, mobile layout, and missing-file behavior. Do not merge or publish merely to obtain a preview.
5. Select and configure payment provider, currency, prices, territory entitlements, and per-SKU private R2 object bindings in secret server-side configuration.
6. Test payment webhooks, secure short-lived download tokens, permitted-country handling, failures, receipts, and a complete pilot purchase before enabling checkout.

**Release rule:** The public live site stays unchanged, checkout disabled, and R2 private until explicit launch approval and end-to-end testing.