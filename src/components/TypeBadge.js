import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getTypeColor, getTypeLabel } from '../theme/colors';

// Insignia de color para un tipo de Pokémon.
export default function TypeBadge({ type, size = 'small' }) {
  const isLarge = size === 'large';
  return (
    <View
      style={[
        styles.badge,
        isLarge && styles.badgeLarge,
        { backgroundColor: getTypeColor(type) },
      ]}
    >
      <Text style={[styles.text, isLarge && styles.textLarge]}>{getTypeLabel(type)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 6,
    marginTop: 4,
  },
  badgeLarge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  textLarge: {
    fontSize: 14,
  },
});
