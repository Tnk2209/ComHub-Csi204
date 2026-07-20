import { describe, it, expect } from 'vitest';
import en from './en/translation.json';
import th from './th/translation.json';

describe('i18n — translation keys completeness', () => {
  const requiredFeatureKeys = [
    'landing.features.compat_title',
    'landing.features.compat_desc',
    'landing.features.tdp_title',
    'landing.features.tdp_desc',
    'landing.features.uat_title',
    'landing.features.uat_desc',
  ];

  it('EN translation has all landing feature keys', () => {
    for (const key of requiredFeatureKeys) {
      const parts = key.split('.');
      let value = en;
      for (const part of parts) value = value?.[part];
      expect(value, `Missing EN key: ${key}`).toBeDefined();
      expect(value, `Empty EN key: ${key}`).not.toBe('');
    }
  });

  it('TH translation has all landing feature keys', () => {
    for (const key of requiredFeatureKeys) {
      const parts = key.split('.');
      let value = th;
      for (const part of parts) value = value?.[part];
      expect(value, `Missing TH key: ${key}`).toBeDefined();
      expect(value, `Empty TH key: ${key}`).not.toBe('');
    }
  });
});
