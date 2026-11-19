import { describe, it, expect } from 'vitest';
import { calculateIncentive, validateMonthlyOutcomes } from '../services/calculationService.js';
import { EMPLOYEES, findEmployee, Employee } from '../config/employeeConfig.js';
import { INCENTIVE_TIERS } from '../config/incentiveTiers.js';

describe('Employee Configuration', () => {
  it('should have exactly 43 PRE executives', () => {
    expect(EMPLOYEES).toHaveLength(43);
  });

  it('should have 3 NA executives with null adjustment', () => {
    const naEmployees = EMPLOYEES.filter((e) => e.adjustment === null);
    expect(naEmployees).toHaveLength(3);
    const naEmails = naEmployees.map((e) => e.email).sort();
    expect(naEmails).toEqual([
      'afsalsyed.mohammed@nxtwave.co.in',
      'phaniraju.pushkara@nxtwave.co.in',
      'siddhi.sontakke@nxtwave.co.in'
    ]);
  });

  it('should have 6 negative adjustment executives', () => {
    const negEmployees = EMPLOYEES.filter((e) => e.adjustment !== null && e.adjustment < 0);
    expect(negEmployees).toHaveLength(6);
    const harsh = EMPLOYEES.find((e) => e.email === 's.harsh@nxtwave.co.in');
    expect(harsh?.adjustment).toBe(-10);

    const minus30 = EMPLOYEES.filter((e) => e.adjustment === -30);
    expect(minus30).toHaveLength(5);
    const minus30Emails = minus30.map((e) => e.email).sort();
    expect(minus30Emails).toEqual([
      'mohamed.ibrahim@nxtwave.co.in',
      'muhammed.ashifr@nxtwave.co.in',
      'niyas.j@nxtwave.co.in',
      'pratiksha.madhavraopatil@nxtwave.co.in',
      'vishnupriya.krishnan@nxtwave.co.in'
    ]);
  });

  it('should not contain salary, ctc, or salary band properties', () => {
    EMPLOYEES.forEach((emp) => {
      const keys = Object.keys(emp);
      expect(keys).not.toContain('salary');
      expect(keys).not.toContain('ctc');
      expect(keys).not.toContain('band');
      expect(keys).not.toContain('salaryBand');
    });
  });

  it('findEmployee should find executives by id or email case-insensitively', () => {
    const byId = findEmployee('jinsha-p');
    expect(byId?.name).toBe('Jinsha P');

    const byEmail = findEmployee('JINSHA.P@NXTWAVE.CO.IN');
    expect(byEmail?.id).toBe('jinsha-p');

    const notFound = findEmployee('non-existent');
    expect(notFound).toBeUndefined();
  });
});

describe('Incentive Tiers Configuration', () => {
  it('should define all 6 base tiers matching the specification', () => {
    expect(INCENTIVE_TIERS).toEqual([
      { threshold: 50, baseBonus: 10000 },
      { threshold: 55, baseBonus: 12500 },
      { threshold: 60, baseBonus: 18000 },
      { threshold: 65, baseBonus: 20000 },
      { threshold: 70, baseBonus: 30000 },
      { threshold: 75, baseBonus: 35000 }
    ]);
  });
});

describe('All 6 Milestone Base Tiers (with 0% adjustment / multiplier 1.00)', () => {
  const baseEmployee: Employee = {
    id: 'test-standard',
    name: 'Standard Executive',
    email: 'standard@nxtwave.co.in',
    adjustment: 0
  };

  const testTiers = [
    { outcomes: 50, expectedBase: 10000, nextThreshold: 55, needed: 5 },
    { outcomes: 55, expectedBase: 12500, nextThreshold: 60, needed: 5 },
    { outcomes: 60, expectedBase: 18000, nextThreshold: 65, needed: 5 },
    { outcomes: 65, expectedBase: 20000, nextThreshold: 70, needed: 5 },
    { outcomes: 70, expectedBase: 30000, nextThreshold: 75, needed: 5 },
    { outcomes: 75, expectedBase: 35000, nextThreshold: null, needed: 0 }
  ];

  testTiers.forEach(({ outcomes, expectedBase, nextThreshold, needed }) => {
    it(`tier at ${outcomes} outcomes should yield base bonus ₹${expectedBase.toLocaleString()}`, () => {
      const res = calculateIncentive(baseEmployee, outcomes);
      expect(res.status).toBe('AVAILABLE');
      if (res.status === 'AVAILABLE') {
        expect(res.multiplier).toBe(1.0);
        expect(res.baseBonus).toBe(expectedBase);
        expect(res.finalIncentive).toBe(expectedBase);
        if (nextThreshold !== null) {
          expect(res.nextMilestone?.threshold).toBe(nextThreshold);
          expect(res.nextMilestone?.needed).toBe(needed);
        } else {
          expect(res.nextMilestone).toBeNull();
        }
      }
    });
  });
});

