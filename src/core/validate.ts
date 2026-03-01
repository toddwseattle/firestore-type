export function assertObject(value: unknown, message = 'Expected object'): asserts value is Record<string, unknown> {
  if (!value || typeof value !== 'object') {
    throw new Error(message);
  }
}

export function assertNumber(value: unknown, message = 'Expected number'): asserts value is number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new Error(message);
  }
}

export function createValidator<T>(
  validator: (value: unknown) => void,
): (value: unknown) => asserts value is T {
  return (value: unknown): asserts value is T => {
    validator(value);
  };
}
