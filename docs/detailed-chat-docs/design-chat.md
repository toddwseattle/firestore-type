# Firestore Object Toolkit — Design

## Purpose

This library provides a structured, TypeScript-first approach to managing
Firestore-backed objects with long-term schema stability.

It addresses common Firestore problems:

- No enforced schema
- Silent schema drift
- Timestamp incompatibilities across environments
- Unsafe evolution of persisted data

The toolkit enables:

- Explicit schema versioning
- Migration-on-read
- Clear separation between domain logic and persistence
- Reuse across React, Angular, and Node/Firebase Functions

---

## Core Design Principle

Every Firestore-backed model has **three representations**:

1. **Domain**
   - Rich, in-memory object
   - Methods, computed fields allowed
   - Uses portable types (`Date`, `string`, `number`)
   - No Firebase imports

2. **Persisted**
   - Firestore-safe shape
   - Flat, serializable
   - Includes `schemaVersion`
   - No methods

3. **Migrated (Latest Persisted)**
   - Result of applying migrations
   - Always the shape domain logic consumes

Firestore never sees domain objects.
Domain logic never sees old schemas.

---

## Read & Write Flow

### Read (migration-on-read)

1. Read raw Firestore document
2. Validate persisted shape (optional but recommended)
3. Migrate to latest schema
4. Hydrate domain object

### Write

1. Update domain object
2. Convert domain → persisted latest
3. Convert `Date` → Firestore Timestamp (adapter)
4. Write to Firestore

---

## Timestamp Strategy

- **Canonical internal type:** `Date`
- Firestore `Timestamp` is used _only_ at the adapter boundary
- Core library uses duck-typed timestamp interfaces

This avoids:

- Admin vs client SDK incompatibilities
- JSON serialization issues
- Test friction

---

## Schema Versioning

- Every persisted object **must** include `schemaVersion`
- Versions are monotonically increasing integers
- Breaking changes require a new version
- Old data is never mutated in place

---

## Non-Goals (v1)

- No code generation
- No Firestore emulator dependency
- No opinionated state management
- No UI abstractions

This is a low-level infrastructure library.

---

## Why This Exists

Firestore is schemaless.
This library makes schema explicit, versioned, and maintainable — in code.
