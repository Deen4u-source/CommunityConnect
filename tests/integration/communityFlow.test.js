const { isValidUuid, normalizePostType } = require('../../src/utils/validation');

describe('community flow integration', () => {
  it('validates input that feeds the post creation pipeline', () => {
    const postId = '8d1e8d4c-8c56-4f7b-af1d-f2c0a8f6f1d2';
    const type = normalizePostType('Announcement');

    expect(isValidUuid(postId)).toBe(true);
    expect(type).toBe('announcement');
  });

  it('keeps a fallback for an unsupported type', () => {
    expect(normalizePostType('Unexpected')).toBe('announcement');
  });
});
