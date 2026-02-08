import { describe, it, expect } from 'vitest';
import { parseTags, stringifyTags, getTagColor, PREDEFINED_TAGS, TAG_COLORS } from './tag-utils';

describe('tag-utils', () => {
  describe('parseTags', () => {
    it('should parse valid JSON array string', () => {
      const result = parseTags('["Remote","Urgent"]');
      expect(result).toEqual(['Remote', 'Urgent']);
    });

    it('should return empty array for null', () => {
      const result = parseTags(null);
      expect(result).toEqual([]);
    });

    it('should return empty array for invalid JSON', () => {
      const result = parseTags('invalid json');
      expect(result).toEqual([]);
    });

    it('should return empty array for empty string', () => {
      const result = parseTags('');
      expect(result).toEqual([]);
    });
  });

  describe('stringifyTags', () => {
    it('should stringify array to JSON', () => {
      const result = stringifyTags(['Remote', 'Urgent']);
      expect(result).toBe('["Remote","Urgent"]');
    });

    it('should handle empty array', () => {
      const result = stringifyTags([]);
      expect(result).toBe('[]');
    });

    it('should handle array with special characters', () => {
      const result = stringifyTags(['Tag with spaces', 'Tag-with-dash']);
      expect(JSON.parse(result)).toEqual(['Tag with spaces', 'Tag-with-dash']);
    });
  });

  describe('getTagColor', () => {
    it('should return consistent color for same tag', () => {
      const color1 = getTagColor('Remote', 0);
      const color2 = getTagColor('Remote', 5);
      expect(color1).toBe(color2);
    });

    it('should return one of predefined colors', () => {
      const color = getTagColor('TestTag', 0);
      expect(TAG_COLORS).toContain(color);
    });

    it('should handle empty tag', () => {
      const color = getTagColor('', 0);
      expect(TAG_COLORS).toContain(color);
    });
  });

  describe('PREDEFINED_TAGS', () => {
    it('should contain expected tags', () => {
      expect(PREDEFINED_TAGS).toContain('Remote');
      expect(PREDEFINED_TAGS).toContain('Hybrid');
      expect(PREDEFINED_TAGS).toContain('Urgent');
    });

    it('should have at least 10 tags', () => {
      expect(PREDEFINED_TAGS.length).toBeGreaterThanOrEqual(10);
    });
  });
});

