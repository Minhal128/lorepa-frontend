// Run: node pricing-parity.test.js
// The renter is shown a total computed in the browser and charged a total
// computed on the server. Pins the two implementations to the same answer -
// if they ever drift, the checkout page lies about the price.
import assert from 'assert';
import { createRequire } from 'module';
import { quote as clientQuote, SERVICE_FEE_RATE as clientRate } from './src/utils/pricing.js';

const require = createRequire(import.meta.url);
const { quote: serverQuote, SERVICE_FEE_RATE: serverRate } = require('../lorepa-backend/utils/pricing.js');

assert.strictEqual(clientRate, serverRate, 'service fee rate must match');

const cases = [
  [80, [{ price: 25 }]],                                  // the brief's worked example
  [80, []],                                               // no accessories selected
  [80, [{ price: 25 }, { price: 15 }, { price: 10 }]],    // several, each charged once
  [40, [{ price: 25 }]],                                  // 1-day rental
  [400, [{ price: 25 }]],                                 // 10-day rental, same flat fee
  [33.33, [{ price: 10.01 }]],                            // rounding
  [0.1, [{ price: 0.2 }]],
  [0, []],
  [undefined, undefined],
  [-50, [{ price: -25 }]],                                // garbage cannot discount
  ['80', [{ price: '25' }]],                              // form inputs arrive as strings
];

for (const [rental, acc] of cases) {
  assert.deepStrictEqual(
    clientQuote(rental, acc),
    serverQuote(rental, acc),
    `client and server disagree on rental=${rental} accessories=${JSON.stringify(acc)}`
  );
}

// the brief's example, end to end
assert.deepStrictEqual(clientQuote(80, [{ price: 25 }]), {
  price: 80, accessories_total: 25, subtotal: 105, service_fee: 5.25, total_with_fee: 110.25,
});

console.log(`pricing-parity: client and server agree on all ${cases.length} cases`);
