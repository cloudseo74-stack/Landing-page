# Ganpati Travel Solutions

One conversion-focused landing page, built with Next.js App Router, TypeScript, Tailwind CSS, Motion and Lucide. No database, server enquiry storage or extra business pages.

## Run

```sh
npm install
npm run dev
```

Open http://localhost:3000. Production: `npm run build` then `npm start`.

## Edit

- `src/config/business.ts`: contact details and WhatsApp URL helper.
- `src/data/content.ts`: services, vehicles, destinations and FAQs.
- `src/components/LandingPage.tsx`: sections and booking interactions.
- `src/app/globals.css`: responsive design and Tailwind theme.

Images live in `public/images`. The supplied logo is used as-is. Hero, airport and waterfall images are AI-generated illustrations, not verified photographs of the fleet or named places. Other service image slots reuse these visuals; the three fleet cards use user-supplied images optimized as fleet-sedan.webp, fleet-suv.webp and fleet-group-travel.webp. Replace each named WebP with approved photography before publishing if available. All slots are local, use Next/Image and have fixed layout dimensions. `scripts/prepare-assets.mjs` prepares placeholders and should not be rerun over replacement photographs.

## Booking

The form validates required fields, an Indian mobile number (with optional +91/91 prefix), and a current or future local date. It opens WhatsApp with a URL-encoded enquiry, ready for the visitor to send. A visible fallback link appears after submission if popups are blocked. It does not send or confirm a booking automatically. Call buttons use `tel:` links. All navigation stays on this single page.

## Before publishing

Replace illustrative images as needed. Set `NEXT_PUBLIC_SITE_URL` to the real production origin before building to enable absolute Open Graph image metadata. The optional itinerary was omitted because no verified itinerary was provided. Confirm all business details with the owner before launch.

## Verification

`npm run build` checks production compilation and TypeScript. With Chrome installed, `node scripts/verify.mjs` checks the rendered page at 320, 375, 768, 1024 and 1440 pixels; links, images, menu, FAQs, destination selection, mobile/date validation, encoded enquiry contents, popup fallback and reduced motion. Screenshots are saved to ignored `test-results/`. The test intercepts `window.open`; it does not send a WhatsApp message.
