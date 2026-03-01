# Firestore-type TODO

## Current status (implemented)

### Design and architecture
- ✅ Design authority document created with:
  - domain vs persisted separation
  - required `schemaVersion` for persisted documents
  - migration-on-read flow
  - runtime validation hook concept
  - timestamp normalization design via duck-typed timestamp
  - optional firebase adapter subpath strategy.

### Core slice (`src/core`)
- ✅ `PersistedBase`, `Migration`, and `ModelSpec` type contracts are implemented.
- ✅ `defineModel(spec)` helper is implemented.
- ✅ Migration/read helpers are implemented:
  - `assertSchemaVersion`
  - `migratePersisted`
  - `readDomain`
- ✅ Validation helpers are implemented:
  - `assertObject`
  - `assertNumber`
  - `createValidator`

### Time slice (`src/time`)
- ✅ Duck-typed `TimestampLike` and `TimestampFactory` are implemented.
- ✅ Conversion helpers are implemented:
  - `dateFromTimestamp`
  - `timestampFromDate`

### Packaging and exports
- ✅ Core/time subpath exports are configured.
- ✅ Optional adapter entrypoints are present:
  - `adapters/firebase-client`
  - `adapters/firebase-admin`

### Tests and build
- ✅ Unit tests exist for:
  - migration dispatch success
  - invalid `schemaVersion` error path
  - timestamp conversion helper behavior
- ✅ TypeScript build configuration and `pnpm build`/`pnpm test` scripts are present.

---

## Remaining work (not implemented yet)

### Adapter functionality
- ⏳ Implement real firebase client adapter utilities (currently placeholders/types only).
- ⏳ Implement real firebase-admin adapter utilities (currently placeholders/types only).
- ⏳ Decide/define adapter peer dependency policy and examples.

### Validation ergonomics
- ⏳ Add higher-level validator composition helpers for common persisted patterns.
- ⏳ Add examples for integrating external runtime validators (e.g. zod/valibot/yup) without hard dependency.

### Migration ergonomics and safety
- ⏳ Improve migration typing so individual migration steps can be typed per version without `any` in the migration map.
- ⏳ Add helper for detecting non-advancing migrations (defensive check that a step increments schema version).
- ⏳ Add helper for generating migration plans/reporting at read time.

### Timestamp utility coverage
- ⏳ Add tests for `_seconds/_nanoseconds` input shape.
- ⏳ Add tests for invalid duck-typed timestamp shapes.
- ⏳ Decide behavior for nanosecond rounding policy and document precisely.

### Documentation and developer experience
- ⏳ Expand README with quickstart and link to user guide.
- ⏳ Add API reference docs for each exported symbol.
- ⏳ Add recipe docs for “domain only fields” and “persisted metadata fields”.

### Project quality
- ⏳ Add linting/formatting setup.
- ⏳ Add CI workflow for build + tests.
- ⏳ Add release/versioning workflow.

---

## Explicit placeholders in current implementation
- 🚧 `src/adapters/firebase-client/index.ts` is a placeholder type, not a concrete adapter implementation.
- 🚧 `src/adapters/firebase-admin/index.ts` is a placeholder type, not a concrete adapter implementation.
