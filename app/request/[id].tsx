import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getPostById, deletePost } from '../../src/services/posts';
import { Post } from '../../src/types/post';
import { supabase } from '../../src/services/supabase';

export default function RequestDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    loadPost();
    getCurrentUser();
  }, [id]);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUserId(user?.id || null);
  };

  const loadPost = async () => {
    try {
      if (!id) return;
      const data = await getPostById(id);
      setPost(data);
    } catch (error) {
      Alert.alert('Error', 'Could not load this post');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deletePost(id);
            Alert.alert('Deleted', 'Post has been deleted');
            router.back();
          } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to delete post');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Post not found</Text>
      </View>
    );
  }

  const isOwner = currentUserId === post.author_id;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[styles.badge, getBadgeStyle(post.post_type)]}>
        <Text style={styles.badgeText}>{post.post_type}</Text>
      </View>

      <Text style={styles.date}>
        Posted on {new Date(post.created_at).toLocaleString()}
      </Text>

      <Text style={styles.body}>{post.body}</Text>

      {isOwner && (
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color="#fff" />
          <Text style={styles.deleteButtonText}>Delete Post</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const getBadgeStyle = (type: string) => {
  switch (type) {
    case 'request':
      return { backgroundColor: '#dbeafe' };
    case 'offer':
      return { backgroundColor: '#dcfce7' };
    case 'update':
      return { backgroundColor: '#fef9c3' };
    case 'announcement':
      return { backgroundColor: '#fce7f3' };
    default:
      return { backgroundColor: '#e2e8f0' };
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 16, color: '#64748b' },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e293b',
    textTransform: 'capitalize',
  },
  date: { fontSize: 13, color: '#94a3b8', marginBottom: 20 },
  body: { fontSize: 17, color: '#1e293b', lineHeight: 26 },
  deleteButton: {
    marginTop: 40,
    backgroundColor: '#ef4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  deleteButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});