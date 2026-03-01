# Firestore-type User Guide (Current Implemented Slice)

This guide explains how to use the currently implemented core/time features with a **basic User object**.

> **Important:** This guide includes marked sections for features that are not implemented yet.

## 1) Concepts: Domain vs Persisted

- **Domain object**: what your application uses.
- **Persisted object**: what gets stored in Firestore-like storage and must include `schemaVersion`.

Example shapes:

```ts
// Domain shape used in app code
export interface User {
  id: string;
  name: string;
  createdAt: Date;
}

// Persisted latest shape stored in database
export interface PersistedUserV2 {
  schemaVersion: 2;
  id: string;
  fullName: string;
  createdAt: { seconds: number; nanoseconds: number };
}
```

## 2) Define a model

Use `defineModel` with conversion logic, current schema version, and migrations.

```ts
import { defineModel, readDomain } from 'firestore-type/core';
import { dateFromTimestamp } from 'firestore-type/time';

const userModel = defineModel({
  currentVersion: 2,

  toPersisted: (user: { id: string; name: string; createdAt: Date }) => ({
    schemaVersion: 2 as const,
    id: user.id,
    fullName: user.name,
    createdAt: {
      seconds: Math.floor(user.createdAt.getTime() / 1000),
      nanoseconds: (user.createdAt.getTime() % 1000) * 1_000_000,
    },
  }),

  fromPersisted: (doc) => ({
    id: doc.id,
    name: doc.fullName,
    createdAt: dateFromTimestamp(doc.createdAt),
  }),

  migrations: {
    // v0: { schemaVersion: 0, id, name, createdAt }
    0: (doc: any) => ({
      schemaVersion: 1,
      id: doc.id,
      fullName: doc.name,
      createdAt: doc.createdAt,
    }),

    // v1: already renamed field, normalize version marker only
    1: (doc: any) => ({
      schemaVersion: 2,
      id: doc.id,
      fullName: doc.fullName,
      createdAt: doc.createdAt,
    }),
  },

  // optional runtime validation hook
  validatePersisted: (raw) => {
    if (!raw || typeof raw !== 'object') {
      throw new Error('Expected persisted user object');
    }
  },
});

// read + validate + migrate + map to domain
const domainUser = readDomain(
  {
    schemaVersion: 0,
    id: 'u1',
    name: 'Ada Lovelace',
    createdAt: { seconds: 1700000000, nanoseconds: 0 },
  },
  userModel,
);
```

## 3) Migration-on-read behavior

When `readDomain(raw, model)` runs:
1. Optional `validatePersisted(raw)` executes.
2. `schemaVersion` is validated.
3. Migrations are applied from old version → latest version.
4. `fromPersisted` maps latest persisted shape into domain shape.

If any migration step is missing, the read throws.

## 4) Timestamp utilities

`dateFromTimestamp` supports:
- native `Date`
- duck-typed `toDate()` object
- `{ seconds, nanoseconds }`
- `{ _seconds, _nanoseconds }`

`timestampFromDate` delegates creation to your provided factory:

```ts
import { timestampFromDate } from 'firestore-type/time';

const firebaseLikeTimestamp = timestampFromDate(new Date(), (date) => ({
  seconds: Math.floor(date.getTime() / 1000),
  nanoseconds: (date.getTime() % 1000) * 1_000_000,
}));
```

## 5) What is not implemented yet (placeholders)

### 🚧 Firebase adapter functionality
`firestore-type/adapters/firebase-client` and `firestore-type/adapters/firebase-admin` are currently placeholder entrypoints.

**Not yet implemented:**
- concrete helpers for Firestore reads/writes
- timestamp factory adapters bound to firebase SDK Timestamp constructors
- converter wrappers for collection/doc APIs

### 🚧 Advanced migration typing
Current migration map uses flexible typing (`Record<number, Migration<any, any>>`).

**Not yet implemented:**
- strongly typed per-version migration chain inference utilities

### 🚧 Extended docs and recipes
**Not yet implemented:**
- end-to-end examples with real firebase SDK integration
- complete API reference docs

## 6) Suggested next step for consumers today

Use the core and time modules directly in your app service/repository layer, and build a small local adapter in your codebase that:
- fetches raw persisted objects,
- calls `readDomain(raw, model)`,
- uses `toPersisted(domain)` on writes.

This gives immediate value while adapter packages are still placeholder-only.
