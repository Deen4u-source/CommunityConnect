export type PostType = 'request' | 'offer' | 'update' | 'announcement';

export type Post = {
  id: string;
  author_id: string;
  organization_id: string | null;
  post_type: PostType;
  body: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type CreatePostInput = {
  post_type: PostType;
  body: string;
  image_url?: string | null;
  organization_id?: string | null;
};