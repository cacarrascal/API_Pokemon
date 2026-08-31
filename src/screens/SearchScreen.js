import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SearchBar from '../components/SearchBar';
import PokemonCard from '../components/PokemonCard';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useDebounce } from '../hooks/useDebounce';
import { searchPokemon } from '../api/pokeApi';
import { colors } from '../theme/colors';

const MIN_CHARS = 3;

export default function SearchScreen({ navigation }) {
  // --- Estados manejados con useState ---
  const [query, setQuery] = useState('');        // Texto actual del input
  const [results, setResults] = useState([]);    // Resultados de la búsqueda
  const [loading, setLoading] = useState(false); // Indicador de carga
  const [error, setError] = useState(null);       // Error de red / API
  const [searched, setSearched] = useState(false); // ¿Ya se ejecutó una búsqueda válida?

  // Debounce: solo buscamos cuando el usuario deja de escribir (500 ms).
  const debouncedQuery = useDebounce(query, 500);

  // --- useEffect: se dispara cada vez que cambia el texto "debounced" ---
  useEffect(() => {
    const q = debouncedQuery.trim();

    // Regla: no buscar con menos de 3 caracteres.
    if (q.length < MIN_CHARS) {
      setResults([]);
      setError(null);
      setLoading(false);
      setSearched(false);
      return;
    }

    // AbortController para cancelar peticiones obsoletas (evita "race conditions").
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await searchPokemon(q, { signal: controller.signal });
        setResults(data);
        setSearched(true);
      } catch (e) {
        if (e.name === 'AbortError') return; // Búsqueda cancelada: se ignora.
        setError('Ocurrió un error de red o de la API. Verifica tu conexión.');
        setResults([]);
        setSearched(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();

    // Cleanup: cancela la petición si el texto cambia antes de terminar.
    return () => controller.abort();
  }, [debouncedQuery]);

  const handleClear = () => setQuery('');

  const goToDetail = (pokemon) => {
    navigation.navigate('Detail', { name: pokemon.name, image: pokemon.image });
  };

  // Decide qué mostrar debajo de la barra de búsqueda según el estado.
  const renderContent = () => {
    if (query.trim().length > 0 && query.trim().length < MIN_CHARS) {
      return (
        <Message
          emoji="⌨️"
          title="Sigue escribiendo"
          subtitle={`Escribe al menos ${MIN_CHARS} caracteres para iniciar la búsqueda.`}
        />
      );
    }

    if (loading) return <Loader message="Buscando Pokémon..." />;

    if (error) {
      return <Message emoji="📡" title="Error de conexión" subtitle={error} color={colors.danger} />;
    }

    if (searched && results.length === 0) {
      return (
        <Message
          emoji="😕"
          title="No se encontraron Pokémon"
          subtitle="Intenta con otro nombre o revisa la ortografía."
        />
      );
    }

    if (!searched && query.trim().length === 0) {
      return (
        <Message
          emoji="🔎"
          title="Busca tu Pokémon"
          subtitle="Escribe el nombre de un Pokémon para ver su información."
        />
      );
    }

    return (
      <FlatList
        data={results}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <PokemonCard pokemon={item} onPress={() => goToDetail(item)} />
        )}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          results.length > 0 ? (
            <Text style={styles.resultsCount}>
              {results.length} resultado{results.length !== 1 ? 's' : ''}
            </Text>
          ) : null
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      {/* Encabezado estilo Pokédex */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PokeFinder</Text>
        <Text style={styles.headerSubtitle}>Busca información de cualquier Pokémon</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.body}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.searchWrapper}>
          <SearchBar value={query} onChangeText={setQuery} onClear={handleClear} />
        </View>
        <View style={styles.content}>{renderContent()}</View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 18,
    paddingTop: 6,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  body: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 6,
  },
  content: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  resultsCount: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textLight,
    marginBottom: 10,
    marginLeft: 4,
  },
});
