import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function StatusBadge({ label, tone = 'neutral' }: { label: string; tone?: 'success' | 'warning' | 'neutral' }) {
  const palette = {
    success: { background: '#DDF6EE', text: '#1D6F5E' },
    warning: { background: '#FDE9C9', text: '#B26A00' },
    neutral: { background: '#EAF2F1', text: '#3E4E4C' },
  };

  const colors = palette[tone];

  return (
    <View style={[styles.badge, { backgroundColor: colors.background }]}>
      <Text style={[styles.text, { color: colors.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
});