describe('All Multiplier Adjustments (+40%, +30%, +20%, +10%, 0%, -10%, -20%, -30%)', () => {
  const multipliers = [
    { adjustment: 40, expectedMultiplier: 1.40, expectedIncentiveAt50: 14000 },
    { adjustment: 30, expectedMultiplier: 1.30, expectedIncentiveAt50: 13000 },
    { adjustment: 20, expectedMultiplier: 1.20, expectedIncentiveAt50: 12000 },
    { adjustment: 10, expectedMultiplier: 1.10, expectedIncentiveAt50: 11000 },
    { adjustment: 0,  expectedMultiplier: 1.00, expectedIncentiveAt50: 10000 },
    { adjustment: -10, expectedMultiplier: 0.90, expectedIncentiveAt50: 9000 },
    { adjustment: -20, expectedMultiplier: 0.80, expectedIncentiveAt50: 8000 },
    { adjustment: -30, expectedMultiplier: 0.70, expectedIncentiveAt50: 7000 }
  ];

  multipliers.forEach(({ adjustment, expectedMultiplier, expectedIncentiveAt50 }) => {
    it(`adjustment ${adjustment >= 0 ? '+' : ''}${adjustment}% results in multiplier ${expectedMultiplier.toFixed(2)} and correct final incentive`, () => {
      const emp: Employee = {
        id: `test-adj-${adjustment}`,
        name: `Executive ${adjustment}`,
        email: `exec.${adjustment}@nxtwave.co.in`,
        adjustment
      };

      const res = calculateIncentive(emp, 50);
      expect(res.status).toBe('AVAILABLE');
      if (res.status === 'AVAILABLE') {
        expect(res.adjustment).toBe(adjustment);
        expect(res.multiplier).toBe(expectedMultiplier);
        expect(res.baseBonus).toBe(10000);
        expect(res.finalIncentive).toBe(expectedIncentiveAt50);
      }
    });
  });
});

describe('Exact Sample Cases from User Spec', () => {
  const jinsha = findEmployee('jinsha-p')!; // +20%
  const ruchi = findEmployee('ruchi-gautam')!; // +30%
  const niyas = findEmployee('niyas-j')!; // -30%

  it('50 outcomes with +20%: ₹10,000 × 1.20 = ₹12,000', () => {
    const res = calculateIncentive(jinsha, 50);
    expect(res.status).toBe('AVAILABLE');
    if (res.status === 'AVAILABLE') {
      expect(res.baseBonus).toBe(10000);
      expect(res.multiplier).toBe(1.20);
      expect(res.finalIncentive).toBe(12000);
      expect(res.nextMilestone).toEqual({
        threshold: 55,
        needed: 5,
        baseBonus: 12500,
        finalBonus: 15000, // 12,500 * 1.20
        additionalBonus: 3000 // 15,000 - 12,000
      });
    }
  });

  it('60 outcomes with +30%: ₹18,000 × 1.30 = ₹23,400', () => {
    const res = calculateIncentive(ruchi, 60);
    expect(res.status).toBe('AVAILABLE');
    if (res.status === 'AVAILABLE') {
      expect(res.baseBonus).toBe(18000);
      expect(res.multiplier).toBe(1.30);
      expect(res.finalIncentive).toBe(23400);
      expect(res.nextMilestone).toEqual({
        threshold: 65,
        needed: 5,
        baseBonus: 20000,
        finalBonus: 26000, // 20,000 * 1.30
        additionalBonus: 2600 // 26,000 - 23,400
      });
    }
  });

  it('70 outcomes with -30%: ₹30,000 × 0.70 = ₹21,000', () => {
    const res = calculateIncentive(niyas, 70);
    expect(res.status).toBe('AVAILABLE');
    if (res.status === 'AVAILABLE') {
      expect(res.baseBonus).toBe(30000);
      expect(res.multiplier).toBe(0.70);
      expect(res.finalIncentive).toBe(21000);
      expect(res.nextMilestone).toEqual({
        threshold: 75,
        needed: 5,
        baseBonus: 35000,
        finalBonus: 24500, // 35,000 * 0.70
        additionalBonus: 3500 // 24,500 - 21,000
      });
    }
  });
});

