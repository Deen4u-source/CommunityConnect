import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { isSupabaseConfigured, supabase } from '../utils/supabase';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [sessionReady, setSessionReady] = useState(!isSupabaseConfigured);
  const [sessionExists, setSessionExists] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSessionExists(Boolean(data.session));
      setSessionReady(true);
    }).catch((error) => {
      if (mounted) {
        console.error('Failed to get session:', error);
        setSessionReady(true);
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (mounted) {
        setSessionExists(Boolean(nextSession));
        setSessionReady(true);
      }
    });
    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  if (!isSupabaseConfigured) return <>{children}</>;
  if (!sessionReady) return <SafeAreaView style={styles.loading}><ActivityIndicator color="#1D6F5E" size="large" /></SafeAreaView>;
  if (!sessionExists) return <AuthScreen />;
  return <>{children}</>;
}

function AuthScreen() {
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!supabase || !email.trim() || password.length < 6) {
      Alert.alert('Check your details', 'Enter an email and a password with at least 6 characters.');
      return;
    }
    setBusy(true);
    try {
      const result = mode === 'signIn'
        ? await supabase.auth.signInWithPassword({ email: email.trim(), password })
        : await supabase.auth.signUp({ email: email.trim(), password });
      setBusy(false);
      if (result.error) {
        Alert.alert(
          mode === 'signIn' ? 'Sign in failed' : 'Sign up failed',
          result.error.message || 'An unknown error occurred'
        );
      } else if (mode === 'signUp' && !result.data.session) {
        Alert.alert('Check your email', 'Confirm your email address, then sign in.');
      }
    } catch (error) {
      setBusy(false);
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>COMMUNITYCONNECT</Text>
        <Text style={styles.title}>{mode === 'signIn' ? 'Welcome back' : 'Join our community'}</Text>
        <Text style={styles.subtitle}>
          {mode === 'signIn'
            ? 'Sign in to your account to connect with your community'
            : 'Create an account to start making a difference'}
        </Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          editable={!busy}
          style={styles.input}
          placeholderTextColor="#5C726C"
        />
        <TextInput
          placeholder="Password (min. 6 characters)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!busy}
          style={styles.input}
          placeholderTextColor="#5C726C"
        />
        <Pressable
          onPress={submit}
          disabled={busy}
          style={[styles.button, busy && { opacity: 0.6 }]}
        >
          <Text style={styles.buttonText}>{busy ? 'Loading...' : mode === 'signIn' ? 'Sign in' : 'Sign up'}</Text>
        </Pressable>
        <Pressable onPress={() => setMode(mode === 'signIn' ? 'signUp' : 'signIn')}>
          <Text style={styles.switchText}>
            {mode === 'signIn' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F8F5' },
  safeArea: { flex: 1, backgroundColor: '#F4F8F5', justifyContent: 'center', padding: 22 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: '#DCEAE5' },
  eyebrow: { color: '#1D6F5E', fontSize: 12, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: '#16362F', fontSize: 30, fontWeight: '800', marginTop: 12 },
  subtitle: { color: '#5C726C', fontSize: 14, lineHeight: 21, marginTop: 8, marginBottom: 22 },
  input: { borderWidth: 1, borderColor: '#DCEAE5', borderRadius: 14, padding: 14, color: '#16362F', marginBottom: 12, backgroundColor: '#F4F8F5' },
  button: { backgroundColor: '#1D6F5E', borderRadius: 14, padding: 14, alignItems: 'center', marginTop: 6 },
  buttonText: { color: '#FFFFFF', fontWeight: '800' },
  switchText: { color: '#1D6F5E', textAlign: 'center', fontWeight: '700', marginTop: 18 },
});
