import { describe, it, expect } from 'vitest';
import { APPLICATION_STATUSES, STATUS_LABELS, STATUS_COLORS } from './constants';

describe('constants', () => {
  describe('APPLICATION_STATUSES', () => {
    it('should have all required statuses', () => {
      expect(APPLICATION_STATUSES.APPLIED).toBe('applied');
      expect(APPLICATION_STATUSES.HR_INTERVIEW).toBe('hr_interview');
      expect(APPLICATION_STATUSES.TECH_INTERVIEW).toBe('tech_interview');
      expect(APPLICATION_STATUSES.OFFER).toBe('offer');
      expect(APPLICATION_STATUSES.REJECTED).toBe('rejected');
    });
  });

  describe('STATUS_LABELS', () => {
    it('should have labels for all statuses', () => {
      expect(STATUS_LABELS.applied).toBeDefined();
      expect(STATUS_LABELS.hr_interview).toBeDefined();
      expect(STATUS_LABELS.tech_interview).toBeDefined();
      expect(STATUS_LABELS.offer).toBeDefined();
      expect(STATUS_LABELS.rejected).toBeDefined();
    });

    it('should have Polish labels', () => {
      expect(STATUS_LABELS.applied).toBe('Aplikowano');
      expect(STATUS_LABELS.offer).toBe('Oferta');
      expect(STATUS_LABELS.rejected).toBe('Odrzucone');
    });
  });

  describe('STATUS_COLORS', () => {
    it('should have colors for all statuses', () => {
      expect(STATUS_COLORS.applied).toBeDefined();
      expect(STATUS_COLORS.hr_interview).toBeDefined();
      expect(STATUS_COLORS.tech_interview).toBeDefined();
      expect(STATUS_COLORS.offer).toBeDefined();
      expect(STATUS_COLORS.rejected).toBeDefined();
    });

    it('should have hex color codes', () => {
      Object.values(STATUS_COLORS).forEach(color => {
        expect(color).toMatch(/^#[0-9a-f]{6}$/i);
      });
    });
  });
});