describe('Edge Cases', () => {
  const jinsha = findEmployee('jinsha-p')!; // +20%
  const harsh = findEmployee('s-harsh')!; // -10%

  it('outcomes < 50 (e.g. 0, 49) -> ₹0 bonus, next target 50', () => {
    const res0 = calculateIncentive(jinsha, 0);
    expect(res0.status).toBe('AVAILABLE');
    if (res0.status === 'AVAILABLE') {
      expect(res0.baseBonus).toBe(0);
      expect(res0.finalIncentive).toBe(0);
      expect(res0.nextMilestone).toEqual({
        threshold: 50,
        needed: 50,
        baseBonus: 10000,
        finalBonus: 12000,
        additionalBonus: 12000
      });
    }

    const res49 = calculateIncentive(jinsha, 49);
    expect(res49.status).toBe('AVAILABLE');
    if (res49.status === 'AVAILABLE') {
      expect(res49.baseBonus).toBe(0);
      expect(res49.finalIncentive).toBe(0);
      expect(res49.nextMilestone).toEqual({
        threshold: 50,
        needed: 1,
        baseBonus: 10000,
        finalBonus: 12000,
        additionalBonus: 12000
      });
    }
  });

  it('outcomes between milestones (52 -> base 10k, 64 -> base 18k, 73 -> base 30k)', () => {
    // 52 -> base 10,000, next 55 (needed 3)
    const res52 = calculateIncentive(jinsha, 52);
    if (res52.status === 'AVAILABLE') {
      expect(res52.baseBonus).toBe(10000);
      expect(res52.finalIncentive).toBe(12000);
      expect(res52.nextMilestone?.threshold).toBe(55);
      expect(res52.nextMilestone?.needed).toBe(3);
    }

    // 64 -> base 18,000, next 65 (needed 1)
    const res64 = calculateIncentive(jinsha, 64);
    if (res64.status === 'AVAILABLE') {
      expect(res64.baseBonus).toBe(18000);
      expect(res64.finalIncentive).toBe(21600);
      expect(res64.nextMilestone?.threshold).toBe(65);
      expect(res64.nextMilestone?.needed).toBe(1);
    }

    // 73 -> base 30,000, next 75 (needed 2)
    const res73 = calculateIncentive(harsh, 73);
    if (res73.status === 'AVAILABLE') {
      expect(res73.baseBonus).toBe(30000);
      expect(res73.multiplier).toBe(0.9);
      expect(res73.finalIncentive).toBe(27000); // 30,000 * 0.9
      expect(res73.nextMilestone?.threshold).toBe(75);
      expect(res73.nextMilestone?.needed).toBe(2);
    }
  });

  it('outcomes > 75 (e.g. 80, 100) -> base bonus capped at ₹35,000, next milestone null', () => {
    const res80 = calculateIncentive(jinsha, 80);
    if (res80.status === 'AVAILABLE') {
      expect(res80.baseBonus).toBe(35000);
      expect(res80.finalIncentive).toBe(42000); // 35,000 * 1.2
      expect(res80.nextMilestone).toBeNull();
    }

    const res100 = calculateIncentive(jinsha, 100);
    if (res100.status === 'AVAILABLE') {
      expect(res100.baseBonus).toBe(35000);
      expect(res100.finalIncentive).toBe(42000);
      expect(res100.nextMilestone).toBeNull();
    }
  });

  it('all 3 NA employees return UNAVAILABLE status', () => {
    const naIds = ['siddhi-sontakke', 'afsalsyed-mohammed', 'phaniraju-pushkara'];
    naIds.forEach((id) => {
      const emp = findEmployee(id)!;
      expect(emp).toBeDefined();
      expect(emp.adjustment).toBeNull();

      const res = calculateIncentive(emp, 60);
      expect(res).toEqual({
        status: 'UNAVAILABLE',
        message: 'Incentive configuration unavailable'
      });
    });
  });

  it('milestones progression array provides correct status and formatting for tracker', () => {
    const res = calculateIncentive(jinsha, 60);
    expect(res.status).toBe('AVAILABLE');
    if (res.status === 'AVAILABLE') {
      expect(res.milestones).toHaveLength(6);
      
      // 50: achieved, not current
      expect(res.milestones[0]).toEqual({
        threshold: 50,
        baseBonus: 10000,
        finalBonus: 12000,
        achieved: true,
        current: false
      });

      // 55: achieved, not current
      expect(res.milestones[1]).toEqual({
        threshold: 55,
        baseBonus: 12500,
        finalBonus: 15000,
        achieved: true,
        current: false
      });

      // 60: achieved, current!
      expect(res.milestones[2]).toEqual({
        threshold: 60,
        baseBonus: 18000,
        finalBonus: 21600,
        achieved: true,
        current: true
      });

      // 65: not achieved, not current
      expect(res.milestones[3]).toEqual({
        threshold: 65,
        baseBonus: 20000,
        finalBonus: 24000,
        achieved: false,
        current: false
      });
    }
  });

  it('rejects invalid, negative, or non-integer inputs', () => {
    expect(() => validateMonthlyOutcomes(-1)).toThrow('Monthly outcomes must be a non-negative integer');
    expect(() => validateMonthlyOutcomes(-50)).toThrow('Monthly outcomes must be a non-negative integer');
    expect(() => validateMonthlyOutcomes(5.5)).toThrow('Monthly outcomes must be a non-negative integer');
    expect(() => validateMonthlyOutcomes(50.1)).toThrow('Monthly outcomes must be a non-negative integer');
    expect(() => validateMonthlyOutcomes('50')).toThrow('Monthly outcomes must be a non-negative integer');
    expect(() => validateMonthlyOutcomes(null)).toThrow('Monthly outcomes must be a non-negative integer');
    expect(() => validateMonthlyOutcomes(undefined)).toThrow('Monthly outcomes must be a non-negative integer');
    expect(() => validateMonthlyOutcomes(NaN)).toThrow('Monthly outcomes must be a non-negative integer');
    expect(() => validateMonthlyOutcomes(Infinity)).toThrow('Monthly outcomes must be a non-negative integer');
    expect(() => validateMonthlyOutcomes({})).toThrow('Monthly outcomes must be a non-negative integer');
    expect(() => validateMonthlyOutcomes([])).toThrow('Monthly outcomes must be a non-negative integer');
  });
});
