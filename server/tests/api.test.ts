import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../index.js';

describe('GET /api/executives (Confidentiality & Directory)', () => {
  it('should return list of all 43 executives sorted by name', async () => {
    const res = await request(app).get('/api/executives');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(43);

    // Verify sorted alphabetically by name
    const names = res.body.map((e: { name: string }) => e.name);
    const sortedNames = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sortedNames);
  });

  it('MUST NOT return adjustment, multiplier, salary, ctc, or band fields', async () => {
    const res = await request(app).get('/api/executives');
    expect(res.status).toBe(200);

    res.body.forEach((exec: Record<string, unknown>) => {
      // Must contain public fields
      expect(exec).toHaveProperty('id');
      expect(exec).toHaveProperty('name');
      expect(exec).toHaveProperty('email');

      // Confidential fields MUST NOT leak
      expect(exec).not.toHaveProperty('adjustment');
      expect(exec).not.toHaveProperty('multiplier');
      expect(exec).not.toHaveProperty('salary');
      expect(exec).not.toHaveProperty('ctc');
      expect(exec).not.toHaveProperty('band');
      expect(exec).not.toHaveProperty('salaryBand');

      // Verify no other keys exist besides id, name, email
      expect(Object.keys(exec).sort()).toEqual(['email', 'id', 'name']);
    });
  });
});

describe('POST /api/calculate - Exact User Spec Sample Cases', () => {
  it('Sample 1: 50 outcomes with +20% (Jinsha P) -> ₹10,000 × 1.20 = ₹12,000', async () => {
    const res = await request(app)
      .post('/api/calculate')
      .send({ executiveId: 'jinsha-p', monthlyOutcomes: 50 });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('AVAILABLE');
    expect(res.body.baseBonus).toBe(10000);
    expect(res.body.multiplier).toBe(1.20);
    expect(res.body.finalIncentive).toBe(12000);
    expect(res.body.nextMilestone).toMatchObject({
      threshold: 55,
      needed: 5,
      baseBonus: 12500,
      finalBonus: 15000,
      additionalBonus: 3000
    });
  });

  it('Sample 2: 60 outcomes with +30% (Ruchi Gautam) -> ₹18,000 × 1.30 = ₹23,400', async () => {
    const res = await request(app)
      .post('/api/calculate')
      .send({ executiveId: 'ruchi-gautam', monthlyOutcomes: 60 });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('AVAILABLE');
    expect(res.body.baseBonus).toBe(18000);
    expect(res.body.multiplier).toBe(1.30);
    expect(res.body.finalIncentive).toBe(23400);
    expect(res.body.nextMilestone).toMatchObject({
      threshold: 65,
      needed: 5,
      baseBonus: 20000,
      finalBonus: 26000,
      additionalBonus: 2600
    });
  });

  it('Sample 3: 70 outcomes with -30% (Niyas J) -> ₹30,000 × 0.70 = ₹21,000', async () => {
    const res = await request(app)
      .post('/api/calculate')
      .send({ executiveId: 'niyas-j', monthlyOutcomes: 70 });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('AVAILABLE');
    expect(res.body.baseBonus).toBe(30000);
    expect(res.body.multiplier).toBe(0.70);
    expect(res.body.finalIncentive).toBe(21000);
    expect(res.body.nextMilestone).toMatchObject({
      threshold: 75,
      needed: 5,
      baseBonus: 35000,
      finalBonus: 24500,
      additionalBonus: 3500
    });
  });

  it('should accept email as executive identifier', async () => {
    const res = await request(app)
      .post('/api/calculate')
      .send({ executiveId: 'jinsha.p@nxtwave.co.in', monthlyOutcomes: 50 });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('AVAILABLE');
    expect(res.body.finalIncentive).toBe(12000);
  });
});

describe('POST /api/calculate - NA Employees', () => {
  const naExecutives = [
    { id: 'siddhi-sontakke', email: 'siddhi.sontakke@nxtwave.co.in' },
    { id: 'afsalsyed-mohammed', email: 'afsalsyed.mohammed@nxtwave.co.in' },
    { id: 'phaniraju-pushkara', email: 'phaniraju.pushkara@nxtwave.co.in' }
  ];

  naExecutives.forEach(({ id, email }) => {
    it(`should return status UNAVAILABLE for ${id} by ID`, async () => {
      const res = await request(app)
        .post('/api/calculate')
        .send({ executiveId: id, monthlyOutcomes: 60 });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: 'UNAVAILABLE',
        message: 'Incentive configuration unavailable'
      });
    });

    it(`should return status UNAVAILABLE for ${email} by email`, async () => {
      const res = await request(app)
        .post('/api/calculate')
        .send({ executiveId: email, monthlyOutcomes: 60 });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: 'UNAVAILABLE',
        message: 'Incentive configuration unavailable'
      });
    });
  });
});

