import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import TypeBadge from './TypeBadge';
import { colors, getTypeColor } from '../theme/colors';
import { capitalize, formatId } from '../utils/format';

// Tarjeta de un Pokémon dentro de la lista de resultados.
// Muestra imagen, nombre, número (ID) y tipo(s).
export default function PokemonCard({ pokemon, onPress }) {
  const mainColor = getTypeColor(pokemon.types[0]);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.imageWrapper, { backgroundColor: mainColor + '22' }]}>
        {pokemon.image ? (
          <Image source={{ uri: pokemon.image }} style={styles.image} resizeMode="contain" />
        ) : (
          <Text style={styles.noImage}>?</Text>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.id}>{formatId(pokemon.id)}</Text>
        <Text style={styles.name}>{capitalize(pokemon.name)}</Text>
        <View style={styles.types}>
          {pokemon.types.map((t) => (
            <TypeBadge key={t} type={t} />
          ))}
        </View>
      </View>

      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  imageWrapper: {
    width: 72,
    height: 72,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 64,
    height: 64,
  },
  noImage: {
    fontSize: 28,
    color: colors.textLight,
    fontWeight: '700',
  },
  info: {
    flex: 1,
    marginLeft: 14,
  },
  id: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '700',
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginTop: 2,
  },
  types: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chevron: {
    fontSize: 30,
    color: colors.textLight,
    marginLeft: 6,
    marginRight: 4,
  },
});
