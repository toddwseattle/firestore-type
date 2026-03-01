/**
 * Optional adapter entrypoint for firebase client SDK integration.
 * Kept dependency-free so consumers can provide firebase peer deps externally.
 */
export type FirebaseClientAdapter = {
  kind: 'firebase-client';
};
