export interface TimestampLike {
  toDate?: () => Date;
  seconds?: number;
  nanoseconds?: number;
  _seconds?: number;
  _nanoseconds?: number;
}

export type TimestampFactory<TTimestamp = unknown> = (date: Date) => TTimestamp;
