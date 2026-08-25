import { supabase } from './supabase';

const postTypeMap: Record<string, string> = {
  Announcement: 'announcement',
  'Success story': 'success_story',
  Activity: 'activity',
  Request: 'request',
  Opportunity: 'opportunity',
  'Helpful information': 'helpful_information',
};

const isUuid = (value: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

async function currentUserId() {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user?.id ?? null;
}

export async function createPost(body: string, postType: string) {
  const userId = await currentUserId();
  if (!supabase || !userId) return;
  const { error } = await supabase.from('posts').insert({
    author_id: userId,
    body,
    post_type: postTypeMap[postType] ?? 'announcement',
  });
  if (error) throw error;
}

export async function createCommunityRequest(body: string, requestType: 'report' | 'help' | 'offer') {
  const userId = await currentUserId();
  if (!supabase || !userId) return;
  const { error } = await supabase.from('community_requests').insert({ author_id: userId, body, request_type: requestType });
  if (error) throw error;
}

export async function setOrganizationFollow(organizationId: string, following: boolean) {
  if (!isUuid(organizationId)) return;
  const userId = await currentUserId();
  if (!supabase || !userId) return;
  const query = supabase.from('organization_follows');
  const result = following
    ? await query.insert({ organization_id: organizationId, user_id: userId })
    : await query.delete().eq('organization_id', organizationId).eq('user_id', userId);
  if (result.error) throw result.error;
}

export async function setPostReaction(postId: string, liked: boolean) {
  if (!isUuid(postId)) return;
  const userId = await currentUserId();
  if (!supabase || !userId) return;
  const query = supabase.from('post_reactions');
  const result = liked
    ? await query.insert({ post_id: postId, user_id: userId })
    : await query.delete().eq('post_id', postId).eq('user_id', userId);
  if (result.error) throw result.error;
}

export async function setPostSave(postId: string, saved: boolean) {
  if (!isUuid(postId)) return;
  const userId = await currentUserId();
  if (!supabase || !userId) return;
  const query = supabase.from('post_saves');
  const result = saved
    ? await query.insert({ post_id: postId, user_id: userId })
    : await query.delete().eq('post_id', postId).eq('user_id', userId);
  if (result.error) throw result.error;
}

export async function addPostComment(postId: string, body: string) {
  if (!isUuid(postId)) return;
  const userId = await currentUserId();
  if (!supabase || !userId) return;
  const { error } = await supabase.from('post_comments').insert({ post_id: postId, author_id: userId, body });
  if (error) throw error;
}

export async function sharePost(postId: string) {
  if (!isUuid(postId)) return;
  const userId = await currentUserId();
  if (!supabase || !userId) return;
  const { error } = await supabase.from('post_shares').insert({ post_id: postId, user_id: userId });
  if (error) throw error;
}

export async function loadPostInteractions(postIds: string[]) {
  const userId = await currentUserId();
  if (!supabase || !userId || postIds.length === 0) return { liked: new Set<string>(), saved: new Set<string>() };
  const [reactionResult, saveResult] = await Promise.all([
    supabase.from('post_reactions').select('post_id').eq('user_id', userId).in('post_id', postIds),
    supabase.from('post_saves').select('post_id').eq('user_id', userId).in('post_id', postIds),
  ]);
  if (reactionResult.error) throw reactionResult.error;
  if (saveResult.error) throw saveResult.error;
  return {
    liked: new Set((reactionResult.data ?? []).map((row) => row.post_id)),
    saved: new Set((saveResult.data ?? []).map((row) => row.post_id)),
  };
}

export async function loadOrganizationFollows(organizationIds: string[]) {
  const userId = await currentUserId();
  if (!supabase || !userId || organizationIds.length === 0) return new Set<string>();
  const { data, error } = await supabase.from('organization_follows').select('organization_id').eq('user_id', userId).in('organization_id', organizationIds);
  if (error) throw error;
  return new Set((data ?? []).map((row) => row.organization_id));
}

export async function loadEventAttendance(eventIds: string[]) {
  const userId = await currentUserId();
  if (!supabase || !userId || eventIds.length === 0) return new Set<string>();
  const { data, error } = await supabase.from('event_attendees').select('event_id').eq('user_id', userId).in('event_id', eventIds);
  if (error) throw error;
  return new Set((data ?? []).map((row) => row.event_id));
}

export async function setEventAttendance(eventId: string, joined: boolean) {
  if (!isUuid(eventId)) return;
  const userId = await currentUserId();
  if (!supabase || !userId) return;
  const query = supabase.from('event_attendees');
  const result = joined
    ? await query.insert({ event_id: eventId, user_id: userId })
    : await query.delete().eq('event_id', eventId).eq('user_id', userId);
  if (result.error) throw result.error;
}
