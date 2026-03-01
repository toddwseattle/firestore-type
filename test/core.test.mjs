import test from 'node:test';
import assert from 'node:assert/strict';

import { defineModel, migratePersisted, readDomain } from '../dist/core/index.js';

test('migration dispatch works', () => {
  const spec = defineModel({
    currentVersion: 2,
    toPersisted: (domain) => ({ schemaVersion: 2, fullName: domain.name }),
    fromPersisted: (persisted) => ({ name: persisted.fullName }),
    migrations: {
      0: (doc) => ({ schemaVersion: 1, fullName: doc.name }),
      1: (doc) => ({ schemaVersion: 2, fullName: doc.fullName }),
    },
  });

  const migrated = migratePersisted({ schemaVersion: 0, name: 'Ada' }, spec);
  assert.deepEqual(migrated, { schemaVersion: 2, fullName: 'Ada' });

  const domain = readDomain({ schemaVersion: 0, name: 'Ada' }, spec);
  assert.deepEqual(domain, { name: 'Ada' });
});

test('invalid schemaVersion throws', () => {
  const spec = defineModel({
    currentVersion: 1,
    toPersisted: (domain) => ({ schemaVersion: 1, x: domain.x }),
    fromPersisted: (persisted) => ({ x: persisted.x }),
  });

  assert.throws(() => readDomain({ schemaVersion: -1, x: 1 }, spec), /Invalid schemaVersion/);
  assert.throws(() => readDomain({ x: 1 }, spec), /Invalid schemaVersion/);
});
