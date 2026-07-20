import { describe, it, expect } from 'vitest';
import { buildCompatibility } from './buildCompatibility';

const emptyParts = {
  cpu: null,
  gpu: null,
  motherboard: null,
  ram: null,
  storage: null,
  case: null,
  psu: null,
};

describe('buildCompatibility — RAM type check', () => {
  it('returns idle when motherboard or RAM not selected', () => {
    const result = buildCompatibility(emptyParts);
    expect(result.checks.ramType.status).toBe('idle');
  });

  it('returns idle when only motherboard selected (no RAM)', () => {
    const parts = { ...emptyParts, motherboard: { ramType: 'DDR5', socket: 'LGA1700', tdp: 25, price: 200 } };
    const result = buildCompatibility(parts);
    expect(result.checks.ramType.status).toBe('idle');
  });

  it('returns success when motherboard DDR5 matches RAM DDR5', () => {
    const parts = {
      ...emptyParts,
      motherboard: { ramType: 'DDR5', socket: 'LGA1700', tdp: 25, price: 200 },
      ram: { ramType: 'DDR5', tdp: 8, price: 150 },
    };
    const result = buildCompatibility(parts);
    expect(result.checks.ramType.status).toBe('success');
  });

  it('returns error when motherboard DDR5 mismatches RAM DDR4', () => {
    const parts = {
      ...emptyParts,
      motherboard: { ramType: 'DDR5', socket: 'LGA1700', tdp: 25, price: 200 },
      ram: { ramType: 'DDR4', tdp: 5, price: 80 },
    };
    const result = buildCompatibility(parts);
    expect(result.checks.ramType.status).toBe('error');
    expect(result.checks.ramType.params.mbRamType).toBe('DDR5');
    expect(result.checks.ramType.params.ramType).toBe('DDR4');
  });

  it('returns error when motherboard DDR4 mismatches RAM DDR5', () => {
    const parts = {
      ...emptyParts,
      motherboard: { ramType: 'DDR4', socket: 'LGA1700', tdp: 15, price: 100 },
      ram: { ramType: 'DDR5', tdp: 8, price: 150 },
    };
    const result = buildCompatibility(parts);
    expect(result.checks.ramType.status).toBe('error');
  });

  it('stays idle when ramType is null on both (data missing)', () => {
    const parts = {
      ...emptyParts,
      motherboard: { ramType: null, socket: 'LGA1700', tdp: 25, price: 200 },
      ram: { ramType: null, tdp: 5, price: 80 },
    };
    const result = buildCompatibility(parts);
    expect(result.checks.ramType.status).toBe('idle');
  });

  it('returns error when CPU supports DDR5 but RAM is DDR4 (CPU-RAM mismatch)', () => {
    const parts = {
      ...emptyParts,
      cpu: { name: 'Intel i9', ramType: ['DDR5'], tdp: 125, price: 500 },
      ram: { ramType: 'DDR4', tdp: 8, price: 100 },
    };
    const result = buildCompatibility(parts);
    expect(result.checks.ramType.status).toBe('error');
    expect(result.checks.ramType.message).toBe('cpu_ram_type_mismatch');
    expect(result.checks.ramType.params.cpuName).toBe('Intel i9');
    expect(result.checks.ramType.params.cpuSupported).toBe('DDR5');
    expect(result.checks.ramType.params.ramType).toBe('DDR4');
  });

  it('returns success when CPU supports DDR5 and RAM is DDR5', () => {
    const parts = {
      ...emptyParts,
      cpu: { name: 'Intel i9', ramType: ['DDR5'], tdp: 125, price: 500 },
      ram: { ramType: 'DDR5', tdp: 8, price: 150 },
    };
    const result = buildCompatibility(parts);
    expect(result.checks.ramType.status).toBe('success');
    expect(result.checks.ramType.message).toBe('ram_type_match');
  });

  it('returns success when CPU supports DDR4 & DDR5 and RAM is DDR4', () => {
    const parts = {
      ...emptyParts,
      cpu: { name: 'Intel i9', ramType: ['DDR4', 'DDR5'], tdp: 125, price: 500 },
      ram: { ramType: 'DDR4', tdp: 8, price: 100 },
    };
    const result = buildCompatibility(parts);
    expect(result.checks.ramType.status).toBe('success');
  });

  it('prioritizes motherboard mismatch over CPU mismatch', () => {
    const parts = {
      ...emptyParts,
      cpu: { name: 'Intel i9', ramType: ['DDR5'], tdp: 125, price: 500 },
      motherboard: { ramType: 'DDR5', socket: 'LGA1700', tdp: 25, price: 200 },
      ram: { ramType: 'DDR4', tdp: 8, price: 100 },
    };
    const result = buildCompatibility(parts);
    expect(result.checks.ramType.status).toBe('error');
    expect(result.checks.ramType.message).toBe('ram_type_mismatch');
  });

  it('returns CPU-RAM mismatch when motherboard matches RAM but CPU mismatches', () => {
    const parts = {
      ...emptyParts,
      cpu: { name: 'AMD Ryzen 5', ramType: ['DDR5'], tdp: 65, price: 200 },
      motherboard: { ramType: 'DDR4', socket: 'AM4', tdp: 15, price: 100 },
      ram: { ramType: 'DDR4', tdp: 8, price: 100 },
    };
    const result = buildCompatibility(parts);
    expect(result.checks.ramType.status).toBe('error');
    expect(result.checks.ramType.message).toBe('cpu_ram_type_mismatch');
  });
});

