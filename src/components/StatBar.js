import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { statLabels } from '../utils/format';

// Barra de una estadística base del Pokémon (HP, Ataque, etc.).
// El valor máximo de referencia en la PokeAPI es 255.
export default function StatBar({ name, value, color = colors.primary }) {
  const percent = Math.min((value / 255) * 100, 100);

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{statLabels[name] || name}</Text>
      <Text style={styles.value}>{value}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percent}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    width: 78,
    fontSize: 13,
    fontWeight: '700',
    color: colors.textLight,
  },
  value: {
    width: 38,
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'right',
    marginRight: 10,
  },
  track: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});
