import { useAuth } from '../context/AuthContext';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
	const { user, signOut } = useAuth();

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Profile</Text>
			<Text>{user?.email ?? 'No signed-in user'}</Text>
			<Button title="Sign out" onPress={signOut} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, justifyContent: 'center', gap: 16, padding: 24 },
	title: { fontSize: 28, fontWeight: '700' },
});
