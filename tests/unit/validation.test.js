const { isValidUuid, normalizePostType } = require('../../src/utils/validation');

describe('validation utilities', () => {
  it('accepts a valid UUID', () => {
    expect(isValidUuid('8d1e8d4c-8c56-4f7b-af1d-f2c0a8f6f1d2')).toBe(true);
  });

  it('rejects invalid UUID values', () => {
    expect(isValidUuid('not-a-uuid')).toBe(false);
  });

  it('normalizes supported post types', () => {
    expect(normalizePostType('Announcement')).toBe('announcement');
    expect(normalizePostType('Success story')).toBe('success_story');
    expect(normalizePostType('Unknown')).toBe('announcement');
  });
});
