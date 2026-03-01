import type { ModelSpec, PersistedBase } from './types.js';

export function assertSchemaVersion(value: unknown): asserts value is PersistedBase {
  if (!value || typeof value !== 'object') {
    throw new Error('Persisted value must be an object with schemaVersion');
  }

  const schemaVersion = (value as Partial<PersistedBase>).schemaVersion;
  if (!Number.isInteger(schemaVersion) || (schemaVersion ?? -1) < 0) {
    throw new Error('Invalid schemaVersion');
  }
}

export function migratePersisted<PersistedLatest extends PersistedBase>(
  persisted: PersistedBase,
  spec: Pick<ModelSpec<unknown, PersistedLatest>, 'currentVersion' | 'migrations'>,
): PersistedLatest {
  if (persisted.schemaVersion > spec.currentVersion) {
    throw new Error(
      `Persisted schemaVersion ${persisted.schemaVersion} is newer than supported ${spec.currentVersion}`,
    );
  }

  let current: PersistedBase = persisted;

  while (current.schemaVersion < spec.currentVersion) {
    const migration = spec.migrations?.[current.schemaVersion];
    if (!migration) {
      throw new Error(`Missing migration for schemaVersion ${current.schemaVersion}`);
    }
    current = migration(current);
    assertSchemaVersion(current);
  }

  return current as PersistedLatest;
}

export function readDomain<Domain, PersistedLatest extends PersistedBase>(
  raw: unknown,
  spec: ModelSpec<Domain, PersistedLatest>,
): Domain {
  if (spec.validatePersisted) {
    spec.validatePersisted(raw);
  }

  assertSchemaVersion(raw);
  const latest = migratePersisted(raw, spec);
  return spec.fromPersisted(latest as PersistedLatest);
}
