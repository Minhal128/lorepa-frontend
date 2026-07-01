# Meta Pixel Integration

## Overview

Lorepa uses the Meta Pixel to track key user actions in the trailer rental funnel. This data feeds into Meta Ads Manager for conversion tracking, ad optimization, and audience building.

**Package:** `react-facebook-pixel`  
**Configuration:** `VITE_META_PIXEL_ID` environment variable  
**Utility file:** `src/utils/metaPixel.js`

---

## Setup

### 1. Create the Pixel

1. Go to [Meta Events Manager](https://business.facebook.com/events_manager)
2. Click **Connect Data Sources → Web**
3. Choose **Meta Pixel** and click **Connect**
4. Name it `Lorepa` and click **Create Pixel**
5. Copy the **Pixel ID** (a 15–16 digit number)

> The Pixel ID is different from the Facebook App ID (`597658509280252`) in the developer invite email.

### 2. Add the Pixel ID to the environment file

Open `lorepa-frontend/.env` and set:

```env
VITE_META_PIXEL_ID=1234567890123456
```

Replace `1234567890123456` with your actual Pixel ID.

### 3. Redeploy

The pixel is inactive until the environment variable is set. After updating `.env`, redeploy the frontend for the change to take effect.

---

## Tracked Events

| Event | Meta Standard Name | Where It Fires | Parameters |
|---|---|---|---|
| Page view | `PageView` | Every route change | — |
| Location search | `Search` | After trailers load with a city filter | `search_string` |
| Trailer detail view | `ViewContent` | After single trailer data loads | `content_ids`, `content_type`, `value`, `currency` |
| Booking dates confirmed | `InitiateCheckout` | When user confirms dates in booking modal | `content_ids`, `content_type`, `value`, `currency` |
| Payment confirmed | `Purchase` | When Stripe payment is verified as paid | `content_ids`, `content_type`, `value`, `currency` |

All monetary values are in **CAD**.

---

## File Reference

### `src/utils/metaPixel.js`

Central utility. All tracking calls go through here. Every function silently no-ops if `VITE_META_PIXEL_ID` is not set or is still the placeholder value, so the app works normally before the pixel is configured.

```js
initPixel()                          // Call once on app boot
trackPageView()                      // Call on every route change
trackSearch(searchString)            // string — the location query
trackViewContent({ contentId, value, contentType, currency })
trackInitiateCheckout({ contentId, value, currency })
trackPurchase({ contentId, value, currency })
```

### `src/App.jsx`

- Calls `initPixel()` once in a `useEffect` on mount.
- Contains the `RouteChangeTracker` component (renders nothing) that calls `trackPageView()` on every `location.pathname` change using `useLocation`.

### `src/pages/TrailersLisitng.jsx`

Calls `trackSearch(cityFilter)` inside `fetchTrailers()` after results are set — only when a city/location filter is active.

### `src/pages/SingleTrailer.jsx`

Calls `trackViewContent` immediately after the trailer API response is received, using the trailer's `_id` and `dailyRate`.

### `src/components/BookingModel.jsx`

Calls `trackInitiateCheckout` inside `handleDateNext()` just before advancing to step 2 (the message step), using the trailer `_id` and the computed `totalWithFee`.

### `src/pages/PaymentSuccess.jsx`

Calls `trackPurchase` inside the `verifyPayment` callback when `verifyRes.data.paid` is `true`, using the `trailerId` and `price` URL parameters.

---

## Verifying the Integration

### Meta Pixel Helper (browser extension)

1. Install the [Meta Pixel Helper](https://chromewebstore.google.com/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc) Chrome extension.
2. Navigate through the funnel:
   - Home → Trailers (with city) → Single trailer → Book → Pay
3. The extension shows each event as it fires, with its parameters.

### Meta Events Manager — Test Events

1. Open [Meta Events Manager](https://business.facebook.com/events_manager)
2. Select your pixel → **Test Events** tab
3. Enter your site URL and click **Open Website**
4. Events appear in the panel in real time as you navigate.

### Expected event sequence for a full booking

```
PageView          → landing on any page
Search            → /trailers?city=Montreal
PageView          → /trailers
ViewContent       → /trailers/:id
InitiateCheckout  → booking modal: dates confirmed
Purchase          → /payment-success
```

---

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| No events firing | `VITE_META_PIXEL_ID` not set or still placeholder | Set the correct Pixel ID in `.env` and redeploy |
| `PageView` fires but no other events | Component-level imports missing or wrong path | Check browser console for import errors |
| `Purchase` not firing | Stripe verify endpoint returning `paid: false` | Confirm the booking reaches `paid` status before redirect |
| Duplicate `PageView` on first load | `initPixel` + `RouteChangeTracker` both fire on mount | Expected — one fires on init, one on route mount; Meta deduplicates |

---

## Adding New Events

To track an additional standard Meta event:

1. Add a new export to `src/utils/metaPixel.js`:

```js
export const trackAddToWishlist = ({ contentId, value = 0, currency = 'CAD' }) => {
  if (!PIXEL_ID || PIXEL_ID === 'YOUR_PIXEL_ID_HERE') return
  ReactPixel.track('AddToWishlist', {
    content_ids: [String(contentId)],
    content_type: 'trailer',
    value,
    currency,
  })
}
```

2. Import and call it from the relevant component.

Full list of Meta standard events: [Meta Business Help — Standard Events](https://www.facebook.com/business/help/402791146561655)
