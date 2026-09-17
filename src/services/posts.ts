import { supabase } from './supabase';
import { Post, CreatePostInput } from '../types/post';

// Get all posts (newest first)
export const getPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

// Get a single post by ID
export const getPostById = async (id: string): Promise<Post | null> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

// Get posts by the current user
export const getMyPosts = async (): Promise<Post[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('author_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

// Create a new post
export const createPost = async (input: CreatePostInput): Promise<Post> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('posts')
    .insert([
      {
        author_id: user.id,
        post_type: input.post_type,
        body: input.body,
        image_url: input.image_url || null,
        organization_id: input.organization_id || null,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Update a post
export const updatePost = async (
  id: string,
  updates: Partial<CreatePostInput>
): Promise<Post> => {
  const { data, error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Delete a post
export const deletePost = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) throw error;
};