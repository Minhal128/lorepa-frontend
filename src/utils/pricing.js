// Mirrors lorepa-backend/utils/pricing.js. The server recomputes the quote at
// checkout, so any drift here shows the renter a total they will not be charged.
export const SERVICE_FEE_RATE = 0.05;

const round2 = (n) => Math.round(n * 100) / 100;
const money = (v) => {
  const n = parseFloat(v);
  return Number.isFinite(n) && n > 0 ? round2(n) : 0;
};

// Accessories are flat one-time fees: they join the service-fee base but are
// never multiplied by the number of rental days.
export const quote = (rentalPrice, accessories = []) => {
  const price = money(rentalPrice);
  const list = Array.isArray(accessories) ? accessories : [];
  const accessories_total = round2(list.reduce((sum, a) => sum + money(a?.price), 0));
  const subtotal = round2(price + accessories_total);
  const service_fee = round2(subtotal * SERVICE_FEE_RATE);
  return { price, accessories_total, subtotal, service_fee, total_with_fee: round2(subtotal + service_fee) };
};

export const activeAccessories = (trailer) =>
  (trailer?.accessories || []).filter((a) => a?.isActive !== false && money(a?.price) >= 0);
