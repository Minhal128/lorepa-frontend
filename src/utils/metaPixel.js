import ReactPixel from 'react-facebook-pixel'

const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID

export const initPixel = () => {
  if (!PIXEL_ID || PIXEL_ID === 'YOUR_PIXEL_ID_HERE') return
  ReactPixel.init(PIXEL_ID, {}, { autoConfig: true, debug: false })
}

export const trackPageView = () => {
  if (!PIXEL_ID || PIXEL_ID === 'YOUR_PIXEL_ID_HERE') return
  ReactPixel.pageView()
}

export const trackSearch = (searchString) => {
  if (!PIXEL_ID || PIXEL_ID === 'YOUR_PIXEL_ID_HERE') return
  ReactPixel.track('Search', { search_string: searchString })
}

export const trackViewContent = ({ contentId, contentType = 'trailer', value = 0, currency = 'CAD' }) => {
  if (!PIXEL_ID || PIXEL_ID === 'YOUR_PIXEL_ID_HERE') return
  ReactPixel.track('ViewContent', {
    content_ids: [String(contentId)],
    content_type: contentType,
    value,
    currency,
  })
}

export const trackInitiateCheckout = ({ contentId, value = 0, currency = 'CAD' }) => {
  if (!PIXEL_ID || PIXEL_ID === 'YOUR_PIXEL_ID_HERE') return
  ReactPixel.track('InitiateCheckout', {
    content_ids: [String(contentId)],
    content_type: 'trailer',
    value,
    currency,
  })
}

export const trackPurchase = ({ contentId, value = 0, currency = 'CAD' }) => {
  if (!PIXEL_ID || PIXEL_ID === 'YOUR_PIXEL_ID_HERE') return
  ReactPixel.track('Purchase', {
    content_ids: [String(contentId)],
    content_type: 'trailer',
    value,
    currency,
  })
}
