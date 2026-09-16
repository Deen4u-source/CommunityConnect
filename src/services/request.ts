import { supabase } from './supabase';

export const getRequests = async () => {
  const { data, error } = await supabase
    .from('requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const createRequest = async (request: {
  title: string;
  description: string;
  category: string;
  latitude?: number;
  longitude?: number;
}) => {
  const { data, error } = await supabase
    .from('requests')
    .insert([request])
    .select()
    .single();

  if (error) throw error;
  return data;
};