import type { ModelSpec, PersistedBase } from './types.js';

export function defineModel<Domain, PersistedLatest extends PersistedBase>(
  spec: ModelSpec<Domain, PersistedLatest>,
): ModelSpec<Domain, PersistedLatest> {
  return spec;
}
