import { Stack } from 'expo-router';
import { AuthProvider } from '../src/context/AuthContext';
import { AuthGate } from '../src/providers/AuthGate';

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGate>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="tabs" />
          <Stack.Screen name="create-request" options={{ presentation: 'modal' }} />
          <Stack.Screen name="request/[id]" options={{ headerShown: true, title: 'Request Details' }} />
        </Stack>
      </AuthGate>
    </AuthProvider>
  );
}