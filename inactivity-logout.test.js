import assert from 'node:assert/strict';
import { INACTIVITY_LIMIT_MS, startInactivityLogout } from './src/helpers/inactivityLogout.js';

const listeners = new Map();
const target = {
  addEventListener: (event, listener) => listeners.set(event, listener),
  removeEventListener: (event) => listeners.delete(event),
};

const realSetTimeout = globalThis.setTimeout;
const realClearTimeout = globalThis.clearTimeout;
const timers = new Map();
let nextTimerId = 0;
let timedOut = false;

globalThis.setTimeout = (callback, delay) => {
  const id = ++nextTimerId;
  timers.set(id, { callback, delay });
  return id;
};
globalThis.clearTimeout = (id) => timers.delete(id);

try {
  const stop = startInactivityLogout(() => { timedOut = true; }, target);
  assert.equal([...timers.values()][0].delay, INACTIVITY_LIMIT_MS);

  const firstTimerId = [...timers.keys()][0];
  listeners.get('pointerdown')();
  assert.equal(timers.has(firstTimerId), false);
  assert.equal(timers.size, 1);

  [...timers.values()][0].callback();
  assert.equal(timedOut, true);

  stop();
  assert.equal(timers.size, 0);
  assert.equal(listeners.size, 0);
} finally {
  globalThis.setTimeout = realSetTimeout;
  globalThis.clearTimeout = realClearTimeout;
}

console.log('inactivity logout check passed');
