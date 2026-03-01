/**
 * Optional adapter entrypoint for firebase-admin SDK integration.
 * Kept dependency-free so consumers can provide firebase peer deps externally.
 */
export type FirebaseAdminAdapter = {
  kind: 'firebase-admin';
};
