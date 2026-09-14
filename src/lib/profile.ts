import { supabase } from '../utils/supabase';

export type ProfileInput = {
  displayName: string;
  bio?: string;
  area?: string;
  avatarUrl?: string;
};

export async function saveProfile(input: ProfileInput) {
  if (!supabase) {
    throw new Error('Supabase is not configured');
  }
  
  if (!input.displayName || !input.displayName.trim()) {
    throw new Error('Display name is required');
  }
  
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    const userId = userData.user?.id;
    if (!userId) throw new Error('You must be signed in to save your profile.');

    const { error } = await supabase.from('profiles').upsert({
      id: userId,
      display_name: input.displayName.trim(),
      bio: input.bio?.trim() || null,
      area: input.area?.trim() || null,
      avatar_url: input.avatarUrl?.trim() || null,
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;
  } catch (error) {
    console.error('Error saving profile:', error);
    throw error;
  }
}

export async function loadProfile() {
  if (!supabase) {
    return null;
  }
  
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    const userId = userData.user?.id;
    if (!userId) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('display_name, bio, area, avatar_url')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error loading profile:', error);
    return null;
  }
}

export async function signOut() {
  if (!supabase) {
    throw new Error('Supabase is not configured');
  }
  
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}
