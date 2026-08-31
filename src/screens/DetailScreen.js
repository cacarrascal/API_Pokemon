import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import TypeBadge from '../components/TypeBadge';
import StatBar from '../components/StatBar';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { getPokemonDetail } from '../api/pokeApi';
import { colors, getTypeColor } from '../theme/colors';
import { capitalize, formatId, formatWeight, formatHeight } from '../utils/format';

export default function DetailScreen({ route }) {
  // Datos recibidos desde la pantalla de búsqueda.
  const { name, image } = route.params;

  // --- Estados con useState ---
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- useEffect: consulta el detalle completo al abrir la pantalla ---
  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPokemonDetail(name, controller.signal);
        if (!data) {
          setError('No se encontró la información de este Pokémon.');
          return;
        }
        setPokemon(data);
      } catch (e) {
        if (e.name === 'AbortError') return;
        setError('Ocurrió un error al cargar el detalle. Verifica tu conexión.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [name]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <Loader message="Cargando detalle..." />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Message emoji="⚠️" title="Ups" subtitle={error} color={colors.danger} />
      </View>
    );
  }

  const types = pokemon.types.map((t) => t.type.name);
  const mainColor = getTypeColor(types[0]);
  const artwork =
    pokemon.sprites?.other?.['official-artwork']?.front_default ||
    pokemon.sprites?.front_default ||
    image;

  return (
    <View style={[styles.root, { backgroundColor: mainColor }]}>
      <SafeAreaView edges={['top']} />
      {/* Cabecera con imagen grande del Pokémon */}
      <View style={styles.hero}>
        <View style={styles.heroTopRow}>
          <Text style={styles.heroName}>{capitalize(pokemon.name)}</Text>
          <Text style={styles.heroId}>{formatId(pokemon.id)}</Text>
        </View>
        <View style={styles.typesRow}>
          {types.map((t) => (
            <TypeBadge key={t} type={t} size="large" />
          ))}
        </View>
        {artwork ? (
          <Image source={{ uri: artwork }} style={styles.heroImage} resizeMode="contain" />
        ) : (
          <View style={styles.heroImage} />
        )}
      </View>

      {/* Panel inferior con la información detallada */}
      <ScrollView
        style={styles.sheet}
        contentContainerStyle={styles.sheetContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Datos físicos */}
        <View style={styles.infoCards}>
          <View style={styles.infoCard}>
            <Text style={styles.infoValue}>{formatWeight(pokemon.weight)}</Text>
            <Text style={styles.infoLabel}>Peso</Text>
          </View>
          <View style={[styles.infoCard, styles.infoCardMiddle]}>
            <Text style={styles.infoValue}>{formatHeight(pokemon.height)}</Text>
            <Text style={styles.infoLabel}>Altura</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoValue}>{pokemon.base_experience ?? '—'}</Text>
            <Text style={styles.infoLabel}>Exp. base</Text>
          </View>
        </View>

        {/* Habilidades */}
        <Text style={[styles.sectionTitle, { color: mainColor }]}>Habilidades</Text>
        <View style={styles.abilities}>
          {pokemon.abilities.map((a) => (
            <View key={a.ability.name} style={styles.abilityChip}>
              <Text style={styles.abilityText}>
                {capitalize(a.ability.name.replace('-', ' '))}
                {a.is_hidden ? ' (oculta)' : ''}
              </Text>
            </View>
          ))}
        </View>

        {/* Estadísticas base */}
        <Text style={[styles.sectionTitle, { color: mainColor }]}>Estadísticas base</Text>
        <View style={styles.stats}>
          {pokemon.stats.map((s) => (
            <StatBar
              key={s.stat.name}
              name={s.stat.name}
              value={s.base_stat}
              color={mainColor}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  centered: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    paddingHorizontal: 22,
    paddingBottom: 8,
    alignItems: 'center',
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  heroName: {
    fontSize: 30,
    fontWeight: '900',
    color: colors.white,
  },
  heroId: {
    fontSize: 18,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.9)',
  },
  typesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 4,
  },
  heroImage: {
    width: 200,
    height: 200,
    marginTop: 6,
  },
  sheet: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  sheetContent: {
    padding: 22,
    paddingBottom: 40,
  },
  infoCards: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 18,
    paddingVertical: 16,
    marginTop: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },
  infoCard: {
    flex: 1,
    alignItems: 'center',
  },
  infoCardMiddle: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.border,
  },
  infoValue: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 3,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginTop: 24,
    marginBottom: 12,
  },
  abilities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  abilityChip: {
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  abilityText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  stats: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },
});
