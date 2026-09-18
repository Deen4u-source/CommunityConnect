import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../src/services/supabase';

export default function SettingsScreen() {
  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          router.replace('/login');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <TouchableOpacity style={styles.menuItem}>
        <Ionicons name="person-outline" size={22} color="#1e293b" />
        <Text style={styles.menuText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <Ionicons name="notifications-outline" size={22} color="#1e293b" />
        <Text style={styles.menuText}>Notification Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={handleSignOut}>
        <Ionicons name="log-out-outline" size={22} color="#ef4444" />
        <Text style={[styles.menuText, { color: '#ef4444' }]}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 20,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  menuText: { fontSize: 16, color: '#1e293b' },
});