describe('buildCompatibility — Form factor check', () => {
  it('returns idle when motherboard or case not selected', () => {
    const result = buildCompatibility(emptyParts);
    expect(result.checks.formFactor.status).toBe('idle');
  });

  it('returns success when case supports motherboard form factor (ATX in [ATX, mATX, ITX])', () => {
    const parts = {
      ...emptyParts,
      motherboard: { formFactor: 'ATX', socket: 'LGA1700', ramType: 'DDR5', tdp: 25, price: 200 },
      case: { formFactor: ['ATX', 'mATX', 'ITX'], maxGpuLength: 365, price: 100 },
    };
    const result = buildCompatibility(parts);
    expect(result.checks.formFactor.status).toBe('success');
  });

  it('returns success when mATX motherboard fits in ATX case', () => {
    const parts = {
      ...emptyParts,
      motherboard: { formFactor: 'mATX', socket: 'LGA1700', ramType: 'DDR4', tdp: 15, price: 100 },
      case: { formFactor: ['ATX', 'mATX', 'ITX'], maxGpuLength: 355, price: 80 },
    };
    const result = buildCompatibility(parts);
    expect(result.checks.formFactor.status).toBe('success');
  });

  it('returns error when ATX motherboard in ITX-only case', () => {
    const parts = {
      ...emptyParts,
      motherboard: { formFactor: 'ATX', socket: 'AM5', ramType: 'DDR5', tdp: 25, price: 200 },
      case: { formFactor: ['ITX'], maxGpuLength: 330, price: 120 },
    };
    const result = buildCompatibility(parts);
    expect(result.checks.formFactor.status).toBe('error');
    expect(result.checks.formFactor.params.mbFormFactor).toBe('ATX');
  });

  it('stays idle when formFactor data is missing from motherboard', () => {
    const parts = {
      ...emptyParts,
      motherboard: { formFactor: null, socket: 'LGA1700', ramType: 'DDR5', tdp: 25, price: 200 },
      case: { formFactor: ['ATX', 'mATX'], maxGpuLength: 365, price: 100 },
    };
    const result = buildCompatibility(parts);
    expect(result.checks.formFactor.status).toBe('idle');
  });

  it('stays idle when formFactor data is missing from case', () => {
    const parts = {
      ...emptyParts,
      motherboard: { formFactor: 'ATX', socket: 'LGA1700', ramType: 'DDR5', tdp: 25, price: 200 },
      case: { formFactor: null, maxGpuLength: 365, price: 100 },
    };
    const result = buildCompatibility(parts);
    expect(result.checks.formFactor.status).toBe('idle');
  });
});
