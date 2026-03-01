export interface PersistedBase {
  schemaVersion: number;
}

export type Migration<From extends PersistedBase, To extends PersistedBase> = (
  persisted: From,
) => To;

export interface ModelSpec<Domain, PersistedLatest extends PersistedBase> {
  currentVersion: number;
  toPersisted: (domain: Domain) => PersistedLatest;
  fromPersisted: (persisted: PersistedLatest) => Domain;
  migrations?: Record<number, Migration<any, any>>;
  validatePersisted?: (value: unknown) => void;
}