describe('POST /api/calculate - Edge Cases & Milestones', () => {
  it('outcomes < 50 returns 0 incentive and points to 50 tier', async () => {
    const res = await request(app)
      .post('/api/calculate')
      .send({ executiveId: 'jinsha-p', monthlyOutcomes: 35 });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('AVAILABLE');
    expect(res.body.baseBonus).toBe(0);
    expect(res.body.finalIncentive).toBe(0);
    expect(res.body.nextMilestone).toMatchObject({
      threshold: 50,
      needed: 15,
      baseBonus: 10000,
      finalBonus: 12000,
      additionalBonus: 12000
    });
  });

  it('outcomes between milestones (e.g. 52, 64, 73)', async () => {
    const res52 = await request(app)
      .post('/api/calculate')
      .send({ executiveId: 'jinsha-p', monthlyOutcomes: 52 });
    expect(res52.status).toBe(200);
    expect(res52.body.baseBonus).toBe(10000);
    expect(res52.body.nextMilestone.threshold).toBe(55);
    expect(res52.body.nextMilestone.needed).toBe(3);

    const res64 = await request(app)
      .post('/api/calculate')
      .send({ executiveId: 'jinsha-p', monthlyOutcomes: 64 });
    expect(res64.status).toBe(200);
    expect(res64.body.baseBonus).toBe(18000);
    expect(res64.body.nextMilestone.threshold).toBe(65);
    expect(res64.body.nextMilestone.needed).toBe(1);

    const res73 = await request(app)
      .post('/api/calculate')
      .send({ executiveId: 's-harsh', monthlyOutcomes: 73 });
    expect(res73.status).toBe(200);
    expect(res73.body.baseBonus).toBe(30000);
    expect(res73.body.finalIncentive).toBe(27000);
    expect(res73.body.nextMilestone.threshold).toBe(75);
    expect(res73.body.nextMilestone.needed).toBe(2);
  });

  it('outcomes > 75 (e.g. 80, 100) caps base bonus at 35,000 and next milestone is null', async () => {
    const res80 = await request(app)
      .post('/api/calculate')
      .send({ executiveId: 'jinsha-p', monthlyOutcomes: 80 });

    expect(res80.status).toBe(200);
    expect(res80.body.baseBonus).toBe(35000);
    expect(res80.body.finalIncentive).toBe(42000);
    expect(res80.body.nextMilestone).toBeNull();
  });
});

describe('POST /api/calculate - Input Validation & Error Handling', () => {
  it('should reject negative monthly outcomes with 400', async () => {
    const res = await request(app)
      .post('/api/calculate')
      .send({ executiveId: 'jinsha-p', monthlyOutcomes: -10 });

    expect(res.status).toBe(400);
    expect(res.body.error.toLowerCase()).toContain('non-negative integer');
  });

  it('should reject non-integer (decimal) monthly outcomes with 400', async () => {
    const res = await request(app)
      .post('/api/calculate')
      .send({ executiveId: 'jinsha-p', monthlyOutcomes: 50.5 });

    expect(res.status).toBe(400);
    expect(res.body.error.toLowerCase()).toContain('non-negative integer');
  });

  it('should reject string monthly outcomes with 400', async () => {
    const res = await request(app)
      .post('/api/calculate')
      .send({ executiveId: 'jinsha-p', monthlyOutcomes: '50' });

    expect(res.status).toBe(400);
    expect(res.body.error.toLowerCase()).toContain('non-negative integer');
  });

  it('should reject missing monthly outcomes with 400', async () => {
    const res = await request(app)
      .post('/api/calculate')
      .send({ executiveId: 'jinsha-p' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('should reject missing executiveId with 400', async () => {
    const res = await request(app)
      .post('/api/calculate')
      .send({ monthlyOutcomes: 50 });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('executiveId');
  });

  it('should reject unknown executiveId with 404', async () => {
    const res = await request(app)
      .post('/api/calculate')
      .send({ executiveId: 'unknown-executive-id', monthlyOutcomes: 50 });

    expect(res.status).toBe(404);
    expect(res.body.error).toContain('not found');
  });
});
