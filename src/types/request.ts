export type Request = {
  id: string;
  title: string;
  description: string;
  category: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
  user_id: string;
};