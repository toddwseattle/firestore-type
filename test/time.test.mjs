import test from 'node:test';
import assert from 'node:assert/strict';

import { dateFromTimestamp, timestampFromDate } from '../dist/time/index.js';

test('dateFromTimestamp converts from toDate duck type', () => {
  const now = new Date('2025-01-01T00:00:00.000Z');
  assert.equal(dateFromTimestamp({ toDate: () => now }).toISOString(), now.toISOString());
});

test('dateFromTimestamp converts from seconds/nanoseconds shape', () => {
  const date = dateFromTimestamp({ seconds: 1_700_000_000, nanoseconds: 500_000_000 });
  assert.equal(date.toISOString(), '2023-11-14T22:13:20.500Z');
});

test('timestampFromDate uses provided factory', () => {
  const date = new Date('2025-01-01T00:00:00.000Z');
  const output = timestampFromDate(date, (d) => ({ iso: d.toISOString() }));
  assert.deepEqual(output, { iso: '2025-01-01T00:00:00.000Z' });
});
