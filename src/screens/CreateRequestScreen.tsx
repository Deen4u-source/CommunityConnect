import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { createPost } from '../src/services/posts';
import { PostType } from '../src/types/post';

const POST_TYPES: { label: string; value: PostType }[] = [
  { label: 'Request Help', value: 'request' },
  { label: 'Offer Help', value: 'offer' },
  { label: 'Update', value: 'update' },
  { label: 'Announcement', value: 'announcement' },
];

export default function CreateRequestScreen() {
  const [body, setBody] = useState('');
  const [postType, setPostType] = useState<PostType>('request');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!body.trim()) {
      Alert.alert('Error', 'Please write something');
      return;
    }

    if (body.trim().length < 1 || body.trim().length > 5000) {
      Alert.alert('Error', 'Post must be between 1 and 5000 characters');
      return;
    }

    setLoading(true);

    try {
      await createPost({
        post_type: postType,
        body: body.trim(),
      });

      Alert.alert('Success', 'Your post has been created!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      console.log('Create post error:', error);
      Alert.alert('Error', error.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Type of Post</Text>
      <View style={styles.typeContainer}>
        {POST_TYPES.map((type) => (
          <TouchableOpacity
            key={type.value}
            style={[
              styles.typeButton,
              postType === type.value && styles.typeButtonActive,
            ]}
            onPress={() => setPostType(type.value)}
          >
            <Text
              style={[
                styles.typeButtonText,
                postType === type.value && styles.typeButtonTextActive,
              ]}
            >
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>What do you need / want to share?</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Describe your request or offer in detail..."
        placeholderTextColor="#94a3b8"
        value={body}
        onChangeText={setBody}
        multiline
        numberOfLines={6}
        maxLength={5000}
      />
      <Text style={styles.charCount}>{body.length}/5000</Text>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Post</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 10,
    marginTop: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  typeButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  typeButtonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#475569',
  },
  typeButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1e293b',
  },
  textArea: {
    height: 140,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'right',
    marginTop: 6,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 28,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});