import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { getRequests } from '../services/request';

type RequestItem = {
  id: string;
  title: string;
  description: string;
  category: string;
};

type RequestCardProps = {
  title: string;
  description: string;
  category: string;
};

const RequestCard = ({ title, description, category }: RequestCardProps) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.category}>{category}</Text>
    </View>
  );
};

const HomeScreen = () => {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRequests();
        setRequests((data ?? []) as RequestItem[]);
      } catch (error) {
        console.log('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={requests}
        keyExtractor={(item: RequestItem) => item.id}
        renderItem={({ item }: { item: RequestItem }) => (
          <RequestCard
            title={item.title}
            description={item.description}
            category={item.category}
          />
        )}
        ListEmptyComponent={<Text style={styles.empty}>No requests yet</Text>}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#888',
  },
  card: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  category: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
});