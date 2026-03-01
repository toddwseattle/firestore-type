import type { TimestampFactory, TimestampLike } from './timestampLike.js';

export function dateFromTimestamp(value: Date | TimestampLike): Date {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value.toDate === 'function') {
    return value.toDate();
  }

  const seconds = value.seconds ?? value._seconds;
  const nanoseconds = value.nanoseconds ?? value._nanoseconds ?? 0;

  if (typeof seconds !== 'number' || typeof nanoseconds !== 'number') {
    throw new Error('Invalid TimestampLike value');
  }

  return new Date(seconds * 1000 + Math.floor(nanoseconds / 1_000_000));
}

export function timestampFromDate<TTimestamp>(
  date: Date,
  factory: TimestampFactory<TTimestamp>,
): TTimestamp {
  return factory(date);
}
