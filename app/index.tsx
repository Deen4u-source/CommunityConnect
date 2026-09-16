import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>CommunityConnect</Text>
      <Text style={styles.subtitle}>Welcome to the home screen</Text>

      {/* Example navigation links */}
      <Link href="/login" style={styles.link}>
        Go to Login
      </Link>

      <Link href="/create-request" style={styles.link}>
        Create a Request
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 30,
  },
  link: {
    fontSize: 16,
    color: '#2563eb',
    marginVertical: 8,
  },
});