import { supabase } from '../utils/supabase';

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
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user?.id ?? null;
  } catch (error) {
    console.error('Error getting current user ID:', error);
    throw error;
  }
}

export async function createPost(body: string, postType: string) {
  const userId = await currentUserId();
  if (!supabase || !userId) {
    throw new Error('User must be authenticated to create a post');
  }
  const { error } = await supabase.from('posts').insert({
    author_id: userId,
    body,
    post_type: postTypeMap[postType] ?? 'announcement',
  });
  if (error) throw error;
}

export async function createCommunityRequest(body: string, requestType: 'report' | 'help' | 'offer') {
  const userId = await currentUserId();
  if (!supabase || !userId) {
    throw new Error('User must be authenticated to submit a community request');
  }
  const { error } = await supabase.from('community_requests').insert({
    author_id: userId,
    body,
    request_type: requestType,
  });
  if (error) throw error;
}

export async function setOrganizationFollow(organizationId: string, following: boolean) {
  if (!organizationId || !isUuid(organizationId)) {
    throw new Error('Invalid organization ID');
  }
  const userId = await currentUserId();
  if (!supabase || !userId) {
    throw new Error('User must be authenticated to follow organizations');
  }
  const query = supabase.from('organization_follows');
  const result = following
    ? await query.insert({ organization_id: organizationId, user_id: userId })
    : await query.delete().eq('organization_id', organizationId).eq('user_id', userId);
  if (result.error) throw result.error;
}

export async function setPostReaction(postId: string, liked: boolean) {
  if (!postId || !isUuid(postId)) {
    throw new Error('Invalid post ID');
  }
  const userId = await currentUserId();
  if (!supabase || !userId) {
    throw new Error('User must be authenticated to react to posts');
  }
  const query = supabase.from('post_reactions');
  const result = liked
    ? await query.insert({ post_id: postId, user_id: userId })
    : await query.delete().eq('post_id', postId).eq('user_id', userId);
  if (result.error) throw result.error;
}

export async function setPostSave(postId: string, saved: boolean) {
  if (!postId || !isUuid(postId)) {
    throw new Error('Invalid post ID');
  }
  const userId = await currentUserId();
  if (!supabase || !userId) {
    throw new Error('User must be authenticated to save posts');
  }
  const query = supabase.from('post_saves');
  const result = saved
    ? await query.insert({ post_id: postId, user_id: userId })
    : await query.delete().eq('post_id', postId).eq('user_id', userId);
  if (result.error) throw result.error;
}

export async function addPostComment(postId: string, body: string) {
  if (!postId || !isUuid(postId)) {
    throw new Error('Invalid post ID');
  }
  const userId = await currentUserId();
  if (!supabase || !userId) {
    throw new Error('User must be authenticated to comment on posts');
  }
  const { error } = await supabase.from('post_comments').insert({
    post_id: postId,
    author_id: userId,
    body,
  });
  if (error) throw error;
}

export async function sharePost(postId: string) {
  if (!postId || !isUuid(postId)) {
    throw new Error('Invalid post ID');
  }
  const userId = await currentUserId();
  if (!supabase || !userId) {
    throw new Error('User must be authenticated to share posts');
  }
  const { error } = await supabase.from('post_shares').insert({
    post_id: postId,
    user_id: userId,
  });
  if (error) throw error;
}

export async function loadPostInteractions(postIds: string[]) {
  if (!postIds || postIds.length === 0) {
    return { liked: new Set<string>(), saved: new Set<string>() };
  }
  
  const userId = await currentUserId();
  if (!supabase || !userId) {
    return { liked: new Set<string>(), saved: new Set<string>() };
  }
  
  try {
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
  } catch (error) {
    console.error('Error loading post interactions:', error);
    return { liked: new Set<string>(), saved: new Set<string>() };
  }
}

export async function loadOrganizationFollows(organizationIds: string[]) {
  if (!organizationIds || organizationIds.length === 0) {
    return new Set<string>();
  }
  
  const userId = await currentUserId();
  if (!supabase || !userId) {
    return new Set<string>();
  }
  
  try {
    const { data, error } = await supabase
      .from('organization_follows')
      .select('organization_id')
      .eq('user_id', userId)
      .in('organization_id', organizationIds);
    
    if (error) throw error;
    return new Set((data ?? []).map((row) => row.organization_id));
  } catch (error) {
    console.error('Error loading organization follows:', error);
    return new Set<string>();
  }
}

export async function loadEventAttendance(eventIds: string[]) {
  if (!eventIds || eventIds.length === 0) {
    return new Set<string>();
  }
  
  const userId = await currentUserId();
  if (!supabase || !userId) {
    return new Set<string>();
  }
  
  try {
    const { data, error } = await supabase
      .from('event_attendees')
      .select('event_id')
      .eq('user_id', userId)
      .in('event_id', eventIds);
    
    if (error) throw error;
    return new Set((data ?? []).map((row) => row.event_id));
  } catch (error) {
    console.error('Error loading event attendance:', error);
    return new Set<string>();
  }
}

export async function setEventAttendance(eventId: string, joined: boolean) {
  if (!eventId || !isUuid(eventId)) {
    throw new Error('Invalid event ID');
  }
  const userId = await currentUserId();
  if (!supabase || !userId) {
    throw new Error('User must be authenticated to attend events');
  }
  const query = supabase.from('event_attendees');
  const result = joined
    ? await query.insert({ event_id: eventId, user_id: userId })
    : await query.delete().eq('event_id', eventId).eq('user_id', userId);
  if (result.error) throw result.error;
}
