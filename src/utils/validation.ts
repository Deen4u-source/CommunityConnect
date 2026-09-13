export function isValidUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export function normalizePostType(type: string): string {
  const map: Record<string, string> = {
    Announcement: 'announcement',
    'Success story': 'success_story',
    Activity: 'activity',
    Request: 'request',
    Opportunity: 'opportunity',
    'Helpful information': 'helpful_information',
  };

  return map[type] ?? 'announcement';
}
