import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateQsofa } from '../src/qsofa.js';

const normal = { respiratoryRate: 16, systolicBP: 120, gcs: 15 };

test('三項皆正常時為 0 分且陰性', () => {
  assert.deepEqual(calculateQsofa(normal), {
    score: 0,
    positive: false,
    criteria: { respiratoryRate: false, systolicBP: false, mentation: false },
  });
});

test('RR 剛好 22/min 時該項達標，得 1 分且陰性', () => {
  const result = calculateQsofa({ ...normal, respiratoryRate: 22 });
  assert.equal(result.score, 1);
  assert.equal(result.positive, false);
  assert.equal(result.criteria.respiratoryRate, true);
});

test('RR 21/min 時該項未達標', () => {
  assert.equal(calculateQsofa({ ...normal, respiratoryRate: 21 }).criteria.respiratoryRate, false);
});

test('SBP 剛好 100 mmHg 時該項達標，得 1 分且陰性', () => {
  const result = calculateQsofa({ ...normal, systolicBP: 100 });
  assert.equal(result.score, 1);
  assert.equal(result.positive, false);
  assert.equal(result.criteria.systolicBP, true);
});

test('SBP 101 mmHg 時該項未達標', () => {
  assert.equal(calculateQsofa({ ...normal, systolicBP: 101 }).criteria.systolicBP, false);
});

test('GCS 14 視為 altered mentation，得 1 分且陰性', () => {
  const result = calculateQsofa({ ...normal, gcs: 14 });
  assert.equal(result.score, 1);
  assert.equal(result.positive, false);
  assert.equal(result.criteria.mentation, true);
});

test('兩項達標時為 2 分且陽性', () => {
  const result = calculateQsofa({ respiratoryRate: 24, systolicBP: 95, gcs: 15 });
  assert.equal(result.score, 2);
  assert.equal(result.positive, true);
});

test('三項達標時為 3 分且陽性', () => {
  const result = calculateQsofa({ respiratoryRate: 30, systolicBP: 85, gcs: 10 });
  assert.equal(result.score, 3);
  assert.equal(result.positive, true);
});

test('輸入缺漏或不是有限數字時丟出 TypeError', () => {
  assert.throws(() => calculateQsofa({ systolicBP: 120, gcs: 15 }), TypeError);
  assert.throws(() => calculateQsofa({ ...normal, respiratoryRate: '22' }), TypeError);
  assert.throws(() => calculateQsofa({ ...normal, systolicBP: NaN }), TypeError);
  assert.throws(() => calculateQsofa({ ...normal, systolicBP: Infinity }), TypeError);
});

test('GCS 3 為合法輸入', () => {
  assert.equal(calculateQsofa({ ...normal, gcs: 3 }).criteria.mentation, true);
});

test('GCS 不是 3–15 的整數時丟出 RangeError', () => {
  assert.throws(() => calculateQsofa({ ...normal, gcs: 2 }), RangeError);
  assert.throws(() => calculateQsofa({ ...normal, gcs: 16 }), RangeError);
  assert.throws(() => calculateQsofa({ ...normal, gcs: 14.5 }), RangeError);
});
