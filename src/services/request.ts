import { supabase } from '../utils/supabase';

export type RequestRecord = {
  id?: string;
  created_at?: string;
  title: string;
  description: string;
  category: string;
  latitude?: number;
  longitude?: number;
  user_id?: string;
};

export const getRequests = async (): Promise<RequestRecord[]> => {
  const { data, error } = await supabase
    .from('requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as RequestRecord[];
};

export const createRequest = async (
  request: Omit<RequestRecord, 'id' | 'created_at' | 'user_id'>,
): Promise<RequestRecord> => {
  const { data, error } = await supabase
    .from('requests')
    .insert([request])
    .select('*')
    .single();

  if (error) throw error;
  return data as RequestRecord;
};