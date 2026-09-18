import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getMyPosts } from '../../src/services/posts';
import { Post } from '../../src/types/post';

export default function RequestsScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadMyPosts = async () => {
    try {
      const data = await getMyPosts();
      setPosts(data);
    } catch (error) {
      console.log('Error loading my posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadMyPosts();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadMyPosts();
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
      <Text style={styles.title}>My Requests</Text>

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
            <Ionicons name="list-outline" size={48} color="#94a3b8" />
            <Text style={styles.emptyText}>You haven’t created any posts yet</Text>
            <Text style={styles.emptySubtext}>
              Create your first request or offer
            </Text>
          </View>
        }
      />
    </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 20,
    marginBottom: 20,
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
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
    textAlign: 'center',
  },
});