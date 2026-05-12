import { describe, test, expect } from 'vitest';

describe('test harness', () => {
  test('vitest is wired and running', () => {
    expect(1 + 1).toBe(2);
  });
});
