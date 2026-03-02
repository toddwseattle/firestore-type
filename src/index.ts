/**
 * firestore-type
 *
 * Shared Firestore type definitions and utilities usable in both
 * browser (Firebase Web SDK) and Node.js (Firebase Admin SDK) environments.
 */
export * as core from './core/index.js';
export * as time from './time/index.js';
export type { DocumentData, TypedDocumentSnapshot, TypedQuerySnapshot } from './types.js';
export { getDocumentData } from './types.js';
