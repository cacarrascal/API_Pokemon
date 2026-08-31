// Módulo de acceso a la PokeAPI (https://pokeapi.co/)
// No requiere API Key.
const BASE_URL = 'https://pokeapi.co/api/v2';

// Caché en memoria del índice completo de Pokémon.
// Se descarga una sola vez y luego se filtra localmente (búsqueda por coincidencia).
let pokemonIndexCache = null;

// Descarga la lista completa de nombres de Pokémon: [{ name, url }, ...]
export async function fetchPokemonIndex(signal) {
  if (pokemonIndexCache) return pokemonIndexCache;

  const res = await fetch(`${BASE_URL}/pokemon?limit=100000&offset=0`, { signal });
  if (!res.ok) throw new Error('No se pudo cargar la lista de Pokémon');

  const data = await res.json();
  pokemonIndexCache = data.results; // [{ name, url }]
  return pokemonIndexCache;
}

// Consulta el detalle completo de un Pokémon por nombre o id.
// Devuelve null si no existe (404).
export async function getPokemonDetail(nameOrId, signal) {
  const key = String(nameOrId).toLowerCase().trim();
  const res = await fetch(`${BASE_URL}/pokemon/${key}`, { signal });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Error al consultar la PokeAPI');

  return res.json();
}

// Convierte el objeto crudo de la API en un modelo simple para las tarjetas.
export function toPokemonSummary(p) {
  return {
    id: p.id,
    name: p.name,
    image:
      p.sprites?.other?.['official-artwork']?.front_default ||
      p.sprites?.front_default ||
      null,
    types: p.types.map((t) => t.type.name),
  };
}

// Busca Pokémon cuyo nombre contenga el texto ingresado.
// Filtra el índice local y descarga el detalle de las primeras coincidencias.
export async function searchPokemon(query, { signal, limit = 20 } = {}) {
  const q = query.toLowerCase().trim();
  const index = await fetchPokemonIndex(signal);

  const matches = index.filter((item) => item.name.includes(q)).slice(0, limit);
  if (matches.length === 0) return [];

  const details = await Promise.all(
    matches.map(async (m) => {
      try {
        const p = await getPokemonDetail(m.name, signal);
        return p ? toPokemonSummary(p) : null;
      } catch (e) {
        // Si la petición fue cancelada, propagamos para descartar el resultado.
        if (e.name === 'AbortError') throw e;
        return null; // Un fallo puntual no rompe toda la búsqueda.
      }
    })
  );

  return details.filter(Boolean).sort((a, b) => a.id - b.id);
}
