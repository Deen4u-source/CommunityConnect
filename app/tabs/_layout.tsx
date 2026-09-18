import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
	return (
		<Tabs screenOptions={({ route }) => ({
			headerShown: false,
			tabBarActiveTintColor: '#2563eb',
			tabBarInactiveTintColor: '#94a3b8',
			tabBarIcon: ({ color, size }) => {
				const iconName = route.name === 'index' ? 'home' : 'person';
				return <Ionicons name={iconName} size={size} color={color} />;
			},
		})}>
			<Tabs.Screen name="index" options={{ title: 'Home' }} />
			<Tabs.Screen name="user" options={{ title: 'Profile' }} />
		</Tabs>
	);
}
