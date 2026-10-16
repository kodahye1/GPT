import { test } from 'node:test';
import assert from 'node:assert/strict';
import { installReducer, canInstall, freeGB, readSavedTargets, validIPv4 } from '../src/installation.ts';
import type { InstallState, Model, Target } from '../src/installation.ts';
const model: Model = { id: 'model', name: 'Model', publisher: 'Demo', sizeGB: 30 };
const targets: Target[] = [
  { id: 'a', ip: '192.168.1.110', totalGB: 100, usedGB: 40, installed: [], online: true },
  { id: 'b', ip: '192.168.1.105', totalGB: 100, usedGB: 90, installed: [], online: true },
];
const initial = (): InstallState => ({ targets: structuredClone(targets), jobs: [] });
test('only eligible selected IPs receive jobs, and progress stays isolated to the target', () => {
  let state = installReducer(initial(), { type: 'start', model, targetIds: ['a', 'b'], now: 0 });
  assert.equal(state.jobs.length, 1); assert.equal(state.jobs[0].targetId, 'a');
  state = installReducer(state, { type: 'tick', now: 3800, models: [model] });
  assert.equal(state.jobs[0].progress, 50); assert.equal(state.targets[0].usedGB, 40);
  state = installReducer(state, { type: 'tick', now: 8000, models: [model] });
  assert.deepEqual(state.targets[0].installed, ['model']); assert.equal(state.targets[0].usedGB, 70);
  assert.equal(freeGB(state.targets[0]), 30); assert.deepEqual(state.targets[1], targets[1]);
  assert.equal(state.jobs.length, 0);
});
test('repeated install requests and completion ticks do not consume storage twice', () => {
  const start = { type: 'start' as const, model, targetIds: ['a'], now: 0 };
  let state = installReducer(initial(), start);
  state = installReducer(state, start); assert.equal(state.jobs.length, 1);
  state = installReducer(state, { type: 'tick', now: 10000, models: [model] });
  state = installReducer(state, start);
  state = installReducer(state, { type: 'tick', now: 20000, models: [model] });
  assert.equal(state.targets[0].usedGB, 70); assert.deepEqual(state.targets[0].installed, ['model']);
});
test('cancellation releases the job without installing or consuming storage', () => {
  let state = installReducer(initial(), { type: 'start', model, targetIds: ['a'], now: 0 });
  state = installReducer(state, { type: 'cancel', targetIds: ['a'] });
  state = installReducer(state, { type: 'tick', now: 9000, models: [model] });
  assert.deepEqual(state, initial());
});
test('uninstall restores storage exactly once', () => {
  let state = installReducer(initial(), { type: 'start', model, targetIds: ['a'], now: 0 });
  state = installReducer(state, { type: 'tick', now: 9000, models: [model] });
  const remove = { type: 'remove' as const, model, targetIds: ['a'] };
  state = installReducer(installReducer(state, remove), remove);
  assert.equal(state.targets[0].usedGB, 40); assert.deepEqual(state.targets[0].installed, []);
});
test('offline, insufficient storage, and a second job on the same device are rejected', () => {
  const state = initial(); assert.equal(canInstall(state, model, state.targets[1]), false);
  assert.equal(canInstall(state, model, { ...state.targets[0], online: false }), false);
  const busy = installReducer(state, { type: 'start', model, targetIds: ['a'], now: 0 });
  assert.equal(canInstall(busy, { ...model, id: 'other' }, busy.targets[0]), false);
});
test('multiple target installations complete independently', () => {
  const state = initial(); state.targets[1].usedGB = 20;
  let next = installReducer(state, { type: 'start', model, targetIds: ['a', 'b'], now: 0 });
  next = installReducer(next, { type: 'tick', now: 8000, models: [model] });
  assert.equal(next.targets[0].installed.includes('model'), true);
  assert.equal(next.targets[1].installed.includes('model'), false); assert.equal(next.jobs.length, 1);
  next = installReducer(next, { type: 'tick', now: 9000, models: [model] });
  assert.equal(next.targets[1].usedGB, 50); assert.equal(next.jobs.length, 0);
});
test('corrupted or stale browser state safely falls back to demo data', () => {
  for (const raw of ['invalid', '{"version":2}', JSON.stringify({ version: 1, targets: [{ ...targets[0], usedGB: 101 }] }), JSON.stringify({ version: 1, targets: [targets[0], targets[0]] })])
    assert.deepEqual(readSavedTargets(raw, targets, ['model']), targets);
  assert.deepEqual(readSavedTargets(JSON.stringify({ version: 1, targets }), targets, ['model']), targets);
});
test('IPv4 validation rejects malformed, out-of-range, and ambiguous addresses', () => {
  assert.equal(validIPv4('192.168.1.105'), true);
  for (const value of ['300.1.1.1', '192.168.1', '192.168.01.1', '1.1.1.-1']) assert.equal(validIPv4(value), false);
});
