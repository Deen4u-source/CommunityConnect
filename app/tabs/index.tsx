import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getPosts } from '../../src/services/posts';
import { Post } from '../../src/types/post';

export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPosts = async () => {
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (error) {
      console.log('Error loading posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load posts when screen opens
  useFocusEffect(
    useCallback(() => {
      loadPosts();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadPosts();
  };

  const renderPost = ({ item }: { item: Post }) => (
    <Link href={`/request/${item.id}`} asChild>
      <TouchableOpacity style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.badge, getBadgeStyle(item.post_type)]}>
            <Text style={styles.badgeText}>{item.post_type}</Text>
          </View>
          <Text style={styles.date}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
        <Text style={styles.body} numberOfLines={3}>
          {item.body}
        </Text>
      </TouchableOpacity>
    </Link>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>CommunityConnect</Text>
        <Text style={styles.subtitle}>Find help or offer support</Text>
      </View>

      {/* Create Button */}
      <Link href="/create-request" asChild>
        <TouchableOpacity style={styles.createButton}>
          <Ionicons name="add-circle" size={22} color="#fff" />
          <Text style={styles.createButtonText}>Create a Post</Text>
        </TouchableOpacity>
      </Link>

      {/* Posts List */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={48} color="#94a3b8" />
            <Text style={styles.emptyText}>No posts yet</Text>
            <Text style={styles.emptySubtext}>Be the first to create one</Text>
          </View>
        }
      />
    </View>
  );
}

// Helper for badge colors
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
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  createButton: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginBottom: 20,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
    textTransform: 'capitalize',
  },
  date: {
    fontSize: 12,
    color: '#94a3b8',
  },
  body: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 22,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
});