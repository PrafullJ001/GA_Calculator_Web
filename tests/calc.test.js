import test from 'node:test';
import assert from 'node:assert/strict';
import { parsePositive, formatNumber, rToAcre, acreToR, requiredGrams, PRODUCTS } from '../src/utils/calc.js';

test('area conversion', () => {
  assert.equal(formatNumber(rToAcre(40)), '1');
  assert.equal(formatNumber(acreToR(1)), '40');
  assert.equal(formatNumber(rToAcre(20)), '0.5');
  assert.equal(formatNumber(acreToR(2)), '80');
  assert.equal(formatNumber(rToAcre(1)), '0.025');
});

test('solid examples', () => {
  const f = PRODUCTS.solid.factor;
  assert.equal(requiredGrams(1, 10, f), 6);
  assert.equal(requiredGrams(2, 10, f), 12);
  assert.equal(requiredGrams(rToAcre(40), 10, f), 6);
});

test('liquid examples', () => {
  const f = PRODUCTS.liquid.factor;
  assert.equal(requiredGrams(1, 10, f), 15);
  assert.equal(requiredGrams(2, 10, f), 30);
  assert.equal(requiredGrams(rToAcre(40), 10, f), 15);
});

test('matches the printed dosage chart (per acre)', () => {
  const chart = { 10: [6, 15], 20: [12, 30], 30: [18, 45], 40: [24, 60], 50: [30, 75], 60: [36, 90] };
  for (const [ppm, [solid, liquid]] of Object.entries(chart)) {
    assert.equal(requiredGrams(1, Number(ppm), PRODUCTS.solid.factor), solid);
    assert.equal(requiredGrams(1, Number(ppm), PRODUCTS.liquid.factor), liquid);
  }
});

test('validation', () => {
  assert.equal(parsePositive('').status, 'empty');
  assert.equal(parsePositive('-5').status, 'invalid');
  assert.equal(parsePositive('abc').status, 'invalid');
  assert.equal(parsePositive('1e3').status, 'invalid');
  assert.equal(parsePositive('1.2.3').status, 'invalid');
  assert.equal(parsePositive('0').status, 'zero');
  assert.equal(parsePositive('0.0').status, 'zero');
  assert.deepEqual(parsePositive('2.5'), { status: 'ok', value: 2.5 });
  assert.deepEqual(parsePositive('.5'), { status: 'ok', value: 0.5 });
});